/**
 * Garanti Durumu ve Tarih Hesaplayıcı
 * Garanti bitiş tarihine göre gün sayısını ve durum rozetini hesaplar.
 */

import { differenceInDays, format, parseISO, isValid, addMonths } from 'date-fns';
import { tr } from 'date-fns/locale';
import { WarrantyStatusType, WarrantyCalculationResult } from '../types';
import { COLORS } from '../constants';

/**
 * Verilen ISO tarih dizgisine (YYYY-MM-DD) göre garanti durumunu hesaplar.
 */
export const calculateWarrantyStatus = (
  warrantyEndDateStr: string | null | undefined
): WarrantyCalculationResult => {
  if (!warrantyEndDateStr) {
    return {
      status: 'expired',
      daysRemaining: 0,
      label: 'Tarih Belirtilmedi',
      color: COLORS.secondary,
      bgColor: COLORS.secondaryContainer,
    };
  }

  try {
    const today = new Date();
    // Saat/dakika farkını sıfırlamak için gün başlangıcına eşitle
    today.setHours(0, 0, 0, 0);

    const endDate = parseISO(warrantyEndDateStr);
    if (!isValid(endDate)) {
      return {
        status: 'expired',
        daysRemaining: 0,
        label: 'Geçersiz Tarih',
        color: COLORS.secondary,
        bgColor: COLORS.secondaryContainer,
      };
    }
    endDate.setHours(0, 0, 0, 0);

    const daysRemaining = differenceInDays(endDate, today);

    if (daysRemaining > 30) {
      return {
        status: 'active',
        daysRemaining,
        label: 'Devam Ediyor',
        color: COLORS.tertiary,
        bgColor: COLORS.tertiaryContainer + '20',
      };
    } else if (daysRemaining >= 0 && daysRemaining <= 30) {
      return {
        status: 'expiring_soon',
        daysRemaining,
        label: 'Yakında Bitecek',
        color: COLORS.warning,
        bgColor: COLORS.warningContainer,
      };
    } else {
      return {
        status: 'expired',
        daysRemaining: Math.abs(daysRemaining),
        label: 'Süresi Doldu',
        color: COLORS.error,
        bgColor: COLORS.errorContainer + '60',
      };
    }
  } catch {
    return {
      status: 'expired',
      daysRemaining: 0,
      label: 'Süresi Doldu',
      color: COLORS.error,
      bgColor: COLORS.errorContainer + '60',
    };
  }
};

/**
 * Garanti süresinin kalan yüzdesini (0-100) hesaplar.
 */
export const calculateWarrantyPercentage = (
  purchaseDateStr: string | null | undefined,
  warrantyEndDateStr: string | null | undefined
): number => {
  if (!warrantyEndDateStr) return 0;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = parseISO(warrantyEndDateStr);
    if (!isValid(endDate)) return 0;
    endDate.setHours(0, 0, 0, 0);

    const startDate = purchaseDateStr && isValid(parseISO(purchaseDateStr))
      ? parseISO(purchaseDateStr)
      : addMonths(endDate, -24);
    startDate.setHours(0, 0, 0, 0);

    const totalDuration = differenceInDays(endDate, startDate);
    if (totalDuration <= 0) return 0;

    const remaining = differenceInDays(endDate, today);
    if (remaining <= 0) return 0;
    if (remaining >= totalDuration) return 100;

    return Math.round((remaining / totalDuration) * 100);
  } catch {
    return 0;
  }
};

/**
 * ISO tarih dizgisini kullanıcı dostu Türkçe formata dönüştürür (örn: 12.04.2028).
 */
export const formatDateTurkish = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-';
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;
    return format(date, 'dd.MM.yyyy', { locale: tr });
  } catch {
    return dateStr;
  }
};

/**
 * Satın alma tarihi ve garanti süresinden (ay olarak) garanti bitiş tarihini otomatik hesaplar.
 */
export const calculateWarrantyEndDate = (
  purchaseDateStr: string,
  durationMonths: number
): string => {
  try {
    const purchaseDate = parseISO(purchaseDateStr);
    if (!isValid(purchaseDate)) return '';
    const calculatedDate = addMonths(purchaseDate, durationMonths);
    return format(calculatedDate, 'yyyy-MM-dd');
  } catch {
    return '';
  }
};

/**
 * Para birimini Türk Lirası olarak formatlar (örn: ₺24.999).
 */
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === undefined || amount === null) return '₺0';
  return `₺${amount.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}`;
};
