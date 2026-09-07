# Product Context: Ev Envanter & Garanti Takip

## 1. Bu Proje Neden Var? (Problem Tanımı)
Modern evlerde onlarca elektronik alet, beyaz eşya ve mobilya bulunmaktadır. Ancak kullanıcılar:
- Ürünlerin faturalarını fiziksel olarak kaybeder veya fişlerin mürekkepleri solar.
- Garanti sürelerinin ne zaman bittiğini unutur, arıza durumunda garanti avantajlarını kaçırır.
- Evdeki eşyaların toplam değerini, seri numaralarını veya mağaza bilgilerini tek bir merkezde göremez.
- Garanti bitimine az süre kala bakım veya onarım yaptırma fırsatını değerlendiremez.

## 2. Çözülen Problemler ve Sunulan Çözüm
- **Dijital Fatura & Ürün Arşivi**: Kağıt fişler yerine kamera ile çekilen veya galeriden yüklenen faturalar Supabase Storage üzerinde güvenle saklanır.
- **Otomatik Süre Hesaplama**: Satın alma tarihi ve garanti süresi girildiğinde sistem garanti bitiş tarihini ve kalan gün sayısını anında hesaplar.
- **Proaktif Hatırlatıcılar**: Garanti bitimine 30 gün, 7 gün ve 1 gün kala kullanıcının cihazına yerel bildirim gönderilir.
- **Hızlı Erişim & Sorgulama**: Marka, model veya seri no ile arama yapılabilir, barkod/QR kod tarayıcı ile saniyeler içinde ürün bulunabilir.
- **Veri Güvenliği**: Supabase RLS (Row Level Security) ile her kullanıcı yalnızca kendi ürünlerine ve belgelerine erişir.

## 3. Kullanıcı Deneyimi (UX) Hedefleri
- **Kullanımı Kolay & Hızlı**: Az adımlı ürün ekleme/düzenleme, akıllı tarih hesaplayıcılar.
- **Görsel & Anlaşılır Durum Rozetleri**: Yeşil (Devam Ediyor), Sarı (Yakında Bitiyor), Kırmızı (Bitti) rozetleriyle tek bakışta durum tespiti.
- **Empty & Loading Durumları**: Ürün yokken motive edici boş durum ekranları ("Henüz ürününüz yok, ilk ürününüzü ekleyin"), işlemler sırasında akıcı yüklenme göstergeleri.
- **Hata Toleransı & Anlaşılır Mesajlar**: Teknik veritabanı hataları yerine sade ve rehberlik eden kullanıcı dostu bildirimler.
- **Modern Tasarım & Dark Mode**: Göz yormayan, estetik, açık ve koyu tema desteği sunan mobil arayüz.

## 4. Temel Kullanıcı Akışları
1. **Oturum Akışı**: Kayıt Ol -> Giriş Yap -> Ana Sayfa / Dashboard.
2. **Ürün Ekleme Akışı**: + Butonu -> Bilgileri Doldur -> Kamera/Galeri ile Fotoğraf & Fatura Ekle -> Kaydet.
3. **Detay & İnceleme Akışı**: Listeden Ürüne Tıkla -> Detayları, Kalan Garanti Gününü, Fatura Görselini Gör -> İhtiyaç halinde Düzenle veya Sil.
4. **Filtreleme & Arama Akışı**: Arama çubuğuna yaz veya "Yakında Bitiyor" / "Beyaz Eşya" filtrelerine basarak hedeflenen ürünleri anında listele.
