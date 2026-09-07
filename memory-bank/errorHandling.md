# Error Handling & User-Facing Error Messaging Guidelines

Bu doküman, uygulamada karşılaşılan tüm teknik, ağ, veritabanı ve doğrulama hatalarının kullanıcıya sunulma standartlarını tanımlar. 

---

## 1. 🎯 Temel İlkeler (Core Principles)

### 1.1. Bilgi Sızıntısını Önleme (Zero Information Leakage)
- Kullanıcıya asla SQL sorgu detayları, PostgreSQL hata kodları (örn: `23505`, `PGRST116`), tablo/kolon adları, Supabase API endpoint'leri veya iç kütüphane yığın izleri (stack trace) gösterilmez.
- **Neden?** Hem uygulamanın güvenlik açığı vermemesi (security through obscurity & defensive design) hem de profesyonel kurumsal kullanıcı deneyimi sağlanması içindir.

### 1.2. Eyleme Yönlendirici Mesaj Deseni (Action-Oriented Messaging)
Kullanıcıya verilen mesaj şu 2 parçadan oluşmalıdır:
1. **Durum Tespiti (Ne oldu?):** Sade, suçlayıcı olmayan, net bir açıklama.
2. **Çözüm Önerisi (Ne yapmalı?):** Kullanıcının tıkanmasını önleyen yönlendirici tavsiye.

---

## 2. 📋 Hata Dönüşüm Sözlüğü & Standart Eşleştirmeler

| Hata Türü / Teknik Kaynak | ❌ Asla Gösterilmeyecek Mesaj | ✅ Kullanıcıya Gösterilecek Modern Mesaj |
| :--- | :--- | :--- |
| **Hatalı Giriş Bilgileri** | `AuthApiError: Invalid login credentials` veya `400 Bad Request` | **"E-posta adresi veya şifreniz eşleşmiyor."**<br>*Öneri:* "Bilgilerinizi kontrol edip tekrar deneyebilir veya şifrenizi sıfırlayabilirsiniz." |
| **Mükerrer E-posta (Kayıt)** | `23505: duplicate key value in auth.users_email_key` | **"Bu e-posta adresi ile kayıtlı bir hesap zaten bulunuyor."**<br>*Öneri:* "Giriş yapmayı deneyebilir veya farklı bir e-posta kullanabilirsiniz." |
| **Zayıf Şifre** | `Password should be at least 6 characters` | **"Şifreniz güvenlik standartlarını karşılamıyor."**<br>*Öneri:* "Lütfen en az 6 karakterden oluşan güçlü bir şifre belirleyin." |
| **Ağ / Bağlantı Kopması** | `Network request failed / TypeError: Failed to fetch` | **"İnternet bağlantısı kurulamadı."**<br>*Öneri:* "Lütfen ağ bağlantınızı kontrol edip sayfayı yenileyin." |
| **Oturum Süresi Dolması** | `JWT expired / 401 Unauthorized` | **"Oturum süreniz sona erdi."**<br>*Öneri:* "Güvenliğiniz için lütfen tekrar giriş yapın." |
| **Storage / Dosya Boyutu** | `PayloadTooLargeError: 413 file exceeds 5MB` | **"Seçtiğiniz dosya boyutu çok yüksek."**<br>*Öneri:* "Lütfen daha küçük boyutlu bir görsel seçin (maksimum 5 MB)." |
| **Storage / Desteklenmeyen Format** | `Invalid mime type application/x-msdownload` | **"Bu dosya formatı desteklenmiyor."**<br>*Öneri:* "Lütfen JPG, PNG veya PDF formatında bir belge yükleyin." |
| **Veritabanı / Kayıt Bulunamadı** | `PGRST116: JSON object requested, multiple (or no) rows returned` | **"Aradığınız ürün veya kayıt bulunamadı."**<br>*Öneri:* "Silinmiş veya taşınmış olabilir. Varlık listenizi kontrol edin." |
| **Mükerrer Seri No (Ürün)** | `duplicate key violates idx_products_serial_number` | **"Bu seri numarasına sahip bir ürün zaten kayıtlı."**<br>*Öneri:* "Lütfen seri numarasını kontrol edin veya mevcut ürünü güncelleyin." |
| **Kamera / Galeri İzin Reddi** | `Permission Denied: Camera hardware missing or rejected` | **"Fotoğraf çekebilmek için kamera izni gerekiyor."**<br>*Öneri:* "Cihazınızın Ayarlar menüsünden uygulamaya izin verebilirsiniz." |
| **Beklenmeyen Sunucu Hatası** | `500 Internal Server Error / Database exception` | **"İşleminiz şu anda gerçekleştirilemiyor."**<br>*Öneri:* "Kısa bir süre sonra tekrar deneyebilir veya destek ekibimizle iletişime geçebilirsiniz." |

---

## 3. 🛠️ Kod İçi Hata Yönetimi Mimarisi

### 3.1. Servis ve Hook Katmanı Standardı
- Ham hatalar `try-catch` bloklarında yakalanır.
- Geliştirme ortamında (`__DEV__`) teknik hata detayları `console.error` ile loglanır.
- Kullanıcı katmanına sadece `formatAppError(error)` ile normalize edilmiş `{ message, suggestion }` döndürülür.

```typescript
// Örnek Servis Çağrısı:
try {
  const { data, error } = await supabase.from('products').insert(...);
  if (error) throw error;
  return { success: true, data };
} catch (rawError) {
  if (__DEV__) {
    console.error('[ProductService.createProduct Error]:', rawError);
  }
  const formatted = formatAppError(rawError);
  return {
    success: false,
    error: formatted.message,
    suggestion: formatted.suggestion,
  };
}
```

### 3.2. UI Katmanında Gösterim Kuralları
- **Inline Alan Hataları:** Doğrudan ilgili input'un altında kırmızı açıklama olarak (Zod validasyon mesajları).
- **Form / İşlem Hataları:** Kart içerisinde uyarı kutusu (Banner) veya Snackbar/Toast olarak; hem durum hem öneri metniyle birlikte.
- **Diyalog / Kritik Hatalar:** Geri alınamaz veya kritik veri kaybı durumlarında "Tekrar Dene" ve "İptal" butonları içeren modal ile.

---

## 4. 🤖 Agent Davranış Kuralı (Agent Execution Rule)
1. Kod yazarken veya düzenlerken **ASLA** `alert(error.message)` veya ham API hata nesnelerini UI'a yansıtma.
2. Tüm hata yakalama süreçlerinde `src/utils/errorHandler.ts` içerisindeki merkezi `formatAppError` fonksiyonunu kullan.
3. Hata mesajının hem **Ne olduğunu** hem de kullanıcıya **Ne yapması gerektiğini** belirttiğinden emin ol.
