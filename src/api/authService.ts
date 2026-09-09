/**
 * Supabase Kimlik Doğrulama Servisi
 * Kullanıcı dostu yerelleştirilmiş hata mesajları ve güvenli servis katmanı.
 */

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase, isSupabaseConfigured } from './supabase';
import { LoginFormData, RegisterFormData, ForgotPasswordFormData, Profile } from '../types';
import { formatAppError } from '../utils/errorHandler';

// Tarayıcı yönlendirmesini hazırla
WebBrowser.maybeCompleteAuthSession();

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
          user: { id: '00000000-0000-0000-0000-000000000000', email },
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
          user: { id: '00000000-0000-0000-0000-000000000000', email },
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
   * Supabase Google OAuth ile giriş yapar.
   */
  async signInWithGoogle() {
    if (!isSupabaseConfigured()) {
      return {
        data: {
          user: { id: '00000000-0000-0000-0000-000000000000', email: 'google.user@example.com' },
          session: { access_token: 'demo-google-token' },
        },
        error: null,
      };
    }

    try {
      const redirectUrl = Linking.createURL('auth/callback', {
        scheme: 'envantertakip',
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        return { data: null, error: formatAuthError(error) };
      }

      if (!data?.url) {
        return { data: null, error: 'Google giriş bağlantısı oluşturulamadı.' };
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (result.type === 'success' && result.url) {
        const url = result.url;

        // 1. PKCE Authorization Code akışı
        if (url.includes('code=')) {
          const codeMatch = url.match(/code=([^&]+)/);
          if (codeMatch && codeMatch[1]) {
            const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(
              decodeURIComponent(codeMatch[1])
            );
            if (sessionError) {
              return { data: null, error: formatAuthError(sessionError) };
            }
            return { data: sessionData, error: null };
          }
        }

        // 2. Implicit / Hash parametre akışı (#access_token=...)
        const rawParams = url.includes('#') ? url.split('#')[1] : url.split('?')[1];
        if (rawParams) {
          const params: Record<string, string> = {};
          rawParams.split('&').forEach((part) => {
            const [k, v] = part.split('=');
            if (k && v) params[decodeURIComponent(k)] = decodeURIComponent(v);
          });

          if (params.access_token) {
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: params.access_token,
              refresh_token: params.refresh_token || '',
            });
            if (sessionError) {
              return { data: null, error: formatAuthError(sessionError) };
            }
            return { data: sessionData, error: null };
          }
        }

        // URL döndü ama doğrudan auth state güncellendi mi kontrol et
        const { data: currentSession } = await supabase.auth.getSession();
        if (currentSession?.session) {
          return { data: currentSession, error: null };
        }
      }

      if (result.type === 'cancel' || result.type === 'dismiss') {
        return { data: null, error: 'Google ile giriş işlemi iptal edildi.' };
      }

      return { data: null, error: 'Giriş işlemi tamamlanamadı.' };
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
