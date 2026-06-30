import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HlmCard, HlmCardContent, HlmCardHeader, HlmCardTitle, HlmCardDescription } from '@spartan-ng/helm/card';
import { HlmSeparator } from '@spartan-ng/helm/separator';

@Component({
  selector: 'app-analytics',
  imports: [HlmCard, HlmCardContent, HlmCardHeader, HlmCardTitle, HlmCardDescription, HlmSeparator],
  template: `
    <div class="p-4 md:p-6 space-y-6">
      <h1 class="text-xl md:text-2xl font-bold tracking-tight">Analytics</h1>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        @for (m of metrics; track m.label) {
          <div hlmCard class="p-4 text-center">
            <div hlmCardHeader class="p-0">
              <p hlmCardDescription>{{ m.label }}</p>
              <h3 hlmCardTitle class="text-2xl">{{ m.value }}</h3>
            </div>
          </div>
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        @for (chart of charts; track chart.title) {
          <div hlmCard>
            <div hlmCardHeader>
              <h3 hlmCardTitle>{{ chart.title }}</h3>
            </div>
            <hr hlmSeparator />
            <div hlmCardContent class="p-4">
              <div class="flex items-end gap-2 h-32">
                @for (bar of chart.data; track $index) {
                  <div class="flex-1 flex flex-col items-center gap-1">
                    <div
                      class="w-full bg-primary rounded-t-sm transition-all"
                      [style.height.%]="bar"
                    ></div>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
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
