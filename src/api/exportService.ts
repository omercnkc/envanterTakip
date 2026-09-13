/**
 * Envanter Verilerini Dışa Aktarma Servisi (CSV & JSON)
 * Excel uyumlu (UTF-8 BOM), güvenli kaçış karakterli ve cihaz paylaşımı entegrasyonlu servis.
 */

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Product } from '../types';
import { calculateWarrantyStatus, formatDateTurkish } from '../utils/warrantyCalculator';
import { formatAppError } from '../utils/errorHandler';

// CSV Hücre Kaçış Fonksiyonu (Virgül, noktalı virgül, tırnak, yeni satır güvenliği)
const escapeCSVCell = (val: string | number | null | undefined): string => {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
};

export const exportService = {
  /**
   * Ürünleri Excel ile uyumlu UTF-8 BOM'lu CSV metnine dönüştürür.
   * Türkçe Excel varsayılanı olan noktalı virgül (;) ayırıcı kullanılır.
   */
  generateCSV(products: Product[]): string {
    const BOM = '\uFEFF'; // Excel Türkçe karakter uyumluluğu için UTF-8 BOM
    
    const headers = [
      'Ürün Adı',
      'Kategori',
      'Marka',
      'Model',
      'Seri Numarası',
      'Satın Alma Tarihi',
      'Fiyat (TL)',
      'Garanti Süresi (Ay)',
      'Garanti Bitiş Tarihi',
      'Kalan Gün',
      'Garanti Durumu',
      'Satıcı / Mağaza',
      'Açıklama',
    ];

    const rows = products.map((p) => {
      const warranty = calculateWarrantyStatus(p.warranty_end_date);
      const categoryName = p.category?.name || 'Diğer';
      const formattedPurchaseDate = p.purchase_date ? formatDateTurkish(p.purchase_date) : '-';
      const formattedEndDate = formatDateTurkish(p.warranty_end_date);
      const price = p.purchase_price != null ? Number(p.purchase_price).toFixed(2) : '0.00';
      const duration = p.warranty_duration_months != null ? String(p.warranty_duration_months) : '-';
      const daysText =
        warranty.status === 'expired'
          ? `Süresi Doldu (${warranty.daysRemaining} gün önce)`
          : `${warranty.daysRemaining} gün`;

      return [
        escapeCSVCell(p.name),
        escapeCSVCell(categoryName),
        escapeCSVCell(p.brand || '-'),
        escapeCSVCell(p.model || '-'),
        escapeCSVCell(p.serial_number || '-'),
        escapeCSVCell(formattedPurchaseDate),
        escapeCSVCell(price),
        escapeCSVCell(duration),
        escapeCSVCell(formattedEndDate),
        escapeCSVCell(daysText),
        escapeCSVCell(warranty.label),
        escapeCSVCell(p.store_name || '-'),
        escapeCSVCell(p.description || '-'),
      ].join(';');
    });

    return BOM + [headers.map(escapeCSVCell).join(';'), ...rows].join('\r\n');
  },

  /**
   * Ürünleri yapılandırılmış JSON metnine dönüştürür.
   */
  generateJSON(products: Product[]): string {
    const formattedData = products.map((p) => {
      const warranty = calculateWarrantyStatus(p.warranty_end_date);
      return {
        id: p.id,
        name: p.name,
        category: p.category?.name || 'Diğer',
        brand: p.brand || null,
        model: p.model || null,
        serialNumber: p.serial_number || null,
        purchaseDate: p.purchase_date ? formatDateTurkish(p.purchase_date) : null,
        purchasePrice: p.purchase_price || 0,
        warrantyDurationMonths: p.warranty_duration_months || 24,
        warrantyEndDate: formatDateTurkish(p.warranty_end_date),
        warrantyStatus: {
          status: warranty.status,
          label: warranty.label,
          daysRemaining: warranty.daysRemaining,
        },
        storeName: p.store_name || null,
        description: p.description || null,
        createdAt: p.created_at,
      };
    });

    return JSON.stringify(
      {
        exportDate: new Date().toISOString(),
        totalProducts: products.length,
        items: formattedData,
      },
      null,
      2
    );
  },

  /**
   * Dosyayı cihazın geçici depolama alanına yazar ve paylaşım penceresini açar.
   */
  async exportAndShare({
    format,
    products,
  }: {
    format: 'csv' | 'json';
    products: Product[];
  }): Promise<{ success: boolean; error?: string }> {
    try {
      if (!products || products.length === 0) {
        return {
          success: false,
          error: 'Dışa aktarılacak kayıtlı ürün bulunamadı. Lütfen önce ürün ekleyin.',
        };
      }

      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (!isSharingAvailable) {
        return {
          success: false,
          error: 'Cihazınızda dosya paylaşım desteği bulunmuyor.',
        };
      }

      const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const timestamp = Math.floor(Date.now() / 1000);
      const filename = `safe_envanter_${dateStamp}_${timestamp}.${format}`;

      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      const content = format === 'csv' ? this.generateCSV(products) : this.generateJSON(products);

      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: format === 'csv' ? 'text/csv' : 'application/json',
        dialogTitle: 'Envanter Verilerini Dışa Aktar',
        UTI: format === 'csv' ? 'public.comma-separated-values-text' : 'public.json',
      });

      return { success: true };
    } catch (err) {
      if (__DEV__) {
        console.error('[ExportService.exportAndShare Error]:', err);
      }
      const formatted = formatAppError(err);
      return { success: false, error: formatted.message };
    }
  },
};
