import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tr } from './tr';
import { en } from './en';

export type Language = 'tr' | 'en';

export const LANGUAGE_STORAGE_KEY = '@safe_envanter_pref_language';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'tr', label: 'Türkçe', nativeLabel: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
];

const dictionaries = { tr, en };

let activeLanguage: Language = 'tr';

/**
 * React dışındaki yardımcı fonksiyonlar veya servisler için çeviri erişimi
 */
export function getTranslation(
  keyPath: string,
  lang: Language = activeLanguage,
  params?: Record<string, string | number>
): string {
  const dict = dictionaries[lang] || dictionaries.tr;
  const parts = keyPath.split('.');
  let current: any = dict;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Fallback to Turkish
      let fallbackCurrent: any = dictionaries.tr;
      for (const fPart of parts) {
        if (fallbackCurrent && typeof fallbackCurrent === 'object' && fPart in fallbackCurrent) {
          fallbackCurrent = fallbackCurrent[fPart];
        } else {
          return keyPath;
        }
      }
      current = fallbackCurrent;
      break;
    }
  }

  if (typeof current !== 'string') {
    return keyPath;
  }

  if (params) {
    let result = current;
    for (const [pKey, pVal] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
    }
    return result;
  }

  return current;
}

export function getCurrentLanguage(): Language {
  return activeLanguage;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
  isLanguageLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'tr',
  setLanguage: async () => {},
  t: (keyPath: string) => keyPath,
  isLanguageLoaded: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('tr');
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (saved === 'tr' || saved === 'en') {
          setLanguageState(saved);
          activeLanguage = saved;
        }
      } catch (e) {
        console.warn('Dil tercihi yüklenirken hata:', e);
      } finally {
        setIsLanguageLoaded(true);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = useCallback(async (newLang: Language) => {
    setLanguageState(newLang);
    activeLanguage = newLang;
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch (e) {
      console.warn('Dil tercihi kaydedilirken hata:', e);
    }
  }, []);

  const t = useCallback(
    (keyPath: string, params?: Record<string, string | number>) => {
      return getTranslation(keyPath, language, params);
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLanguageLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export const useTranslation = useLanguage;
