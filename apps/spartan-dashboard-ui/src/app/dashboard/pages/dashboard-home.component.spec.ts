import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DashboardHomeComponent } from './dashboard-home.component';

describe('DashboardHomeComponent', () => {
  let component: DashboardHomeComponent;
  let fixture: ComponentFixture<DashboardHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the heading', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Dashboard Overview');
  });

  it('should render 4 stat cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('div[hlmCard]');
    expect(cards.length).toBe(6);
  });

  it('should render 4 stat metrics', () => {
    expect(component.stats.length).toBe(4);
  });

  it('should render all stat values', () => {
    const el = fixture.nativeElement as HTMLElement;
    for (const stat of component.stats) {
      expect(el.textContent).toContain(stat.value);
    }
  });

  it('should render 5 recent activity items', () => {
    const items = fixture.nativeElement.querySelectorAll('[hlmCardContent] + div .flex.justify-between');
    expect(component.activities.length).toBe(5);
  });

  it('should render 4 quick action buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button[hlmBtn]');
    expect(component.quickActions.length).toBe(4);
  });

  it('should apply OnPush change detection', () => {
    const metadata = (DashboardHomeComponent as any)['ɵcmp'];
    expect(metadata.onPush).toBe(true);
  });
});
