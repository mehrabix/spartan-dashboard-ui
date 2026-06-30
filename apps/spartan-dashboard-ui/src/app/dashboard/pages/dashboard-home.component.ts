import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-dashboard-home',
  template: `
    <div class="page">
      <h1 class="page-title">Dashboard Overview</h1>
      <div class="stats-grid">
        @for (stat of stats; track stat.label) {
          <div class="stat-card">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
            <span class="stat-trend" [class.up]="stat.up" [class.down]="!stat.up">
              {{ stat.trend }}
            </span>
          </div>
        }
      </div>
      <div class="page-grid">
        <div class="card">
          <h2>Recent Activity</h2>
          @for (item of activities; track item) {
            <div class="activity-row">
              <span>{{ item.action }}</span>
              <span class="muted">{{ item.time }}</span>
            </div>
          }
        </div>
        <div class="card">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            @for (action of quickActions; track action) {
              <button class="action-btn">{{ action }}</button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; }
    .page-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 24px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; display: flex; flex-direction: column; gap: 4px; }
    .stat-value { font-size: 2rem; font-weight: 700; }
    .stat-label { font-size: 0.875rem; color: #64748b; }
    .stat-trend { font-size: 0.8rem; }
    .stat-trend.up { color: #22c55e; }
    .stat-trend.down { color: #ef4444; }
    .page-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
    .card h2 { font-size: 1.125rem; font-weight: 600; margin-bottom: 16px; }
    .activity-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
    .muted { color: #94a3b8; font-size: 0.875rem; }
    .actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .action-btn { padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; background: #f8fafc; cursor: pointer; font-size: 0.875rem; }
    .action-btn:hover { background: #f1f5f9; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHomeComponent {
  readonly stats = [
    { label: 'Total Users', value: '2,847', trend: '+12%', up: true },
    { label: 'Revenue', value: '$48,290', trend: '+8.2%', up: true },
    { label: 'Active Sessions', value: '1,423', trend: '-3.1%', up: false },
    { label: 'Bounce Rate', value: '24.5%', trend: '-2.4%', up: true },
  ];
  readonly activities = [
    { action: 'New user registered', time: '2 min ago' },
    { action: 'Order #4821 completed', time: '15 min ago' },
    { action: 'Server deployment finished', time: '1 hr ago' },
    { action: 'Database backup completed', time: '3 hr ago' },
    { action: 'New analytics report generated', time: '5 hr ago' },
  ];
  readonly quickActions = ['New User', 'Create Report', 'Add Product', 'Run Backup'];
}
