import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-analytics',
  template: `
    <div class="page">
      <h1 class="page-title">Analytics</h1>
      <div class="chart-grid">
        @for (chart of charts; track chart.title) {
          <div class="card">
            <h3>{{ chart.title }}</h3>
            <div class="chart-placeholder">
              <div class="bar-chart">
                @for (bar of chart.data; track $index) {
                  <div class="bar-wrapper">
                    <div class="bar" [style.height.%]="bar"></div>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
      <div class="card metrics">
        <h3>Key Metrics</h3>
        <div class="metrics-grid">
          @for (m of metrics; track m.label) {
            <div class="metric">
              <span class="metric-value">{{ m.value }}</span>
              <span class="metric-label">{{ m.label }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; }
    .page-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 24px; }
    .chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
    .card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; }
    .chart-placeholder { height: 180px; display: flex; align-items: flex-end; }
    .bar-chart { display: flex; align-items: flex-end; gap: 8px; width: 100%; height: 100%; padding-top: 20px; }
    .bar-wrapper { flex: 1; display: flex; align-items: flex-end; height: 100%; }
    .bar { width: 100%; background: linear-gradient(to top, #3b82f6, #60a5fa); border-radius: 4px 4px 0 0; min-height: 4px; transition: height 0.3s; }
    .metrics { margin-top: 0; }
    .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .metric { text-align: center; }
    .metric-value { display: block; font-size: 1.5rem; font-weight: 700; }
    .metric-label { font-size: 0.8rem; color: #64748b; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent {
  readonly charts = [
    { title: 'Weekly Visitors', data: [40, 65, 50, 80, 55, 90, 70] },
    { title: 'Page Views', data: [60, 45, 75, 55, 85, 65, 95] },
    { title: 'Conversions', data: [20, 35, 25, 40, 30, 45, 35] },
    { title: 'Revenue Trend', data: [50, 70, 45, 85, 60, 75, 90] },
  ];
  readonly metrics = [
    { label: 'Page Views', value: '142K' },
    { label: 'Visitors', value: '48K' },
    { label: 'Conversion', value: '3.2%' },
    { label: 'Avg Time', value: '4m 32s' },
  ];
}
