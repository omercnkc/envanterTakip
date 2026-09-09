/**
 * Supabase Storage Servis Katmanı
 * Görsel ve fatura dosyalarını Supabase Storage bucket'larına yükler ve yönetir.
 */

import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabase, isSupabaseConfigured } from './supabase';
import { formatAppError } from '../utils/errorHandler';

export type StorageBucket = 'product-images' | 'invoices';

export interface UploadResult {
  publicUrl: string | null;
  path: string | null;
  error: string | null;
  isLocalFallback?: boolean;
}

export interface UploadOptions {
  mimeType?: string;
  fileName?: string;
}

/**
 * Dosya URI'sinden veya dosya adından uzantıyı ve MIME tipini tespit eder.
 */
export const getMimeTypeAndExt = (
  uriOrName: string
): { mimeType: string; ext: string } => {
  const clean = uriOrName.split('?')[0].toLowerCase();
  if (clean.endsWith('.png')) return { mimeType: 'image/png', ext: 'png' };
  if (clean.endsWith('.webp')) return { mimeType: 'image/webp', ext: 'webp' };
  if (clean.endsWith('.pdf')) return { mimeType: 'application/pdf', ext: 'pdf' };
  if (clean.endsWith('.heic')) return { mimeType: 'image/heic', ext: 'heic' };
  return { mimeType: 'image/jpeg', ext: 'jpg' };
};

export const storageService = {
  /**
   * Yerel dosya URI'sini okuyarak belirtilen bucket'a yükler.
   * @param localUri Cihaz üzerindeki dosya yolu (örn: file:///...)
   * @param bucket 'product-images' veya 'invoices'
   * @param userId Kullanıcı kimliği
   * @param options Dosya adı veya mime tipi opsiyonları
   */
  async uploadFile(
    localUri: string,
    bucket: StorageBucket,
    userId: string,
    options?: UploadOptions
  ): Promise<UploadResult> {
    // Supabase bağlı değilse yerel URI ile devam et
    if (!isSupabaseConfigured()) {
      return {
        publicUrl: localUri,
        path: `mock-${bucket}-${Date.now()}`,
        error: null,
        isLocalFallback: true,
      };
    }

    try {
      let ext = options?.fileName
        ? options.fileName.split('.').pop()?.toLowerCase() || 'jpg'
        : '';
      let mimeType = options?.mimeType || '';

      if (!ext || !mimeType) {
        const detected = getMimeTypeAndExt(options?.fileName || localUri);
        if (!ext) ext = detected.ext;
        if (!mimeType) mimeType = detected.mimeType;
      }

      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = `${userId}/${fileName}`;

      // 1. Dosyayı Base64 formatında oku
      const base64 = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 2. Binary ArrayBuffer'a dönüştür
      const arrayBuffer = decode(base64);

      // 3. Supabase Storage'a yükle
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, arrayBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        console.warn(`[Supabase Storage ${bucket}] Yükleme uyarısı:`, error.message);
        // Supabase tarafında bucket henüz açılmamışsa veya yetki yoksa kullanıcıyı engelleme, yerel URI ile devam et
        return {
          publicUrl: localUri,
          path: filePath,
          error: null,
          isLocalFallback: true,
        };
      }

      // 4. Genel erişilebilir Public URL al
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return {
        publicUrl: urlData.publicUrl,
        path: data.path,
        error: null,
      };
    } catch (err) {
      console.warn(`[Storage Service] Dosya işleme uyarısı (yerel URI fallback):`, err);
      // Cihaz içi okuma veya beklenmedik durumda yerel dosya yoluyla kullanıcıyı engellemeden devam ettir
      return {
        publicUrl: localUri,
        path: null,
        error: null,
        isLocalFallback: true,
      };
    }
  },

  /**
   * Supabase Storage üzerindeki dosyayı siler.
   */
  async deleteFile(fileUrlOrPath: string, bucket: StorageBucket): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured() || !fileUrlOrPath) {
      return { success: true, error: null };
    }

    try {
      // Eğer public URL verilmişse relative path'i ayıkla
      let relativePath = fileUrlOrPath;
      if (fileUrlOrPath.includes(`/storage/v1/object/public/${bucket}/`)) {
        relativePath = fileUrlOrPath.split(`/storage/v1/object/public/${bucket}/`)[1];
      }

      const { error } = await supabase.storage.from(bucket).remove([relativePath]);

      if (error) {
        return { success: false, error: formatAppError(error).fullMessage };
      }

      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: formatAppError(err).fullMessage };
    }
  },
};
