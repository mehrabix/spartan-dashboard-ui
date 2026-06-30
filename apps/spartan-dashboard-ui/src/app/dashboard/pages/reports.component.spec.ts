import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReportsComponent } from './reports.component';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the heading', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Reports');
  });

  it('should render a Generate Report button', () => {
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Generate Report');
  });

  it('should render all reports in the table', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(component.reports.length);
  });

  it('should display report names', () => {
    const el = fixture.nativeElement as HTMLElement;
    for (const r of component.reports) {
      expect(el.textContent).toContain(r.name);
    }
  });

  it('should render a badge for each status', () => {
    const badges = fixture.nativeElement.querySelectorAll('[hlmBadge]');
    expect(badges.length).toBe(component.reports.length);
  });
});
