# Project Brief: envanterTakip (Ev Envanter & Garanti Takip)

## 1. Proje Genel Bakışı
- **Proje Adı**: envanterTakip (Ev Envanter & Garanti Takip)
- **GitHub**: [omercnkc/envanterTakip](https://github.com/omercnkc/envanterTakip)
- **Platform**: Mobil (iOS & Android)
- **Teknoloji**: React Native (Expo SDK 57, TypeScript) + Supabase (BaaS)
- **Kapsam**: 1 Aylık React Native + Supabase Staj Projesi

## 2. Temel Hedefler & Amaç
Kullanıcıların sahip oldukları elektronik cihazları, ev eşyalarını ve diğer ürünleri dijital ortamda kayıt altına almalarını, garanti sürelerini otomatik hesaplayarak proaktif bildirimlerle takip etmelerini ve ürün/fatura fotoğraflarını güvenli şekilde bulutta (Supabase Storage) saklamalarını sağlamak.

## 3. Ana Özellikler & Fonksiyonlar
1. **Kullanıcı Sistemi (Authentication)**: E-posta ve şifre ile Kayıt, Giriş, Çıkış ve Şifre Sıfırlama.
2. **Kişiselleştirilmiş Güvenlik (Row Level Security - RLS)**: Kullanıcılar yalnızca kendi ekledikleri ürünleri görebilir, ekleyebilir, düzenleyebilir ve silebilir.
3. **Ana Sayfa / Dashboard**: Toplam ürün, devam eden garanti, biten garanti, yaklaşan garanti sayaçları ve son eklenen ürünler listesi.
4. **Ürün Yönetimi (CRUD)**: Ürün adı, marka, model, kategori, seri no, satın alma tarihi, fiyatı, mağaza, açıklama, ürün ve fatura görseli alanları.
5. **Kategori Mimarisi**: Televizyon, Bilgisayar, Telefon, Tablet, Beyaz Eşya, Küçük Ev Aletleri, Mobilya, Mutfak, Oyun/Konsol, Diğer.
6. **Medya & Depolama**: Kamera çekimi veya galeriden görsel seçimi (Expo ImagePicker) ile Supabase Storage (`product-images` ve `invoices`) entegrasyonu.
7. **Otomatik Garanti Durumu**: Devam Eden (>30 gün), Yakında Bitiyor (<=30 gün), Bitti (<=0 gün) durumlarının anlık hesaplanması.
8. **Arama & Filtreleme**: İsim, marka, model, seri numarası bazlı anlık arama; kategori ve garanti durumuna göre çoklu filtreleme.
9. **Bildirim Sistemi**: Expo Notifications ile garanti bitimine 30 gün, 7 gün ve 1 gün kala hatırlatıcı bildirimler.
10. **Profil & Ayarlar**: Kullanıcı bilgileri, bildirim tercihleri, tema (Açık/Koyu mod) ve oturum yönetimi.

## 4. 4 Haftalık Staj Yol Haritası
- **1. Hafta – Altyapı**: Expo + TypeScript, Supabase Auth & DB tabloları, Navigation, Temel UI.
- **2. Hafta – Ürün İşlemleri**: Kategori yapısı, Ürün CRUD, Form validasyonları (React Hook Form/Zod), Arama.
- **3. Hafta – Fotoğraf & Garanti**: Kamera/galeri entegrasyonu, Supabase Storage, Garanti hesaplamaları ve Bildirimler.
- **4. Hafta – Tamamlama & Teslimat**: Dashboard, Profil/Ayarlar, RLS kontrolleri, Empty/Loading/Error durumları, Dokümantasyon, APK çıktısı.

## 5. Başarı ve Teslim Kriterleri
- Çalışan React Native mobil uygulaması (Expo / APK).
- Supabase veritabanı şeması ve RLS güvenlik kuralları.
- Kapsamlı `README.md` ve `memory-bank` dokümantasyonu.
- Temiz, modüler, tip güvenli TypeScript kod tabanı ve düzenli Git commit geçmişi.
