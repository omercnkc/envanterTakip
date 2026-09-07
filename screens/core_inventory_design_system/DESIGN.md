---
name: Core Inventory Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#464554'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#5c5f60'
  on-secondary: '#ffffff'
  secondary-container: '#e1e3e4'
  on-secondary-container: '#626566'
  tertiary: '#006c49'
  on-tertiary: '#ffffff'
  tertiary-container: '#00885d'
  on-tertiary-container: '#000703'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e1e3e4'
  secondary-fixed-dim: '#c5c7c8'
  on-secondary-fixed: '#191c1d'
  on-secondary-fixed-variant: '#454748'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 1rem
  gutter: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 1.5rem
  section-gap: 2rem
---

## Marka ve Stil
Bu tasarım sistemi, kullanıcıların varlıklarını ve garanti süreçlerini yönetmelerine yardımcı olan güvenilir, verimli ve modern bir SaaS estetiği üzerine inşa edilmiştir. Görsel dil, "Safe" (Güvenli) vizyonuna sadık kalarak, tanıdık hiyerarşiler ve temiz bir arayüz ile kullanıcıda profesyonellik ve kontrol hissi uyandırmayı hedefler.

**Stil Karakteri:**
- **Kurumsal / Modern:** Net çizgiler, dengeli boşluk kullanımı ve işlevsel bir yapı.
- **Güven Odaklı:** Karmaşadan uzak, veriyi ön plana çıkaran ve okunabilirliği en üst düzeye çıkaran bir yaklaşım.
- **Hiyerarşik:** Bilginin önem sırasına göre tonlamalarla ayrıştırıldığı, sezgisel bir düzen.

## Renkler
Renk paleti, eylem ve bildirimleri birbirinden net bir şekilde ayırmak için tasarlanmıştır.

- **Birincil (Indigo):** Markanın ana rengidir. Butonlar, aktif durumlar ve önemli vurgular için kullanılır.
- **Yüzey ve Arka Plan:** Uygulama, katmanlı bir derinlik hissi yaratmak için `#F3F4F6` (açık gri) arka plan üzerinde `#FFFFFF` (saf beyaz) kart yapılarını kullanır.
- **Durum Renkleri:** Garanti süreleri ve sistem uyarıları için semantik renkler (Yeşil: Devam ediyor, Turuncu: Yaklaşıyor, Kırmızı: Süresi doldu) kritik öneme sahiptir.
- **Nötr Tonlar:** Metin hiyerarşisi ve simgeler için gri skalası kullanılarak görsel gürültü azaltılır.

## Tipografi
Tasarım sistemi, başlıklar için karakter sahibi **Plus Jakarta Sans**, gövde metinleri için ise yüksek okunabilirlik sunan **Inter** fontunu kullanır.

- **Başlıklar:** Kullanıcıyı karşılayan ana mesajlar ve ekran başlıkları için kullanılır. Kalın (Bold) ve yarı-kalın (Semi-bold) ağırlıklar tercih edilir.
- **Gövde Metni:** Ürün detayları ve açıklamalar için Inter fontu, düşük göz yorgunluğu ve netlik sağlar.
- **Etiketler:** Küçük boyutlu metinlerde (tarihler, kategoriler) okunabilirliği artırmak için hafif genişletilmiş harf aralığı uygulanır.

## Yerleşim ve Boşluklar
Uygulama, mobil öncelikli bir ızgara yapısını benimser.

- **Kenar Boşlukları:** Ekranın sağından ve solundan 16px (1rem) sabit boşluk bırakılır.
- **Kart Yapısı:** Bileşenler arası dikey boşluklarda 16px standarttır; ancak ilişkili gruplarda 8px (0.5rem) tercih edilir.
- **Hizalama:** Tüm öğeler sol kenara hizalanır; sayısal veriler ve eylem okları genellikle sağa yaslı konumlandırılır.

## Derinlik ve Katmanlar
Derinlik, karmaşık gölgeler yerine tonal katmanlar ve çok hafif gölge efektleri (soft shadows) ile sağlanır.

- **Yüzey Katmanları:** Ana uygulama arka planı en alt katmandır. Kartlar, bu arka plan üzerinde beyaz dolgulu ve 4px-8px blur değerine sahip, %5 opaklıklı siyah gölgelerle yükseltilir.
- **Ayırıcılar:** Çok ince (1px) ve düşük kontrastlı gri çizgiler, kart içindeki bilgileri bölmek için kullanılır.
- **Odak Durumu:** Giriş alanları veya seçili kartlar, birincil renk olan mor ile ince bir çerçeve veya dolgu alarak öne çıkarılır.

## Formlar ve Köşeler
Yumuşak ve modern bir görünüm için orta düzeyde yuvarlatılmış köşeler kullanılır.

- **Standart Bileşenler:** Butonlar, giriş alanları ve küçük kartlar 8px (0.5rem) köşe yarıçapına sahiptir.
- **Geniş Konteynırlar:** Ana panel kartları ve modal yapılarında 16px (1rem) köşe yarıçapı tercih edilerek daha yumuşak bir çerçeveleme sağlanır.
- **Tam Yuvarlak:** Bildirim rozetleri ve profil resimleri tam daire (pill-shaped) formundadır.

## Bileşenler

**1. Kartlar (Cards):**
Beyaz arka plana sahip, 16px yuvarlatılmış köşeli yapılar. Ürün listelerinde görsel sol tarafta, metinler ortada ve durum göstergesi sağ tarafta yer alır.

**2. Butonlar (Buttons):**
- **Primary:** Mor arka plan, beyaz metin. Tam genişlik veya içeriğe göre boyutlanır.
- **Secondary:** Mor metin, açık mor veya transparan arka plan.
- **Destructive:** Kırmızı metin, açık kırmızı arka plan (örn: Sil butonu).

**3. Giriş Alanları (Inputs):**
Gri ince çerçeveli, odaklandığında mor çerçeveye dönüşen yapılar. Etiketler (Labels) alanın üzerinde, yardımcı metinler ise altında yer alır.

**4. Alt Navigasyon (Bottom Navigation):**
Sabit konumlu, beyaz zemin üzerine gri ikonlar. Aktif sekme birincil mor renk ve altında küçük bir belirteç ile vurgulanır. Ortadaki "Ekle" (+) butonu genellikle dairesel bir vurgu ile ayrıştırılabilir.

**5. Çipler (Chips/Badges):**
Kategori filtreleme ve durum belirtme (Devam Ediyor, Süresi Doldu) için kullanılır. Duruma göre arka plan rengi ve metin rengi değişkenlik gösterir.