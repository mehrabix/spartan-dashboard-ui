import { Component, ChangeDetectionStrategy } from '@angular/core';

interface User {
  name: string;
  email: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-users',
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Users</h1>
        <button class="btn-primary">Add User</button>
      </div>
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users; track user.email) {
              <tr>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td><span class="badge">{{ user.role }}</span></td>
                <td><span class="status" [class.active]="user.status === 'Active'">{{ user.status }}</span></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-title { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .btn-primary { padding: 8px 16px; background: #0f172a; color: #fff; border: none; border-radius: 6px; cursor: pointer; }
    .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { text-align: left; padding: 12px 16px; font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
    .table td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; }
    .badge { padding: 2px 8px; border-radius: 4px; background: #e2e8f0; font-size: 0.8rem; }
    .status { padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; background: #fef2f2; color: #dc2626; }
    .status.active { background: #f0fdf4; color: #16a34a; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  readonly users: User[] = [
    { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
    { name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
    { name: 'David Brown', email: 'david@example.com', role: 'Editor', status: 'Active' },
    { name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'Active' },
    { name: 'Frank Wilson', email: 'frank@example.com', role: 'Viewer', status: 'Inactive' },
    { name: 'Grace Lee', email: 'grace@example.com', role: 'Editor', status: 'Active' },
  ];
}
