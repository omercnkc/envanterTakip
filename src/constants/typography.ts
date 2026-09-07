/**
 * Core Inventory Design System - Tipografi Sabitleri
 * screens/core_inventory_design_system/DESIGN.md spesifikasyonuna göre hazırlanmıştır.
 */

import { TextStyle } from 'react-native';

export const TYPOGRAPHY = {
  headlineLg: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  } as TextStyle,

  headlineLgMobile: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
  } as TextStyle,

  headlineMd: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  } as TextStyle,

  bodyLg: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  } as TextStyle,

  bodyMd: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  } as TextStyle,

  bodySm: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  } as TextStyle,

  labelMd: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.25,
  } as TextStyle,

  labelSm: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  } as TextStyle,
} as const;
