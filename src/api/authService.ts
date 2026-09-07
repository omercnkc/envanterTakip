/**
 * Supabase Kimlik Doğrulama Servisi
 * Kullanıcı dostu yerelleştirilmiş hata mesajları ve güvenli servis katmanı.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { LoginFormData, RegisterFormData, ForgotPasswordFormData, Profile } from '../types';
import { formatAppError } from '../utils/errorHandler';

/**
 * Supabase hata mesajlarını Türkçe kullanıcı dostu ve yönlendirici ifadelere dönüştürür.
 */
export const formatAuthError = (error: unknown): string => {
  return formatAppError(error).fullMessage;
};

export const authService = {
  /**
   * E-posta ve şifre ile giriş yapar.
   */
  async signIn({ email, password }: LoginFormData) {
    if (!isSupabaseConfigured()) {
      // Demo / Mock Giriş Desteği (Supabase henüz kurulmadıysa)
      return {
        data: {
          user: { id: 'demo-user-id', email },
          session: { access_token: 'demo-token' },
        },
        error: null,
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { data: null, error: formatAuthError(error) };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: formatAuthError(err) };
    }
  },

  /**
   * Yeni kullanıcı kaydı oluşturur ve profiles tablosuna ekler.
   */
  async signUp({ fullName, email, password }: RegisterFormData) {
    if (!isSupabaseConfigured()) {
      return {
        data: {
          user: { id: 'demo-user-id', email },
          session: { access_token: 'demo-token' },
        },
        error: null,
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        return { data: null, error: formatAuthError(error) };
      }

      // Profil tablosuna güvenli yedek yazım
      if (data.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName.trim(),
            email: email.trim(),
          });
        } catch {
          // Trigger zaten profili oluşturduğu için olası hatayı sessizce absorbe et
        }
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: formatAuthError(err) };
    }
  },

  /**
   * Oturumu kapatır.
   */
  async signOut() {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: formatAuthError(error) };
      }
      return { error: null };
    } catch (err) {
      return { error: formatAuthError(err) };
    }
  },

  /**
   * Şifre sıfırlama e-postası gönderir.
   */
  async resetPassword({ email }: ForgotPasswordFormData) {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) {
        return { error: formatAuthError(error) };
      }
      return { error: null };
    } catch (err) {
      return { error: formatAuthError(err) };
    }
  },

  /**
   * Kullanıcının profil bilgilerini getirir.
   */
  async getProfile(userId: string): Promise<{ data: Profile | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return {
        data: {
          id: userId,
          full_name: 'Demo Kullanıcı',
          email: 'demo@ornek.com',
          created_at: new Date().toISOString(),
        },
        error: null,
      };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { data: null, error: formatAuthError(error) };
      }

      return { data: data as Profile, error: null };
    } catch (err) {
      return { data: null, error: formatAuthError(err) };
    }
  },
};
