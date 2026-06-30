import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { TabService } from './tab.service';

function createMocks() {
  const events$ = new Subject<NavigationEnd>();
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
    localStorage.removeItem('spartan-pinned');
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
    service['_tabIds'].set(['unknown']);
    const tabs = service.tabs();
    expect(tabs[0].icon).toBe('📄');
  });
});
