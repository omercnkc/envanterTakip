/**
 * Envanter ve Ürün Durum Yönetimi (InventoryContext)
 * Ürün listesi, kategoriler, canlı istatistikler ve CRUD operasyonlarını reaktif yönetir.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Product, Category, ProductFormData, ProductFilterOptions, InventoryStats } from '../types';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';
import { isSupabaseConfigured } from '../api/supabase';
import { calculateWarrantyStatus } from '../utils/warrantyCalculator';
import {
  scheduleWarrantyNotifications,
  cancelWarrantyNotifications,
  syncAllWarrantyNotifications,
} from '../utils/notificationHelper';
import { useAuth } from './AuthContext';

interface InventoryContextType {
  products: Product[];
  allProducts: Product[];
  categories: Category[];
  stats: InventoryStats;
  loading: boolean;
  isLoading: boolean;
  refreshing: boolean;
  isRefreshing: boolean;
  filterOptions: ProductFilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<ProductFilterOptions>>;
  resetFilters: () => void;
  fetchProducts: () => Promise<void>;
  refresh: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  addProduct: (data: ProductFormData) => Promise<{ success: boolean; data?: Product; error?: string }>;
  updateProduct: (
    productId: string,
    data: Partial<ProductFormData>
  ) => Promise<{ success: boolean; data?: Product; error?: string }>;
  deleteProduct: (productId: string) => Promise<{ success: boolean; error?: string }>;
  getProduct: (productId: string) => Promise<Product | null>;
}

const defaultFilterOptions: ProductFilterOptions = {
  searchQuery: '',
  categoryId: undefined,
  warrantyStatus: 'all',
  sortBy: 'created_at',
  sortOrder: 'desc',
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<ProductFilterOptions>(defaultFilterOptions);

  const isConfigured = isSupabaseConfigured();
  const userId = user?.id || (isConfigured ? '' : '00000000-0000-0000-0000-000000000000');

  const resetFilters = useCallback(() => {
    setFilterOptions(defaultFilterOptions);
  }, []);

  // Kategorileri yükle
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      const res = await categoryService.getCategories();
      if (isMounted && res.data) {
        setCategories(res.data);
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Ürünleri çek
  const fetchProducts = useCallback(async () => {
    // Supabase bağlıyken kullanıcı henüz giriş yapmadıysa sorgu atma
    if (isConfigured && !user?.id) {
      setAllProducts([]);
      setProducts([]);
      setLoading(false);
      return;
    }

    const currentUserId = user?.id || '00000000-0000-0000-0000-000000000000';
    try {
      setLoading(true);
      // 1. Her zaman kullanıcının TÜM ham ürünlerini çek (İstatistikler, bildirimler ve ana sayfa için)
      const allRes = await productService.getProducts(currentUserId, defaultFilterOptions);
      const allItems = allRes.data || [];
      setAllProducts(allItems);
      syncAllWarrantyNotifications(allItems);

      // 2. Filtre seçenekleri aktifse filtrelenmiş listeyi hazırla (ProductsScreen için)
      const isFiltered =
        (filterOptions.searchQuery && filterOptions.searchQuery.trim() !== '') ||
        filterOptions.categoryId !== undefined ||
        filterOptions.warrantyStatus !== 'all' ||
        filterOptions.sortBy !== 'created_at' ||
        filterOptions.sortOrder !== 'desc';

      if (isFiltered) {
        const filteredRes = await productService.getProducts(currentUserId, filterOptions);
        setProducts(filteredRes.data || []);
      } else {
        setProducts(allItems);
      }
    } catch {
      // Hata sessizce yakalanır
    } finally {
      setLoading(false);
    }
  }, [user?.id, isConfigured, filterOptions]);

  // Sayfa yenileme (Pull to refresh)
  const refresh = useCallback(async () => {
    if (isConfigured && !user?.id) {
      setAllProducts([]);
      setProducts([]);
      return;
    }
    const currentUserId = user?.id || '00000000-0000-0000-0000-000000000000';
    setRefreshing(true);
    try {
      const allRes = await productService.getProducts(currentUserId, defaultFilterOptions);
      const allItems = allRes.data || [];
      setAllProducts(allItems);
      syncAllWarrantyNotifications(allItems);

      const isFiltered =
        (filterOptions.searchQuery && filterOptions.searchQuery.trim() !== '') ||
        filterOptions.categoryId !== undefined ||
        filterOptions.warrantyStatus !== 'all' ||
        filterOptions.sortBy !== 'created_at' ||
        filterOptions.sortOrder !== 'desc';

      if (isFiltered) {
        const filteredRes = await productService.getProducts(currentUserId, filterOptions);
        setProducts(filteredRes.data || []);
      } else {
        setProducts(allItems);
      }
    } finally {
      setRefreshing(false);
    }
  }, [user?.id, isConfigured, filterOptions]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Dinamik İstatistikler (4'lü Sayaç - Filtrelerden ASLA etkilenmez, tüm envanteri yansıtır)
  const stats: InventoryStats = useMemo(() => {
    let total = allProducts.length;
    let active = 0;
    let expiringSoon = 0;
    let expired = 0;

    allProducts.forEach((p) => {
      const { status } = calculateWarrantyStatus(p.warranty_end_date);
      if (status === 'active') active++;
      else if (status === 'expiring_soon') expiringSoon++;
      else if (status === 'expired') expired++;
    });

    return { total, active, expiringSoon, expired };
  }, [allProducts]);

  // Yeni Ürün Ekleme
  const addProduct = async (data: ProductFormData) => {
    if (isConfigured && !user?.id) {
      return { success: false, error: 'Ürün eklemek için lütfen oturum açın.' };
    }
    const currentUserId = user?.id || '00000000-0000-0000-0000-000000000000';
    const res = await productService.createProduct(data, currentUserId);
    if (res.error || !res.data) {
      return { success: false, error: res.error || 'Ürün kaydedilemedi.' };
    }
    // Yeni ürün için bildirimleri planla
    scheduleWarrantyNotifications(res.data);
    await fetchProducts();
    return { success: true, data: res.data };
  };

  // Ürün Güncelleme
  const updateProduct = async (productId: string, data: Partial<ProductFormData>) => {
    const res = await productService.updateProduct(productId, data);
    if (res.error || !res.data) {
      return { success: false, error: res.error || 'Ürün güncellenemedi.' };
    }
    // Güncellenen ürünün bildirimlerini yeniden planla
    scheduleWarrantyNotifications(res.data);
    await fetchProducts();
    return { success: true, data: res.data };
  };

  // Ürün Silme
  const deleteProduct = async (productId: string) => {
    const res = await productService.deleteProduct(productId);
    if (!res.success) {
      return { success: false, error: res.error || 'Ürün silinemedi.' };
    }
    // Planlanmış bildirimleri iptal et
    cancelWarrantyNotifications(productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    return { success: true };
  };

  // Tek Ürün Getirme
  const getProduct = async (productId: string): Promise<Product | null> => {
    const cached = products.find((p) => p.id === productId);
    if (cached) return cached;

    const res = await productService.getProductById(productId);
    return res.data;
  };

  const value = useMemo(
    () => ({
      products,
      allProducts,
      categories,
      stats,
      loading,
      isLoading: loading,
      refreshing,
      isRefreshing: refreshing,
      filterOptions,
      setFilterOptions,
      resetFilters,
      fetchProducts,
      refresh,
      refreshProducts: refresh,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
    }),
    [
      products,
      allProducts,
      categories,
      stats,
      loading,
      refreshing,
      filterOptions,
      resetFilters,
      fetchProducts,
      refresh,
    ]
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
