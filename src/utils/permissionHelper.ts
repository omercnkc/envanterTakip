/**
 * İzin Yönetim ve Ön Açıklama Yardımcısı (Permission Helper)
 * Cihaz işletim sistemi izinlerini doğrudan istemek yerine, modern Türkçe açıklama
 * ve şeffaf gizlilik güvencesi sunan ön izin katmanını yönetir.
 */

import { Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { biometricHelper } from './biometricHelper';

import { appPreferencesHelper } from './appPreferencesHelper';

export type PermissionType = 'camera' | 'media_library' | 'notifications';

export interface PermissionPromptConfig {
  type: PermissionType;
  title: string;
  description: string;
  features: string[];
  primaryButtonText: string;
  secondaryButtonText?: string;
}

export const PERMISSION_CONFIGS_TR: Record<PermissionType, PermissionPromptConfig> = {
  camera: {
    type: 'camera',
    title: 'Kamera Erişimi Gerekiyor',
    description:
      'Ürünlerinizi envantere eklerken fatura, garanti belgesi veya barkod fotoğraflarını anında çekebilmeniz için kameraya erişim izni gerekiyor.',
    features: [
      'Ürün ve fatura fotoğraflarını anında çekme',
      'Seri numarası ve barkodları otomatik tarama',
      'Sigorta için net kanıt belgeleri oluşturma',
    ],
    primaryButtonText: 'Kamera İzni Ver',
    secondaryButtonText: 'Şimdi Değil',
  },
  media_library: {
    type: 'media_library',
    title: 'Fotoğraf Galerisi Erişimi',
    description:
      'Cihazınızda önceden çekilmiş olan ürün ve fatura fotoğraflarını envanterinize yükleyebilmek için fotoğraf kitaplığınıza erişim gerekiyor.',
    features: [
      'Galeriden ürün ve garanti belgesi seçme',
      'Fatura fotoğraflarını dijital arşivleme',
      'Yalnızca seçtiğiniz fotoğraflara güvenli erişim',
    ],
    primaryButtonText: 'Galeri İzni Ver',
    secondaryButtonText: 'Şimdi Değil',
  },
  notifications: {
    type: 'notifications',
    title: 'Garanti & Bakım Bildirimleri',
    description:
      'Garantisi dolmak üzere olan ürünlerinizi kaçırmamanız ve periyodik bakımları zamanında yapabilmeniz için anlık bildirimlere izin vermelisiniz.',
    features: [
      'Garanti bitmeden 30, 14 ve 7 gün önce hatırlatma',
      'Kombi, filtre ve periyodik bakım alarmları',
      'Rahatsız etmeyen akıllı yerel uyarılar',
    ],
    primaryButtonText: 'Bildirimlere İzin Ver',
    secondaryButtonText: 'Daha Sonra',
  },
};

export const PERMISSION_CONFIGS_EN: Record<PermissionType, PermissionPromptConfig> = {
  camera: {
    type: 'camera',
    title: 'Camera Access Required',
    description:
      'Camera access is required so you can instantly capture invoices, receipts, warranties, and barcodes when adding items.',
    features: [
      'Instantly photograph items and receipts',
      'Automatically scan serial numbers & barcodes',
      'Create verified documentation for insurance',
    ],
    primaryButtonText: 'Allow Camera Access',
    secondaryButtonText: 'Not Now',
  },
  media_library: {
    type: 'media_library',
    title: 'Photo Library Access',
    description:
      'Photo library access is needed to upload existing product photos and warranty receipts from your device.',
    features: [
      'Select photos and warranty docs from gallery',
      'Digitally archive your purchase receipts',
      'Secure access limited only to selected photos',
    ],
    primaryButtonText: 'Allow Photo Access',
    secondaryButtonText: 'Not Now',
  },
  notifications: {
    type: 'notifications',
    title: 'Warranty & Maintenance Alerts',
    description:
      'Enable notifications so you never miss an expiring warranty or scheduled periodic appliance maintenance.',
    features: [
      'Reminders 30, 14, and 7 days before warranty ends',
      'Scheduled maintenance alarms for home appliances',
      'Unobtrusive, reliable on-device notifications',
    ],
    primaryButtonText: 'Allow Notifications',
    secondaryButtonText: 'Later',
  },
};

export const PERMISSION_CONFIGS = PERMISSION_CONFIGS_TR;

export const getPermissionConfig = (type: PermissionType, lang: 'tr' | 'en' = 'tr'): PermissionPromptConfig => {
  return lang === 'en' ? PERMISSION_CONFIGS_EN[type] : PERMISSION_CONFIGS_TR[type];
};

type PermissionModalListener = (config: PermissionPromptConfig | null, resolveCallback?: (granted: boolean) => void) => void;

let activeListener: PermissionModalListener | null = null;

export const permissionHelper = {
  /**
   * Modal dinleyicisini bağlar
   */
  setListener(listener: PermissionModalListener | null) {
    activeListener = listener;
  },

  /**
   * Belirtilen iznin şu an verilip verilmediğini arka planda kontrol eder
   */
  async checkPermission(type: PermissionType): Promise<{ granted: boolean; canAskAgain: boolean }> {
    try {
      if (type === 'camera') {
        const res = await ImagePicker.getCameraPermissionsAsync();
        return { granted: res.granted, canAskAgain: res.canAskAgain };
      } else if (type === 'media_library') {
        const res = await ImagePicker.getMediaLibraryPermissionsAsync();
        return { granted: res.granted, canAskAgain: res.canAskAgain };
      } else if (type === 'notifications') {
        const res = await Notifications.getPermissionsAsync();
        const granted =
          res.granted || res.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
        return { granted: !!granted, canAskAgain: res.canAskAgain };
      }
      return { granted: false, canAskAgain: true };
    } catch (err) {
      console.warn('İzin kontrol hatası:', err);
      return { granted: false, canAskAgain: true };
    }
  },

  /**
   * Kullanıcıya modern Türkçe UI ile izin talep penceresini açar.
   * Eğer izin zaten verilmişse hemen true döner.
   */
  async requestPermissionWithModal(type: PermissionType): Promise<boolean> {
    // 1. Zaten izinli mi kontrol et
    const current = await this.checkPermission(type);
    if (current.granted) {
      return true;
    }

    const prefs = await appPreferencesHelper.getPreferences();
    const config = getPermissionConfig(type, prefs.language);

    // 2. Dinleyici varsa modern Türkçe modalı göster
    if (activeListener) {
      return new Promise<boolean>((resolve) => {
        activeListener!(config, async (userAccepted: boolean) => {
          if (!userAccepted) {
            resolve(false);
            return;
          }

          // Kullanıcı onayladı, işletim sistemi izin isteğini başlat
          biometricHelper.setPickerActive(true);
          try {
            let finalGranted = false;

            if (type === 'camera') {
              const res = await ImagePicker.requestCameraPermissionsAsync();
              finalGranted = res.granted;
              if (!res.granted && !res.canAskAgain) {
                // Kalıcı reddedilmişse ayarlara yönlendir
                Linking.openSettings();
              }
            } else if (type === 'media_library') {
              const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
              finalGranted = res.granted;
              if (!res.granted && !res.canAskAgain) {
                Linking.openSettings();
              }
            } else if (type === 'notifications') {
              const res = await Notifications.requestPermissionsAsync({
                ios: { allowAlert: true, allowBadge: true, allowSound: true },
              });
              finalGranted = !!(
                res.granted || res.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
              );
              if (!finalGranted && !res.canAskAgain) {
                Linking.openSettings();
              }
            }

            resolve(finalGranted);
          } catch (err) {
            console.warn('Sistem izni istenirken hata:', err);
            resolve(false);
          } finally {
            biometricHelper.setPickerActive(false);
          }
        });
      });
    }

    // Yedek durum (dinleyici yoksa doğrudan native iste)
    if (type === 'camera') {
      const res = await ImagePicker.requestCameraPermissionsAsync();
      return res.granted;
    } else if (type === 'media_library') {
      const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return res.granted;
    } else {
      const res = await Notifications.requestPermissionsAsync();
      return res.granted;
    }
  },
};
