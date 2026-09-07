# Active Context: Ev Envanter & Garanti Takip

## 1. Mevcut Odak Noktası (Current Work Focus)
- **1. ve 2. Hafta Başarıyla Tamamlandı**: Tasarım sistemi, Supabase Auth, Envanter State Yönetimi (`InventoryContext`), Ürün CRUD İşlemleri, Form Validasyonları (Zod + React Hook Form), Otomatik Garanti Bitiş Tarihi Hesaplayıcı, Canlı Arama ve Ürün Detayı / Düzenleme akışları tamamlandı.
- **Sıradaki Odak**: 3. Hafta hedefleri olan Expo ImagePicker ile görsel/fatura seçimi, Supabase Storage (`product-images`, `invoices`) dosya yükleme/silme ve Expo Notifications ile 30, 7, 1 gün öncesi yerel bildirimlerin zamanlanması.

## 2. Son Yapılan Değişiklikler (Recent Changes)
- `src/utils/warrantyCalculator.ts`: Gün farkı hesabı, garanti durum rozetleri (`active`, `expiring_soon`, `expired`), Türkçe tarih formatlama ve otomatik bitiş tarihi hesaplama fonksiyonları yazıldı.
- `src/api/categoryService.ts` ve `src/api/productService.ts`: Kategori getirme, ürün CRUD, filtreleme ve arama servisleri geliştirildi.
- `src/context/InventoryContext.tsx`: Ürün listesi, istatistikler ve CRUD durumunu yöneten Context Provider eklendi.
- `src/components/`: `WarrantyBadge`, `ProductCard`, `CategoryPickerModal` ve ayrıştırılmış `.styles.ts` dosyaları oluşturuldu.
- `src/screens/main/`: `AddProductScreen`, `EditProductScreen`, `ProductDetailScreen`, `ProductsScreen` ve `HomeScreen` dinamik verilerle güncellendi.
- `src/navigation/RootNavigator.tsx`: `ProductDetail` ve `EditProduct` ekranları Stack'e kaydedildi.
- `App.tsx`: `InventoryProvider` hiyerarşiye eklendi.
- `npx tsc --noEmit` çalıştırıldı -> 0 hata.

## 3. Sıradaki Adımlar (Next Steps)
1. **3. Hafta – Medya & Bildirimler**:
   - `expo-image-picker` ile kamera/galeri görsel ve fatura yükleme.
   - Supabase Storage bucket entegrasyonu (`storageService.ts`).
   - `expo-notifications` ile 30 gün, 7 gün ve 1 gün öncesi yerel bildirim zamanlama motoru (`notificationService.ts`).
   - Barkod ve QR kod okuma (`expo-camera`).
2. **4. Hafta – Tamamlama & Teslimat**.
