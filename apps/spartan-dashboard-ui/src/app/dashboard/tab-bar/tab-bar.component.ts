import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { TabService } from '../services/tab.service';

@Component({
  selector: 'app-tab-bar',
  imports: [NgComponentOutlet],
  template: `
    <div class="tab-bar">
      @for (tab of tabService.tabs(); track tab.id) {
        <div class="tab" [class.active]="tab.id === tabService.activeTabId()" (click)="tabService.setActiveTab(tab.id)" (keydown.enter)="tabService.setActiveTab(tab.id)" role="tab" tabindex="0">
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
          <button class="tab-close" (click)="$event.stopPropagation(); tabService.closeTab(tab.id)">&times;</button>
        </div>
      }
    </div>
    <div class="tab-content">
      @if (tabService.activeTab(); as active) {
        <ng-container *ngComponentOutlet="active.component" />
      } @else {
        <div class="empty-state">
          <p>Select a page from the sidebar to get started</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
    .tab-bar { display: flex; background: #e2e8f0; border-bottom: 1px solid #cbd5e1; min-height: 36px; overflow-x: auto; flex-shrink: 0; }
    .tab { display: flex; align-items: center; gap: 6px; padding: 6px 14px; cursor: pointer; border-right: 1px solid #cbd5e1; background: #f1f5f9; font-size: 0.8rem; white-space: nowrap; user-select: none; }
    .tab:hover { background: #f8fafc; }
    .tab.active { background: #fff; border-bottom: 2px solid #0f172a; margin-bottom: -1px; }
    .tab-icon { font-size: 0.9rem; }
    .tab-label { font-weight: 500; }
    .tab-close { border: none; background: none; cursor: pointer; font-size: 1rem; line-height: 1; padding: 0 2px; color: #94a3b8; display: flex; align-items: center; }
    .tab-close:hover { color: #ef4444; }
    .tab-content { flex: 1; overflow-y: auto; background: #f8fafc; }
    .empty-state { display: flex; align-items: center; justify-content: center; height: 100%; color: #94a3b8; font-size: 1rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabBarComponent {
  protected readonly tabService = inject(TabService);
}
