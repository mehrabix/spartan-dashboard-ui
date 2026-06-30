import { TestBed, ComponentFixture, NO_ERRORS_SCHEMA } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { TabBarComponent } from './tab-bar.component';
import { TabService } from '../services/tab.service';

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

  return { events$, router, activatedRoute };
}

describe('TabBarComponent', () => {
  let component: TabBarComponent;
  let fixture: ComponentFixture<TabBarComponent>;
  let tabService: TabService;

  async function setup() {
    const mocks = createMocks();
    localStorage.removeItem('spartan-pinned');
    await TestBed.configureTestingModule({
      imports: [TabBarComponent],
      providers: [
        TabService,
        { provide: Router, useValue: mocks.router },
        { provide: ActivatedRoute, useValue: mocks.activatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    tabService = TestBed.inject(TabService);
    tabService.initFromUrl();
    fixture = TestBed.createComponent(TabBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  it('should have hlmTabs wrapping directive', async () => {
    await setup();
    const tabs = fixture.nativeElement.querySelector('[hlmTabs]');
    expect(tabs).toBeTruthy();
  });

  it('should have paginated tabs list component', async () => {
    await setup();
    const paginated = fixture.nativeElement.querySelector('hlm-paginated-tabs-list');
    expect(paginated).toBeTruthy();
  });

  it('should have home tab in the service', async () => {
    await setup();
    expect(tabService.tabIds()).toContain('home');
    expect(tabService.tabs().length).toBe(1);
  });

  it('should add tabs from service', async () => {
    await setup();
    tabService.addTab('users');
    tabService.addTab('analytics');
    fixture.detectChanges();
    expect(tabService.tabs().length).toBe(3);
  });

  it('should show close button count on non-home tabs', async () => {
    await setup();
    tabService.addTab('users');
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('[role="button"]');
    expect(buttons.length).toBe(1);
  });

  it('should not close home tab', async () => {
    await setup();
    tabService.closeTab('home');
    expect(tabService.tabIds()).toContain('home');
  });

  it('should show pin icon when tab is pinned', async () => {
    await setup();
    tabService.addTab('users');
    tabService.togglePin('users');
    fixture.detectChanges();
    expect(tabService.isPinned('users')).toBe(true);
  });

  it('should unpin a pinned tab', async () => {
    await setup();
    tabService.addTab('users');
    tabService.togglePin('users');
    tabService.togglePin('users');
    expect(tabService.isPinned('users')).toBe(false);
  });

  it('should update active tab on navigation', async () => {
    const mocks = createMocks();
    localStorage.removeItem('spartan-pinned');
    await TestBed.resetTestingModule().configureTestingModule({
      imports: [TabBarComponent],
      providers: [
        TabService,
        { provide: Router, useValue: mocks.router },
        { provide: ActivatedRoute, useValue: mocks.activatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    tabService = TestBed.inject(TabService);
    (mocks.router as any).url = '/dashboard/users';
    mocks.events$.next(new NavigationEnd(1, '/dashboard/users', '/dashboard/users'));
    expect(tabService.activeTabId()).toBe('users');
  });

  it('should have context menu template', async () => {
    await setup();
    expect(component['contextMenuTabId']).toBeNull();
  });

  it('should prevent focus on paginator buttons', async () => {
    await setup();
    const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    const btn = document.createElement('button');
    btn.setAttribute('data-pagination', 'previous');
    Object.defineProperty(event, 'target', { value: btn });
    component['preventPaginatorFocus'](event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('should not prevent focus on non-paginator buttons', async () => {
    await setup();
    const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    const btn = document.createElement('button');
    Object.defineProperty(event, 'target', { value: btn });
    component['preventPaginatorFocus'](event);
    expect(event.defaultPrevented).toBe(false);
  });
});
