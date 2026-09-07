/**
 * Kategori Servisi
 * Supabase categories tablosundan kategorileri çeker ve çevrimdışı fallback sağlar.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { Category } from '../types';
import { CATEGORIES } from '../constants';
import { formatAppError } from '../utils/errorHandler';

export const categoryService = {
  /**
   * Tüm kategorileri getirir.
   */
  async getCategories(): Promise<{ data: Category[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: CATEGORIES as Category[], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        // Hata durumunda yerel sabitleri fallback olarak dön
        return { data: CATEGORIES as Category[], error: formatAppError(error).fullMessage };
      }

      if (!data || data.length === 0) {
        return { data: CATEGORIES as Category[], error: null };
      }

      return { data: data as Category[], error: null };
    } catch (err) {
      return { data: CATEGORIES as Category[], error: formatAppError(err).fullMessage };
    }
  },
};
