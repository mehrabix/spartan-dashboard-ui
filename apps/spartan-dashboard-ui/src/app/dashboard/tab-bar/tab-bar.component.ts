import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CdkMenuModule } from '@angular/cdk/menu';
import { HlmTabs, HlmTabsPaginatedList, HlmTabsTrigger } from '@spartan-ng/helm/tabs';
import { TabService } from '../services/tab.service';

@Component({
  selector: 'app-tab-bar',
  imports: [CdkMenuModule, HlmTabs, HlmTabsPaginatedList, HlmTabsTrigger],
  template: `
      <div hlmTabs [tab]="tabService.activeTabId()" (tabActivated)="tabService.setActiveTab($event)" class="px-1 py-1 bg-background border-b border-border" (mousedown)="preventPaginatorFocus($event)">
      <hlm-paginated-tabs-list>
        @for (tab of tabService.tabs(); track tab.id) {
          @let pinned = tabService.isPinned(tab.id);
          <button
            [hlmTabsTrigger]="tab.id"
            [cdkContextMenuTriggerFor]="contextMenu"
            (contextmenu)="contextMenuTabId = tab.id"
            class="relative shrink-0"
          >
            @if (pinned) {
              <span class="shrink-0 text-[10px]">📌</span>
            }
            <span class="shrink-0">{{ tab.icon }}</span>
            <span class="truncate max-w-20">{{ tab.label }}</span>
            @if (!pinned && tab.id !== 'home') {
              <span
                class="inline-flex items-center justify-center w-4 h-4 rounded-sm text-xs leading-none cursor-pointer hover:bg-muted hover:text-destructive transition-colors ml-0.5"
                (click)="$event.stopPropagation(); tabService.closeTab(tab.id)"
                role="button"
                tabindex="0"
                (keydown.enter)="$event.stopPropagation(); tabService.closeTab(tab.id)"
              >&times;</span>
            }
          </button>
        }
      </hlm-paginated-tabs-list>
    </div>

    <ng-template #contextMenu>
      <div class="min-w-40 py-1 bg-popover text-popover-foreground rounded-lg border border-border shadow-md text-sm" cdkMenu>
        @if (contextMenuTabId && contextMenuTabId !== 'home') {
          <button cdkMenuItem class="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer" (click)="tabService.closeTab(contextMenuTabId); contextMenuTabId = null">
            <span class="w-4 shrink-0 text-xs">✕</span>
            <span>Close Tab</span>
          </button>
        }
        @if (contextMenuTabId) {
          <button cdkMenuItem class="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer" (click)="tabService.togglePin(contextMenuTabId); contextMenuTabId = null">
            <span class="w-4 shrink-0 text-xs">{{ tabService.isPinned(contextMenuTabId) ? '📌' : '📍' }}</span>
            <span>{{ tabService.isPinned(contextMenuTabId) ? 'Unpin Tab' : 'Pin Tab' }}</span>
          </button>
        }
        <div class="h-px bg-border my-1"></div>
        @if (contextMenuTabId) {
          <button cdkMenuItem class="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer" (click)="tabService.closeOtherTabs(contextMenuTabId); contextMenuTabId = null">
            <span class="w-4 shrink-0 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
            </span>
            <span>Close Others</span>
          </button>
        }
        <button cdkMenuItem class="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer" (click)="tabService.closeAllTabs(); contextMenuTabId = null">
          <span class="w-4 shrink-0 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/><line x1="3" x2="21" y1="9" y2="9"/></svg>
          </span>
          <span>Close All</span>
        </button>
      </div>
    </ng-template>
  `,
  host: { class: 'block shrink-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabBarComponent {
  protected readonly tabService = inject(TabService);
  protected contextMenuTabId: string | null = null;

  protected preventPaginatorFocus(event: MouseEvent): void {
    const button = (event.target as HTMLElement).closest('button[data-pagination]');
    if (button) {
      event.preventDefault();
    }
  }
}
