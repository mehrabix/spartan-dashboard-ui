import { Injectable, signal, computed, Type } from '@angular/core';

export interface TabItem {
  id: string;
  label: string;
  icon: string;
  component: Type<unknown>;
  data?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class TabService {
  private readonly _tabs = signal<TabItem[]>([]);
  private readonly _activeTabId = signal<string | null>(null);

  readonly tabs = this._tabs.asReadonly();
  readonly activeTabId = this._activeTabId.asReadonly();
  readonly activeTab = computed(() => {
    const id = this._activeTabId();
    return this._tabs().find(t => t.id === id) ?? null;
  });

  addTab(tab: TabItem): void {
    const existing = this._tabs().find(t => t.id === tab.id);
    if (existing) {
      this._activeTabId.set(tab.id);
      return;
    }
    this._tabs.update(tabs => [...tabs, tab]);
    this._activeTabId.set(tab.id);
  }

  closeTab(id: string): void {
    const tabs = this._tabs();
    const idx = tabs.findIndex(t => t.id === id);
    if (idx === -1) return;
    this._tabs.update(t => t.filter(tab => tab.id !== id));
    if (this._activeTabId() === id) {
      const remaining = this._tabs();
      if (remaining.length === 0) {
        this._activeTabId.set(null);
      } else if (idx >= remaining.length) {
        this._activeTabId.set(remaining[remaining.length - 1].id);
      } else {
        this._activeTabId.set(remaining[idx].id);
      }
    }
  }

  setActiveTab(id: string): void {
    if (this._tabs().some(t => t.id === id)) {
      this._activeTabId.set(id);
    }
  }
}
