/**
 * Supabase Kimlik Doğrulama Servisi
 * Kullanıcı dostu yerelleştirilmiş hata mesajları ve güvenli servis katmanı.
 */

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    const cleanEmail = email.trim().toLowerCase();

    if (!isSupabaseConfigured()) {
      // Demo / Mock Giriş Desteği (Supabase henüz kurulmadıysa)
      return {
        data: {
          user: { id: '00000000-0000-0000-0000-000000000000', email: cleanEmail },
          session: { access_token: 'demo-token' },
        },
        error: null,
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
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
    const cleanEmail = email.trim().toLowerCase();
    const cleanFullName = fullName.trim();

    if (!isSupabaseConfigured()) {
      return {
        data: {
          user: { id: '00000000-0000-0000-0000-000000000000', email: cleanEmail },
          session: { access_token: 'demo-token' },
        },
        error: null,
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanFullName,
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
            full_name: cleanFullName,
            email: cleanEmail,
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
      const cleanEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
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
  /**
   * Kullanıcı profil bilgilerini getirir.
   */
  async getProfile(userId: string): Promise<{ data: Profile | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      try {
        const stored = await AsyncStorage.getItem('@safe_envanter_mock_profile');
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            data: {
              id: userId,
              full_name: parsed.full_name || 'Demo Kullanıcı',
              email: 'demo@ornek.com',
              avatar_url: parsed.avatar_url || null,
              created_at: new Date().toISOString(),
            },
            error: null,
          };
        }
      } catch {
        // yut
      }
      return {
        data: {
          id: userId,
          full_name: 'Demo Kullanıcı',
          email: 'demo@ornek.com',
          avatar_url: null,
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

  /**
   * Kullanıcı profil bilgilerini (Ad Soyad ve Profil Fotoğrafı) günceller.
   */
  async updateProfile(
    userId: string,
    fullName: string,
    avatarUrl?: string | null
  ): Promise<{ error: string | null }> {
    const cleanFullName = fullName.trim();

    if (!isSupabaseConfigured()) {
      try {
        const existing = await AsyncStorage.getItem('@safe_envanter_mock_profile');
        const parsed = existing ? JSON.parse(existing) : {};
        const updated = {
          ...parsed,
          full_name: cleanFullName,
          avatar_url: avatarUrl !== undefined ? avatarUrl : parsed.avatar_url,
        };
        await AsyncStorage.setItem('@safe_envanter_mock_profile', JSON.stringify(updated));
      } catch (err) {
        console.warn('Mock profil kaydedilemedi:', err);
      }
      return { error: null };
    }

    try {
      // 1. profiles tablosunu güncelle
      const updatePayload: any = {
        full_name: cleanFullName,
        updated_at: new Date().toISOString(),
      };
      if (avatarUrl !== undefined) {
        updatePayload.avatar_url = avatarUrl;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', userId);

      if (profileError) {
        return { error: formatAuthError(profileError) };
      }

      // 2. auth.users metadata'sını senkronize et
      try {
        await supabase.auth.updateUser({
          data: {
            full_name: cleanFullName,
            ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
          },
        });
      } catch {
        // Metadata güncellemesi başarısız olsa da ana profil tablosu güncellendi
      }

      return { error: null };
    } catch (err) {
      return { error: formatAuthError(err) };
    }
  },

  /**
   * Kullanıcının şifresini günceller.
   */
  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: formatAuthError(error) };
      }

      return { error: null };
    } catch (err) {
      return { error: formatAuthError(err) };
    }
  },
};

