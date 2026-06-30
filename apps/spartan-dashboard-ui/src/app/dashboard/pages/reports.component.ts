import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HlmCard, HlmCardContent } from '@spartan-ng/helm/card';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmTableImports } from '@spartan-ng/helm/table';

@Component({
  selector: 'app-reports',
  imports: [HlmCard, HlmCardContent, HlmButton, HlmBadge, ...HlmTableImports],
  template: `
    <div class="p-4 md:p-6 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-xl md:text-2xl font-bold tracking-tight">Reports</h1>
        <button hlmBtn size="sm">Generate Report</button>
      </div>

      <div hlmCard class="overflow-hidden">
        <div hlmCardContent class="p-0 overflow-x-auto">
          <div hlmTableContainer>
            <table hlmTable>
              <thead hlmTHead>
                <tr hlmTr>
                  <th hlmTh>Report</th>
                  <th hlmTh>Period</th>
                  <th hlmTh>Status</th>
                  <th hlmTh>Generated</th>
                </tr>
              </thead>
              <tbody hlmTBody>
                @for (report of reports; track report.name) {
                  <tr hlmTr>
                    <td hlmTd class="font-medium whitespace-nowrap">{{ report.name }}</td>
                    <td hlmTd class="text-muted-foreground whitespace-nowrap">{{ report.period }}</td>
                    <td hlmTd>
                      <span hlmBadge [variant]="report.status === 'Completed' ? 'default' : 'secondary'" class="text-xs whitespace-nowrap">
                        {{ report.status }}
                      </span>
                    </td>
                    <td hlmTd class="text-muted-foreground whitespace-nowrap">{{ report.generated }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
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
