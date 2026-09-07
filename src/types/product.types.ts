/**
 * Ürün Formu ve Filtreleme Tipleri / Zod Şemaları
 */

import { z } from 'zod';
import { Product } from './database.types';

export const productFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Ürün adı en az 2 karakter olmalıdır')
    .max(100, 'Ürün adı çok uzun'),
  brand: z
    .string()
    .min(1, 'Marka alanı zorunludur')
    .max(50, 'Marka adı çok uzun'),
  model: z.string().max(50, 'Model çok uzun').optional().nullable(),
  category_id: z.number().min(1, 'Lütfen bir kategori seçin'),
  serial_number: z.string().max(100, 'Seri numarası çok uzun').optional().nullable(),
  purchase_date: z.string().optional().nullable(),
  purchase_price: z
    .number()
    .nonnegative('Fiyat negatif olamaz')
    .optional()
    .nullable(),
  warranty_duration_months: z.number().positive().optional().nullable(),
  warranty_end_date: z
    .string()
    .min(1, 'Garanti bitiş tarihi zorunludur'),
  store_name: z.string().max(100, 'Mağaza adı çok uzun').optional().nullable(),
  description: z.string().max(500, 'Açıklama çok uzun').optional().nullable(),
  image_path: z.string().optional().nullable(),
  invoice_path: z.string().optional().nullable(),
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
