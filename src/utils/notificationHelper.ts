/**
 * Expo Notifications - Garanti Takip & Bildirim Yönetimi
 * Garantisi 30 gün, 7 gün ve 1 gün kalan ürünler için yerel push bildirimleri planlar.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Product } from '../types';

// Bildirimlerin uygulama ön plandayken de sesli ve banner olarak görünmesini sağla
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

export const NOTIFICATION_CHANNEL_ID = 'warranty-alerts';

/**
 * Android bildirim kanalını yapılandırır
 */
export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
        name: 'Garanti Hatırlatıcıları',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6366F1',
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
      });
    } catch (err) {
      // Expo Go (Android), özel NotificationChannel oluşturmayı SDK 53+ ile
      // kısmen bozduğu için NullPointerException fırlatabilir.
      // Bu durumda hatayı yutup sessizce devam ediyoruz, çünkü cihaz varsayılan
      // bildirim kanalını kullanarak bildirimleri yine de gösterecektir.
      console.warn('Android bildirim kanalı oluşturulamadı (Expo Go kısıtlaması olabilir).');
    }
  }
}

/**
 * Kullanıcıdan bildirim izinlerini ister
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const settings = await Notifications.getPermissionsAsync();
    let granted =
      settings.granted ||
      settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

    if (!granted) {
      const requested = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      granted =
        requested.granted ||
        requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
    }

    if (granted) {
      await setupNotificationChannel();
    }

    return granted;
  } catch (error) {
    console.warn('Bildirim izni istenirken hata oluştu:', error);
    return false;
  }
}

interface MilestoneConfig {
  days: number;
  idSuffix: string;
  title: string;
  getBody: (productName: string) => string;
}

const MILESTONES: MilestoneConfig[] = [
  {
    days: 30,
    idSuffix: '30d',
    title: '🔔 Garanti Hatırlatması',
    getBody: (name) => `${name} ürününüzün garanti süresinin bitmesine 30 gün kaldı.`,
  },
  {
    days: 7,
    idSuffix: '7d',
    title: '⚠️ Garanti Süresi Yaklaşıyor!',
    getBody: (name) => `${name} ürününüzün garantisi 7 gün sonra sona eriyor. Fatura veya servis durumunu kontrol edin.`,
  },
  {
    days: 1,
    idSuffix: '1d',
    title: '🚨 Garanti Yarın Bitiyor!',
    getBody: (name) => `${name} ürününüzün garanti süresi yarın sona eriyor!`,
  },
];

/**
 * Tek bir ürün için 30, 7 ve 1 gün öncesine yerel bildirim planlar
 */
export async function scheduleWarrantyNotifications(product: Product): Promise<void> {
  if (!product.warranty_end_date) {
    return;
  }

  // Önce bu ürün için önceden planlanmış bildirimleri iptal et (çakışmayı önle)
  await cancelWarrantyNotifications(product.id);

  // Bitiş tarihini parse et (YYYY-MM-DD)
  const parts = product.warranty_end_date.split('-').map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return;
  }

  const [year, month, day] = parts;
  // Bitiş günü saat 10:00:00 olarak referans al
  const expiryDate = new Date(year, month - 1, day, 10, 0, 0);

  const now = Date.now();

  for (const milestone of MILESTONES) {
    const triggerDate = new Date(expiryDate.getTime() - milestone.days * 24 * 60 * 60 * 1000);

    // Sadece gelecekteki tarihler için bildirim zamanla
    if (triggerDate.getTime() > now) {
      try {
        await Notifications.scheduleNotificationAsync({
          identifier: `warranty-${product.id}-${milestone.idSuffix}`,
          content: {
            title: milestone.title,
            body: milestone.getBody(product.name),
            data: {
              productId: product.id,
              productName: product.name,
              milestoneDays: milestone.days,
              type: 'warranty_alert',
            },
            sound: 'default',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
            channelId: NOTIFICATION_CHANNEL_ID,
          },
        });
      } catch (err) {
        console.warn(`Bildirim planlanamadı (${product.name} - ${milestone.days} gün):`, err);
      }
    }
  }
}

/**
 * Belirli bir ürüne ait tüm planlanmış bildirimleri iptal eder
 */
export async function cancelWarrantyNotifications(productId: string): Promise<void> {
  try {
    // Bilinen identifier'ları tek tek iptal et
    const targetIds = [
      `warranty-${productId}-30d`,
      `warranty-${productId}-7d`,
      `warranty-${productId}-1d`,
    ];

    await Promise.all(
      targetIds.map(async (id) => {
        try {
          await Notifications.cancelScheduledNotificationAsync(id);
        } catch {
          // Identifier yoksa yut
        }
      })
    );

    // Ayrıca data payload'unda productId içeren kalanları da tara ve temizle
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const item of scheduled) {
      const data = item.content?.data as Record<string, any> | undefined;
      if (data?.productId === productId || item.identifier.startsWith(`warranty-${productId}-`)) {
        try {
          await Notifications.cancelScheduledNotificationAsync(item.identifier);
        } catch {
          // Yut
        }
      }
    }
  } catch (err) {
    console.warn(`Bildirimler iptal edilirken hata (${productId}):`, err);
  }
}

/**
 * Tüm ürün listesini tarar ve her bir ürün için bildirimleri senkronize eder
 */
export async function syncAllWarrantyNotifications(products: Product[]): Promise<void> {
  try {
    for (const product of products) {
      if (product.warranty_end_date) {
        await scheduleWarrantyNotifications(product);
      }
    }
  } catch (err) {
    console.warn('Toplu bildirim senkronizasyonunda hata:', err);
  }
}

/**
 * Anında test bildirimi tetikler (2 saniye sonra çalar)
 */
export async function sendTestNotification(title?: string, body?: string): Promise<string> {
  await setupNotificationChannel();
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: title || '🔔 Garanti Takip Test Bildirimi',
      body: body || 'Harika! Bildirim sistemi sorunsuz çalışıyor. Garanti süreleriniz yaklaşınca haberdar edileceksiniz.',
      data: {
        type: 'test',
        timestamp: new Date().toISOString(),
      },
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
      channelId: NOTIFICATION_CHANNEL_ID,
    },
  });
}

/**
 * Mevcut planlanmış bildirim sayısını döner
 */
export async function getScheduledNotificationsCount(): Promise<number> {
  try {
    const list = await Notifications.getAllScheduledNotificationsAsync();
    return list.length;
  } catch {
    return 0;
  }
}
