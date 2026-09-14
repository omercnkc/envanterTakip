/**
 * Ürün Servis Katmanı (Product Service)
 * Supabase CRUD operasyonları, arama, filtreleme ve hata güvenliği.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { Product, ProductFormData, ProductFilterOptions } from '../types';
import { formatAppError } from '../utils/errorHandler';
import { calculateWarrantyStatus, normalizeToISODate } from '../utils/warrantyCalculator';


// Supabase henüz bağlanmadıysa veya demo modunda kullanılacak yerel mock veri deposu
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';

let mockProductsStore: Product[] = [
  {
    id: 'mock-1',
    user_id: MOCK_USER_ID,
    category_id: 1,
    name: 'Samsung QLED 4K TV',
    brand: 'Samsung',
    model: 'Q60B 55 Inch',
    serial_number: '0A18C2D3E4F5',
    purchase_date: '2024-04-12',
    purchase_price: 24999,
    warranty_duration_months: 24,
    warranty_end_date: '2028-04-12',
    store_name: 'Teknosa',
    description: 'Salonda TV ünitesinde kullanılıyor.',
    image_path: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=80',
    invoice_path: 'https://images.unsplash.com/photo-1554415707-9e49017a1430?w=500&auto=format&fit=crop&q=80',
    is_favorite: false,
    created_at: '2024-04-12T10:00:00.000Z',
    category: { id: 1, name: 'Televizyon', icon: 'tv' },
  },
  {
    id: 'mock-2',
    user_id: MOCK_USER_ID,
    category_id: 3,
    name: 'iPhone 16 Pro',
    brand: 'Apple',
    model: '256GB Titanyum',
    serial_number: 'F2LZX19PKL90',
    purchase_date: '2024-09-05',
    purchase_price: 74999,
    warranty_duration_months: 24,
    warranty_end_date: '2026-09-25', // Yakında bitecek örnek
    store_name: 'Apple Store Zorlu',
    description: 'Şahsi kullanım telefonu.',
    image_path: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=80',
    invoice_path: 'https://images.unsplash.com/photo-1554415707-9e49017a1430?w=500&auto=format&fit=crop&q=80',
    is_favorite: true,
    created_at: '2024-09-05T14:30:00.000Z',
    category: { id: 3, name: 'Telefon', icon: 'smartphone' },
  },
  {
    id: 'mock-3',
    user_id: MOCK_USER_ID,
    category_id: 5,
    name: 'Bosch No-Frost Buzdolabı',
    brand: 'Bosch',
    model: 'KGN56VWF0N',
    serial_number: 'BSH-98842100',
    purchase_date: '2023-11-20',
    purchase_price: 32500,
    warranty_duration_months: 36,
    warranty_end_date: '2027-11-20',
    store_name: 'MediaMarkt',
    description: 'Mutfak buzdolabı.',
    image_path: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=500&auto=format&fit=crop&q=80',
    invoice_path: 'https://images.unsplash.com/photo-1554415707-9e49017a1430?w=500&auto=format&fit=crop&q=80',
    is_favorite: false,
    created_at: '2023-11-20T11:15:00.000Z',
    category: { id: 5, name: 'Beyaz Eşya', icon: 'refrigerator' },
  },
  {
    id: 'mock-4',
    user_id: MOCK_USER_ID,
    category_id: 6,
    name: 'Dyson V15 Detect Süpürge',
    brand: 'Dyson',
    model: 'V15 Absolute',
    serial_number: 'DYS-44109822',
    purchase_date: '2022-02-18',
    purchase_price: 18999,
    warranty_duration_months: 24,
    warranty_end_date: '2024-02-18', // Süresi dolmuş örnek
    store_name: 'Dyson Online',
    description: 'Dikey kablosuz süpürge.',
    image_path: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&auto=format&fit=crop&q=80',
    invoice_path: 'https://images.unsplash.com/photo-1554415707-9e49017a1430?w=500&auto=format&fit=crop&q=80',
    is_favorite: false,
    created_at: '2022-02-18T09:00:00.000Z',
    category: { id: 6, name: 'Küçük Ev Aletleri', icon: 'coffee' },
  },
];

export const productService = {
  /**
   * Kullanıcıya ait ürünleri filtre ve arama kriterlerine göre getirir.
   */
  async getProducts(
    userId: string,
    options?: ProductFilterOptions
  ): Promise<{ data: Product[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      let filtered = [...mockProductsStore];

      if (options?.searchQuery && options.searchQuery.trim() !== '') {
        const q = options.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.brand && p.brand.toLowerCase().includes(q)) ||
            (p.model && p.model.toLowerCase().includes(q)) ||
            (p.serial_number && p.serial_number.toLowerCase().includes(q))
        );
      }

      if (options?.categoryId) {
        filtered = filtered.filter((p) => p.category_id === options.categoryId);
      }

      if (options?.warrantyStatus === 'favorites' || options?.onlyFavorites) {
        filtered = filtered.filter((p) => p.is_favorite === true);
      } else if (options?.warrantyStatus && options.warrantyStatus !== 'all') {
        filtered = filtered.filter((p) => {
          const calc = calculateWarrantyStatus(p.warranty_end_date);
          return calc.status === options.warrantyStatus;
        });
      }

      return { data: filtered, error: null };
    }

    // Supabase bağlıysa ve geçerli bir UUID yoksa boş liste dön
    if (!userId || userId.trim() === '' || !userId.includes('-')) {
      return { data: [], error: null };
    }

    try {
      let query = supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('user_id', userId);

      // Kategori Filtresi
      if (options?.categoryId) {
        query = query.eq('category_id', options.categoryId);
      }

      // Favoriler Filtresi
      if (options?.warrantyStatus === 'favorites' || options?.onlyFavorites) {
        query = query.eq('is_favorite', true);
      }

      // Arama Filtresi
      if (options?.searchQuery && options.searchQuery.trim() !== '') {
        const q = `%${options.searchQuery.trim()}%`;
        query = query.or(`name.ilike.${q},brand.ilike.${q},model.ilike.${q},serial_number.ilike.${q}`);
      }

      // Sıralama
      query = query.order(options?.sortBy || 'created_at', {
        ascending: options?.sortOrder === 'asc',
      });

      const { data, error } = await query;

      if (error) {
        return { data: [], error: formatAppError(error).fullMessage };
      }

      let result = (data as Product[]) || [];

      // İstemci tarafı garanti durumu filtresi (dinamik hesaplandığı için)
      if (
        options?.warrantyStatus &&
        options.warrantyStatus !== 'all' &&
        options.warrantyStatus !== 'favorites'
      ) {
        result = result.filter((p) => {
          const calc = calculateWarrantyStatus(p.warranty_end_date);
          return calc.status === options.warrantyStatus;
        });
      }

      return { data: result, error: null };
    } catch (err) {
      return { data: [], error: formatAppError(err).fullMessage };
    }
  },

  /**
   * Tek bir ürünün detaylarını getirir.
   */
  async getProductById(productId: string): Promise<{ data: Product | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      const found = mockProductsStore.find((p) => p.id === productId) || null;
      return { data: found, error: found ? null : 'Ürün bulunamadı.' };
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('id', productId)
        .single();

      if (error) {
        return { data: null, error: formatAppError(error).fullMessage };
      }

      return { data: data as Product, error: null };
    } catch (err) {
      return { data: null, error: formatAppError(err).fullMessage };
    }
  },

  /**
   * Yeni ürün oluşturur.
   */
  async createProduct(
    formData: ProductFormData,
    userId: string
  ): Promise<{ data: Product | null; error: string | null }> {
    const normalizedPurchaseDate = normalizeToISODate(formData.purchase_date);
    const normalizedWarrantyEndDate =
      normalizeToISODate(formData.warranty_end_date) || formData.warranty_end_date;

    if (!isSupabaseConfigured()) {
      const newProduct: Product = {
        id: `mock-${Date.now()}`,
        user_id: userId,
        category_id: formData.category_id,
        name: formData.name.trim(),
        brand: formData.brand ? formData.brand.trim() : null,
        model: formData.model ? formData.model.trim() : null,
        serial_number: formData.serial_number ? formData.serial_number.trim() : null,
        purchase_date: normalizedPurchaseDate,
        purchase_price: formData.purchase_price ?? 0,
        warranty_duration_months: formData.warranty_duration_months ?? 24,
        warranty_end_date: normalizedWarrantyEndDate,
        store_name: formData.store_name ? formData.store_name.trim() : null,
        description: formData.description ? formData.description.trim() : null,
        image_path: formData.image_path || null,
        invoice_path: formData.invoice_path || null,
        is_favorite: false,
        created_at: new Date().toISOString(),
      };
      mockProductsStore = [newProduct, ...mockProductsStore];
      return { data: newProduct, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          user_id: userId,
          category_id: formData.category_id,
          name: formData.name.trim(),
          brand: formData.brand ? formData.brand.trim() : null,
          model: formData.model ? formData.model.trim() : null,
          serial_number: formData.serial_number ? formData.serial_number.trim() : null,
          purchase_date: normalizedPurchaseDate,
          purchase_price: formData.purchase_price ?? 0,
          warranty_duration_months: formData.warranty_duration_months ?? 24,
          warranty_end_date: normalizedWarrantyEndDate,
          store_name: formData.store_name ? formData.store_name.trim() : null,
          description: formData.description ? formData.description.trim() : null,
          image_path: formData.image_path || null,
          invoice_path: formData.invoice_path || null,
        })
        .select('*, category:categories(*)')
        .single();

      if (error) {
        return { data: null, error: formatAppError(error).fullMessage };
      }

      return { data: data as Product, error: null };
    } catch (err) {
      return { data: null, error: formatAppError(err).fullMessage };
    }
  },

  /**
   * Var olan ürünü günceller.
   */
  async updateProduct(
    productId: string,
    formData: Partial<ProductFormData>
  ): Promise<{ data: Product | null; error: string | null }> {
    const updatePayload: Record<string, any> = { ...formData };
    if (formData.purchase_date !== undefined) {
      updatePayload.purchase_date = normalizeToISODate(formData.purchase_date);
    }
    if (formData.warranty_end_date !== undefined) {
      updatePayload.warranty_end_date =
        normalizeToISODate(formData.warranty_end_date) || formData.warranty_end_date;
    }

    if (!isSupabaseConfigured()) {
      const index = mockProductsStore.findIndex((p) => p.id === productId);
      if (index === -1) return { data: null, error: 'Güncellenecek ürün bulunamadı.' };

      const updated = {
        ...mockProductsStore[index],
        ...updatePayload,
        updated_at: new Date().toISOString(),
      };
      mockProductsStore[index] = updated as Product;
      return { data: updated as Product, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updatePayload,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId)
        .select('*, category:categories(*)')
        .single();


      if (error) {
        return { data: null, error: formatAppError(error).fullMessage };
      }

      return { data: data as Product, error: null };
    } catch (err) {
      return { data: null, error: formatAppError(err).fullMessage };
    }
  },

  /**
   * Ürünü siler.
   */
  async deleteProduct(productId: string): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) {
      mockProductsStore = mockProductsStore.filter((p) => p.id !== productId);
      return { success: true, error: null };
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        return { success: false, error: formatAppError(error).fullMessage };
      }

      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: formatAppError(err).fullMessage };
    }
  },

  /**
   * Ürünün favori durumunu günceller (Local mock veya Supabase).
   */
  async toggleFavorite(
    productId: string,
    isFavorite: boolean
  ): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) {
      const index = mockProductsStore.findIndex((p) => p.id === productId);
      if (index !== -1) {
        mockProductsStore[index] = {
          ...mockProductsStore[index],
          is_favorite: isFavorite,
        };
      }
      return { success: true, error: null };
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({
          is_favorite: isFavorite,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId);

      if (error) {
        return { success: false, error: formatAppError(error).fullMessage };
      }

      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: formatAppError(err).fullMessage };
    }
  },
};
