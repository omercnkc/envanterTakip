/**
 * Tema Yönetimi (ThemeContext & Provider)
 * Açık / Koyu (Light / Dark) mod geçişini, sistem teması senkronizasyonunu ve AsyncStorage kalıcılığını yönetir.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from 'react';
import {
  Appearance,
  useColorScheme,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS, ThemeColors, ThemeMode } from '../constants/colors';

const THEME_STORAGE_KEY = '@safe_envanter_theme';

// Android için LayoutAnimation etkinleştir
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ThemeContextType {
  theme: ThemeMode; // 'light' | 'dark' | 'system'
  systemColorScheme: 'light' | 'dark'; // Cihazın gerçek sistem teması
  isDark: boolean;
  colors: ThemeColors;
  setTheme: (theme: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [loading, setLoading] = useState(true);

  // useColorScheme hook'u ve Appearance modülü ile sistem temasını takip et
  const hookColorScheme = useColorScheme();
  const [systemColorScheme, setSystemColorScheme] = useState<'light' | 'dark'>(() => {
    const initial = Appearance.getColorScheme();
    return initial === 'dark' ? 'dark' : 'light';
  });

  // Sistem temasındaki anlık değişimleri dinle (Kullanıcı cihaz ayarlarından dark/light değiştirdiğinde)
  useEffect(() => {
    const initial = Appearance.getColorScheme();
    if (initial === 'dark' || initial === 'light') {
      setSystemColorScheme(initial);
    }

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme === 'dark' || colorScheme === 'light') {
        if (Platform.OS !== 'web') {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
        setSystemColorScheme(colorScheme);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Hook'tan gelen güncellemeleri de yakala
  useEffect(() => {
    if (hookColorScheme === 'dark' || hookColorScheme === 'light') {
      setSystemColorScheme(hookColorScheme);
    }
  }, [hookColorScheme]);

  // Kayıtlı tema tercihini yükle
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = (await AsyncStorage.getItem(THEME_STORAGE_KEY)) as ThemeMode | null;
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          setThemeState(savedTheme);
        }
      } catch (err) {
        console.warn('Tema tercihi yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSavedTheme();
  }, []);

  const setTheme = async (newTheme: ThemeMode) => {
    try {
      if (Platform.OS !== 'web') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (err) {
      console.warn('Tema kaydedilirken hata:', err);
    }
  };

  const toggleTheme = async () => {
    const nextTheme: ThemeMode = isDark ? 'light' : 'dark';
    await setTheme(nextTheme);
  };

  // Eğer theme === 'system' ise sistemColorScheme'a göre, aksi halde seçilen temaya göre
  const isDark = theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  const contextValue = useMemo(
    () => ({
      theme,
      systemColorScheme,
      isDark,
      colors,
      setTheme,
      toggleTheme,
    }),
    [theme, systemColorScheme, isDark, colors]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useThemeColors = (): ThemeColors => {
  return useTheme().colors;
};

