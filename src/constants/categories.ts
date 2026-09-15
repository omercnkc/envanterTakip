/**
 * Proje Kategori Sabitleri
 * 10 standart kategori ve ikon tanımları
 */

export interface CategoryItem {
  id: number;
  name: string;
  icon: string;
  description?: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 1, name: 'Televizyon', icon: 'tv', description: 'OLED, QLED, Smart TV ve Monitörler' },
  { id: 2, name: 'Bilgisayar', icon: 'laptop', description: 'Laptop, Masaüstü, Tablet ve Donanımlar' },
  { id: 3, name: 'Telefon', icon: 'smartphone', description: 'Akıllı Telefonlar ve Aksesuarları' },
  { id: 4, name: 'Tablet', icon: 'tablet', description: 'iPad, Android tablet ve e-kitap okuyucular' },
  { id: 5, name: 'Beyaz Eşya', icon: 'refrigerator', description: 'Buzdolabı, Çamaşır / Bulaşık Makinesi' },
  { id: 6, name: 'Küçük Ev Aletleri', icon: 'coffee', description: 'Süpürge, Kahve Makinesi, Ütü, Fritöz' },
  { id: 7, name: 'Mobilya', icon: 'armchair', description: 'Koltuk, Yatak, Çalışma Masası, Dolap' },
  { id: 8, name: 'Mutfak Ürünleri', icon: 'utensils', description: 'Tencere seti, Bıçak seti, Mutfak robotu' },
  { id: 9, name: 'Oyun / Konsol', icon: 'gamepad-2', description: 'PlayStation, Xbox, Nintendo, VR' },
  { id: 10, name: 'Diğer', icon: 'package', description: 'Kategori dışı diğer ev varlıkları' },
];

export const DEFAULT_CATEGORIES = CATEGORIES;

export const CATEGORY_TRANSLATION_MAP: Record<string, { en: string; tr: string; key: string }> = {
  'Televizyon': { en: 'Television', tr: 'Televizyon', key: 'categories.tv' },
  'Bilgisayar': { en: 'Computers', tr: 'Bilgisayar', key: 'categories.laptop' },
  'Telefon': { en: 'Smartphone', tr: 'Telefon', key: 'categories.smartphone' },
  'Tablet': { en: 'Tablet', tr: 'Tablet', key: 'categories.tablet' },
  'Beyaz Eşya': { en: 'Major Appliances', tr: 'Beyaz Eşya', key: 'categories.refrigerator' },
  'Küçük Ev Aletleri': { en: 'Small Appliances', tr: 'Küçük Ev Aletleri', key: 'categories.coffee' },
  'Mobilya': { en: 'Furniture', tr: 'Mobilya', key: 'categories.armchair' },
  'Mutfak Ürünleri': { en: 'Kitchenware', tr: 'Mutfak Ürünleri', key: 'categories.utensils' },
  'Oyun / Konsol': { en: 'Gaming / Console', tr: 'Oyun / Konsol', key: 'categories.gamepad' },
  'Diğer': { en: 'Other', tr: 'Diğer', key: 'categories.other' },
};

export const getCategoryDisplayName = (name: string, language: 'tr' | 'en' = 'tr'): string => {
  if (!name) return name;
  const match = CATEGORY_TRANSLATION_MAP[name];
  if (match) {
    return language === 'en' ? match.en : match.tr;
  }
  // If the reverse was saved (in English)
  for (const item of Object.values(CATEGORY_TRANSLATION_MAP)) {
    if (item.en.toLowerCase() === name.toLowerCase()) {
      return language === 'en' ? item.en : item.tr;
    }
  }
  return name;
};

