/**
 * Core Inventory Design System - Boşluk ve Yuvarlatma Sabitleri
 * screens/core_inventory_design_system/DESIGN.md spesifikasyonuna göre hazırlanmıştır.
 */

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Semantik Boşluklar
  containerMargin: 16,
  gutter: 16,
  stackSm: 8,
  stackMd: 16,
  stackLg: 24,
  sectionGap: 32,
} as const;

export const RADIUS = {
  sm: 4,
  default: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
} as const;
