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
