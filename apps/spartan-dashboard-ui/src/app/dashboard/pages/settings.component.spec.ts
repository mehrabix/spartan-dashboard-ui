import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { SettingsComponent } from './settings.component';
import { ThemeService } from '../services/theme.service';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    themeService = TestBed.inject(ThemeService);
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the heading', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Settings');
  });

  it('should render a preferences card with dark mode toggle', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Dark Mode');
    expect(el.textContent).toContain('Use dark theme');
  });

  it('should render account information labels', () => {
    const el = fixture.nativeElement as HTMLElement;
    for (const item of component.account) {
      expect(el.textContent).toContain(item.label);
    }
  });

  it('should toggle dark mode when switch is clicked', () => {
    const switchTrigger = fixture.nativeElement.querySelector('brn-switch');
    expect(switchTrigger).toBeTruthy();
    themeService.setDark(true);
    fixture.detectChanges();
    expect(themeService.isDark()).toBe(true);
  });

  it('should show email notifications toggle', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Email Notifications');
  });

  it('should show compact view toggle', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Compact View');
  });

  it('should render 3 account fields', () => {
    expect(component.account.length).toBe(3);
  });

  it('should start with email notifications enabled', () => {
    expect(component['emailNotifications']).toBe(true);
  });
});
