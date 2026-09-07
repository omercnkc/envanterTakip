# Tech Context: Ev Envanter & Garanti Takip

## 1. Kullanılan Teknolojiler & Versiyonlar

### Mobil İstemci (Frontend)
- **Node.js**: Modern LTS
- **Expo**: `~57.0.20` (SDK 57)
- **React**: `19.2.3`
- **React Native**: `0.86.3`
- **TypeScript**: `~6.0.3`

### Temel Kütüphaneler ve Bağımlılıklar
- **Navigasyon**:
  - `@react-navigation/native` (`^7.3.18`)
  - `@react-navigation/native-stack` (`^7.18.10`)
  - `@react-navigation/bottom-tabs` (`^7.18.18`)
  - `react-native-screens` (`~4.16.0`), `react-native-safe-area-context` (`~5.6.0`)
- **Backend Entegrasyonu**:
  - `@supabase/supabase-js` (`^2.114.0`)
  - `react-native-url-polyfill` (`^4.0.0`)
  - `base64-arraybuffer` (`^1.0.2`)
- **Form & Validasyon**:
  - `react-hook-form` (`^7.87.0`)
  - `@hookform/resolvers` (`^5.9.1`)
  - `zod` (`^4.5.4`)
- **Cihaz & Medya Donanımları**:
  - `expo-camera` (`~17.0.10`)
  - `expo-image-picker` (`~17.0.11`)
  - `expo-document-picker` (`~14.0.8`)
  - `expo-file-system` (`~19.0.24`)
  - `expo-notifications` (`~0.32.17`)
- **UI & İkonlar**:
  - `lucide-react-native` (`^1.39.0`)
  - `react-native-svg` (`15.12.1`)
  - `expo-linear-gradient` (`~15.0.8`)
- **Depolama & Yardımcılar**:
  - `@react-native-async-storage/async-storage` (`2.2.0`)
  - `date-fns` (`^4.4.0`)
  - `expo-crypto` (`~15.0.9`)

## 2. Geliştirme Ortamı & Konfigürasyon

### Ortam Değişkenleri (`.env`)
```env
EXPO_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
```

### Çalıştırma Komutları
```bash
# Bağımlılıkları yükle
npm install

# Expo dev sunucusunu başlat
npx expo start
# veya
npm start

# Android / iOS platformlarına özel başlatma
npm run android
npm run ios
```

## 3. Teknik Kısıtlar ve Dikkat Edilecekler
- **Doğrudan DB Görsel Saklama Yasağı**: PostgreSQL tablolarında görsel binary verisi saklanmaz; yalnızca Supabase Storage URL / path dizgisi kaydedilir.
- **RLS Zorunluluğu**: Supabase tarafında her tabloda RLS etkin olmalı; anon key ile yapılan tüm istemci istekleri kullanıcı kimliği (`auth.uid()`) ile filtrelenmelidir.
- **Expo SDK 54 / React 19 Uyumluluğu**: Yeni Expo mimarisi ve React 19 sürümüne uygun hook ve paket kullanımı.
- **Kullanıcı Hatası Koruması**: Ağ kopmaları, Storage yükleme hataları ve geçersiz form girişleri `try/catch` ve Zod şemalarıyla yakalanıp kullanıcıya dost mesajlarla sunulmalıdır.
