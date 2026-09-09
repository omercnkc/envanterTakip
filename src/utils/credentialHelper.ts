import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedCredential {
  email: string;
  password: string;
  savedAt: string;
  isGeneratedPassword?: boolean;
}

const STORAGE_KEY = '@envanter_saved_credentials';

/**
 * Kullanıcı kimlik bilgilerini (e-posta & şifre) cihaz yerel hafızasına kaydeder.
 */
export const saveCredentials = async (
  email: string,
  password: string,
  isGeneratedPassword: boolean = false
): Promise<boolean> => {
  try {
    const data: SavedCredential = {
      email: email.trim(),
      password,
      savedAt: new Date().toISOString(),
      isGeneratedPassword,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Kimlik bilgileri kaydedilirken hata oluştu:', error);
    return false;
  }
};

/**
 * Cihazda kayıtlı kimlik bilgilerini getirir.
 */
export const getSavedCredentials = async (): Promise<SavedCredential | null> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return null;
    const parsed = JSON.parse(json) as SavedCredential;
    if (parsed && parsed.email && parsed.password) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Kayıtlı kimlik bilgileri okunurken hata oluştu:', error);
    return null;
  }
};

/**
 * Cihazda kayıtlı kimlik bilgilerini siler.
 */
export const clearSavedCredentials = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Kayıtlı kimlik bilgileri silinirken hata oluştu:', error);
    return false;
  }
};
