# System Patterns: Ev Envanter & Garanti Takip

## 1. Sistem Mimarisi Genel Bakış
Uygulama, React Native (Expo) istemcisi ve BaaS (Backend-as-a-Service) olarak Supabase kullanan katmanlı bir mimari üzerine kuruludur.

```
┌─────────────────────────────────────────────────────────────┐
│                 React Native (Expo SDK 54)                  │
│  ┌────────────────────┐ ┌─────────────────────────────────┐ │
│  │ Navigation Layer   │ │ Context / State Layer           │ │
│  │ (Auth & Main Stack)│ │ (AuthContext, InventoryContext) │ │
│  └─────────┬──────────┘ └────────────────┬────────────────┘ │
│            │                             │                  │
│  ┌─────────▼─────────────────────────────▼────────────────┐ │
│  │ Screens & UI Components (Cards, Badges, Modals, Forms) │ │
│  └─────────────────────────┬──────────────────────────────┘ │
│                            │                                │
│  ┌─────────────────────────▼──────────────────────────────┐ │
│  │ Service & API Layer (Supabase Client, Storage, Notif)  │ │
│  └─────────────────────────┬──────────────────────────────┘ │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTPS / WebSocket (RLS Enabled)
┌────────────────────────────▼────────────────────────────────┐
│                       Supabase Cloud                        │
│  ┌───────────────┐  ┌─────────────────┐  ┌────────────────┐ │
│  │ Supabase Auth │  │ PostgreSQL (DB) │  │ Storage Engine │ │
│  │ (auth.users)  │  │ (RLS Policies)  │  │ (2 Buckets)    │ │
│  └───────────────┘  └─────────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 2. Navigasyon Mimarisi (React Navigation)
- **Auth Stack**:
  - `Splash`: Oturum kontrolü ve yönlendirme
  - `Login`: E-posta ve şifre ile giriş
  - `Register`: Yeni kullanıcı kaydı
  - `ForgotPassword`: Şifre sıfırlama e-postası gönderme
- **Main App (Bottom Tabs + Root Stack)**:
  - **Tabs**:
    - `HomeTab` (Dashboard / Özet İstatistikler)
    - `ProductsTab` (Ürün Listesi / Arama / Filtreleme)
    - `AddProductTab` (Yeni Ürün Ekleme)
    - `ProfileTab` (Profil, Ayarlar, Çıkış)
  - **Stack Screens**:
    - `ProductDetail`: Ürün detayları ve fatura görünümü
    - `EditProduct`: Var olan ürünü düzenleme
    - `FilterModal` / `SearchScreen`: Gelişmiş filtreleme ve arama

## 3. Veritabanı ve Güvenlik Modeli (RLS)
- **Tablolar**:
  - `profiles`: `id (UUID = auth.users.id)`, `full_name`, `email`, `created_at`
  - `categories`: `id (SERIAL)`, `name`, `icon`, `created_at`
  - `products`: `id (UUID)`, `user_id (UUID)`, `category_id (INT)`, `name`, `brand`, `model`, `serial_number`, `purchase_date`, `purchase_price`, `warranty_end_date`, `store_name`, `description`, `image_path`, `invoice_path`, `created_at`, `updated_at`
- **Row Level Security (RLS)**:
  - `products` tablosunda `ENABLE ROW LEVEL SECURITY;`
  - `SELECT`, `INSERT`, `UPDATE`, `DELETE` politikaları: `auth.uid() = user_id`

## 4. Medya ve Depolama Stratejisi (Supabase Storage)
- İki ayrı bucket:
  - `product-images`: Ürün fotoğrafları
  - `invoices`: Fatura ve fiş belgeleri
- Dosya isimlendirme formatı: `${user_id}/${uuid}_${filename}` (çakışmaları önlemek ve benzersizlik sağlamak için).
- Görsel yükleme akışı:
  1. `expo-image-picker` ile görsel seçilir / çekilir.
  2. Dosya `base64` veya `ArrayBuffer` formatına dönüştürülür.
  3. Supabase Storage bucket'ına yüklenir.
  4. Dönen `path` veya public URL veritabanındaki `products` kaydına yazılır.
  5. Ürün silindiğinde ilişkili storage dosyaları da temizlenir.

## 5. Garanti Hesaplama ve Bildirim Mantığı
- **Garanti Durumu**:
  - `daysLeft = differenceInDays(warranty_end_date, today)`
  - `daysLeft > 30` -> `active` (Garanti Devam Ediyor - Yeşil)
  - `daysLeft >= 1 && daysLeft <= 30` -> `expiring_soon` (Yakında Bitiyor - Sarı)
  - `daysLeft <= 0` -> `expired` (Garanti Bitti - Kırmızı)
- **Bildirimler**:
  - Ürün kaydedildiğinde/güncellendiğinde `warranty_end_date` baz alınarak 30 gün, 7 gün ve 1 gün öncesine `expo-notifications` ile yerel zamanlanmış bildirimler (`scheduleNotificationAsync`) kurulur.

## 6. Form Yönetimi ve Validasyon Deseni
- **React Hook Form + Zod**:
  - Form validasyon şeması Zod ile tanımlanır.
  - Zorunlu alanlar: Ürün Adı, Garanti Bitiş Tarihi.
  - Tarih tutarlılığı: `warranty_end_date >= purchase_date`.
  - Sayısal kontroller: `purchase_price >= 0`.
