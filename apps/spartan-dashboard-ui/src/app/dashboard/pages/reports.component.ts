import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-reports',
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Reports</h1>
        <button class="btn-primary">Generate Report</button>
      </div>
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Report</th>
              <th>Period</th>
              <th>Status</th>
              <th>Generated</th>
            </tr>
          </thead>
          <tbody>
            @for (report of reports; track report.name) {
              <tr>
                <td>{{ report.name }}</td>
                <td>{{ report.period }}</td>
                <td><span class="status" [class.completed]="report.status === 'Completed'">{{ report.status }}</span></td>
                <td>{{ report.generated }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-title { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .btn-primary { padding: 8px 16px; background: #0f172a; color: #fff; border: none; border-radius: 6px; cursor: pointer; }
    .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { text-align: left; padding: 12px 16px; font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
    .table td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; }
    .status { padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; background: #fef2f2; color: #dc2626; }
    .status.completed { background: #f0fdf4; color: #16a34a; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent {
  readonly reports = [
    { name: 'Monthly Revenue', period: 'June 2026', status: 'Completed', generated: '2026-06-30' },
    { name: 'User Growth', period: 'Q2 2026', status: 'Completed', generated: '2026-06-29' },
    { name: 'Product Performance', period: 'June 2026', status: 'Pending', generated: '-' },
    { name: 'Customer Satisfaction', period: 'Q2 2026', status: 'Completed', generated: '2026-06-28' },
    { name: 'Sales Forecast', period: 'July 2026', status: 'Generating', generated: '-' },
    { name: 'Inventory Report', period: 'June 2026', status: 'Completed', generated: '2026-06-27' },
  ];
}
