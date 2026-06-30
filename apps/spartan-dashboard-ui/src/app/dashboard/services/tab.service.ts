import { Injectable, signal, computed, inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class TabService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

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
      filter(e => e instanceof NavigationEnd),
      map(() => this.router.url.split('/').pop()?.split('?')[0] ?? 'home')
    ),
    { initialValue: this.router.url.split('/').pop()?.split('?')[0] ?? 'home' }
  );

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

  initFromUrl(): void {
    const params = this.route.snapshot.queryParams;
    const tabsParam = params['t'] as string | undefined;
    const currentTabId = this.router.url.split('/').pop()?.split('?')[0] ?? 'home';

    const ids = tabsParam ? tabsParam.split(',').filter(Boolean) : [currentTabId];
    if (!ids.includes(currentTabId)) {
      ids.push(currentTabId);
    }
    this._tabIds.set(ids);
  }

  addTab(id: string): void {
    const fresh = this._tabIds().filter(t => t !== id);
    fresh.push(id);
    this._tabIds.set(fresh);
    this.syncUrl(id);
  }

  closeTab(id: string): void {
    if (this._pinned().has(id)) return;
    const tabs = this._tabIds();
    if (tabs.length <= 1) return;
    const idx = tabs.indexOf(id);
    const remaining = tabs.filter(t => t !== id);
    this._tabIds.set(remaining);
    const nextId = idx >= remaining.length ? remaining[remaining.length - 1] : remaining[idx];
    this.syncUrl(nextId);
  }

  closeOtherTabs(id: string): void {
    const pinned = this._pinned();
    const keep = this._tabIds().filter(t => t === id || pinned.has(t));
    this._tabIds.set(keep);
    this.syncUrl(id);
  }

  closeAllTabs(): void {
    const homeOnly = ['home'];
    this._tabIds.set(homeOnly);
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
