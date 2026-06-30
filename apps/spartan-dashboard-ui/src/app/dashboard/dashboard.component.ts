import { Component, ChangeDetectionStrategy, inject, Type } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import { TabService } from './services/tab.service';
import {
  DashboardHomeComponent,
  UsersComponent,
  AnalyticsComponent,
  SettingsComponent,
  ReportsComponent,
  ProductsComponent,
} from './pages';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  component: Type<unknown>;
}

@Component({
  imports: [RouterModule, TabBarComponent],
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Spartan Dashboard</h2>
        </div>
        <nav class="sidebar-nav">
          @for (item of navItems; track item.id) {
            <button class="nav-item" (click)="openTab(item)">
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ item.label }}</span>
            </button>
          }
        </nav>
        <div class="sidebar-footer">
          <span class="version">v1.0.0</span>
        </div>
      </aside>
      <main class="main-content">
        <app-tab-bar />
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
    .dashboard-layout { display: flex; height: 100%; }
    .sidebar { width: 240px; background: #0f172a; color: #fff; display: flex; flex-direction: column; flex-shrink: 0; }
    .sidebar-header { padding: 20px 16px; border-bottom: 1px solid #1e293b; }
    .sidebar-header h2 { font-size: 1rem; font-weight: 700; margin: 0; }
    .sidebar-nav { flex: 1; padding: 8px; overflow-y: auto; }
    .nav-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px; border: none; background: none; color: #94a3b8; cursor: pointer; border-radius: 6px; font-size: 0.875rem; text-align: left; transition: all 0.15s; }
    .nav-item:hover { background: #1e293b; color: #fff; }
    .nav-icon { font-size: 1rem; width: 20px; text-align: center; }
    .nav-label { font-weight: 500; }
    .sidebar-footer { padding: 12px 16px; border-top: 1px solid #1e293b; }
    .version { font-size: 0.75rem; color: #475569; }
    .main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly tabService = inject(TabService);

  readonly navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', component: DashboardHomeComponent },
    { id: 'users', label: 'Users', icon: '👥', component: UsersComponent },
    { id: 'analytics', label: 'Analytics', icon: '📈', component: AnalyticsComponent },
    { id: 'products', label: 'Products', icon: '📦', component: ProductsComponent },
    { id: 'reports', label: 'Reports', icon: '📄', component: ReportsComponent },
    { id: 'settings', label: 'Settings', icon: '⚙️', component: SettingsComponent },
  ];

  protected openTab(item: NavItem): void {
    this.tabService.addTab({
      id: item.id,
      label: item.label,
      icon: item.icon,
      component: item.component,
    });
  }
}
