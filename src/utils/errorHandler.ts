/**
 * Merkezi Hata Yönetimi ve Kullanıcı Dostu Mesaj Dönüştürücü
 * memory-bank/errorHandling.md standartlarına uygun olarak tasarlanmıştır.
 * Teknik detayları maskeler, kullanıcıya durum tespiti ve eyleme yönelik öneri sunar.
 */

export interface FormattedError {
  /** Kullanıcıya gösterilecek durum tespiti (Ne oldu?) */
  message: string;
  /** Kullanıcıya gösterilecek çözüm önerisi (Ne yapmalı?) */
  suggestion?: string;
  /** Mesaj ve önerinin birleştirilmiş tek satırlık hali */
  fullMessage: string;
}

/**
 * Ham hata nesnelerini (Supabase, Fetch, JS Error vb.) kullanıcı dostu,
 * güvenli ve yönlendirici mesajlara dönüştürür.
 */
export const formatAppError = (error: unknown): FormattedError => {
  if (!error) {
    return {
      message: 'Beklenmeyen bir hata oluştu.',
      suggestion: 'Lütfen kısa bir süre sonra tekrar deneyin.',
      fullMessage: 'Beklenmeyen bir hata oluştu. Lütfen kısa bir süre sonra tekrar deneyin.',
    };
  }

  // Geliştirme ortamında teknik hatayı konsola bas (Prodüksiyonda sızdırılmaz)
  if (__DEV__) {
    console.warn('[Technical Error Log]:', error);
  }

  const rawMessage =
    typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message: unknown }).message)
      : String(error);

  const rawString = String(rawMessage).toLowerCase();

  // 1. Kimlik Doğrulama Hataları
  if (
    rawString.includes('email not confirmed') ||
    rawString.includes('email_not_confirmed') ||
    rawString.includes('email address not confirmed')
  ) {
    return {
      message: 'E-posta adresiniz henüz doğrulanmamış.',
      suggestion: 'Lütfen gelen kutunuzdaki (veya spam klasöründeki) doğrulama bağlantısına tıklayarak hesabınızı aktif edin.',
      fullMessage:
        'E-posta adresiniz henüz doğrulanmamış. Lütfen gelen kutunuzdaki (veya spam klasöründeki) doğrulama bağlantısına tıklayarak hesabınızı aktif edin.',
    };
  }

  if (
    rawString.includes('invalid login credentials') ||
    rawString.includes('invalid_grant') ||
    rawString.includes('invalid credentials') ||
    rawString.includes('invalid username or password') ||
    rawString.includes('invalid email or password') ||
    rawString.includes('bad credentials')
  ) {
    return {
      message: 'E-posta adresi veya şifreniz eşleşmiyor.',
      suggestion: 'Bilgilerinizi kontrol edebilir veya "Şifremi Unuttum" adımından şifrenizi sıfırlayabilirsiniz.',
      fullMessage:
        'E-posta adresi veya şifreniz eşleşmiyor. Bilgilerinizi kontrol edebilir veya "Şifremi Unuttum" adımından sıfırlayabilirsiniz.',
    };
  }

  if (
    rawString.includes('user not found') ||
    rawString.includes('user_not_found')
  ) {
    return {
      message: 'Bu e-posta adresi ile kayıtlı bir hesap bulunamadı.',
      suggestion: 'Lütfen e-posta adresinizi kontrol edin veya yeni bir hesap oluşturun.',
      fullMessage:
        'Bu e-posta adresi ile kayıtlı bir hesap bulunamadı. Lütfen e-posta adresinizi kontrol edin veya yeni bir hesap oluşturun.',
    };
  }

  if (
    rawString.includes('user already registered') ||
    rawString.includes('already registered') ||
    rawString.includes('user_already_exists') ||
    rawString.includes('unique_email')
  ) {
    return {
      message: 'Bu e-posta adresi ile kayıtlı bir hesap zaten bulunuyor.',
      suggestion: 'Mevcut hesabınızla giriş yapabilir veya farklı bir e-posta adresi kullanabilirsiniz.',
      fullMessage:
        'Bu e-posta adresi ile kayıtlı bir hesap zaten bulunuyor. Mevcut hesabınızla giriş yapabilir veya farklı bir e-posta kullanabilirsiniz.',
    };
  }

  if (
    rawString.includes('signups not allowed') ||
    rawString.includes('signup is disabled')
  ) {
    return {
      message: 'Yeni kullanıcı kaydı şu anda kapalıdır.',
      suggestion: 'Lütfen sistem yöneticisi ile iletişime geçin.',
      fullMessage: 'Yeni kullanıcı kaydı şu anda kapalıdır. Lütfen sistem yöneticisi ile iletişime geçin.',
    };
  }

  if (
    rawString.includes('password should be at least') ||
    rawString.includes('weak password') ||
    rawString.includes('password is too short')
  ) {
    return {
      message: 'Belirlediğiniz şifre güvenlik kriterlerine uymuyor.',
      suggestion: 'Lütfen en az 4 karakterden oluşan bir şifre belirleyin.',
      fullMessage: 'Belirlediğiniz şifre güvenlik kriterlerine uymuyor. Lütfen en az 4 karakter kullanın.',
    };
  }

  if (
    rawString.includes('rate limit') ||
    rawString.includes('too many requests') ||
    rawString.includes('over_email_send_rate_limit') ||
    rawString.includes('over_request_rate_limit')
  ) {
    return {
      message: 'Çok fazla deneme yapıldı.',
      suggestion: 'Güvenliğiniz için lütfen birkaç dakika bekleyip tekrar deneyin.',
      fullMessage: 'Çok fazla deneme yapıldı. Güvenliğiniz için lütfen birkaç dakika bekleyip tekrar deneyin.',
    };
  }

  // 2. Ağ ve Bağlantı Hataları
  if (
    rawString.includes('network request failed') ||
    rawString.includes('failed to fetch') ||
    rawString.includes('networkerror') ||
    rawString.includes('timeout')
  ) {
    return {
      message: 'İnternet bağlantısı kurulamadı.',
      suggestion: 'Lütfen ağ bağlantınızı kontrol edip tekrar deneyin.',
      fullMessage: 'İnternet bağlantısı kurulamadı. Lütfen ağınızı kontrol edip tekrar deneyin.',
    };
  }

  // 3. Oturum & Yetkilendirme Hataları
  if (
    rawString.includes('jwt expired') ||
    rawString.includes('invalid token') ||
    rawString.includes('unauthorized') ||
    rawString.includes('401')
  ) {
    return {
      message: 'Oturum süreniz sona erdi.',
      suggestion: 'Güvenliğiniz için lütfen tekrar giriş yapın.',
      fullMessage: 'Oturum süreniz sona erdi. Güvenliğiniz için lütfen tekrar giriş yapın.',
    };
  }

  // 4. Depolama (Storage) ve Görsel Hataları
  if (
    rawString.includes('bucket not found') ||
    rawString.includes('the resource was not found') ||
    rawString.includes('bucket_not_found')
  ) {
    return {
      message: 'Depolama alanı (bucket) bulunamadı.',
      suggestion: 'Supabase yönetim panelinden storage bucket kurulumunu kontrol edebilirsiniz.',
      fullMessage:
        'Depolama alanı (bucket) bulunamadı. Lütfen Supabase Storage ayarlarını kontrol edin.',
    };
  }

  if (
    rawString.includes('row-level security policy for table "objects"') ||
    rawString.includes('violates row-level security policy')
  ) {
    return {
      message: 'Dosya yükleme erişim izni reddedildi.',
      suggestion: 'Supabase Storage RLS politikalarının oluşturulduğundan emin olun.',
      fullMessage:
        'Dosya yükleme erişim izni reddedildi. Supabase Storage RLS politikalarını kontrol edin.',
    };
  }

  if (rawString.includes('payload too large') || rawString.includes('413')) {
    return {
      message: 'Yüklemeye çalıştığınız dosya boyutu çok büyük.',
      suggestion: 'Lütfen daha küçük boyutlu bir görsel veya belge seçin (Maksimum 5 MB).',
      fullMessage:
        'Yüklemeye çalıştığınız dosya boyutu çok büyük. Lütfen daha küçük boyutlu bir görsel seçin (Maksimum 5 MB).',
    };
  }

  if (rawString.includes('mime type') || rawString.includes('unsupported file')) {
    return {
      message: 'Seçilen dosya formatı desteklenmiyor.',
      suggestion: 'Lütfen JPG, PNG veya PDF formatında bir dosya yükleyin.',
      fullMessage: 'Seçilen dosya formatı desteklenmiyor. Lütfen JPG, PNG veya PDF formatında bir dosya yükleyin.',
    };
  }

  // 5. Veritabanı & Mükerrer Kayıt Hataları
  if (rawString.includes('serial_number') || rawString.includes('23505')) {
    return {
      message: 'Bu seri numarasına sahip bir ürün zaten kayıtlı.',
      suggestion: 'Lütfen seri numarasını kontrol edin veya var olan ürünü güncelleyin.',
      fullMessage:
        'Bu seri numarasına sahip bir ürün zaten kayıtlı. Lütfen seri numarasını kontrol edin.',
    };
  }

  if (rawString.includes('pgrst116') || rawString.includes('not found')) {
    return {
      message: 'İlgili kayıt bulunamadı.',
      suggestion: 'Kayıt silinmiş veya taşınmış olabilir. Varlık listenizi yenileyin.',
      fullMessage: 'İlgili kayıt bulunamadı. Kayıt silinmiş veya taşınmış olabilir.',
    };
  }

  // 6. Donanım ve İzin Hataları
  if (rawString.includes('permission') || rawString.includes('camera') || rawString.includes('media')) {
    return {
      message: 'Gerekli cihaz erişim izni verilmedi.',
      suggestion: 'İşleme devam edebilmek için telefonunuzun Ayarlar bölümünden izinleri açabilirsiniz.',
      fullMessage:
        'Gerekli cihaz erişim izni verilmedi. Ayarlar bölümünden kamera ve galeri izinlerini açabilirsiniz.',
    };
  }

  // 7. Genel Güvenli Fallback
  return {
    message: 'İşleminiz şu anda gerçekleştirilemiyor.',
    suggestion: 'Lütfen kısa bir süre sonra tekrar deneyin.',
    fullMessage: 'İşleminiz şu anda gerçekleştirilemiyor. Lütfen kısa bir süre sonra tekrar deneyin.',
  };
};
