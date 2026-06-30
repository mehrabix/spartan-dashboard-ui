import { Route } from '@angular/router';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/dashboard-home.component').then(m => m.DashboardHomeComponent),
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users.component').then(m => m.UsersComponent),
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics.component').then(m => m.AnalyticsComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products.component').then(m => m.ProductsComponent),
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports.component').then(m => m.ReportsComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings.component').then(m => m.SettingsComponent),
  },
];
