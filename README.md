# 🛡️ envanterTakip (Ev Envanter & Garanti Takip)

> **GitHub Repository:** [omercnkc/envanterTakip](https://github.com/omercnkc/envanterTakip)

React Native (Expo SDK 57) ve Supabase kullanılarak Android ve iOS platformlarında çalışan, evdeki elektronik eşyaları, beyaz eşyaları ve diğer ürünleri dijitalleştirerek fatura, garanti ve envanter süreçlerini takip eden mobil uygulama.

---

## 🎯 1. Projenin Amacı

Kullanıcıların sahip olduğu elektronik cihazları, ev eşyalarını ve diğer ürünleri kayıt altında tutmasını, garanti sürelerini takip etmesini, fatura ve ürün fotoğraflarını saklamasını ve garanti bitiş tarihleri yaklaşınca otomatik bildirim almasını sağlamaktır.

Bu proje kapsamında özellikle:
- **React Native & TypeScript** ile modern mobil uygulama mimarisi
- **Supabase** (Authentication, PostgreSQL Database, Storage, Row Level Security - RLS)
- **Kamera & Galeri** entegrasyonu (Supabase Storage ile eşzamanlı)
- **Yerel Bildirim Sistemi** (Expo Notifications ile 30, 7, 1 gün uyarıları)
- **Form Validasyonu** (React Hook Form & Zod)
- **Arama & Dinamik Filtreleme**
- **UI/UX & Hata / Loading Yönetimi** (Empty state, Skeleton/Spinner, Kullanıcı dostu hata mesajları)

---

## 🛠️ 2. Kullanılacak Teknolojiler

### Mobil
- **Framework**: React Native (Expo SDK 57, TypeScript)
- **Navigasyon**: React Navigation (Native Stack + Bottom Tabs)
- **Form & Validasyon**: React Hook Form, Zod
- **Durum & Depolama**: React Context API, AsyncStorage
- **İkonlar & Tasarım**: Lucide React Native, Expo Vector Icons
- **Medya / Cihaz**: Expo ImagePicker, Expo Camera, Expo DocumentPicker, Expo Notifications
- **Tarih & Yardımcılar**: Date-fns, base64-arraybuffer

### Backend & Altyapı (Supabase)
- **Supabase Authentication**: E-posta & Şifre ile kayıt, giriş, çıkış, şifre sıfırlama
- **PostgreSQL Database**: İlişkisel veri modeli (`profiles`, `categories`, `products`)
- **Row Level Security (RLS)**: Kullanıcı bazlı tam veri izolasyonu (`auth.uid() = user_id`)
- **Supabase Storage**: `product-images` ve `invoices` bucket'ları ile güvenli görsel/belge saklama

---

## 📱 3. Uygulama Ekranları ve Modüller

| Ekran | Açıklama |
| :--- | :--- |
| **Splash Screen** | Açılış ve oturum kontrolü ekranı |
| **Login / Register / Forgot Password** | Supabase Auth tabanlı kimlik doğrulama akışı |
| **Home (Dashboard)** | Toplam ürün, devam eden/biten/yaklaşan garanti sayaçları ve son eklenenler |
| **Product List (Ürünler)** | Görsel kartlı ürün listeleme, arama ve filtreleme |
| **Product Detail (Ürün Detay)** | Ürün, fatura, garanti durumu ve detaylı meta verileri |
| **Add / Edit Product (Ekle & Düzenle)** | Kamera/galeri yüklemeli, validasyonlu ürün yönetim formu |
| **Search & Filter** | Ada, markaya, modele, seri no'ya, kategoriye ve garanti durumuna göre arama/filtreleme |
| **Notifications (Bildirimler)** | Yaklaşan garanti bildirimleri ve hatırlatıcı kayıtları |
| **Profile & Settings** | Kullanıcı bilgileri, bildirim tercihleri, Dark Mode ve çıkış |

---

## ⏳ 4. Garanti Durum Mantığı ve Bildirimler

### Otomatik Garanti Durumu Hesaplama
- 🟢 **Garanti Devam Ediyor**: Garanti bitiş tarihi bugünden > 30 gün ileride.
- 🟡 **Garanti Yakında Bitiyor**: Garanti bitimine 30 gün veya daha az kaldı (1 - 30 gün).
- 🔴 **Garanti Bitti**: Garanti bitiş tarihi geçmiş (<= 0 gün).

### Bildirim Sistemi (Expo Notifications)
Garanti dolumundan önce proaktif bildirimler:
- 📅 **30 Gün Kala**: *"Samsung TV garantisinin bitmesine 30 gün kaldı."*
- 📅 **7 Gün Kala**: *"iPhone 16 Pro garantisinin bitmesine 7 gün kaldı."*
- 📅 **1 Gün Kala**: *"Dyson Süpürge garantisi yarın sona eriyor!"*

---

## 🗄️ 5. Veritabanı ve Depolama Mimarisi

### Tablo İlişkileri
```
auth.users
   └── profiles (id, full_name, email, created_at)
         └── products (id, user_id, category_id, name, brand, model, serial_number, purchase_date, purchase_price, warranty_end_date, store_name, description, image_path, invoice_path, created_at, updated_at)
               └── categories (id, name, icon, created_at)
```

### Row Level Security (RLS)
Her kullanıcı yalnızca kendi eklediği ürün ve profil verilerini görüntüleyebilir, ekleyebilir, güncelleyebilir ve silebilir (`products.user_id = auth.uid()`).

### Supabase Storage Buckets
1. `product-images`: Ürün fotoğrafları için (Unique UUID dosya adlandırma).
2. `invoices`: Fatura/fiş fotoğrafları ve belgeler için.

---

## 📅 6. 4 Haftalık Staj Yol Haritası

- **1. Hafta – Proje Altyapısı**: React Native + Expo + TypeScript kurulumu, Supabase projesi ve tabloları, Authentication akışı (Login, Register, Forgot Password), React Navigation ve temel tema tasarımı.
- **2. Hafta – Ürün İşlemleri**: Kategori yapısı, Ürün CRUD (Ekleme, Listeleme, Detay, Düzenleme, Silme), React Hook Form validasyonları ve arama altyapısı.
- **3. Hafta – Fotoğraf ve Garanti**: Kamera/galeri erişimi (Expo ImagePicker), Supabase Storage entegrasyonu, fatura/görsel yükleme, otomatik garanti hesaplamaları, garanti filtreleri ve Expo Notifications bildirim sistemi.
- **4. Hafta – Tamamlama & Sunum**: Dashboard özet kartları, Profil ve Ayarlar ekranları, RLS güvenlik testleri, Loading/Empty/Error state iyileştirmeleri, UI/UX polish, README & dokümantasyon, APK derleme ve sunum hazırlığı.

---

## 🌟 7. Bonus Özellikler

- [x] 📷 Barkod & QR Kod ile Seri No Okuma (Expo Camera)
- [x] 🌓 Açık / Koyu Tema Desteği (Dark Mode)
- [ ] 📄 Fatura & Garanti Belgesini PDF Olarak İçe/Dışa Aktarma
- [ ] 🌐 Türkçe / İngilizce Çoklu Dil Desteği (i18n)
- [ ] 📊 Harcama & Kategori Bazlı İstatistik Grafikleri
- [ ] 🔒 Biyometrik Giriş (FaceID / Fingerprint)

---

## ⚡ 8. Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Ortam Değişkenlerini Tanımlayın
Kök dizinde `.env` dosyası oluşturun (`.env.example` şablonunu kullanabilirsiniz):
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Supabase SQL Şemasını Uygulayın
Supabase Dashboard SQL Editor üzerinde veritabanı tablolarını, RLS kurallarını ve Storage bucket politikalarını tanımlayın.

### 4. Uygulamayı Başlatın
```bash
npx expo start
```
Terminalde oluşan QR kodu telefonunuzdaki **Expo Go** uygulamasıyla taratarak iOS/Android cihazınızda çalıştırabilirsiniz.

---

## 📝 9. Git Commit Standartları

Geliştirme sürecinde düzenli ve anlamlı commit mesajları kullanılır:
```bash
feat: add supabase authentication
feat: create product form and validation
feat: add product and invoice image upload to supabase storage
feat: implement automatic warranty calculation and filtering
feat: schedule local notifications for warranty expiration
fix: validate purchase and warranty end dates
fix: handle storage upload error and offline fallback
```

---

## 📦 10. Teslim Edilecekler
- ✅ React Native & TypeScript Kaynak Kodları
- ✅ Supabase Veritabanı Şeması & RLS Kuralları
- ✅ Detaylı Dokümantasyon (`README.md`, `memory-bank/`)
- ✅ Test Kullanıcı Bilgileri & Kurulum Kılavuzu
- ✅ Android APK Çıktısı & Ekran Görüntüleri
