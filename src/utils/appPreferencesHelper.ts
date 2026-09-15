/**
 * Uygulama Genel Tercihleri ve Ayarlar Yardımcısı (App Preferences Helper)
 * Para birimi, bildirim günleri, bakım hatırlatıcıları ve varsayılan garanti süresini yönetir.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export type CurrencyCode = 'TRY' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyOption {
  code: CurrencyCode;
  symbol: string;
  label: string;
  ratePlaceholder?: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'TRY', symbol: '₺', label: 'Türk Lirası (₺)' },
  { code: 'USD', symbol: '$', label: 'Amerikan Doları ($)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'İngiliz Sterlini (£)' },
];

export const getCurrencyOptions = (language: 'tr' | 'en' = 'tr'): CurrencyOption[] => [
  { code: 'TRY', symbol: '₺', label: language === 'en' ? 'Turkish Lira (₺)' : 'Türk Lirası (₺)' },
  { code: 'USD', symbol: '$', label: language === 'en' ? 'US Dollar ($)' : 'Amerikan Doları ($)' },
  { code: 'EUR', symbol: '€', label: language === 'en' ? 'Euro (€)' : 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: language === 'en' ? 'British Pound (£)' : 'İngiliz Sterlini (£)' },
];

export const WARRANTY_MILESTONE_OPTIONS = [
  { days: 60, label: '60 Gün' },
  { days: 30, label: '30 Gün' },
  { days: 14, label: '14 Gün' },
  { days: 7, label: '7 Gün' },
  { days: 1, label: '1 Gün' },
];

export const DEFAULT_WARRANTY_DURATION_OPTIONS = [
  { months: 12, label: '12 Ay (1 Yıl)' },
  { months: 24, label: '24 Ay (2 Yıl)' },
  { months: 36, label: '36 Ay (3 Yıl)' },
  { months: 60, label: '60 Ay (5 Yıl)' },
];

const PREF_STORAGE_KEYS = {
  CURRENCY: '@safe_envanter_pref_currency',
  WARRANTY_DAYS: '@safe_envanter_pref_warranty_days',
  MAINTENANCE_REMINDERS: '@safe_envanter_pref_maintenance_reminders',
  DEFAULT_WARRANTY_MONTHS: '@safe_envanter_pref_default_warranty_months',
  NOTIFICATION_HOUR: '@safe_envanter_pref_notification_hour',
  LANGUAGE: '@safe_envanter_pref_language',
};

export interface AppPreferences {
  currency: CurrencyCode;
  currencySymbol: string;
  warrantyDays: number[];
  maintenanceReminders: boolean;
  defaultWarrantyMonths: number;
  notificationHour: number;
  language: 'tr' | 'en';
}

const DEFAULT_PREFERENCES: AppPreferences = {
  currency: 'TRY',
  currencySymbol: '₺',
  warrantyDays: [30, 14, 7, 1],
  maintenanceReminders: true,
  defaultWarrantyMonths: 24,
  notificationHour: 10,
  language: 'tr',
};

// Hafızada hızlı erişim için önbellek
let cachedPreferences: AppPreferences = { ...DEFAULT_PREFERENCES };

export const appPreferencesHelper = {
  /**
   * Kayıtlı tüm tercihleri yükler
   */
  async getPreferences(): Promise<AppPreferences> {
    try {
      const [
        savedCurrency,
        savedDays,
        savedMaintenance,
        savedMonths,
        savedHour,
        savedLanguage,
      ] = await Promise.all([
        AsyncStorage.getItem(PREF_STORAGE_KEYS.CURRENCY),
        AsyncStorage.getItem(PREF_STORAGE_KEYS.WARRANTY_DAYS),
        AsyncStorage.getItem(PREF_STORAGE_KEYS.MAINTENANCE_REMINDERS),
        AsyncStorage.getItem(PREF_STORAGE_KEYS.DEFAULT_WARRANTY_MONTHS),
        AsyncStorage.getItem(PREF_STORAGE_KEYS.NOTIFICATION_HOUR),
        AsyncStorage.getItem(PREF_STORAGE_KEYS.LANGUAGE),
      ]);

      const currency = (savedCurrency as CurrencyCode) || DEFAULT_PREFERENCES.currency;
      const currencyOption = CURRENCY_OPTIONS.find((c) => c.code === currency) || CURRENCY_OPTIONS[0];

      let warrantyDays = DEFAULT_PREFERENCES.warrantyDays;
      if (savedDays) {
        try {
          const parsed = JSON.parse(savedDays);
          if (Array.isArray(parsed) && parsed.length > 0) {
            warrantyDays = parsed;
          }
        } catch {
          // varsayılanı kullan
        }
      }

      const language: 'tr' | 'en' = savedLanguage === 'en' ? 'en' : 'tr';

      cachedPreferences = {
        currency,
        currencySymbol: currencyOption.symbol,
        warrantyDays,
        maintenanceReminders: savedMaintenance !== null ? savedMaintenance === 'true' : true,
        defaultWarrantyMonths: savedMonths ? Number(savedMonths) : 24,
        notificationHour: savedHour ? Number(savedHour) : 10,
        language,
      };

      return cachedPreferences;
    } catch (err) {
      console.warn('Tercihler yüklenirken hata:', err);
      return DEFAULT_PREFERENCES;
    }
  },

  /**
   * Senkronize hızlı para birimi simgesi erişimi
   */
  getCurrencySymbolSync(): string {
    return cachedPreferences.currencySymbol || '₺';
  },

  /**
   * Para birimini kaydeder
   */
  async setCurrency(code: CurrencyCode): Promise<void> {
    const option = CURRENCY_OPTIONS.find((c) => c.code === code) || CURRENCY_OPTIONS[0];
    cachedPreferences.currency = code;
    cachedPreferences.currencySymbol = option.symbol;
    await AsyncStorage.setItem(PREF_STORAGE_KEYS.CURRENCY, code);
  },

  /**
   * Bildirim günlerini kaydeder (örn: [60, 30, 7, 1])
   */
  async setWarrantyDays(days: number[]): Promise<void> {
    cachedPreferences.warrantyDays = days;
    await AsyncStorage.setItem(PREF_STORAGE_KEYS.WARRANTY_DAYS, JSON.stringify(days));
  },

  /**
   * Bakım hatırlatıcıları açık/kapalı durumunu kaydeder
   */
  async setMaintenanceReminders(enabled: boolean): Promise<void> {
    cachedPreferences.maintenanceReminders = enabled;
    await AsyncStorage.setItem(PREF_STORAGE_KEYS.MAINTENANCE_REMINDERS, String(enabled));
  },

  /**
   * Yeni ürünler için varsayılan garanti süresini kaydeder (örn: 24 ay)
   */
  async setDefaultWarrantyMonths(months: number): Promise<void> {
    cachedPreferences.defaultWarrantyMonths = months;
    await AsyncStorage.setItem(PREF_STORAGE_KEYS.DEFAULT_WARRANTY_MONTHS, String(months));
  },

  /**
   * Bildirim saatini kaydeder (örn: 10:00)
   */
  async setNotificationHour(hour: number): Promise<void> {
    cachedPreferences.notificationHour = hour;
    await AsyncStorage.setItem(PREF_STORAGE_KEYS.NOTIFICATION_HOUR, String(hour));
  },

  /**
   * Uygulama dilini kaydeder ('tr' | 'en')
   */
  async setLanguage(language: 'tr' | 'en'): Promise<void> {
    cachedPreferences.language = language;
    await AsyncStorage.setItem(PREF_STORAGE_KEYS.LANGUAGE, language);
  },
};
