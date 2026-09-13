/**
 * Garanti Durumu ve Tarih Hesaplayıcı
 * Garanti bitiş tarihine göre gün sayısını ve durum rozetini hesaplar.
 */

import { differenceInDays, format, parseISO, isValid, addMonths, parse } from 'date-fns';
import { tr } from 'date-fns/locale';
import { WarrantyStatusType, WarrantyCalculationResult } from '../types';
import { COLORS } from '../constants';
import { ThemeColors } from '../constants/colors';

/**
 * ISO, GG/AA/YYYY, GG.AA.YYYY veya GG-AA-YYYY formatındaki tarihleri ve Date nesnelerini ayrıştırır.
 */
export const parseAnyDate = (dateStr: string | Date | null | undefined): Date | null => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) {
    return isValid(dateStr) ? dateStr : null;
  }
  if (typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // 1. Standart ISO formatı (YYYY-MM-DD veya YYYY-MM-DDTHH:mm:ss...)
  if (/^\d{4}-\d{1,2}-\d{1,2}/.test(trimmed)) {
    const isoDate = parseISO(trimmed);
    if (isValid(isoDate)) return isoDate;
  }

  // 2. GG/AA/YYYY veya G/A/YYYY formatı
  let date = parse(trimmed, 'dd/MM/yyyy', new Date());
  if (isValid(date)) return date;
  date = parse(trimmed, 'd/M/yyyy', new Date());
  if (isValid(date)) return date;

  // 3. GG.AA.YYYY veya G.A.YYYY formatı
  date = parse(trimmed, 'dd.MM.yyyy', new Date());
  if (isValid(date)) return date;
  date = parse(trimmed, 'd.M.yyyy', new Date());
  if (isValid(date)) return date;

  // 4. GG-AA-YYYY veya G-A-YYYY formatı
  date = parse(trimmed, 'dd-MM-yyyy', new Date());
  if (isValid(date)) return date;
  date = parse(trimmed, 'd-M-yyyy', new Date());
  if (isValid(date)) return date;

  // 5. Genel ISO fallback
  date = parseISO(trimmed);
  if (isValid(date)) return date;

  return null;
};

/**
 * Verilen tarih dizgisine göre garanti durumunu hesaplar.
 */
export const calculateWarrantyStatus = (
  warrantyEndDateStr: string | null | undefined,
  themeColors?: ThemeColors
): WarrantyCalculationResult => {
  const currentColors = themeColors || COLORS;

  if (!warrantyEndDateStr) {
    return {
      status: 'expired',
      daysRemaining: 0,
      label: 'Tarih Belirtilmedi',
      color: currentColors.secondary,
      bgColor: currentColors.secondaryContainer,
    };
  }

  try {
    const today = new Date();
    // Saat/dakika farkını sıfırlamak için gün başlangıcına eşitle
    today.setHours(0, 0, 0, 0);

    const endDate = parseAnyDate(warrantyEndDateStr);
    if (!endDate) {
      return {
        status: 'expired',
        daysRemaining: 0,
        label: 'Geçersiz Tarih',
        color: currentColors.secondary,
        bgColor: currentColors.secondaryContainer,
      };
    }
    endDate.setHours(0, 0, 0, 0);

    const daysRemaining = differenceInDays(endDate, today);

    if (daysRemaining > 30) {
      return {
        status: 'active',
        daysRemaining,
        label: 'Devam Ediyor',
        color: currentColors.warranty?.active || currentColors.tertiary,
        bgColor: currentColors.warranty?.activeBg || currentColors.tertiaryContainer + '20',
      };
    } else if (daysRemaining >= 0 && daysRemaining <= 30) {
      return {
        status: 'expiring_soon',
        daysRemaining,
        label: 'Yakında Bitecek',
        color: currentColors.warranty?.expiring || currentColors.warning,
        bgColor: currentColors.warranty?.expiringBg || currentColors.warningContainer,
      };
    } else {
      return {
        status: 'expired',
        daysRemaining: Math.abs(daysRemaining),
        label: 'Süresi Doldu',
        color: currentColors.warranty?.expired || currentColors.error,
        bgColor: currentColors.warranty?.expiredBg || currentColors.errorContainer + '60',
      };
    }
  } catch {
    return {
      status: 'expired',
      daysRemaining: 0,
      label: 'Süresi Doldu',
      color: currentColors.warranty?.expired || currentColors.error,
      bgColor: currentColors.warranty?.expiredBg || currentColors.errorContainer + '60',
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

    const endDate = parseAnyDate(warrantyEndDateStr);
    if (!endDate) return 0;
    endDate.setHours(0, 0, 0, 0);

    const parsedStart = parseAnyDate(purchaseDateStr);
    const startDate = parsedStart || addMonths(endDate, -24);
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
 * Tarih dizgisini veya Date nesnesini kullanıcı dostu Türkçe gün/ay/yıl formatına dönüştürür (örn: 10/07/2027).
 */
export const formatDateTurkish = (dateStr: string | Date | null | undefined): string => {
  if (!dateStr) return '-';
  try {
    const date = parseAnyDate(dateStr);
    if (!date) return typeof dateStr === 'string' ? dateStr : '-';
    return format(date, 'dd/MM/yyyy', { locale: tr });
  } catch {
    return typeof dateStr === 'string' ? dateStr : '-';
  }
};

/**
 * Satın alma tarihi ve garanti süresinden (ay olarak) garanti bitiş tarihini otomatik hesaplar.
 * Kullanıcıya gün/ay/yıl (dd/MM/yyyy) formatında döner.
 */
export const calculateWarrantyEndDate = (
  purchaseDateStr: string,
  durationMonths: number
): string => {
  try {
    const purchaseDate = parseAnyDate(purchaseDateStr);
    if (!purchaseDate) return '';
    const calculatedDate = addMonths(purchaseDate, durationMonths);
    return format(calculatedDate, 'dd/MM/yyyy');
  } catch {
    return '';
  }
};


/**
 * Herhangi bir geçerli tarih dizgisini Supabase için standart ISO (YYYY-MM-DD) formatına dönüştürür.
 */
export const normalizeToISODate = (dateStr: string | null | undefined): string | null => {
  if (!dateStr) return null;
  const date = parseAnyDate(dateStr);
  if (!date) return null;
  return format(date, 'yyyy-MM-dd');
};

/**
 * Para birimini Türk Lirası olarak formatlar (örn: ₺24.999).
 */
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === undefined || amount === null) return '₺0';
  return `₺${amount.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}`;
};

