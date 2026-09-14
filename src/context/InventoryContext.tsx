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
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<{ success: boolean; isFavorite: boolean }>;
  favoriteCount: number;
}

const defaultFilterOptions: ProductFilterOptions = {
  searchQuery: '',
  categoryId: undefined,
  warrantyStatus: 'all',
  sortBy: 'created_at',
  sortOrder: 'desc',
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const getFavoritesStorageKey = (uid: string) => `@safe_envanter_favorites_${uid || 'guest'}`;

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<ProductFilterOptions>(defaultFilterOptions);

  const isConfigured = isSupabaseConfigured();
  const userId = user?.id || (isConfigured ? '' : '00000000-0000-0000-0000-000000000000');

  const resetFilters = useCallback(() => {
    setFilterOptions(defaultFilterOptions);
  }, []);

  // Kullanıcı değiştiğinde yerel favorileri yükle
  useEffect(() => {
    let isMounted = true;
    const loadLocalFavorites = async () => {
      try {
        const key = getFavoritesStorageKey(userId);
        const raw = await AsyncStorage.getItem(key);
        if (raw && isMounted) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setFavoriteIds(new Set(parsed));
          }
        }
      } catch (e) {
        console.warn('Favoriler yerelden yüklenemedi:', e);
      }
    };
    loadLocalFavorites();
    return () => {
      isMounted = false;
    };
  }, [userId]);

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

  // Ürünleri çek & Yerel/Bulut favori senkronizasyonu yap
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

      // 1. Yerel AsyncStorage'daki favori ID'lerini al
      let localFavList: string[] = [];
      try {
        const raw = await AsyncStorage.getItem(getFavoritesStorageKey(currentUserId));
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) localFavList = parsed;
        }
      } catch {}

      // 2. Kullanıcının ham ürünlerini çek
      const allRes = await productService.getProducts(currentUserId, defaultFilterOptions);
      const rawItems = allRes.data || [];

      // 3. Buluttaki favoriler ile yereldeki favorileri BİRLEŞTİR (Local & Cloud Sync)
      const cloudFavList = rawItems.filter((p) => p.is_favorite === true).map((p) => p.id);
      const mergedFavSet = new Set<string>([...localFavList, ...cloudFavList]);
      setFavoriteIds(mergedFavSet);

      // Güncellenmiş listeyi yerel depolamaya yaz
      AsyncStorage.setItem(
        getFavoritesStorageKey(currentUserId),
        JSON.stringify(Array.from(mergedFavSet))
      ).catch(() => {});

      // Yerelde favori olup bulutta false kalmış ürünleri arka planda buluta senkronize et
      if (isConfigured && user?.id) {
        localFavList.forEach((favId) => {
          const productOnCloud = rawItems.find((p) => p.id === favId);
          if (productOnCloud && !productOnCloud.is_favorite) {
            productService.toggleFavorite(favId, true).catch(() => {});
          }
        });
      }

      // Tüm ürünleri senkronize favori durumuyla sarmala
      const allItems = rawItems.map((p) => ({
        ...p,
        is_favorite: mergedFavSet.has(p.id),
      }));

      setAllProducts(allItems);
      syncAllWarrantyNotifications(allItems);

      // 4. Filtre seçenekleri aktifse ProductsScreen için listeyi hazırla
      if (filterOptions.warrantyStatus === 'favorites') {
        setProducts(allItems.filter((p) => mergedFavSet.has(p.id)));
      } else {
        const isFiltered =
          (filterOptions.searchQuery && filterOptions.searchQuery.trim() !== '') ||
          filterOptions.categoryId !== undefined ||
          filterOptions.warrantyStatus !== 'all' ||
          filterOptions.sortBy !== 'created_at' ||
          filterOptions.sortOrder !== 'desc';

        if (isFiltered) {
          const filteredRes = await productService.getProducts(currentUserId, filterOptions);
          const filteredItems = (filteredRes.data || []).map((p) => ({
            ...p,
            is_favorite: mergedFavSet.has(p.id),
          }));
          setProducts(filteredItems);
        } else {
          setProducts(allItems);
        }
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
      let localFavList: string[] = [];
      try {
        const raw = await AsyncStorage.getItem(getFavoritesStorageKey(currentUserId));
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) localFavList = parsed;
        }
      } catch {}

      const allRes = await productService.getProducts(currentUserId, defaultFilterOptions);
      const rawItems = allRes.data || [];

      const cloudFavList = rawItems.filter((p) => p.is_favorite === true).map((p) => p.id);
      const mergedFavSet = new Set<string>([...localFavList, ...cloudFavList]);
      setFavoriteIds(mergedFavSet);

      AsyncStorage.setItem(
        getFavoritesStorageKey(currentUserId),
        JSON.stringify(Array.from(mergedFavSet))
      ).catch(() => {});

      const allItems = rawItems.map((p) => ({
        ...p,
        is_favorite: mergedFavSet.has(p.id),
      }));

      setAllProducts(allItems);
      syncAllWarrantyNotifications(allItems);

      if (filterOptions.warrantyStatus === 'favorites') {
        setProducts(allItems.filter((p) => mergedFavSet.has(p.id)));
      } else {
        const isFiltered =
          (filterOptions.searchQuery && filterOptions.searchQuery.trim() !== '') ||
          filterOptions.categoryId !== undefined ||
          filterOptions.warrantyStatus !== 'all' ||
          filterOptions.sortBy !== 'created_at' ||
          filterOptions.sortOrder !== 'desc';

        if (isFiltered) {
          const filteredRes = await productService.getProducts(currentUserId, filterOptions);
          const filteredItems = (filteredRes.data || []).map((p) => ({
            ...p,
            is_favorite: mergedFavSet.has(p.id),
          }));
          setProducts(filteredItems);
        } else {
          setProducts(allItems);
        }
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

  // Favori Kontrolü
  const isFavorite = useCallback(
    (productId: string): boolean => {
      return favoriteIds.has(productId);
    },
    [favoriteIds]
  );

  // Favori Ekleme / Çıkarma (Yerel Optimistic UI + AsyncStorage + Supabase Bulut Senkronizasyonu)
  const toggleFavorite = useCallback(
    async (productId: string): Promise<{ success: boolean; isFavorite: boolean }> => {
      const currentFav = favoriteIds.has(productId);
      const nextFav = !currentFav;

      // 1. Anında Yerel State Güncellemesi (Optimistic UI)
      const updatedSet = new Set(favoriteIds);
      if (nextFav) {
        updatedSet.add(productId);
      } else {
        updatedSet.delete(productId);
      }
      setFavoriteIds(updatedSet);

      setAllProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, is_favorite: nextFav } : p))
      );
      setProducts((prev) => {
        if (filterOptions.warrantyStatus === 'favorites' && !nextFav) {
          return prev.filter((p) => p.id !== productId);
        }
        return prev.map((p) => (p.id === productId ? { ...p, is_favorite: nextFav } : p));
      });

      // 2. Yerel AsyncStorage'a kalıcı olarak kaydet
      const currentUserId = user?.id || '00000000-0000-0000-0000-000000000000';
      AsyncStorage.setItem(
        getFavoritesStorageKey(currentUserId),
        JSON.stringify(Array.from(updatedSet))
      ).catch((err) => console.warn('Yerel favori kaydedilemedi:', err));

      // 3. Bulut Senkronizasyonu (Supabase / Mock)
      try {
        await productService.toggleFavorite(productId, nextFav);
      } catch (err) {
        console.warn('Bulut favori senkronizasyon hatası:', err);
      }

      return { success: true, isFavorite: nextFav };
    },
    [favoriteIds, filterOptions.warrantyStatus, user?.id]
  );

  // Toplam Favori Sayısı
  const favoriteCount = useMemo(() => {
    return allProducts.filter((p) => favoriteIds.has(p.id) || p.is_favorite).length;
  }, [allProducts, favoriteIds]);

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
    setAllProducts((prev) => prev.filter((p) => p.id !== productId));

    if (favoriteIds.has(productId)) {
      const updatedSet = new Set(favoriteIds);
      updatedSet.delete(productId);
      setFavoriteIds(updatedSet);
      const currentUserId = user?.id || '00000000-0000-0000-0000-000000000000';
      AsyncStorage.setItem(
        getFavoritesStorageKey(currentUserId),
        JSON.stringify(Array.from(updatedSet))
      ).catch(() => {});
    }

    return { success: true };
  };

  // Tek Ürün Getirme
  const getProduct = async (productId: string): Promise<Product | null> => {
    const cached = products.find((p) => p.id === productId) || allProducts.find((p) => p.id === productId);
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
      isFavorite,
      toggleFavorite,
      favoriteCount,
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
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      isFavorite,
      toggleFavorite,
      favoriteCount,
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
