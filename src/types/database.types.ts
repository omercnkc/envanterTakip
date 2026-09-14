/**
 * Supabase Veritabanı ve Varlık Tipleri
 */

export type WarrantyStatusType = 'active' | 'expiring_soon' | 'expired';

export interface Profile {
  id: string; // auth.users.id
  full_name: string | null;
  email: string;
  avatar_url?: string | null;
  expo_push_token?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  created_at?: string;
}

export interface Product {
  id: string;
  user_id: string;
  category_id: number;
  name: string;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
  warranty_duration_months?: number | null;
  warranty_end_date: string;
  store_name: string | null;
  description: string | null;
  image_path: string | null;
  invoice_path: string | null;
  is_favorite?: boolean;
  created_at: string;
  updated_at?: string;
  
  // Katmanlı ilişkisel veri (Join)
  category?: Category;
}

export interface WarrantyCalculationResult {
  status: WarrantyStatusType;
  daysRemaining: number;
  label: string;
  color: string;
  bgColor: string;
}
