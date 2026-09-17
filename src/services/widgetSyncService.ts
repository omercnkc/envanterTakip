import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';
import { calculateWarrantyStatus, formatDateTurkish } from '../utils/warrantyCalculator';
import { WarrantyWidget, WarrantyWidgetData } from '../widgets/WarrantyWidget';
import { appPreferencesHelper } from '../utils/appPreferencesHelper';

export const WIDGET_STORAGE_KEY = '@app_widget_warranty_data';

/**
 * Ürün listesinden widget için gerekli en yakın garanti ve aktif sayı verisini hesaplar
 */
export function calculateWidgetData(
  products: Product[],
  language: 'tr' | 'en' = 'tr'
): WarrantyWidgetData {
  if (!products || products.length === 0) {
    return {
      language,
      nearestProduct: null,
      activeCount: 0,
      totalCount: 0,
    };
  }

  let activeCount = 0;
  const activeProductsWithDays: Array<{
    product: Product;
    daysRemaining: number;
    isExpiringSoon: boolean;
    isExpired: boolean;
  }> = [];

  products.forEach((p) => {
    if (!p.warranty_end_date) return;
    const status = calculateWarrantyStatus(p.warranty_end_date);

    if (status.status === 'active' || status.status === 'expiring_soon') {
      activeCount += 1;
      activeProductsWithDays.push({
        product: p,
        daysRemaining: status.daysRemaining,
        isExpiringSoon: status.status === 'expiring_soon',
        isExpired: false,
      });
    }
  });

  // En yakın garanti bitişine göre sırala
  activeProductsWithDays.sort((a, b) => a.daysRemaining - b.daysRemaining);

  const nearest = activeProductsWithDays[0];

  let nearestProductInfo: WarrantyWidgetData['nearestProduct'] = null;

  if (nearest) {
    const brandModel = [nearest.product.brand, nearest.product.model].filter(Boolean).join(' · ');
    nearestProductInfo = {
      id: nearest.product.id,
      name: nearest.product.name,
      brandModel: brandModel || nearest.product.category?.name || undefined,
      daysRemaining: nearest.daysRemaining,
      endDate: formatDateTurkish(nearest.product.warranty_end_date),
      status: nearest.isExpiringSoon ? 'expiring_soon' : 'active',
      imageUrl: nearest.product.image_path,
    };
  }

  return {
    language,
    nearestProduct: nearestProductInfo,
    activeCount,
    totalCount: products.length,
  };
}

/**
 * Envanter verisi değiştikçe widget'ı hem yerel depolamada hem de Android ana ekranında günceller
 */
export async function syncWidgetData(
  products: Product[],
  explicitLanguage?: 'tr' | 'en'
): Promise<WarrantyWidgetData> {
  let lang = explicitLanguage;
  if (!lang) {
    try {
      const prefs = await appPreferencesHelper.getPreferences();
      lang = prefs.language || 'tr';
    } catch {
      lang = 'tr';
    }
  }

  const data = calculateWidgetData(products, lang);

  try {
    // 1. Veriyi AsyncStorage'a yaz (TaskHandler okuyabilsin)
    await AsyncStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(data));

    // 2. Android yerel widget güncellemesini tetikle
    // Expo Go ortamında native module bulunamayacağı için try-catch ile güvenle sarılır
    try {
      const { requestWidgetUpdate } = require('react-native-android-widget');
      if (typeof requestWidgetUpdate === 'function') {
        await requestWidgetUpdate({
          widgetName: 'WarrantyWidget',
          renderWidget: () => React.createElement(WarrantyWidget, data),
        });
      }
    } catch {
      // Expo Go'da native modül olmadığında sessizce devam eder (çökme olmaz)
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[WidgetSyncService] Senkronizasyon uyarısı:', error);
    }
  }

  return data;
}
