/**
 * Ürün Formu ve Filtreleme Tipleri / Zod Şemaları
 */

import { z } from 'zod';
import { Product } from './database.types';

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Ürün adı zorunludur')
    .min(2, 'Ürün adı en az 2 karakter olmalıdır')
    .max(100, 'Ürün adı çok uzun'),
  brand: z
    .string()
    .trim()
    .min(1, 'Marka alanı zorunludur')
    .max(50, 'Marka adı çok uzun'),
  model: z.string().trim().max(50, 'Model çok uzun').optional().nullable(),
  category_id: z
    .number()
    .min(1, 'Lütfen bir kategori seçin'),

  // Delil Nitelikli Zorunlu Alanlar:
  serial_number: z
    .string()
    .trim()
    .min(1, 'Seri numarası delil niteliği taşıdığı için zorunludur')
    .max(35, 'Seri numarası en fazla 35 karakter olabilir'),

  purchase_date: z
    .string()
    .trim()
    .min(1, 'Satın alma tarihi delil olarak zorunludur')
    .regex(
      /^(\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{4})$/,
      'Satın alma tarihi GG/AA/YYYY formatında olmalıdır'
    ),

  purchase_price: z
    .number({ message: 'Lütfen geçerli bir fiyat giriniz' })
    .positive('Satın alma fiyatı 0\'dan büyük olmalıdır'),

  store_name: z
    .string()
    .trim()
    .min(1, 'Satın alınan mağaza / satıcı bilgisi zorunludur')
    .max(100, 'Mağaza adı çok uzun'),

  warranty_duration_months: z
    .number()
    .positive('Garanti süresi pozitif olmalıdır')
    .optional()
    .nullable(),

  warranty_end_date: z
    .string()
    .trim()
    .min(1, 'Garanti bitiş tarihi zorunludur')
    .regex(
      /^(\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{4})$/,
      'Tarih GG/AA/YYYY formatında olmalıdır'
    ),

  invoice_path: z
    .string()
    .nullable()
    .refine(
      (val) => val !== null && val !== undefined && val.trim().length > 0,
      'Fatura belgesi veya fotoğrafı delil olarak zorunludur'
    ),

  description: z.string().trim().max(500, 'Açıklama çok uzun').optional().nullable(),
  image_path: z.string().optional().nullable(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

export interface ProductFilterOptions {
  searchQuery?: string;
  categoryId?: number;
  warrantyStatus?: 'all' | 'active' | 'expiring_soon' | 'expired';
  sortBy?: 'warranty_end_date' | 'purchase_date' | 'name' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface InventoryStats {
  total: number;
  active: number;
  expiringSoon: number;
  expired: number;
}
