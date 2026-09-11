/**
 * Önbellek Yönetimi (Cache Helper)
 * expo-file-system üzerinden uygulama önbellek boyutunu hesaplar ve temizler.
 */

import * as FileSystem from 'expo-file-system/legacy';

export const cacheHelper = {
  /**
   * Geçici dosya dizinindeki toplam boyutu ve dosya sayısını hesaplar.
   */
  async getCacheSize(): Promise<{ sizeInBytes: number; fileCount: number }> {
    try {
      if (!FileSystem.cacheDirectory) {
        return { sizeInBytes: 0, fileCount: 0 };
      }

      const files = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory);
      let totalSize = 0;
      let count = 0;

      for (const file of files) {
        const fileUri = `${FileSystem.cacheDirectory}${file}`;
        try {
          const info = await FileSystem.getInfoAsync(fileUri);
          if (info.exists && !info.isDirectory) {
            totalSize += (info as any).size || 0;
            count++;
          }
        } catch {
          // Bir dosya okunamadıysa devam et
        }
      }

      return { sizeInBytes: totalSize, fileCount: count };
    } catch {
      return { sizeInBytes: 0, fileCount: 0 };
    }
  },

  /**
   * Önbellek dizinindeki tüm geçici dosyaları temizler.
   */
  async clearCache(): Promise<{ success: boolean; freedBytes: number; deletedCount: number }> {
    try {
      if (!FileSystem.cacheDirectory) {
        return { success: true, freedBytes: 0, deletedCount: 0 };
      }

      const { sizeInBytes, fileCount } = await this.getCacheSize();
      const files = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory);

      for (const file of files) {
        const fileUri = `${FileSystem.cacheDirectory}${file}`;
        try {
          await FileSystem.deleteAsync(fileUri, { idempotent: true });
        } catch {
          // Devam et
        }
      }

      return { success: true, freedBytes: sizeInBytes, deletedCount: fileCount };
    } catch {
      return { success: false, freedBytes: 0, deletedCount: 0 };
    }
  },

  /**
   * Byte değerini insan tarafından okunabilir MB/KB metnine dönüştürür.
   */
  formatBytes(bytes: number): string {
    if (bytes <= 0) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${Math.round(kb)} KB`;
    }
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  },
};
