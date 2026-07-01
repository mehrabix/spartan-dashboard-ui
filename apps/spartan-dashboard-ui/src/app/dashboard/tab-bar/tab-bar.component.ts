import { Component, ChangeDetectionStrategy, inject, signal, HostListener } from '@angular/core';
import { CdkMenuModule } from '@angular/cdk/menu';
import { HlmTabs, HlmTabsPaginatedList, HlmTabsTrigger } from '@spartan-ng/helm/tabs';
import { TabService, TAB_COLORS, type TabColor } from '../services/tab.service';

@Component({
  selector: 'app-tab-bar',
  imports: [CdkMenuModule, HlmTabs, HlmTabsPaginatedList, HlmTabsTrigger],
  template: `
    <div
      hlmTabs
      [tab]="tabService.activeTabId()"
      [orientation]="tabService.verticalTabs() ? 'vertical' : 'horizontal'"
      (tabActivated)="tabService.setActiveTab($event)"
      class="px-1 py-1 bg-background border-b border-border relative"
      (mousedown)="preventPaginatorFocus($event)"
    >
      <!-- S-Tier: Tab search overlay -->
      @if (tabService.isSearchOpen()) {
        <div
          class="absolute inset-0 z-50 flex items-start justify-center pt-12 bg-background/95"
          (click)="tabService.toggleSearch()"
        >
          <div
            class="w-80 max-h-64 bg-popover text-popover-foreground rounded-lg border border-border shadow-lg overflow-hidden"
            (click)="$event.stopPropagation()"
          >
            <input
              class="w-full px-3 py-2 text-sm bg-transparent border-b border-border outline-none placeholder:text-muted-foreground"
              placeholder="Search tabs..."
              autofocus
              (input)="onSearchInput($event)"
              (keydown.escape)="tabService.toggleSearch()"
              (keydown.enter)="activateFirstSearchResult()"
            />
            <div class="max-h-48 overflow-y-auto">
              @for (tab of tabService.filteredTabs(); track tab.id) {
                <button
                  class="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                  (click)="tabService.setActiveTab(tab.id); tabService.toggleSearch()"
                >
                  <span>{{ tab.icon }}</span>
                  <span>{{ tabService.getTabLabel(tab.id) }}</span>
                  <span class="ml-auto text-xs text-muted-foreground">{{ tab.id }}</span>
                </button>
              }
              @if (tabService.filteredTabs().length === 0) {
                <div class="px-3 py-4 text-sm text-muted-foreground text-center">No tabs found</div>
              }
            </div>
          </div>
        </div>
      }

      <hlm-paginated-tabs-list
        (dragover)="onDragOver($event)"
        (drop)="onDrop($event)"
      >
        @for (tab of tabService.tabs(); track tab.id; let i = $index) {
          <button
            [hlmTabsTrigger]="tab.id"
            [cdkContextMenuTriggerFor]="contextMenu"
            (contextmenu)="contextMenuTabId = tab.id"
            (auxclick)="onAuxClick($event, tab.id)"
            draggable="true"
            (dragstart)="onDragStart(i, $event)"
            (dragend)="onDragEnd()"
            class="relative shrink-0"
            [class.opacity-50]="draggedIndex() === i"
            [class.border-l-2]="dragOverIndex() === i"
            [class.border-primary]="dragOverIndex() === i"
            [title]="getTabTitle(tab.id)"
          >
            <!-- B-Tier: Color indicator -->
            @if (tabService.tabColors()[tab.id]) {
              <span
                class="absolute left-0 top-1 bottom-1 w-0.5 rounded-full"
                [style.background]="tabColorToCss(tabService.tabColors()[tab.id]!)"
              ></span>
            }
            @if (tabService.isPinned(tab.id)) {
              <span class="shrink-0 text-[10px]">📌</span>
            }
            <span class="shrink-0">{{ tab.icon }}</span>
            <!-- B-Tier: Inline rename -->
            @if (tabService.editingTabId() === tab.id) {
              <input
                class="w-16 h-5 text-xs px-1 rounded border border-input bg-background"
                [value]="renameValue"
                (input)="renameValue = $any($event.target).value"
                (blur)="commitRename(tab.id)"
                (keydown.enter)="commitRename(tab.id)"
                (keydown.escape)="tabService.cancelEditing()"
                (click)="$event.stopPropagation()"
              />
            } @else {
              <span
                class="truncate max-w-20"
                (dblclick)="startRename(tab.id); $event.preventDefault()"
              >{{ tabService.getTabLabel(tab.id) }}</span>
            }
            <!-- B-Tier: Alert badge -->
            @if (tabService.tabBadges()[tab.id]) {
              <span
                class="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-medium bg-destructive text-destructive-foreground"
              >{{ tabService.tabBadges()[tab.id] }}</span>
            }
            @if (!tabService.isPinned(tab.id) && tab.id !== 'home') {
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

      <!-- A-Tier: Loading indicator -->
      @if (tabService.isLoading()) {
        <span class="ml-auto mr-1 shrink-0 inline-block w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
      }
    </div>

    <!-- Context menu -->
    <ng-template #contextMenu>
      <div class="min-w-44 py-1 bg-popover text-popover-foreground rounded-lg border border-border shadow-md text-sm" cdkMenu>
        @if (contextMenuTabId && contextMenuTabId !== 'home') {
          <button
            cdkMenuItem
            class="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            (click)="tabService.closeTab(contextMenuTabId); contextMenuTabId = null"
          >
            <span class="w-4 shrink-0 text-xs">✕</span>
            <span>Close Tab</span>
          </button>
        }
        @if (contextMenuTabId) {
          <button
            cdkMenuItem
            class="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            (click)="tabService.togglePin(contextMenuTabId); contextMenuTabId = null"
          >
            <span class="w-4 shrink-0 text-xs">{{ tabService.isPinned(contextMenuTabId) ? '📌' : '📍' }}</span>
            <span>{{ tabService.isPinned(contextMenuTabId) ? 'Unpin Tab' : 'Pin Tab' }}</span>
          </button>
        }
        @if (contextMenuTabId) {
          <button
            cdkMenuItem
            class="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            (click)="tabService.duplicateTab(contextMenuTabId); contextMenuTabId = null"
          >
            <span class="w-4 shrink-0 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16V4a2 2 0 0 1 2-2h12"/></svg>
            </span>
            <span>Duplicate Tab</span>
          </button>
        }
        @if (contextMenuTabId && (tabService.tabHistory()[contextMenuTabId]?.length ?? 0) > 1) {
          <button
            cdkMenuItem
            class="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            (click)="tabService.navigateTabBack(contextMenuTabId); contextMenuTabId = null"
          >
            <span class="w-4 shrink-0 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </span>
            <span>Go Back</span>
          </button>
        }
        @if (contextMenuTabId) {
          <div class="h-px bg-border my-1"></div>
          <div class="px-2 py-1 text-xs text-muted-foreground">Tab Color</div>
          <div class="flex flex-wrap gap-1 px-2 pb-1.5">
            @for (color of TAB_COLORS; track color) {
              <button
                cdkMenuItem
                class="w-5 h-5 rounded-full border border-border cursor-pointer hover:scale-110 transition-transform"
                [class.ring-2]="tabService.tabColors()[contextMenuTabId] === color"
                [class.ring-primary]="tabService.tabColors()[contextMenuTabId] === color"
                [style.background]="tabColorToCss(color)"
                (click)="tabService.setTabColor(contextMenuTabId, color)"
                [attr.aria-label]="color"
              ></button>
            }
          </div>
          <div class="h-px bg-border my-1"></div>
          <button
            cdkMenuItem
            class="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            (click)="tabService.toggleReadabilityMode(contextMenuTabId); contextMenuTabId = null"
          >
            <span class="w-4 shrink-0 text-xs">{{ tabService.isReadabilityMode(contextMenuTabId) ? '✓' : '☐' }}</span>
            <span>Readability Mode</span>
          </button>
          @if (tabService.tabTimestamps()[contextMenuTabId]) {
            <div class="px-2 py-1 text-xs text-muted-foreground">
              Open for {{ getDurationAgo(contextMenuTabId) }}
            </div>
          }
        }
        <div class="h-px bg-border my-1"></div>
        @if (contextMenuTabId) {
          <button
            cdkMenuItem
            class="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            (click)="tabService.closeOtherTabs(contextMenuTabId); contextMenuTabId = null"
          >
            <span class="w-4 shrink-0 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
            </span>
            <span>Close Others</span>
          </button>
        }
        <button
          cdkMenuItem
          class="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
          (click)="tabService.closeAllTabs(); contextMenuTabId = null"
        >
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
  protected readonly TAB_COLORS = TAB_COLORS;

  protected draggedIndex = signal<number | null>(null);
  protected dragOverIndex = signal<number | null>(null);
  protected renameValue = '';

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'w') {
      event.preventDefault();
      const activeId = this.tabService.activeTabId();
      if (activeId) this.tabService.closeTab(activeId);
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      const tabs = this.tabService.tabIds();
      if (tabs.length < 2) return;
      const activeIdx = tabs.indexOf(this.tabService.activeTabId() ?? 'home');
      const nextIdx = (activeIdx + 1) % tabs.length;
      this.tabService.setActiveTab(tabs[nextIdx]);
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'Tab' && event.shiftKey) {
      event.preventDefault();
      const tabs = this.tabService.tabIds();
      if (tabs.length < 2) return;
      const activeIdx = tabs.indexOf(this.tabService.activeTabId() ?? 'home');
      const prevIdx = (activeIdx - 1 + tabs.length) % tabs.length;
      this.tabService.setActiveTab(tabs[prevIdx]);
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key >= '1' && event.key <= '9') {
      event.preventDefault();
      const idx = parseInt(event.key) - 1;
      const tabs = this.tabService.tabIds();
      if (idx < tabs.length) {
        this.tabService.setActiveTab(tabs[idx]);
      }
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === 'a' || event.key === 'A')) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        event.preventDefault();
        this.tabService.toggleSearch();
      }
      return;
    }
    if (event.key === 'Escape' && this.tabService.isSearchOpen()) {
      this.tabService.toggleSearch();
    }
  }

  protected onAuxClick(event: MouseEvent, id: string): void {
    if (event.button === 1) {
      event.preventDefault();
      this.tabService.closeTab(id);
    }
  }

  protected onDragStart(index: number, event: DragEvent): void {
    this.draggedIndex.set(index);
    event.dataTransfer?.setData('text/plain', String(index));
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (this.draggedIndex() === null) return;
    const target = (event.target as HTMLElement).closest('[hlmTabsTrigger]');
    if (target) {
      const parent = target.closest('[role="tablist"]');
      if (parent) {
        const items = Array.from(parent.querySelectorAll('[hlmTabsTrigger]'));
        this.dragOverIndex.set(items.indexOf(target));
      }
    }
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    const fromIndex = Number(event.dataTransfer?.getData('text/plain'));
    const toIndex = this.dragOverIndex();
    if (!isNaN(fromIndex) && toIndex !== null && fromIndex !== toIndex) {
      this.tabService.reorderTabs(fromIndex, toIndex);
    }
    this.draggedIndex.set(null);
    this.dragOverIndex.set(null);
  }

  protected onDragEnd(): void {
    this.draggedIndex.set(null);
    this.dragOverIndex.set(null);
  }

  protected startRename(id: string): void {
    this.renameValue = this.tabService.getTabLabel(id);
    this.tabService.startEditing(id);
  }

  protected commitRename(id: string): void {
    if (this.renameValue.trim()) {
      this.tabService.setTabLabel(id, this.renameValue.trim());
    } else {
      this.tabService.cancelEditing();
    }
  }

  protected getTabTitle(id: string): string {
    const label = this.tabService.getTabLabel(id);
    const duration = this.tabService.getTabOpenDuration(id);
    if (duration <= 0) return label;
    return label + ' | ' + this.getDurationAgo(id);
  }

  protected onSearchInput(event: Event): void {
    this.tabService.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected activateFirstSearchResult(): void {
    const filtered = this.tabService.filteredTabs();
    if (filtered.length > 0) {
      this.tabService.setActiveTab(filtered[0].id);
      this.tabService.toggleSearch();
    }
  }

  protected getDurationAgo(id: string): string {
    const duration = this.tabService.getTabOpenDuration(id);
    if (duration <= 0) return 'just now';
    const seconds = Math.floor(duration / 1000);
    if (seconds < 60) return seconds + 's';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'm ' + (seconds % 60) + 's';
    const hours = Math.floor(minutes / 60);
    return hours + 'h ' + (minutes % 60) + 'm';
  }

  protected tabColorToCss(color: TabColor): string {
    const map: Record<TabColor, string> = {
      default: 'transparent',
      red: '#ef4444',
      orange: '#f97316',
      yellow: '#eab308',
      green: '#22c55e',
      blue: '#3b82f6',
      purple: '#a855f7',
      pink: '#ec4899',
    };
    return map[color] ?? 'transparent';
  }

  protected preventPaginatorFocus(event: MouseEvent): void {
    const button = (event.target as HTMLElement).closest('button[data-pagination]');
    if (button) {
      event.preventDefault();
    }
  }
}
