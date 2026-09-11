# Active Context: Ev Envanter & Garanti Takip

## 1. Mevcut Odak Noktası (Current Work Focus)
- **1., 2. ve 3. Hafta Başarıyla Tamamlandı**: Tasarım sistemi, Supabase Auth, Envanter State Yönetimi (`InventoryContext`), Ürün CRUD İşlemleri, Medya/Fatura Yükleme (Supabase Storage), 30/7/1 gün Garantisi Bitenler için Yerel Bildirimler ve Barkod/QR Kod Tarayıcı tamamlandı.
- **4. Hafta Geliştirmeleri (Aşama 1 & 2 Tamamlandı)**:
  - Profil Bilgilerini Güncelleme (`EditProfileModal.tsx`, `authService.updateProfile`) tamamlandı.
  - Güvenli Şifre Değiştirme (`ChangePasswordModal.tsx`, `authService.updatePassword`) tamamlandı.
  - Envanter Verilerini Dışa Aktarma (Excel uyumlu UTF-8 CSV ve JSON + `expo-sharing` ile cihaz paylaşımı: `exportService.ts`, `ExportDataModal.tsx`) tamamlandı.
  - Tema Mimarisi & Karanlık Mod (`LIGHT_COLORS` & `DARK_COLORS`, `ThemeContext.tsx`, `App.tsx` dinamik tema) tamamlandı.
  - Ayarlar Kalıcılığı (`SettingsScreen.tsx`, `@react-native-async-storage/async-storage` ile 2FA, e-posta ve bildirim tercihleri) tamamlandı.
  - Bildirim Aç/Kapat Mantığı (`cancelAllWarrantyNotifications` & `syncAllWarrantyNotifications`) bağlandı.
  - Gerçek Önbellek Temizleme (`cacheHelper.ts`, `FileSystem.cacheDirectory`) tamamlandı.
  - Yörünge Cihaz Yükleme Animasyonu (`TechOrbitLoader.tsx`, `TechOrbitLoader.styles.ts`): 7 cihaz ikonlu, 360° kesintisiz yavaş dönüş, dik tutma (counter-spin), merkeze çekilme ve yaylanma fiziği (`Animated.spring`), nabızlı metin ve %100 açık/koyu tema uyumu tamamlandı.
  - `SplashScreen.tsx`: Yeni teknoloji yörünge animasyonuna bağlandı, dinamik temalı ve 2.8 saniyelik şık açılış deneyimi sağlandı.
  - `ProductsScreen.tsx`, `ProductDetailScreen.tsx` ve `EditProductScreen.tsx` ekranlarında yükleme durumları `TechOrbitLoader` ile modernize edildi.
- **Sıradaki Odak**: Aşama 3 & 4 (Dokümantasyon & APK derleme hazırlığı).


## 2. Son Yapılan Değişiklikler (Recent Changes)
- `app.json`: `userInterfaceStyle` ayarı `"light"` yerine `"automatic"` yapıldı. Böylece iOS/Android sistem karanlık/aydınlık mod değişimleri Expo ve React Native tarafından dinamik olarak algılanabilir hale getirildi.
- `src/context/ThemeContext.tsx`: `Appearance.addChangeListener` ve `useColorScheme` ile telefonun sistem teması canlı olarak takip edildi, `systemColorScheme` context'e aktarıldı, `LayoutAnimation` entegre edildi.
- `App.tsx`: `ThemeTransitionOverlay` eklenerek açık/koyu mod değişimlerinde gözü yoran ani renk parlaması yerine yumuşak ve şık bir dissolve (çözünme) geçiş animasyonu uygulandı.
- `src/screens/main/SettingsScreen.tsx`: Eski kaba `Alert.alert` tema seçim diyaloğu kaldırıldı; yerine şık 3'lü interaktif segment seçici (☀️ Açık, 🌙 Koyu, 📱 Sistem) ve sistem modu durum bilgi rozeti eklendi.
- `npx tsc --noEmit` çalıştırıldı -> 0 hata.

## 3. Sıradaki Adımlar (Next Steps)
1. **4. Hafta – Aşama 2: UI/UX Cila & Mikro-Animasyonlar**:
   - Boş durum (EmptyState) ekranlarının eyleme yönlendirici hale getirilmesi.
   - Yükleme (skeleton/loading) animasyonlarının parlatılması.
2. **4. Hafta – Aşama 3 & 4: Dokümantasyon & Teslimat**:
   - `README.md` güncellemesi ve ekran görüntüleri.
   - Android APK derleme rehberi.

