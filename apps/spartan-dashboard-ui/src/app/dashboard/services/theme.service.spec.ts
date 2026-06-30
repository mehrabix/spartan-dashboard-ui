import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from './theme.service';

const STORAGE_KEY = 'spartan-theme';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(ThemeService);
  });

  it('should start with light mode by default', () => {
    expect(service.isDark()).toBe(false);
  });

  it('should restore dark mode from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(ThemeService);
    expect(service.isDark()).toBe(true);
  });

  it('should toggle dark mode', () => {
    service.toggle();
    expect(service.isDark()).toBe(true);
    service.toggle();
    expect(service.isDark()).toBe(false);
  });

  it('should set dark mode explicitly', () => {
    service.setDark(true);
    expect(service.isDark()).toBe(true);
    service.setDark(false);
    expect(service.isDark()).toBe(false);
  });

  it('should persist to localStorage when toggling', () => {
    service.setDark(true);
    TestBed.flushEffects();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    service.setDark(false);
    TestBed.flushEffects();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
  });

  it('should toggle dark class on document element', () => {
    service.setDark(true);
    TestBed.flushEffects();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    service.setDark(false);
    TestBed.flushEffects();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should not touch localStorage in non-browser platform', () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
    service = TestBed.inject(ThemeService);
    service.setDark(true);
    TestBed.flushEffects();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
