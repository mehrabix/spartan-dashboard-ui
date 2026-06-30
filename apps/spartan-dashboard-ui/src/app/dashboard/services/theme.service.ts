import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'spartan-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _dark = signal<boolean>(false);
  private readonly platformId = inject(PLATFORM_ID);

  readonly isDark = this._dark.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this._dark.set(localStorage.getItem(STORAGE_KEY) === 'dark');
    }

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const dark = this._dark();
        document.documentElement.classList.toggle('dark', dark);
        localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
      }
    });
  }

  toggle(): void {
    this._dark.update(v => !v);
  }

  setDark(dark: boolean): void {
    this._dark.set(dark);
  }
}
