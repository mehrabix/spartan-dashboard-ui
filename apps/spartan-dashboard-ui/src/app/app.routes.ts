import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard/home',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then(m => m.dashboardRoutes),
  },
  {
    path: '**',
    redirectTo: 'dashboard/home',
  },
];
