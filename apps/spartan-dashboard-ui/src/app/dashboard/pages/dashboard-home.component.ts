import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HlmCard, HlmCardContent, HlmCardHeader, HlmCardTitle, HlmCardDescription } from '@spartan-ng/helm/card';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmSeparator } from '@spartan-ng/helm/separator';

@Component({
  selector: 'app-dashboard-home',
  imports: [HlmCard, HlmCardContent, HlmCardHeader, HlmCardTitle, HlmCardDescription, HlmButton, HlmSeparator],
  template: `
    <div class="p-6 space-y-6">
      <h1 class="text-2xl font-bold tracking-tight">Dashboard Overview</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (stat of stats; track stat.label) {
          <div hlmCard class="p-4">
            <div hlmCardHeader class="p-0">
              <p hlmCardDescription>{{ stat.label }}</p>
              <h3 hlmCardTitle class="text-2xl">{{ stat.value }}</h3>
            </div>
            <div hlmCardContent class="p-0 pt-1">
              <span [class.text-green-600]="stat.up" [class.text-red-600]="!stat.up" class="text-sm font-medium">
                {{ stat.trend }}
              </span>
            </div>
          </div>
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div hlmCard>
          <div hlmCardHeader>
            <h3 hlmCardTitle>Recent Activity</h3>
          </div>
          <hr hlmSeparator />
          <div hlmCardContent class="p-0">
            @for (item of activities; track item; let last = $last) {
              <div class="flex justify-between items-center px-6 py-3 text-sm" [class.border-b]="!last" [class.border-border]="!last">
                <span>{{ item.action }}</span>
                <span class="text-muted-foreground text-xs">{{ item.time }}</span>
              </div>
            }
          </div>
        </div>

        <div hlmCard>
          <div hlmCardHeader>
            <h3 hlmCardTitle>Quick Actions</h3>
            <p hlmCardDescription>Common tasks at your fingertips</p>
          </div>
          <hr hlmSeparator />
          <div hlmCardContent class="p-4">
            <div class="grid grid-cols-2 gap-2">
              @for (action of quickActions; track action) {
                <button hlmBtn variant="outline" size="sm">{{ action }}</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
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
