import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, Subscription } from 'rxjs';

export interface TabState {
  id: string;
  label: string;
  icon: string;
}

const TAB_LABELS: Record<string, { label: string; icon: string }> = {
  home: { label: 'Dashboard', icon: '📊' },
  users: { label: 'Users', icon: '👥' },
  analytics: { label: 'Analytics', icon: '📈' },
  products: { label: 'Products', icon: '📦' },
  reports: { label: 'Reports', icon: '📄' },
  settings: { label: 'Settings', icon: '⚙️' },
};

const PINNED_KEY = 'spartan-pinned';
const SESSION_KEY = 'spartan-session';
const COLORS_KEY = 'spartan-tab-colors';
const LABELS_KEY = 'spartan-tab-labels';

export const TAB_COLORS = ['default', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'] as const;
export type TabColor = (typeof TAB_COLORS)[number];

function loadPinned(): Set<string> {
  try {
    const raw = localStorage.getItem(PINNED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function savePinned(pinned: Set<string>): void {
  localStorage.setItem(PINNED_KEY, JSON.stringify([...pinned]));
}

function loadSession(): string[] {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSession(tabs: string[]): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(tabs));
}

function loadColors(): Record<string, TabColor> {
  try {
    const raw = localStorage.getItem(COLORS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveColors(colors: Record<string, TabColor>): void {
  localStorage.setItem(COLORS_KEY, JSON.stringify(colors));
}

function loadLabels(): Record<string, string> {
  try {
    const raw = localStorage.getItem(LABELS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLabels(labels: Record<string, string>): void {
  localStorage.setItem(LABELS_KEY, JSON.stringify(labels));
}

@Injectable({ providedIn: 'root' })
export class TabService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const loadingSub = this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        this._isLoading.set(true);
      } else if (e instanceof NavigationEnd) {
        this._isLoading.set(false);
      }
    });
    this.destroyRef.onDestroy(() => loadingSub.unsubscribe());

    const historySub = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(() => {
      const id = this.activeTabId();
      if (id) {
        const url = this.router.url;
        if (!this._currentHistory[id]) {
          this._currentHistory[id] = [];
        }
        if (this._currentHistory[id][this._currentHistory[id].length - 1] !== url) {
          this._currentHistory[id].push(url);
        }
        this._tabHistory.set({ ...this._currentHistory });
      }
    });
    this.destroyRef.onDestroy(() => historySub.unsubscribe());
  }

  private readonly _tabIds = signal<string[]>([]);
  readonly tabIds = this._tabIds.asReadonly();

  private readonly _pinned = signal<Set<string>>(loadPinned());
  readonly pinned = this._pinned.asReadonly();

  readonly tabs = computed<TabState[]>(() =>
    this._tabIds().map(id => ({
      id,
      ...(TAB_LABELS[id] ?? { label: id, icon: '📄' }),
    }))
  );

  readonly activeTabId = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url.split('/').pop()?.split('?')[0] ?? 'home')
    ),
    { initialValue: this.router.url.split('/').pop()?.split('?')[0] ?? 'home' }
  );

  // S-Tier: Drag & drop reorder
  reorderTabs(fromIndex: number, toIndex: number): void {
    const ids = [...this._tabIds()];
    const [moved] = ids.splice(fromIndex, 1);
    ids.splice(toIndex, 0, moved);
    this._tabIds.set(ids);
    saveSession(ids);
  }

  // S-Tier: Tab hover info
  readonly hoveredTabId = signal<string | null>(null);

  // A-Tier: Loading indicator
  private readonly _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();

  // A-Tier: Session restore
  initFromUrl(): void {
    const saved = loadSession();
    const params = this.route.snapshot.queryParams;
    const tabsParam = params['t'] as string | undefined;
    const currentTabId = this.router.url.split('/').pop()?.split('?')[0] ?? 'home';

    let ids: string[];
    if (tabsParam) {
      ids = tabsParam.split(',').filter(Boolean);
    } else if (saved.length > 0) {
      ids = saved;
      if (!ids.includes(currentTabId)) {
        ids.push(currentTabId);
      }
    } else {
      ids = [currentTabId];
    }
    if (!ids.includes(currentTabId)) {
      ids.push(currentTabId);
    }
    this._tabIds.set(ids);
    saveSession(ids);
  }

  // A-Tier: Duplicate tab
  duplicateTab(id: string): void {
    const ids = [...this._tabIds()];
    const idx = ids.indexOf(id);
    const copyId = id + '_copy';
    ids.splice(idx + 1, 0, copyId);
    this._tabIds.set(ids);
    saveSession(ids);
  }

  // A-Tier: Tab history per tab
  private readonly _tabHistory = signal<Record<string, string[]>>({});
  readonly tabHistory = this._tabHistory.asReadonly();
  private _currentHistory: Record<string, string[]> = {};

  navigateTabBack(id: string): void {
    const history = this._currentHistory[id];
    if (!history || history.length < 2) return;
    history.pop();
    const prev = history[history.length - 1];
    this.setActiveTab(prev.split('/').pop()?.split('?')[0] ?? id);
  }

  // B-Tier: Tab groups/coloring
  private readonly _tabColors = signal<Record<string, TabColor>>(loadColors());
  readonly tabColors = this._tabColors.asReadonly();

  setTabColor(id: string, color: TabColor): void {
    this._tabColors.update(colors => {
      const next = { ...colors };
      if (color === 'default') {
        delete next[id];
      } else {
        next[id] = color;
      }
      saveColors(next);
      return next;
    });
  }

  // B-Tier: Tab search
  readonly searchQuery = signal('');
  readonly isSearchOpen = signal(false);
  readonly filteredTabs = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.tabs();
    return this.tabs().filter(t => t.label.toLowerCase().includes(query) || t.id.toLowerCase().includes(query));
  });

  toggleSearch(): void {
    this.isSearchOpen.update(v => !v);
    if (!this.isSearchOpen()) {
      this.searchQuery.set('');
    }
  }

  // B-Tier: Alert badges
  private readonly _tabBadges = signal<Record<string, string | number>>({});
  readonly tabBadges = this._tabBadges.asReadonly();

  setTabBadge(id: string, badge: string | number | null): void {
    this._tabBadges.update(badges => {
      const next = { ...badges };
      if (badge === null) {
        delete next[id];
      } else {
        next[id] = badge;
      }
      return next;
    });
  }

  // B-Tier: Tab renaming
  private readonly _tabLabels = signal<Record<string, string>>(loadLabels());
  readonly tabLabels = this._tabLabels.asReadonly();
  readonly editingTabId = signal<string | null>(null);

  setTabLabel(id: string, label: string): void {
    this._tabLabels.update(labels => {
      const next = { ...labels, [id]: label };
      saveLabels(next);
      return next;
    });
    this.editingTabId.set(null);
  }

  startEditing(id: string): void {
    this.editingTabId.set(id);
  }

  cancelEditing(): void {
    this.editingTabId.set(null);
  }

  getTabLabel(id: string): string {
    return this._tabLabels()[id] ?? TAB_LABELS[id]?.label ?? id;
  }

  // C-Tier: Vertical tab bar
  readonly verticalTabs = signal(false);
  toggleVerticalTabs(): void {
    this.verticalTabs.update(v => !v);
  }

  // C-Tier: Readability mode per tab
  private readonly _readabilityMode = signal<Set<string>>(new Set());
  readonly readabilityMode = this._readabilityMode.asReadonly();

  isReadabilityMode(id: string): boolean {
    return this._readabilityMode().has(id);
  }

  toggleReadabilityMode(id: string): void {
    this._readabilityMode.update(s => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // C-Tier: Time tracker
  private readonly _tabTimestamps = signal<Record<string, number>>({});
  readonly tabTimestamps = this._tabTimestamps.asReadonly();

  getTabOpenDuration(id: string): number {
    const ts = this._tabTimestamps()[id];
    if (!ts) return 0;
    return Date.now() - ts;
  }

  isPinned(id: string): boolean {
    return this._pinned().has(id);
  }

  togglePin(id: string): void {
    this._pinned.update(s => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      savePinned(next);
      return next;
    });
  }

  addTab(id: string): void {
    const fresh = this._tabIds().filter(t => t !== id);
    fresh.push(id);
    this._tabIds.set(fresh);
    this._tabTimestamps.update(ts => ({ ...ts, [id]: Date.now() }));
    saveSession(fresh);
    this.syncUrl(id);
  }

  closeTab(id: string): void {
    if (this._pinned().has(id)) return;
    const tabs = this._tabIds();
    if (tabs.length <= 1) return;
    const idx = tabs.indexOf(id);
    const remaining = tabs.filter(t => t !== id);
    this._tabIds.set(remaining);
    saveSession(remaining);
    const nextId = idx >= remaining.length ? remaining[remaining.length - 1] : remaining[idx];
    this.syncUrl(nextId);
  }

  closeOtherTabs(id: string): void {
    const pinned = this._pinned();
    const keep = this._tabIds().filter(t => t === id || pinned.has(t));
    this._tabIds.set(keep);
    saveSession(keep);
    this.syncUrl(id);
  }

  closeAllTabs(): void {
    const homeOnly = ['home'];
    this._tabIds.set(homeOnly);
    saveSession(homeOnly);
    this.syncUrl('home');
  }

  setActiveTab(id: string): void {
    this.router.navigate(['/dashboard', id], {
      queryParamsHandling: 'preserve',
    });
  }

  private syncUrl(activeId: string): void {
    this.router.navigate(['/dashboard', activeId], {
      queryParams: { t: this._tabIds().join(',') },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
