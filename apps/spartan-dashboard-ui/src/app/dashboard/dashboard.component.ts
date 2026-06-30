import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: ` <h1>Dashboard</h1> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
