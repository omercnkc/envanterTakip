/**
 * Authentication Context & Provider
 * Kullanıcı oturum durumunu ve profil verilerini yönetir.
 */

import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../api/supabase';
import { authService } from '../api/authService';
import { Profile, LoginFormData, RegisterFormData, ForgotPasswordFormData } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (data: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: RegisterFormData) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (data: ForgotPasswordFormData) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (fullName: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Profil verisini getiren yardımcı
  const loadProfile = async (userId: string) => {
    const { data } = await authService.getProfile(userId);
    if (data) {
      setProfile(data);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        if (!isSupabaseConfigured()) {
          setLoading(false);
          return;
        }

        const { data } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          if (data.session?.user) {
            await loadProfile(data.session.user.id);
          }
        }
      } catch {
        // Oturum okuma hatası güvenle yutulur
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    // Oturum değişikliklerini dinle
    if (isSupabaseConfigured()) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          if (isMounted) {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            if (newSession?.user) {
              await loadProfile(newSession.user.id);
            } else {
              setProfile(null);
            }
            setLoading(false);
          }
        }
      );

      return () => {
        isMounted = false;
        authListener.subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = async (data: LoginFormData) => {
    const response = await authService.signIn(data);
    if (response.error) {
      return { success: false, error: response.error };
    }
    if (response.data?.user) {
      setUser(response.data.user as unknown as User);
      setSession(response.data.session as unknown as Session);
      await loadProfile(response.data.user.id);
    }
    return { success: true };
  };

  const signUp = async (data: RegisterFormData) => {
    const response = await authService.signUp(data);
    if (response.error) {
      return { success: false, error: response.error };
    }
    if (response.data?.session && response.data?.user) {
      setUser(response.data.user as unknown as User);
      setSession(response.data.session as unknown as Session);
      await loadProfile(response.data.user.id);
    }
    return { success: true };
  };

  const signInWithGoogle = async () => {
    const response = await authService.signInWithGoogle();
    if (response.error) {
      return { success: false, error: response.error };
    }
    if (response.data) {
      const respData = response.data as any;
      const currentUser = respData.user || respData.session?.user || null;
      const currentSession = respData.session || null;

      if (currentUser) {
        setUser(currentUser as User);
        setSession(currentSession as Session);
        await loadProfile(currentUser.id);
      }
    }
    return { success: true };
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const resetPassword = async (data: ForgotPasswordFormData) => {
    const response = await authService.resetPassword(data);
    if (response.error) {
      return { success: false, error: response.error };
    }
    return { success: true };
  };

  const updateProfile = async (fullName: string) => {
    if (!user?.id) {
      return { success: false, error: 'Oturum açmış kullanıcı bulunamadı.' };
    }
    const response = await authService.updateProfile(user.id, fullName);
    if (response.error) {
      return { success: false, error: response.error };
    }
    await loadProfile(user.id);
    return { success: true };
  };

  const updatePassword = async (newPassword: string) => {
    const response = await authService.updatePassword(newPassword);
    if (response.error) {
      return { success: false, error: response.error };
    }
    return { success: true };
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await loadProfile(user.id);
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      session,
      profile,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      resetPassword,
      updateProfile,
      updatePassword,
      refreshProfile,
    }),
    [user, session, profile, loading]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
