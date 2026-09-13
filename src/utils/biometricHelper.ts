import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BIOMETRIC_KEY = '@safe_envanter_biometric_enabled';
const BIOMETRIC_TIMEOUT_KEY = '@safe_envanter_biometric_timeout';
const LAST_UNLOCK_KEY = '@safe_envanter_biometric_last_unlock';
const BACKGROUND_TIMESTAMP_KEY = '@safe_envanter_biometric_background_time';

export type BiometricTimeout = 'immediately' | '15m' | '30m';

export interface BiometricTimeoutOption {
  id: BiometricTimeout;
  label: string;
  minutes: number;
  description: string;
}

export const BIOMETRIC_TIMEOUT_OPTIONS: BiometricTimeoutOption[] = [
  {
    id: 'immediately',
    label: 'Anında',
    minutes: 0,
    description: 'Uygulamadan her çıkıldığında kilitlenir',
  },
  {
    id: '15m',
    label: '15 Dakika',
    minutes: 15,
    description: '15 dakika içinde dönüldüğünde parmak izi istemez',
  },
  {
    id: '30m',
    label: '30 Dakika',
    minutes: 30,
    description: '30 dakika içinde dönüldüğünde parmak izi istemez',
  },
];

export interface BiometricCheckResult {
  hasHardware: boolean;
  isEnrolled: boolean;
  biometricTypeName: string; // 'Face ID', 'Parmak İzi' veya 'Biyometri'
}

let inMemoryLastUnlockTime = 0;
let inMemoryBackgroundTime = 0;
let isMediaPickerActive = false;
let mediaPickerTimeout: any = null;

export const biometricHelper = {
  /**
   * Medya / Kamera / Belge seçicisi veya sistem arayüzü açıkken kilit kontrolünü askıya alır.
   */
  setPickerActive(active: boolean): void {
    if (mediaPickerTimeout) {
      clearTimeout(mediaPickerTimeout);
      mediaPickerTimeout = null;
    }

    if (active) {
      isMediaPickerActive = true;
      inMemoryLastUnlockTime = Date.now();
    } else {
      inMemoryLastUnlockTime = Date.now();
      // Harici arayüz kapandıktan ve ön plana dönüldükten sonra 3 saniye boyunca kilidi tetikleme
      mediaPickerTimeout = setTimeout(() => {
        isMediaPickerActive = false;
        mediaPickerTimeout = null;
      }, 3000);
    }
  },

  isPickerActive(): boolean {
    return isMediaPickerActive;
  },

  /**
   * Cihazın biyometrik donanım ve kayıt durumunu sorgular.
   */
  async checkBiometrics(): Promise<BiometricCheckResult> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = hasHardware ? await LocalAuthentication.isEnrolledAsync() : false;

      let biometricTypeName = 'Biyometri';
      if (hasHardware) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          biometricTypeName = 'Face ID / Yüz Tanıma';
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          biometricTypeName = 'Parmak İzi';
        }
      }

      return {
        hasHardware,
        isEnrolled,
        biometricTypeName,
      };
    } catch {
      return {
        hasHardware: false,
        isEnrolled: false,
        biometricTypeName: 'Biyometri',
      };
    }
  },

  /**
   * Biyometrik girişin ayarlardan aktif edilip edilmediğini kontrol eder.
   */
  async isEnabled(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem(BIOMETRIC_KEY);
      return val === 'true';
    } catch {
      return false;
    }
  },

  /**
   * Biyometrik giriş tercihini kaydeder.
   */
  async setEnabled(enabled: boolean): Promise<boolean> {
    try {
      await AsyncStorage.setItem(BIOMETRIC_KEY, String(enabled));
      if (enabled) {
        await this.recordUnlock();
      }
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Kayıtlı kilit süresi tercihini getirir (Varsayılan: 'immediately').
   */
  async getTimeout(): Promise<BiometricTimeout> {
    try {
      const val = await AsyncStorage.getItem(BIOMETRIC_TIMEOUT_KEY);
      if (val === 'immediately' || val === '15m' || val === '30m') {
        return val;
      }
      return 'immediately';
    } catch {
      return 'immediately';
    }
  },

  /**
   * Kilit süresi tercihini kaydeder.
   */
  async setTimeout(timeout: BiometricTimeout): Promise<boolean> {
    try {
      await AsyncStorage.setItem(BIOMETRIC_TIMEOUT_KEY, timeout);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Kullanıcının başarıyla kilit açtığı zamanı kaydeder (Login veya Kilit Ekranı).
   */
  async recordUnlock(): Promise<void> {
    const now = Date.now();
    inMemoryLastUnlockTime = now;
    try {
      await AsyncStorage.setItem(LAST_UNLOCK_KEY, String(now));
    } catch {
      // sessizce geç
    }
  },

  /**
   * Uygulamanın arka plana geçtiği zamanı kaydeder.
   */
  async recordBackground(): Promise<void> {
    if (isMediaPickerActive) {
      // Harici kamera / galeri / dosya seçici açıkken arka plan kilit süresi tetikleme
      return;
    }
    const now = Date.now();
    inMemoryBackgroundTime = now;
    try {
      await AsyncStorage.setItem(BACKGROUND_TIMESTAMP_KEY, String(now));
    } catch {
      // sessizce geç
    }
  },

  /**
   * Uygulama öne geldiğinde kilit ekranının açılması gerekip gerekmediğini hesaplar.
   */
  async shouldLockOnResume(): Promise<boolean> {
    try {
      if (isMediaPickerActive) {
        return false;
      }
      const enabled = await this.isEnabled();
      if (!enabled) return false;

      const now = Date.now();

      // Son kilit açma / işlem üzerinden 25 saniyeden az geçtiyse asla kilitleme
      let lastUnlock = inMemoryLastUnlockTime;
      if (!lastUnlock) {
        const storedUnlock = await AsyncStorage.getItem(LAST_UNLOCK_KEY);
        lastUnlock = storedUnlock ? parseInt(storedUnlock, 10) : 0;
      }
      if (lastUnlock && now - lastUnlock < 25000) {
        return false;
      }

      const timeout = await this.getTimeout();

      // Anında kilit seçilmişse:
      if (timeout === 'immediately') {
        return true;
      }

      // Arka plana geçiş zamanını kontrol et:
      let bgTime = inMemoryBackgroundTime;
      if (!bgTime) {
        const storedBg = await AsyncStorage.getItem(BACKGROUND_TIMESTAMP_KEY);
        bgTime = storedBg ? parseInt(storedBg, 10) : 0;
      }

      if (!bgTime) {
        // Kayıtlı arka plan süresi yoksa (örn: uzun süre sonra ilk açılış)
        return true;
      }

      const elapsed = now - bgTime;
      const thresholdMinutes = timeout === '15m' ? 15 : 30;
      const thresholdMs = thresholdMinutes * 60 * 1000;

      return elapsed >= thresholdMs;
    } catch {
      return false;
    }
  },

  /**
   * Kullanıcıdan biyometrik doğrulama ister.
   */
  async authenticate(
    promptMessage: string = 'Safe Envanter Doğrulaması'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const check = await this.checkBiometrics();
      if (!check.hasHardware || !check.isEnrolled) {
        return {
          success: false,
          error: 'Cihazınızda biyometrik kimlik doğrulama (Face ID / Parmak İzi) aktif değil.',
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Vazgeç',
        fallbackLabel: 'Şifre Kullan',
        disableDeviceFallback: false,
      });

      if (result.success) {
        await this.recordUnlock();
        return { success: true };
      }

      return {
        success: false,
        error: result.error || 'Doğrulama başarısız oldu.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Biyometrik doğrulama sırasında bir hata oluştu.',
      };
    }
  },
};
