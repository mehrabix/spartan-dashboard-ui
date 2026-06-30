import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import { TabService } from './services/tab.service';
import { ThemeService } from './services/theme.service';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

@Component({
  imports: [RouterModule, RouterOutlet, TabBarComponent, HlmButton],
  selector: 'app-dashboard',
  template: `
    <div class="flex h-screen">
      <aside class="flex w-60 flex-col shrink-0 bg-sidebar border-r border-sidebar-border">
        <div class="px-4 py-5 flex items-center justify-between">
          <h2 class="text-sm font-semibold tracking-tight text-sidebar-foreground">Spartan Dashboard</h2>
          <button hlmBtn variant="ghost" size="sm" class="w-7 h-7 p-0 text-sidebar-foreground" (click)="themeService.toggle()" [attr.aria-label]="'Switch to ' + (themeService.isDark() ? 'light' : 'dark') + ' mode'">
            {{ themeService.isDark() ? '☀️' : '🌙' }}
          </button>
        </div>
        <hr hlmSeparator />
        <nav class="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          @for (item of navItems; track item.id) {
            <button
              hlmBtn
              variant="ghost"
              size="sm"
              class="w-full justify-start gap-3 px-3 py-2 text-sm font-normal"
              [class.bg-accent]="item.id === tabService.activeTabId()"
              [class.text-accent-foreground]="item.id === tabService.activeTabId()"
              (click)="tabService.addTab(item.id)"
            >
              <span class="text-base w-5 text-center shrink-0">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </button>
          }
        </nav>
        <div class="px-4 py-3 border-t border-sidebar-border">
          <span class="text-xs text-sidebar-foreground/60">v1.0.0</span>
        </div>
      </aside>
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-tab-bar />
        <div class="flex-1 overflow-y-auto bg-muted/30">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  protected readonly tabService = inject(TabService);
  protected readonly themeService = inject(ThemeService);

  readonly navItems: NavItem[] = [
    { id: 'home', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'reports', label: 'Reports', icon: '📄' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  ngOnInit(): void {
    this.tabService.initFromUrl();
  }
}
