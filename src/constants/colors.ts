/**
 * Core Inventory Design System - Renk Paleti
 * screens/core_inventory_design_system/DESIGN.md spesifikasyonuna göre hazırlanmıştır.
 */

export const COLORS = {
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
  surfaceContainerLowest: '#ffffff', // En saf beyaz kart yüzeyi
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
} as const;

export type ColorType = typeof COLORS;
