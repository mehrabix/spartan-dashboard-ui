import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { NavigationEnd, NavigationStart, Router, ActivatedRoute } from '@angular/router';
import { TabService } from './tab.service';

function createMocks() {
  const events$ = new Subject<NavigationEnd | NavigationStart>();
  const navigate = vi.fn(() => Promise.resolve(true));
  const router = {
    events: events$.asObservable(),
    url: '/dashboard/home',
    navigate,
  } as unknown as Router;

  const activatedRoute = {
    snapshot: { queryParams: {} },
  } as unknown as ActivatedRoute;

  return { events$, router, activatedRoute, navigate };
}

describe('TabService', () => {
  let service: TabService;

  beforeEach(() => {
    localStorage.clear();
    const mocks = createMocks();
    TestBed.configureTestingModule({
      providers: [
        TabService,
        { provide: Router, useValue: mocks.router },
        { provide: ActivatedRoute, useValue: mocks.activatedRoute },
      ],
    });
    service = TestBed.inject(TabService);
  });

  it('should initialize with home tab from URL', () => {
    service.initFromUrl();
    expect(service.tabIds().length).toBe(1);
    expect(service.tabIds()[0]).toBe('home');
  });

  it('should parse tabs from query param', () => {
    const route = TestBed.inject(ActivatedRoute) as any;
    route.snapshot.queryParams = { t: 'home,users,analytics' };
    service.initFromUrl();
    expect(service.tabIds()).toEqual(['home', 'users', 'analytics']);
  });

  it('should add a new tab', () => {
    service.initFromUrl();
    service.addTab('users');
    expect(service.tabIds()).toContain('users');
    expect(service.tabIds().length).toBe(2);
  });

  it('should not duplicate tabs on add', () => {
    service.initFromUrl();
    service.addTab('home');
    expect(service.tabIds().length).toBe(1);
  });

  it('should close a tab', () => {
    service.initFromUrl();
    service.addTab('users');
    service.addTab('analytics');
    service.closeTab('users');
    expect(service.tabIds()).not.toContain('users');
    expect(service.tabIds().length).toBe(2);
  });

  it('should not close the last remaining tab', () => {
    service.initFromUrl();
    service.closeTab('home');
    expect(service.tabIds()).toContain('home');
  });

  it('should not close a pinned tab', () => {
    service.initFromUrl();
    service.togglePin('home');
    service.closeTab('home');
    expect(service.tabIds()).toContain('home');
  });

  it('should toggle pin state', () => {
    expect(service.isPinned('home')).toBe(false);
    service.togglePin('home');
    expect(service.isPinned('home')).toBe(true);
    service.togglePin('home');
    expect(service.isPinned('home')).toBe(false);
  });

  it('should close all tabs except home', () => {
    service.initFromUrl();
    service.addTab('users');
    service.addTab('analytics');
    service.addTab('products');
    service.closeAllTabs();
    expect(service.tabIds()).toEqual(['home']);
  });

  it('should close other tabs while keeping pinned ones', () => {
    service.initFromUrl();
    service.addTab('users');
    service.addTab('analytics');
    service.addTab('products');
    service.togglePin('analytics');
    service.closeOtherTabs('products');
    expect(service.tabIds()).toContain('products');
    expect(service.tabIds()).toContain('analytics');
    expect(service.tabIds()).not.toContain('users');
  });

  it('should navigate when setting active tab', () => {
    const mocks = createMocks();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        TabService,
        { provide: Router, useValue: mocks.router },
        { provide: ActivatedRoute, useValue: mocks.activatedRoute },
      ],
    });
    service = TestBed.inject(TabService);
    service.setActiveTab('users');
    expect(mocks.navigate).toHaveBeenCalledWith(['/dashboard', 'users'], { queryParamsHandling: 'preserve' });
  });

  it('should provide tabs as state objects', () => {
    service.initFromUrl();
    service.addTab('users');
    const tabs = service.tabs();
    expect(tabs.length).toBe(2);
    expect(tabs[0]).toMatchObject({ id: 'home', label: 'Dashboard', icon: '📊' });
    expect(tabs[1]).toMatchObject({ id: 'users', label: 'Users', icon: '👥' });
  });

  it('should derive activeTabId from router URL', () => {
    const mocks = createMocks();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        TabService,
        { provide: Router, useValue: mocks.router },
        { provide: ActivatedRoute, useValue: mocks.activatedRoute },
      ],
    });
    service = TestBed.inject(TabService);
    expect(service.activeTabId()).toBe('home');
    (mocks.router as any).url = '/dashboard/users';
    mocks.events$.next(new NavigationEnd(1, '/dashboard/users', '/dashboard/users'));
    expect(service.activeTabId()).toBe('users');
  });

  it('should provide fallback icon for unknown tab ids', () => {
    service.initFromUrl();
    (service as any)._tabIds.set(['unknown']);
    const tabs = service.tabs();
    expect(tabs[0].icon).toBe('📄');
  });

  // S-Tier: Reorder tabs (drag & drop)
  it('should reorder tabs', () => {
    service.initFromUrl();
    service.addTab('users');
    service.addTab('analytics');
    service.reorderTabs(2, 0);
    expect(service.tabIds()).toEqual(['analytics', 'home', 'users']);
  });

  // A-Tier: Loading indicator
  it('should set loading true on NavigationStart', () => {
    const mocks = createMocks();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        TabService,
        { provide: Router, useValue: mocks.router },
        { provide: ActivatedRoute, useValue: mocks.activatedRoute },
      ],
    });
    service = TestBed.inject(TabService);
    expect(service.isLoading()).toBe(false);
    mocks.events$.next(new NavigationStart(1, '/dashboard/users'));
    expect(service.isLoading()).toBe(true);
  });

  it('should set loading false on NavigationEnd', () => {
    const mocks = createMocks();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        TabService,
        { provide: Router, useValue: mocks.router },
        { provide: ActivatedRoute, useValue: mocks.activatedRoute },
      ],
    });
    service = TestBed.inject(TabService);
    mocks.events$.next(new NavigationStart(1, '/dashboard/users'));
    expect(service.isLoading()).toBe(true);
    mocks.events$.next(new NavigationEnd(1, '/dashboard/users', '/dashboard/users'));
    expect(service.isLoading()).toBe(false);
  });

  // A-Tier: Session restore
  it('should restore session from localStorage', () => {
    localStorage.setItem('spartan-session', JSON.stringify(['home', 'users']));
    const mocks = createMocks();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        TabService,
        { provide: Router, useValue: mocks.router },
        { provide: ActivatedRoute, useValue: mocks.activatedRoute },
      ],
    });
    service = TestBed.inject(TabService);
    service.initFromUrl();
    expect(service.tabIds()).toContain('home');
    expect(service.tabIds()).toContain('users');
  });

  // A-Tier: Duplicate tab
  it('should duplicate a tab', () => {
    service.initFromUrl();
    service.addTab('users');
    service.duplicateTab('users');
    expect(service.tabIds()).toEqual(['home', 'users', 'users_copy']);
  });

  // A-Tier: Tab history
  it('should track tab history on navigation', () => {
    const mocks = createMocks();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        TabService,
        { provide: Router, useValue: mocks.router },
        { provide: ActivatedRoute, useValue: mocks.activatedRoute },
      ],
    });
    service = TestBed.inject(TabService);
    (mocks.router as any).url = '/dashboard/users';
    mocks.events$.next(new NavigationEnd(1, '/dashboard/users', '/dashboard/users'));
    expect(service.tabHistory()['users']).toBeDefined();
    expect(service.tabHistory()['users'].length).toBeGreaterThanOrEqual(1);
  });

  // B-Tier: Tab colors
  it('should set and get tab color', () => {
    service.setTabColor('home', 'blue');
    expect(service.tabColors()['home']).toBe('blue');
  });

  it('should remove color when set to default', () => {
    service.setTabColor('home', 'blue');
    service.setTabColor('home', 'default');
    expect(service.tabColors()['home']).toBeUndefined();
  });

  // B-Tier: Tab search
  it('should filter tabs by search query', () => {
    service.initFromUrl();
    service.addTab('users');
    service.addTab('analytics');
    service.searchQuery.set('use');
    const filtered = service.filteredTabs();
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('users');
  });

  it('should return all tabs when search query is empty', () => {
    service.initFromUrl();
    service.addTab('users');
    expect(service.filteredTabs().length).toBe(2);
  });

  it('should toggle search open state', () => {
    expect(service.isSearchOpen()).toBe(false);
    service.toggleSearch();
    expect(service.isSearchOpen()).toBe(true);
    service.toggleSearch();
    expect(service.isSearchOpen()).toBe(false);
  });

  it('should clear search query when closing search', () => {
    service.toggleSearch();
    service.searchQuery.set('users');
    service.toggleSearch();
    expect(service.searchQuery()).toBe('');
  });

  // B-Tier: Alert badges
  it('should set and clear tab badge', () => {
    service.setTabBadge('home', 5);
    expect(service.tabBadges()['home']).toBe(5);
    service.setTabBadge('home', null);
    expect(service.tabBadges()['home']).toBeUndefined();
  });

  // B-Tier: Tab renaming
  it('should set and get custom tab label', () => {
    service.setTabLabel('home', 'My Dashboard');
    expect(service.getTabLabel('home')).toBe('My Dashboard');
  });

  it('should return default label for tabs without custom label', () => {
    expect(service.getTabLabel('home')).toBe('Dashboard');
  });

  it('should start and cancel editing', () => {
    service.startEditing('home');
    expect(service.editingTabId()).toBe('home');
    service.cancelEditing();
    expect(service.editingTabId()).toBeNull();
  });

  // C-Tier: Vertical tab bar
  it('should toggle vertical tabs', () => {
    expect(service.verticalTabs()).toBe(false);
    service.toggleVerticalTabs();
    expect(service.verticalTabs()).toBe(true);
    service.toggleVerticalTabs();
    expect(service.verticalTabs()).toBe(false);
  });

  // C-Tier: Readability mode
  it('should toggle readability mode', () => {
    expect(service.isReadabilityMode('home')).toBe(false);
    service.toggleReadabilityMode('home');
    expect(service.isReadabilityMode('home')).toBe(true);
    service.toggleReadabilityMode('home');
    expect(service.isReadabilityMode('home')).toBe(false);
  });

  // C-Tier: Time tracker
  it('should track tab open timestamps on add', () => {
    service.addTab('users');
    expect(service.tabTimestamps()['users']).toBeGreaterThan(0);
  });

  it('should return open duration', () => {
    service.addTab('users');
    expect(service.getTabOpenDuration('users')).toBeGreaterThanOrEqual(0);
  });
});
