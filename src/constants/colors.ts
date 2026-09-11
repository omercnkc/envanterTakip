/**
 * Core Inventory Design System - Renk Paleti (Light & Dark Mode)
 * Stitch & Material Design 3 tasarım spesifikasyonlarına göre hazırlanmıştır.
 */

export interface ThemeColors {
  // Marka & Birincil Renkler
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  primaryFixed: string;
  primaryFixedDim: string;
  surfaceTint: string;
  inversePrimary: string;

  // İkincil & Nötr Renkler
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  secondaryFixed: string;
  secondaryFixedDim: string;

  // Üçüncül & Başarı Renkleri (Yeşil - Garanti Devam Ediyor)
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  tertiaryFixed: string;
  tertiaryFixedDim: string;

  // Hata & Süresi Dolmuş Garanti Renkleri (Kırmızı)
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  // Uyarı & Yakında Bitecek Garanti Renkleri (Turuncu / Amber)
  warning: string;
  warningContainer: string;
  onWarningContainer: string;

  // Yüzey ve Arka Plan Katmanları (Layering)
  background: string;
  onBackground: string;
  surface: string;
  surfaceBright: string;
  surfaceDim: string;
  surfaceVariant: string;
  onSurface: string;
  onSurfaceVariant: string;

  // Kart Katmanları
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;

  // Çerçeve ve Çizgiler
  outline: string;
  outlineVariant: string;
  borderLight: string;

  // Ters Katmanlar
  inverseSurface: string;
  inverseOnSurface: string;

  // Garanti Rozet Renkleri
  warranty: {
    active: string;
    activeBg: string;
    activeText: string;
    expiring: string;
    expiringBg: string;
    expiringText: string;
    expired: string;
    expiredBg: string;
    expiredText: string;
  };
}

export const LIGHT_COLORS: ThemeColors = {
  // Marka & Birincil Renkler
  primary: '#4648d4',
  onPrimary: '#ffffff',
  primaryContainer: '#6063ee',
  onPrimaryContainer: '#fffbff',
  primaryFixed: '#e1e0ff',
  primaryFixedDim: '#c0c1ff',
  surfaceTint: '#494bd6',
  inversePrimary: '#c0c1ff',

  // İkincil & Nötr Renkler
  secondary: '#5c5f60',
  onSecondary: '#ffffff',
  secondaryContainer: '#e1e3e4',
  onSecondaryContainer: '#626566',
  secondaryFixed: '#e1e3e4',
  secondaryFixedDim: '#c5c7c8',

  // Üçüncül & Başarı Renkleri (Yeşil - Garanti Devam Ediyor)
  tertiary: '#006c49',
  onTertiary: '#ffffff',
  tertiaryContainer: '#00885d',
  onTertiaryContainer: '#000703',
  tertiaryFixed: '#6ffbbe',
  tertiaryFixedDim: '#4edea3',

  // Hata & Süresi Dolmuş Garanti Renkleri (Kırmızı)
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  // Uyarı & Yakında Bitecek Garanti Renkleri (Turuncu / Amber)
  warning: '#d97706',
  warningContainer: '#fef3c7',
  onWarningContainer: '#78350f',

  // Yüzey ve Arka Plan Katmanları (Layering)
  background: '#f8f9ff',
  onBackground: '#121c2a',
  surface: '#f8f9ff',
  surfaceBright: '#f8f9ff',
  surfaceDim: '#d0dbed',
  surfaceVariant: '#d9e3f6',
  onSurface: '#121c2a',
  onSurfaceVariant: '#464554',

  // Kart Katmanları
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#eff4ff',
  surfaceContainer: '#e6eeff',
  surfaceContainerHigh: '#dee9fc',
  surfaceContainerHighest: '#d9e3f6',

  // Çerçeve ve Çizgiler
  outline: '#767586',
  outlineVariant: '#c7c4d7',
  borderLight: '#e2e8f0',

  // Ters Katmanlar
  inverseSurface: '#27313f',
  inverseOnSurface: '#eaf1ff',

  // Garanti Rozet Renkleri
  warranty: {
    active: '#10b981',
    activeBg: '#ecfdf5',
    activeText: '#065f46',
    expiring: '#f59e0b',
    expiringBg: '#fffbeb',
    expiringText: '#92400e',
    expired: '#ef4444',
    expiredBg: '#fef2f2',
    expiredText: '#991b1b',
  },
};

export const DARK_COLORS: ThemeColors = {
  // Marka & Birincil Renkler (Koyu arka planda parlayan modern indigo/mor)
  primary: '#7275ff',
  onPrimary: '#ffffff',
  primaryContainer: '#4648d4',
  onPrimaryContainer: '#e1e0ff',
  primaryFixed: '#28296a',
  primaryFixedDim: '#1f2053',
  surfaceTint: '#7275ff',
  inversePrimary: '#4648d4',

  // İkincil & Nötr Renkler
  secondary: '#94a3b8',
  onSecondary: '#0f172a',
  secondaryContainer: '#1e293b',
  onSecondaryContainer: '#cbd5e1',
  secondaryFixed: '#1e293b',
  secondaryFixedDim: '#334155',

  // Üçüncül & Başarı Renkleri (Canlı Zümrüt Yeşili)
  tertiary: '#34d399',
  onTertiary: '#022c22',
  tertiaryContainer: '#065f46',
  onTertiaryContainer: '#a7f3d0',
  tertiaryFixed: '#064e3b',
  tertiaryFixedDim: '#022c22',

  // Hata & Süresi Dolmuş Garanti Renkleri (Canlı Mercan Kırmızısı)
  error: '#f87171',
  onError: '#450a0a',
  errorContainer: '#7f1d1d',
  onErrorContainer: '#fecaca',

  // Uyarı & Yakında Bitecek Garanti Renkleri (Işıltılı Amber)
  warning: '#fbbf24',
  warningContainer: '#78350f',
  onWarningContainer: '#fef3c7',

  // Yüzey ve Arka Plan Katmanları (Derin Gece / OLED Lacivert Siyah)
  background: '#0b0f19',
  onBackground: '#f8fafc',
  surface: '#0b0f19',
  surfaceBright: '#1e293b',
  surfaceDim: '#070a12',
  surfaceVariant: '#192231',
  onSurface: '#f8fafc',
  onSurfaceVariant: '#94a3b8',

  // Kart Katmanları (Elevations)
  surfaceContainerLowest: '#121826',
  surfaceContainerLow: '#172033',
  surfaceContainer: '#1d273d',
  surfaceContainerHigh: '#232f48',
  surfaceContainerHighest: '#2b3955',

  // Çerçeve ve Çizgiler
  outline: '#475569',
  outlineVariant: '#334155',
  borderLight: '#1e293b',

  // Ters Katmanlar
  inverseSurface: '#f1f5f9',
  inverseOnSurface: '#0f172a',

  // Garanti Rozet Renkleri (Koyu mod kontrastı optimize edilmiş)
  warranty: {
    active: '#34d399',
    activeBg: '#064e3b50',
    activeText: '#6ee7b7',
    expiring: '#fbbf24',
    expiringBg: '#78350f50',
    expiringText: '#fde68a',
    expired: '#f87171',
    expiredBg: '#7f1d1d50',
    expiredText: '#fca5a5',
  },
};

// Geriye dönük tam uyumluluk için varsayılan COLORS
export const COLORS = LIGHT_COLORS;

export type ColorType = ThemeColors;
export type ThemeMode = 'light' | 'dark' | 'system';
