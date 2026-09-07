# Clean Code & Senior Mobile Engineering Guidelines

Bu doküman, projede geliştirilecek tüm React Native & TypeScript kodlarının profesyonel, sürdürülebilir, modüler ve yüksek performanslı olmasını sağlayan temel mühendislik kurallarını tanımlar.

---

## 1. 📁 Dosya ve Klasör Ayrımı (Separation of Concerns)

### 1.1. Stil Dosyalarının Ayrılması (Styles Separation)
- **Kural**: Bileşen veya ekran dosyası içerisindeki `StyleSheet.create` bloğu 30-40 satırı aşıyorsa veya bileşen karmaşıksa, stiller kesinlikle ayrı bir dosyaya taşınmalıdır.
- **Dosya İsimlendirme Standardı**:
  - Bileşen: `ProductCard.tsx` ➡️ Stil: `ProductCard.styles.ts`
  - Ekran: `ProductDetailScreen.tsx` ➡️ Stil: `ProductDetailScreen.styles.ts`
- **Örnek Yapı**:
  ```typescript
  // ProductCard.styles.ts
  import { StyleSheet } from 'react-native';
  import { COLORS, SPACING, RADIUS } from '@/constants/theme';

  export const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: COLORS.cardBackground,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.sm,
    },
    // ...
  });
  ```

### 1.2. Özel Kancalar (Custom Hooks) ile Mantık ve UI Ayrımı
- UI bileşenleri (JSX) yalnızca render ve görsel sunumdan sorumlu olmalıdır.
- Veri çekme, filtreleme, form yönetimi ve yan etkiler custom hook'lara taşınmalıdır.
- **Örnek**: `useProducts`, `useProductForm`, `useWarrantyCalculator`, `useImagePicker`.

### 1.3. Katmanlı Servis Mimarisi (Service Layer)
- UI veya Hook katmanı doğrudan ham Supabase sorguları yazmamalıdır.
- Tüm veri tabanı ve depolama işlemleri `src/api/` veya `src/services/` altında toplanır:
  - `authService.ts` (Giriş, Kayıt, Şifre Sıfırlama)
  - `productService.ts` (CRUD sorguları)
  - `storageService.ts` (Görsel yükleme ve silme)
  - `notificationService.ts` (Yerel bildirim zamanlama)

---

## 2. 🛡️ TypeScript ve Tip Güvenliği Standartları

- **Kesinlikle `any` Kullanılmamalıdır**: Her model, prop, state ve fonksiyon parametresi kesin tiplerle (`interface` veya `type`) tanımlanmalıdır.
- **Merkezi Tip Tanımları**:
  - `src/types/database.types.ts`: Supabase veritabanı modelleri.
  - `src/types/navigation.types.ts`: Stack ve Tab navigasyon rota parametreleri.
  - `src/types/product.types.ts`: Ürün, garanti durumu, filtreleme tipleri.
- **Zod & Schema Type Inference**:
  ```typescript
  export const productSchema = z.object({
    name: z.string().min(2, 'Ürün adı en az 2 karakter olmalıdır'),
    purchasePrice: z.number().nonnegative('Fiyat negatif olamaz'),
    warrantyEndDate: z.string().datetime(),
  });

  export type ProductFormData = z.infer<typeof productSchema>;
  ```

---

## 3. ⚡ React Native Performans ve Bellek Optimizasyonu

### 3.1. Inline Stil ve Fonksiyonlardan Kaçınma
- JSX içerisinde `style={{ marginTop: 10, padding: 5 }}` şeklinde inline nesneler tanımlanmamalıdır (her render'da yeni referans oluşturur).
- `StyleSheet.create` kullanılmalıdır.

### 3.2. Liste Optimizasyonları (FlatList)
- Listelerde her zaman `keyExtractor` tanımlanmalıdır.
- Sabit yükseklikli kartlarda `getItemLayout` kullanılmalıdır.
- Liste elemanları (`renderItem`) `useCallback` ile sarmalanmalı veya alt bileşen `React.memo` ile korunmalıdır.

### 3.3. Bellek Sızıntılarını Önleme (Cleanup)
- `useEffect` içerisindeki event listener'lar, Supabase auth abonelikleri ve zamanlayıcılar mutlaka `return () => cleanup()` ile temizlenmelidir.

---

## 4. 🎨 Tasarım Sistemleri ve Sabitler (Design System & Tokens)

- **Hardcoded Değer Yasağı**: Kod içerisinde rastgele hex kodları (`#FF0000`, `#1E293B`) veya sabit boşluklar (`margin: 17`) yazılmamalıdır.
- **Merkezi Tema Sabitleri**:
  - `src/constants/colors.ts`: Renk paletleri, Dark / Light tema değişkenleri.
  - `src/constants/spacing.ts`: Standart aralıklar (`xs: 4, sm: 8, md: 16, lg: 24, xl: 32`).
  - `src/constants/typography.ts`: Yazı boyutları, ağırlıkları ve satır yükseklikleri.
  - `src/constants/categories.ts`: Kategori listesi, ikon eşleşmeleri.

---

## 5. 🚦 Hata Yönetimi ve Güvenilirlik (Error Handling & UX)

- **Kullanıcı Dostu Hata Mesajları**:
  - ❌ *Hatalı*: `alert(error.message)` -> `AuthApiError: Invalid login credentials`
  - ✅ *Doğru*: `Toast.show('E-posta veya şifre hatalı. Lütfen tekrar deneyin.')`
- **Guard Clauses & Early Return**:
  - Derin `if-else` blokları yerine erken dönüş (early return) kullanılmalıdır:
  ```typescript
  // ✅ Doğru Yaklaşım:
  const handleSaveProduct = async (data: ProductFormData) => {
    if (!user) {
      showError('Oturum açmanız gerekiyor.');
      return;
    }
    if (!data.name.trim()) {
      showError('Ürün adı boş bırakılamaz.');
      return;
    }

    try {
      setLoading(true);
      await productService.createProduct(data, user.id);
      showSuccess('Ürün başarıyla kaydedildi.');
    } catch (error) {
      showError('Ürün kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  ```

---

## 6. 📱 Bileşen Yapısı ve Okunabilirlik Şablonu

Bir bileşen dosyası şu sıra ile yapılandırılmalıdır:
1. **İmportlar**:
   - 1. Dış kütüphaneler (React, React Native, Icons)
   - 2. Navigasyon, Servisler ve Kancalar (Hooks)
   - 3. Alt Bileşenler
   - 4. Tipler, Sabitler ve Yardımcı Fonksiyonlar
   - 5. Stiller (`import { styles } from './ComponentName.styles'`)
2. **Tip ve Arayüz Tanımları** (`interface Props { ... }`)
3. **Bileşen Fonksiyonu**:
   - Kancalar (`useNavigation`, `useState`, `useEffect`, `useForm`)
   - Yardımcı işleyiciler (`handlePress`, `onSubmit`)
   - Render dönüşü (`return (<View>...</View>)`)
4. **Export**: `export default ComponentName;` veya `export const ComponentName = memo(...)`

---

## 7. 🧪 Kod İnceleme & Temizlik Kontrol Listesi

Bir kod bloğu yazıldığında şu sorulara "Evet" denmelidir:
- [ ] Stiller 30 satırdan uzunsa ayrı `.styles.ts` dosyasına taşındı mı?
- [ ] Hiç `any` tipi kullanıldı mı? (Kullanılmamalı)
- [ ] Sabit renk ve boşluk değerleri `constants` üzerinden mi alındı?
- [ ] Supabase çağrıları doğrudan JSX içinde mi yoksa bir servis / hook üzerinden mi yapıldı?
- [ ] Loading ve Error durumları kullanıcıya düzgün gösteriliyor mu?
- [ ] Ekran `SafeAreaView` ile çentik/home bar korumasına sahip mi?
