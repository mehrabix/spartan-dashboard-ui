import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AnalyticsComponent } from './analytics.component';

describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the heading', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Analytics');
  });

  it('should render 4 metric cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('[hlmCard]');
    expect(component.metrics.length).toBe(4);
  });

  it('should render all metric values', () => {
    const el = fixture.nativeElement as HTMLElement;
    for (const m of component.metrics) {
      expect(el.textContent).toContain(m.value);
    }
  });

  it('should render 4 chart sections', () => {
    expect(component.charts.length).toBe(4);
  });

  it('should render chart data bars', () => {
    const bars = fixture.nativeElement.querySelectorAll('[style*="height"]');
    expect(bars.length).toBeGreaterThan(0);
  });
});
