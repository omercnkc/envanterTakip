# 🛡️ envanterTakip — Smart Home Inventory & Warranty Tracker
### *Ev Envanter & Garanti Takip Mobil Uygulaması*

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.86.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-SDK_57-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Backend_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Platform-iOS_%7C_Android-black?style=for-the-badge&logo=android&logoColor=white" alt="Platforms" />
  <img src="https://img.shields.io/badge/Languages-TR_%7C_EN-FF5722?style=for-the-badge&logo=google-translate&logoColor=white" alt="Languages" />
</p>

---

<p align="center">
  <b>🌍 Dil / Language:</b>
  <a href="#-türkçe-dokümantasyon"> 🇹🇷 Türkçe </a> |
  <a href="#-english-documentation"> 🇬🇧 English </a>
</p>

---

<a name="-türkçe-dokümantasyon"></a>
## 🇹🇷 Türkçe Dokümantasyon

**envanterTakip**, evinizdeki tüm elektronik cihazları, beyaz eşyaları, mobilyaları ve kişisel eşyaları dijitalleştirerek garanti sürelerini, faturalarını ve servis geçmişlerini tek merkezden yönetmenizi sağlayan yeni nesil akıllı mobil envanter uygulamasıdır.

React Native (Expo SDK 57), TypeScript ve Supabase ile geliştirilmiş olup iOS ve Android platformlarında tam native performans ve modern bir kullanıcı deneyimi sunar.

---

### 📑 İçindekiler
1. [Öne Çıkan Özellikler](#-öne-çıkan-özellikler)
2. [Ekranlar & Kullanıcı Deneyimi](#-ekranlar--kullanıcı-deneyimi)
3. [Teknoloji Mimarisi](#-teknoloji-mimarisi)
4. [Veritabanı & Güvenlik (Supabase)](#-veritabanı--güvenlik-supabase)
5. [Garanti Hesaplama & Bildirim Motoru](#-garanti-hesaplama--bildirim-motoru)
6. [Kurulum & Çalıştırma](#-kurulum--çalıştırma)
7. [Proje Dizin Yapısı](#-proje-dizin-yapısı)
8. [Yol Haritası & Sürüm Durumu](#-yol-haritası--sürüm-durumu)

---

### ✨ Öne Çıkan Özellikler

- 🌐 **Çoklu Dil Desteği (TR / EN)**: Türkçe ve İngilizce arayüz desteği, dil tercihini dinamik değiştirme ve yerelleştirilmiş bildirim şablonları.
- 📊 **İnteraktif Kategori Grafikleri (Analytics)**: `react-native-gifted-charts` destekli interaktif pasta/halka (Donut) ve çubuk grafikler. Kategori bazında ürün adedi ve toplam bütçe dağılımı, grafik dilimlerine dokunarak ürün listesini anında filtreleme.
- 📱 **Ana Ekran Widget Desteği (Android & iOS Widgets)**: Uygulamayı açmadan telefonun ana ekranında yaklaşan garantileri, gün sayaçlarını ve kritik uyarıları canlı widget kartı olarak izleme (`react-native-android-widget`).
- 🛡️ **Garanti Sağlık Skoru (Warranty Health Score)**: Sahip olduğunuz ürünlerin aktif garanti yüzdesini ve koruma düzeyini gösteren dinamik sağlık puanı ve akıllı analiz panosu.
- 📄 **Tek Tıkla Resmi A4 PDF Raporu**: Sigorta, taşınma ve servis süreçleri için tüm envanteri, fatura numaralarını ve garanti durumlarını listeleyen resmi tasarımlı A4 PDF dökümü oluşturma ve anında paylaşma.
- 🔒 **Modern Uygulama İçi İzin Yönetimi (Permission Priming UI)**: İşletim sisteminin ani ve yabancı dildeki izin diyalogları yerine; kamera, galeri ve bildirim izinlerinin neden istendiğini, şifreleme güvencelerini açıklayan şık cam efektli (Glassmorphic) Türkçe/İngilizce hazırlık modalleri.
- 💾 **Tam Yedekleme & Geri Yükleme (JSON Backup & Restore)**: Envanter verilerini tek dokunuşla JSON olarak dışa aktarma veya daha önce alınan yedekleri dosyadan içe aktararak bildirimleriyle birlikte anında geri yükleme.
- ⚙️ **Gelişmiş Ayarlar Merkezi**:
  - Özelleştirilebilir bildirim zamanlaması (`60`, `30`, `14`, `7`, `1` gün hapları)
  - Periyodik bakım ve servis hatırlatıcıları
  - Para birimi seçimi (`₺ TRY`, `$ USD`, `€ EUR`, `£ GBP`)
  - Standart garanti süresi ön tanımları (`12`, `24`, `36`, `60` ay)
  - KVKK, Gizlilik Politikası ve Kullanım Koşulları modali
- 📷 **Barkod & QR Kod Okuyucu**: Seri numaralarını ve ürün kodlarını kamerayla saniyeler içinde otomatik forma aktarma.
- 🔐 **Biyometrik Kimlik Doğrulama**: FaceID / TouchID / Parmak İzi ile uygulamayı kilitleme ve güvenli oturum açma.
- 🌓 **Dinamik Açık / Koyu Tema**: Sistem tercihiyle senkronize veya manuel seçilebilir modern Dark & Light Mode tasarımı.

---

### 📱 Ekranlar & Kullanıcı Deneyimi

| Ekran | Açıklama |
| :--- | :--- |
| **Giriş & Kayıt (Auth)** | E-posta/Şifre ile Supabase Auth doğrulaması, şifre sıfırlama, Biyometrik FaceID girişi. |
| **Ana Sayfa (Dashboard)** | Finansal özet, garanti durum sayaçları, son eklenen ürünler, hızlı işlem butonları. |
| **İnteraktif Grafikler** | Kategori bütçe dağılımı, donat grafik, etkileşimli filtreleme ve analitik metrikler. |
| **Ürünler (Envanter)** | Görsel kartlı grid/liste tasarımı, anlık arama, çoklu filtre (Kategori, Garanti durumu). |
| **Ürün Detay** | Ürün ve fatura fotoğrafları (tam ekran zoom), garanti bitiş sayacı, servis & mağaza bilgileri, QR/Barkod çıktısı. |
| **Ürün Ekle / Düzenle** | React Hook Form & Zod doğrulamalı, kamera ve galeriden görsel yüklemeli, otomatik tarih hesaplamalı form. |
| **Bildirim Merkezi** | Planlanmış garanti alarmları, periyodik servis hatırlatıcıları ve geçmiş bildirimler. |
| **Profil & Kimlik** | Profil fotoğrafı yükleme & görüntüleme, Garanti Sağlık Skoru, Sigorta PDF Raporu oluşturma. |
| **Ayarlar & Yedekleme** | Para birimi, hatırlatıcı sıklığı, yedek dışa/içe aktarma (Restore), KVKK & yasal sözleşmeler. |

---

### 🛠️ Teknoloji Mimarisi

- **Mobil Çekirdek**: React Native `0.86.3` / Expo SDK `57` / React `19.2.3`
- **Dil**: TypeScript `6.0` (Strict Type Safety)
- **Navigasyon**: `@react-navigation/native-stack` & `@react-navigation/bottom-tabs`
- **Grafik & Veri Görselleştirme**: `react-native-gifted-charts`, `react-native-svg`
- **Widget Altyapısı**: `react-native-android-widget`
- **Form & Doğrulama**: `react-hook-form`, `zod`, `@hookform/resolvers`
- **Kamera & Medya**: `expo-camera`, `expo-image-picker`, `expo-document-picker`
- **PDF & Paylaşım**: `expo-print`, `expo-sharing`, `expo-file-system`
- **Biyometrik Güvenlik**: `expo-local-authentication`, `expo-crypto`
- **Bildirimler**: `expo-notifications`
- **Tasarım & UI**: Vanilla StyleSheet, Lucide React Native, Expo Linear Gradient, Glassmorphism

---

### 🗄️ Veritabanı & Güvenlik (Supabase)

```
auth.users
  └── profiles (id, full_name, email, avatar_url, language, currency, created_at)
        └── products (id, user_id, category_id, name, brand, model, serial_number, 
                      purchase_date, purchase_price, warranty_end_date, store_name, 
                      description, image_path, invoice_path, created_at, updated_at)
              └── categories (id, name, icon, color, created_at)
```

- **Row Level Security (RLS)**: Veritabanı seviyesinde `auth.uid() = user_id` kuralı sayesinde her kullanıcı yalnızca kendi ürün ve belgelerine erişebilir.
- **Storage Buckets**:
  - `product-images`: Ürün fotoğrafları için güvenli depolama.
  - `invoices`: Fatura, fiş ve resmi garanti belgeleri için depolama.
  - `avatars`: Kullanıcı profil fotoğrafları için depolama.

---

### ⏳ Garanti Hesaplama & Bildirim Motoru

```
[Satın Alma Tarihi] ──── (Garanti Süresi: 12/24/36/60 Ay) ────► [Garanti Bitiş Tarihi]
                                                                        │
        ┌───────────────────────┬───────────────────────────────┬───────┴───────────────────────┐
        ▼                       ▼                               ▼                               ▼
   [> 30 Gün]             [1 - 30 Gün]                      [0 Gün]                         [< 0 Gün]
🟢 Garanti Devam Ediyor   🟡 Yakında Bitiyor           🔴 Bugün Sona Eriyor              ⚪ Garanti Bitti
(60g / 30g Uyarısı)     (14g / 7g Uyarısı)             (Son Gün Kritik Bildirimi)      (Arşiv & Servis Modu)
```

---

<a name="-english-documentation"></a>
## 🇬🇧 English Documentation

**envanterTakip** is an intelligent, full-featured Home Inventory and Warranty Tracking mobile application designed to digitize household electronics, appliances, and personal belongings while automating warranty tracking, receipt archival, and service schedules.

Built on React Native (Expo SDK 57), TypeScript, and Supabase, it delivers a high-performance native experience on both iOS and Android platforms.

---

### 🌟 Key Highlights

- 🌐 **Dual Language Support (TR / EN)**: Full localization with seamless in-app Turkish & English switching and localized notification schedules.
- 📊 **Interactive Category Analytics**: Donut and bar charts powered by `react-native-gifted-charts`. Tap any category slice to instantly drill down and filter matching products.
- 📱 **Home Screen Widgets (Android & iOS)**: Stay updated without launching the app. Real-time glanceable widget displays nearest expiring items, urgency colors, and active counts.
- 🛡️ **Warranty Health Score**: Dynamic algorithm evaluating total inventory coverage, protection ratios, and imminent warranty risks.
- 📄 **One-Click Official A4 PDF Export**: Instant export of insurance-ready A4 documentation complete with brand, serial numbers, invoice status, and warranty validity.
- 🔒 **In-App Permission Priming UI**: Eliminates abrupt English system dialogs with elegant, localized glassmorphic modals explaining permissions (Camera, Gallery, Notifications) before OS triggers.
- 💾 **JSON Backup & Cloud-Free Restore**: Zero lock-in. One-tap full database JSON export and complete file-based restoration with instant notification re-scheduling.
- ⚙️ **Comprehensive Settings & Preferences**:
  - Multi-tier alert thresholds (`60d`, `30d`, `14d`, `7d`, `1d`)
  - Periodic maintenance and cleaning reminders
  - Currency selector (`₺ TRY`, `$ USD`, `€ EUR`, `£ GBP`)
  - Default warranty duration presets (`12`, `24`, `36`, `60` months)
  - Legal compliance modal (KVKK, Privacy Policy, Terms of Service)
- 📷 **Barcode & QR Code Scanner**: Automatic serial number capture via device camera.
- 🔐 **Biometric Security**: Biometric lock screen supporting FaceID, TouchID, and Android Fingerprint.
- 🌓 **Adaptive Dark & Light Theme**: Polished dark mode palette adhering to WCAG contrast guidelines.

---

### 🗂️ Architecture & Folder Structure

```text
envanterTakip/
├── src/
│   ├── api/             # Supabase client and backend endpoints
│   ├── components/      # Reusable UI components & modals
│   │   ├── EditProfileModal.tsx
│   │   ├── ImportDataModal.tsx      # JSON backup restore workflow
│   │   ├── LegalModal.tsx           # KVKK & Privacy policy reader
│   │   ├── PermissionModal.tsx      # In-app localized permission priming
│   │   ├── ProductCard.tsx
│   │   └── ...
│   ├── constants/       # Color palettes, theme tokens, typography
│   ├── context/         # Auth, Theme, and App state contexts
│   ├── hooks/           # Custom React hooks (useTheme, useProducts)
│   ├── navigation/      # Stack & Tab Navigators
│   ├── screens/         # Main & Auth views
│   │   ├── auth/        # Login, Register, ForgotPassword
│   │   └── main/        # Home, Products, Detail, Profile, Settings, Analytics
│   ├── services/        # Product, Notification, PDF, and Storage services
│   ├── types/           # TypeScript interfaces & database schemas
│   ├── utils/           # Date helpers, permissionHelper, appPreferencesHelper
│   └── widgets/         # Android & iOS Home Screen Widget providers
├── database/            # Supabase SQL migration files & RLS policies
├── assets/              # App icons, splash screens, sample invoices
├── app.json             # Expo config & native permission descriptions
└── package.json         # Dependencies and scripts
```

---

### ⚡ Kurulum ve Çalıştırma / Quick Start

#### 1. Bağımlılıkları Yükleyin / Install Dependencies
```bash
npm install
```

#### 2. Çevresel Değişkenleri Ayarlayın / Configure Environment
Kök dizinde `.env` dosyası oluşturup Supabase proje bilgilerinizi ekleyin:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 3. Supabase Veritabanını Başlatın / Database Setup
`database/schema.sql` dosyasındaki SQL sorgularını Supabase Dashboard > SQL Editor alanında çalıştırarak tabloları, RLS kurallarını ve Storage bucket'larını etkinleştirin.

#### 4. Uygulamayı Başlatın / Run the App
```bash
# Metro geliştirici sunucusunu başlat
npx expo start

# Android simülatör / cihaz
npx expo run:android

# iOS simülatör / cihaz
npx expo run:ios
```

---

### 📅 Yol Haritası & Sürüm Durumu / Feature Roadmap

- [x] 🌐 Çoklu Dil Desteği (TR / EN Language Support)
- [x] 📊 İnteraktif Kategori Grafikleri (Interactive Donut & Bar Charts)
- [x] 📱 Ana Ekran Widget Desteği (Home Screen Widgets)
- [x] 📄 Tek Tıkla A4 PDF Envanter & Sigorta Raporu (PDF Generation & Share)
- [x] 💾 JSON Veri Yedekleme & Geri Yükleme (Backup & Restore Manager)
- [x] 🛡️ Garanti Sağlık Skoru Panosu (Warranty Health Gauge)
- [x] 🔒 Uygulama İçi Şık İzin Yönetimi (Contextual In-App Permission Priming)
- [x] 📷 Barkod & QR Kod ile Seri No Okuma (Barcode & QR Scanner)
- [x] 🔐 Biyometrik Güvenlik (FaceID / TouchID / Fingerprint)
- [x] 🌓 Dinamik Koyu / Açık Tema (Dark & Light Mode)
- [x] ⏳ Akıllı Bildirim Zamanlaması (60, 30, 14, 7, 1 gün eşikleri)
- [x] 📜 KVKK, Gizlilik Politikası & Yasal Bilgilendirme Modali

---

### 📄 Lisans / License

Bu proje **MIT Lisansı** altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına göz atabilirsiniz.

---

<p align="center">
  Geliştirici: <b>Ömer Çanakçı</b> • <a href="https://github.com/omercnkc">GitHub Profile</a>
</p>
