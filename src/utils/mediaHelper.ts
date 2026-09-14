/**
 * Medya ve Belge Seçim Yardımcısı
 * Expo ImagePicker ve Expo DocumentPicker izin ve seçim işlemlerini yönetir.
 */

import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { biometricHelper } from './biometricHelper';
import { alertService } from '../context/AlertContext';
import { permissionHelper } from './permissionHelper';

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
   * Kamera iznini modern Türkçe modal ile kontrol eder ve gerekirse talep eder.
   */
  async requestCameraPermission(): Promise<boolean> {
    return await permissionHelper.requestPermissionWithModal('camera');
  },

  /**
   * Galeri / Medya Kütüphanesi iznini modern Türkçe modal ile kontrol eder.
   */
  async requestMediaLibraryPermission(): Promise<boolean> {
    return await permissionHelper.requestPermissionWithModal('media_library');
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
