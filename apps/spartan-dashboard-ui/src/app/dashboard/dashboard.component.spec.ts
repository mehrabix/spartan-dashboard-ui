import { TestBed, ComponentFixture, NO_ERRORS_SCHEMA } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { TabService } from './services/tab.service';
import { ThemeService } from './services/theme.service';

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

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    const mocks = createMocks();
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        TabService,
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: Router, useValue: mocks.router },
        { provide: ActivatedRoute, useValue: mocks.activatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 6 navigation items', () => {
    expect(component.navItems.length).toBe(6);
  });

  it('should render sidebar heading', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Spartan Dashboard');
  });

  it('should render version text', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('v1.0.0');
  });

  it('should render all nav item labels', () => {
    const el = fixture.nativeElement as HTMLElement;
    for (const item of component.navItems) {
      expect(el.textContent).toContain(item.label);
    }
  });

  it('should render tab bar component', () => {
    const tabBar = fixture.nativeElement.querySelector('app-tab-bar');
    expect(tabBar).toBeTruthy();
  });

  it('should render router outlet', () => {
    const outlet = fixture.nativeElement.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });

  it('should start with sidebar closed', () => {
    expect(component['sidebarOpen']()).toBe(false);
  });

  it('should render mobile header', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Spartan Dashboard');
  });

  it('should render theme toggle button', () => {
    const btns = fixture.nativeElement.querySelectorAll('button');
    const themeBtn = Array.from(btns).find(b => b.getAttribute('aria-label')?.includes('mode'));
    expect(themeBtn).toBeTruthy();
  });

  it('should render hlm-sheet for mobile sidebar', () => {
    const sheet = fixture.nativeElement.querySelector('hlm-sheet');
    expect(sheet).toBeTruthy();
  });

  it('should initialize tabs from URL on init', () => {
    const tabService = TestBed.inject(TabService);
    tabService.initFromUrl();
    expect(tabService.tabIds()).toContain('home');
  });

  it('should open sidebar when hamburger clicked', () => {
    expect(component['sidebarOpen']()).toBe(false);
    component['sidebarOpen'].set(true);
    expect(component['sidebarOpen']()).toBe(true);
  });
});
