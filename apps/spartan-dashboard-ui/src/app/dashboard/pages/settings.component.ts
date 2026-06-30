import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-settings',
  template: `
    <div class="page">
      <h1 class="page-title">Settings</h1>
      <div class="card">
        @for (section of sections; track section.title) {
          <div class="section">
            <h3>{{ section.title }}</h3>
            @for (item of section.items; track item.label) {
              <div class="setting-row">
                <div>
                  <span class="setting-label">{{ item.label }}</span>
                  <span class="setting-desc">{{ item.desc }}</span>
                </div>
                @if (item.type === 'toggle') {
                  <label class="toggle">
                    <input type="checkbox" [checked]="item.value" />
                    <span class="slider"></span>
                  </label>
                } @else {
                  <span class="setting-value">{{ item.value }}</span>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; max-width: 800px; }
    .page-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 24px; }
    .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; }
    .section { margin-bottom: 24px; }
    .section:last-child { margin-bottom: 0; }
    .section h3 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
    .setting-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f8fafc; }
    .setting-label { display: block; font-size: 0.9rem; font-weight: 500; }
    .setting-desc { display: block; font-size: 0.8rem; color: #64748b; margin-top: 2px; }
    .setting-value { font-size: 0.875rem; color: #64748b; }
    .toggle { position: relative; display: inline-block; width: 40px; height: 22px; cursor: pointer; }
    .toggle input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; inset: 0; background: #cbd5e1; border-radius: 11px; transition: 0.2s; }
    .toggle input:checked + .slider { background: #0f172a; }
    .slider::before { content: ''; position: absolute; height: 16px; width: 16px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: 0.2s; }
    .toggle input:checked + .slider::before { transform: translateX(18px); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  readonly sections = [
    {
      title: 'Preferences',
      items: [
        { label: 'Email Notifications', desc: 'Receive email updates', type: 'toggle', value: true },
        { label: 'Dark Mode', desc: 'Use dark theme', type: 'toggle', value: false },
        { label: 'Compact View', desc: 'Show compact layout', type: 'toggle', value: false },
      ],
    },
    {
      title: 'Account',
      items: [
        { label: 'Language', desc: 'Display language', type: 'text', value: 'English (US)' },
        { label: 'Timezone', desc: 'Time zone', type: 'text', value: 'UTC-5 (Eastern)' },
        { label: 'Session Timeout', desc: 'Auto logout after', type: 'text', value: '30 minutes' },
      ],
    },
  ];
}
