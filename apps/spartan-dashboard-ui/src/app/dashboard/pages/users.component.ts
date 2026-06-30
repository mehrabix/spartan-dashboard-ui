import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HlmCard, HlmCardContent } from '@spartan-ng/helm/card';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmTableImports } from '@spartan-ng/helm/table';

interface User {
  name: string;
  email: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-users',
  imports: [HlmCard, HlmCardContent, HlmButton, HlmBadge, ...HlmTableImports],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold tracking-tight">Users</h1>
        <button hlmBtn size="sm">Add User</button>
      </div>

      <div hlmCard>
        <div hlmCardContent class="p-0">
          <div hlmTableContainer>
            <table hlmTable>
              <thead hlmTHead>
                <tr hlmTr>
                  <th hlmTh>Name</th>
                  <th hlmTh>Email</th>
                  <th hlmTh>Role</th>
                  <th hlmTh>Status</th>
                </tr>
              </thead>
              <tbody hlmTBody>
                @for (user of users; track user.email) {
                  <tr hlmTr>
                    <td hlmTd class="font-medium">{{ user.name }}</td>
                    <td hlmTd class="text-muted-foreground">{{ user.email }}</td>
                    <td hlmTd>
                      <span hlmBadge variant="secondary" class="text-xs">{{ user.role }}</span>
                    </td>
                    <td hlmTd>
                      <span hlmBadge [variant]="user.status === 'Active' ? 'default' : 'outline'" class="text-xs">
                        {{ user.status }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
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
