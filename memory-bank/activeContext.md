# Active Context: Ev Envanter & Garanti Takip

## 1. Mevcut Odak Noktası (Current Work Focus)
- **1., 2. ve 3. Hafta Başarıyla Tamamlandı**: Tasarım sistemi, Supabase Auth, Envanter State Yönetimi (`InventoryContext`), Ürün CRUD İşlemleri, Medya/Fatura Yükleme (Supabase Storage), 30/7/1 gün Garantisi Bitenler için Yerel Bildirimler ve Barkod/QR Kod Tarayıcı tamamlandı.
- **4. Hafta Geliştirmeleri Başladı**:
  - Profil Bilgilerini Güncelleme (`EditProfileModal.tsx`, `authService.updateProfile`) tamamlandı.
  - Güvenli Şifre Değiştirme (`ChangePasswordModal.tsx`, `authService.updatePassword`) tamamlandı.
  - Envanter Verilerini Dışa Aktarma (Excel uyumlu UTF-8 CSV ve JSON + `expo-sharing` ile cihaz paylaşımı: `exportService.ts`, `ExportDataModal.tsx`) tamamlandı.
- **Sıradaki Odak**: Ayarlar (Dark Mode, bildirim tercihleri saklama), Empty State ve Loading animasyonları cila ve APK derleme hazırlığı.

## 2. Son Yapılan Değişiklikler (Recent Changes)
- `expo-sharing` kütüphanesi kuruldu.
- `src/types/auth.types.ts`: `updateProfileSchema` ve `changePasswordSchema` Zod şemaları ve tipleri eklendi.
- `src/api/authService.ts`: `updateProfile` ve `updatePassword` metodları yazıldı.
- `src/context/AuthContext.tsx`: `updateProfile` ve `updatePassword` metodları entegre edildi.
- `src/api/exportService.ts`: Excel uyumlu UTF-8 BOM destekli CSV oluşturucu, JSON oluşturucu ve `expo-sharing` ile cihazda paylaşım motoru geliştirildi.
- `src/components/`: `EditProfileModal`, `ChangePasswordModal`, `ExportDataModal` ve ayrıştırılmış `.styles.ts` dosyaları oluşturuldu ve export edildi.
- `src/screens/main/ProfileScreen.tsx` & `.styles.ts`: Profil kartına "Profili Düzenle" butonu, menüye "Verileri Dışa Aktar" butonu ve modallar eklendi.
- `src/screens/main/SettingsScreen.tsx`: "Hesap ve Profil Ayarları", "Şifre ve Güvenlik" ve "Verileri Dışa Aktar" aksiyonları gerçek modallara bağlandı.
- `npx tsc --noEmit` çalıştırıldı -> 0 hata.

## 3. Sıradaki Adımlar (Next Steps)
1. **4. Hafta – Tamamlama & Cila**:
   - Karanlık mod (Dark Mode) desteği ve tema entegrasyonu.
   - Bildirim tercihleri (garanti hatırlatıcıları aç/kapa) durumunun `AsyncStorage`'da saklanması.
   - Boş durum (EmptyState) ve yükleme animasyonlarının parlatılması.
   - Android APK derleme ve sunum hazırlığı.

