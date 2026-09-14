/**
 * Bakım ve Periyodik Servis Takip Servisi (Maintenance Service)
 * Cihaz bakımları, filtre değişimleri ve periyodik servis CRUD işlemleri.
 */

import { addMonths, format } from 'date-fns';
import { supabase, isSupabaseConfigured } from './supabase';
import { MaintenanceRecord, MaintenanceFormData } from '../types';
import { parseAnyDate, normalizeToISODate } from '../utils/warrantyCalculator';

// Mock veri deposu (Çevrimdışı veya demo modu için)
let mockMaintenanceStore: MaintenanceRecord[] = [
  {
    id: 'mock-maint-1',
    product_id: 'mock-3', // Bosch Buzdolabı
    user_id: '00000000-0000-0000-0000-000000000000',
    title: 'Koku Filtresi Değişimi',
    maintenance_date: '2026-10-15',
    interval_months: 6,
    cost: 450,
    service_provider: 'Bosch Yetkili Servis',
    notes: 'Hava sirkülasyon filtresi yenilenecek.',
    status: 'pending',
    created_at: '2024-11-20T10:00:00.000Z',
  },
  {
    id: 'mock-maint-2',
    product_id: 'mock-4', // Dyson V15
    user_id: '00000000-0000-0000-0000-000000000000',
    title: 'HEPA Filtre Yıkama & Kurutma',
    maintenance_date: '2026-09-30',
    interval_months: 1,
    cost: 0,
    service_provider: 'Kendim',
    notes: 'Filtre 24 saat tam kurumadan takılmamalı.',
    status: 'pending',
    created_at: '2024-02-18T10:00:00.000Z',
  },
];

export const maintenanceService = {
  /**
   * Belirli bir ürüne ait tüm bakım kayıtlarını getirir
   */
  async getByProductId(productId: string): Promise<{ data: MaintenanceRecord[]; error: string | null }> {
    if (!isSupabaseConfigured() || productId.startsWith('mock-')) {
      const records = mockMaintenanceStore
        .filter((m) => m.product_id === productId)
        .sort((a, b) => new Date(a.maintenance_date).getTime() - new Date(b.maintenance_date).getTime());
      return { data: records, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('product_id', productId)
        .order('maintenance_date', { ascending: true });

      if (error) {
        if (error.message?.includes('schema cache') || error.message?.includes('Could not find the table')) {
          // Supabase'de tablo henüz oluşturulmadıysa yerel mock depoya geç
          const records = mockMaintenanceStore
            .filter((m) => m.product_id === productId)
            .sort((a, b) => new Date(a.maintenance_date).getTime() - new Date(b.maintenance_date).getTime());
          return { data: records, error: null };
        }
        return { data: [], error: error.message };
      }

      return { data: (data as MaintenanceRecord[]) || [], error: null };
    } catch (err: any) {
      const records = mockMaintenanceStore
        .filter((m) => m.product_id === productId)
        .sort((a, b) => new Date(a.maintenance_date).getTime() - new Date(b.maintenance_date).getTime());
      return { data: records, error: null };
    }
  },

  /**
   * Yeni bir bakım kaydı oluşturur
   */
  async create(
    productId: string,
    userId: string,
    formData: MaintenanceFormData
  ): Promise<{ data: MaintenanceRecord | null; error: string | null }> {
    const isoDate = normalizeToISODate(formData.maintenance_date);
    if (!isoDate) {
      return { data: null, error: 'Geçersiz bakım tarihi' };
    }

    if (!isSupabaseConfigured() || productId.startsWith('mock-')) {
      const newRecord: MaintenanceRecord = {
        id: `mock-maint-${Date.now()}`,
        product_id: productId,
        user_id: userId || '00000000-0000-0000-0000-000000000000',
        title: formData.title.trim(),
        maintenance_date: isoDate,
        interval_months: formData.interval_months || null,
        cost: formData.cost !== undefined && formData.cost !== null ? Number(formData.cost) : 0,
        service_provider: formData.service_provider ? formData.service_provider.trim() : null,
        notes: formData.notes ? formData.notes.trim() : null,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      mockMaintenanceStore.push(newRecord);
      return { data: newRecord, error: null };
    }

    try {
      const payload = {
        product_id: productId,
        user_id: userId,
        title: formData.title.trim(),
        maintenance_date: isoDate,
        interval_months: formData.interval_months || null,
        cost: formData.cost !== undefined && formData.cost !== null ? Number(formData.cost) : 0,
        service_provider: formData.service_provider ? formData.service_provider.trim() : null,
        notes: formData.notes ? formData.notes.trim() : null,
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('maintenance_records')
        .insert([payload])
        .select()
        .single();

      if (error) {
        if (error.message?.includes('schema cache') || error.message?.includes('Could not find the table')) {
          const newRecord: MaintenanceRecord = {
            id: `mock-maint-${Date.now()}`,
            product_id: productId,
            user_id: userId || '00000000-0000-0000-0000-000000000000',
            title: formData.title.trim(),
            maintenance_date: isoDate,
            interval_months: formData.interval_months || null,
            cost: formData.cost !== undefined && formData.cost !== null ? Number(formData.cost) : 0,
            service_provider: formData.service_provider ? formData.service_provider.trim() : null,
            notes: formData.notes ? formData.notes.trim() : null,
            status: 'pending',
            created_at: new Date().toISOString(),
          };
          mockMaintenanceStore.push(newRecord);
          return { data: newRecord, error: null };
        }
        return { data: null, error: error.message };
      }

      return { data: data as MaintenanceRecord, error: null };
    } catch (err: any) {
      return { data: null, error: err?.message || 'Bakım eklenemedi' };
    }
  },

  /**
   * Bakım kaydını tamamlandı olarak işaretler.
   * Eğer periyot (interval_months) tanımlıysa, bir sonraki bakım için otomatik yeni kayıt oluşturur.
   */
  async complete(
    recordId: string,
    scheduleNext: boolean = true
  ): Promise<{ data: MaintenanceRecord | null; nextRecord?: MaintenanceRecord | null; error: string | null }> {
    const completedAt = new Date().toISOString();

    if (!isSupabaseConfigured() || recordId.startsWith('mock-')) {
      const index = mockMaintenanceStore.findIndex((m) => m.id === recordId);
      if (index === -1) {
        return { data: null, error: 'Kayıt bulunamadı' };
      }

      const existing = mockMaintenanceStore[index];
      existing.status = 'completed';
      existing.completed_at = completedAt;

      let nextRecord: MaintenanceRecord | null = null;
      if (scheduleNext && existing.interval_months && existing.interval_months > 0) {
        const baseDate = parseAnyDate(existing.maintenance_date) || new Date();
        const nextDate = addMonths(baseDate, existing.interval_months);
        nextRecord = {
          id: `mock-maint-${Date.now()}`,
          product_id: existing.product_id,
          user_id: existing.user_id,
          title: existing.title,
          maintenance_date: format(nextDate, 'yyyy-MM-dd'),
          interval_months: existing.interval_months,
          cost: existing.cost,
          service_provider: existing.service_provider,
          notes: existing.notes,
          status: 'pending',
          created_at: new Date().toISOString(),
        };
        mockMaintenanceStore.push(nextRecord);
      }

      return { data: existing, nextRecord, error: null };
    }

    try {
      // 1. Mevcut kaydı çek ve tamamla
      const { data: existing, error: fetchErr } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('id', recordId)
        .single();

      if (fetchErr || !existing) {
        return { data: null, error: fetchErr?.message || 'Kayıt bulunamadı' };
      }

      const { data: updated, error: updateErr } = await supabase
        .from('maintenance_records')
        .update({
          status: 'completed',
          completed_at: completedAt,
          updated_at: completedAt,
        })
        .eq('id', recordId)
        .select()
        .single();

      if (updateErr) {
        return { data: null, error: updateErr.message };
      }

      let nextRecord: MaintenanceRecord | null = null;
      // 2. Periyot varsa bir sonraki bakımı otomatik aç
      if (scheduleNext && existing.interval_months && existing.interval_months > 0) {
        const baseDate = parseAnyDate(existing.maintenance_date) || new Date();
        const nextDate = addMonths(baseDate, existing.interval_months);
        const { data: createdNext, error: nextErr } = await supabase
          .from('maintenance_records')
          .insert([
            {
              product_id: existing.product_id,
              user_id: existing.user_id,
              title: existing.title,
              maintenance_date: format(nextDate, 'yyyy-MM-dd'),
              interval_months: existing.interval_months,
              cost: existing.cost,
              service_provider: existing.service_provider,
              notes: existing.notes,
              status: 'pending',
            },
          ])
          .select()
          .single();

        if (!nextErr && createdNext) {
          nextRecord = createdNext as MaintenanceRecord;
        }
      }

      return { data: updated as MaintenanceRecord, nextRecord, error: null };
    } catch (err: any) {
      return { data: null, error: err?.message || 'Bakım tamamlanamadı' };
    }
  },

  /**
   * Bakım kaydını siler
   */
  async delete(recordId: string): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured() || recordId.startsWith('mock-')) {
      mockMaintenanceStore = mockMaintenanceStore.filter((m) => m.id !== recordId);
      return { success: true, error: null };
    }

    try {
      const { error } = await supabase
        .from('maintenance_records')
        .delete()
        .eq('id', recordId);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Kayıt silinemedi' };
    }
  },
};
