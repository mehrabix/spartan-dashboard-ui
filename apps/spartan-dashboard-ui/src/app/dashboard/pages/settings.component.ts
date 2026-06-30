import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { HlmCard, HlmCardContent, HlmCardHeader, HlmCardTitle, HlmCardDescription } from '@spartan-ng/helm/card';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSwitch } from '@spartan-ng/helm/switch';
import { BrnSwitch } from '@spartan-ng/brain/switch';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-settings',
  imports: [HlmCard, HlmCardContent, HlmCardHeader, HlmCardTitle, HlmCardDescription, HlmLabel, HlmInput, HlmSwitch, BrnSwitch],
  template: `
    <div class="p-6 space-y-6 max-w-2xl">
      <h1 class="text-2xl font-bold tracking-tight">Settings</h1>

      <div hlmCard>
        <div hlmCardHeader>
          <h3 hlmCardTitle>Preferences</h3>
          <p hlmCardDescription>Customize your experience</p>
        </div>
        <hr hlmSeparator />
        <div hlmCardContent class="p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">Dark Mode</p>
              <p class="text-xs text-muted-foreground">Use dark theme</p>
            </div>
            <brn-switch [checked]="themeService.isDark()" (checkedChange)="themeService.setDark($event)" aria-label="Toggle dark mode">
              <hlm-switch />
            </brn-switch>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">Email Notifications</p>
              <p class="text-xs text-muted-foreground">Receive email updates</p>
            </div>
            <brn-switch [checked]="emailNotifications" (checkedChange)="emailNotifications = $event" aria-label="Toggle email notifications">
              <hlm-switch />
            </brn-switch>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">Compact View</p>
              <p class="text-xs text-muted-foreground">Show compact layout</p>
            </div>
            <brn-switch [checked]="compactView" (checkedChange)="compactView = $event" aria-label="Toggle compact view">
              <hlm-switch />
            </brn-switch>
          </div>
        </div>
      </div>

      <div hlmCard>
        <div hlmCardHeader>
          <h3 hlmCardTitle>Account</h3>
          <p hlmCardDescription>Manage your account settings</p>
        </div>
        <hr hlmSeparator />
        <div hlmCardContent class="p-6 space-y-4">
          @for (item of account; track item.label; let i = $index) {
            <div class="space-y-1.5">
              <label hlmLabel [attr.for]="'account-' + i">{{ item.label }}</label>
              <input hlmInput [value]="item.value" class="w-full" readonly [id]="'account-' + i" />
            </div>
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  protected readonly themeService = inject(ThemeService);
  protected emailNotifications = true;
  protected compactView = false;

  readonly account = [
    { label: 'Language', value: 'English (US)' },
    { label: 'Timezone', value: 'UTC-5 (Eastern)' },
    { label: 'Session Timeout', value: '30 minutes' },
  ];
}
