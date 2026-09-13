/**
 * Medya ve Belge Seçim Yardımcısı
 * Expo ImagePicker ve Expo DocumentPicker izin ve seçim işlemlerini yönetir.
 */

import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { biometricHelper } from './biometricHelper';

export interface PickMediaResult {
  uri: string | null;
  name?: string;
  size?: number;
  mimeType?: string;
  canceled: boolean;
  error?: string | null;
}

export const mediaHelper = {
  /**
   * Kamera iznini kontrol eder ve gerekirse talep eder.
   */
  async requestCameraPermission(): Promise<boolean> {
    const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      if (canAskAgain) {
        Alert.alert(
          'Kamera İzni Gerekli',
          'Ürün veya fatura fotoğrafı çekebilmek için uygulamanın kameraya erişmesine izin vermelisiniz.'
        );
      }
      return false;
    }
    return true;
  },

  /**
   * Galeri / Medya Kütüphanesi iznini kontrol eder.
   */
  async requestMediaLibraryPermission(): Promise<boolean> {
    const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      if (canAskAgain) {
        Alert.alert(
          'Galeri İzni Gerekli',
          'Fotoğraf veya fatura seçebilmek için uygulamanın galerinize erişmesine izin vermelisiniz.'
        );
      }
      return false;
    }
    return true;
  },

  /**
   * Kamera ile anlık fotoğraf çeker.
   */
  async pickFromCamera(): Promise<PickMediaResult> {
    biometricHelper.setPickerActive(true);
    try {
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        return { uri: null, canceled: true, error: 'Kamera izni verilmedi.' };
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.7,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return { uri: null, canceled: true };
      }

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        name: asset.fileName || 'camera_photo.jpg',
        size: asset.fileSize,
        mimeType: asset.mimeType || 'image/jpeg',
        canceled: false,
      };
    } catch (err) {
      console.error('Kamera hatası:', err);
      return { uri: null, canceled: true, error: 'Kamera açılamadı.' };
    } finally {
      biometricHelper.setPickerActive(false);
    }
  },

  /**
   * Galeriden görsel seçer (Kullanıcıyı küçük kırpmaya zorlamaz, tam görseli alır).
   */
  async pickFromGallery(): Promise<PickMediaResult> {
    biometricHelper.setPickerActive(true);
    try {
      const hasPermission = await this.requestMediaLibraryPermission();
      if (!hasPermission) {
        return { uri: null, canceled: true, error: 'Galeri izni verilmedi.' };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.7,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return { uri: null, canceled: true };
      }

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        name: asset.fileName || 'gallery_photo.jpg',
        size: asset.fileSize,
        mimeType: asset.mimeType || 'image/jpeg',
        canceled: false,
      };
    } catch (err) {
      console.error('Galeri seçim hatası:', err);
      return { uri: null, canceled: true, error: 'Galeri açılamadı.' };
    } finally {
      biometricHelper.setPickerActive(false);
    }
  },

  /**
   * Fatura için belge (PDF veya Görsel) seçer.
   */
  async pickDocument(): Promise<PickMediaResult> {
    biometricHelper.setPickerActive(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return { uri: null, canceled: true };
      }

      const asset = result.assets[0];
      const fileName = asset.name || 'fatura_belgesi.pdf';
      const isPdf = fileName.toLowerCase().endsWith('.pdf') || asset.mimeType?.includes('pdf');
      const detectedMime = asset.mimeType || (isPdf ? 'application/pdf' : 'image/jpeg');

      return {
        uri: asset.uri,
        name: fileName,
        size: asset.size,
        mimeType: detectedMime,
        canceled: false,
      };
    } catch (err) {
      console.error('Belge seçim hatası:', err);
      return { uri: null, canceled: true, error: 'Belge seçilemedi.' };
    } finally {
      biometricHelper.setPickerActive(false);
    }
  },
};
