import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CdkMenuModule } from '@angular/cdk/menu';
import { TabService } from '../services/tab.service';

@Component({
  selector: 'app-tab-bar',
  imports: [CdkMenuModule],
  template: `
    <div class="rounded-lg p-[3px] h-9 bg-muted inline-flex items-center justify-start w-full overflow-x-auto shrink-0">
      @for (tab of tabService.tabs(); track tab.id) {
        @let active = tab.id === tabService.activeTabId();
        @let pinned = tabService.isPinned(tab.id);
        <button
          [cdkContextMenuTriggerFor]="contextMenu"
          (contextmenu)="contextMenuTabId = tab.id"
          class="relative inline-flex items-center justify-center whitespace-nowrap rounded-md border text-sm font-medium transition-all shrink-0 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 after:absolute after:inset-x-1 after:bottom-[-3px] after:h-0.5 after:rounded-full after:bg-foreground"
          [class.h-7]="!pinned"
          [class.w-7]="pinned"
          [class.gap-1.5]="!pinned"
          [class.px-2]="!pinned"
          [class.py-1]="!pinned"
          [class.border-transparent]="!active"
          [class.border-border]="active"
          [class.bg-background]="active"
          [class.text-foreground]="active || pinned"
          [class.shadow-sm]="active"
          [class.text-foreground/60]="!active && !pinned"
          [class.hover:text-foreground]="!active"
          [class.after:opacity-100]="active"
          [class.after:opacity-0]="!active"
          (click)="tabService.setActiveTab(tab.id)"
        >
          @if (pinned) {
            <span class="shrink-0 text-[10px]">📌</span>
          }
          <span class="shrink-0">{{ tab.icon }}</span>
          @if (!pinned) {
            <span>{{ tab.label }}</span>
          }
          @if (!pinned && tab.id !== 'home') {
            <span
              class="inline-flex items-center justify-center w-4 h-4 rounded-sm text-xs leading-none cursor-pointer hover:bg-muted hover:text-destructive transition-colors"
              (click)="$event.stopPropagation(); tabService.closeTab(tab.id)"
              role="button"
              tabindex="0"
              (keydown.enter)="$event.stopPropagation(); tabService.closeTab(tab.id)"
            >&times;</span>
          }
        </button>
      }
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
  host: { class: 'flex items-center px-1 py-1 bg-background border-b border-border overflow-x-auto shrink-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabBarComponent {
  protected readonly tabService = inject(TabService);
  protected contextMenuTabId: string | null = null;
}
