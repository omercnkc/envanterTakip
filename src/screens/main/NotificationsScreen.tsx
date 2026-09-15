import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Bell,
  BellRing,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Trash2,
  CheckCheck,
} from 'lucide-react-native';

import { useTheme } from '../../context/ThemeContext';
import { useInventory } from '../../context/InventoryContext';
import { useAlert } from '../../context/AlertContext';
import { useTranslation } from '../../i18n';
import { calculateWarrantyStatus, formatDateTurkish } from '../../utils/warrantyCalculator';
import { sendTestNotification } from '../../utils/notificationHelper';
import { EmptyState } from '../../components/EmptyState';
import { getStyles } from './NotificationsScreen.styles';

type NotificationFilterTab = 'all' | 'unread' | 'read';

interface NotificationItem {
  id: string;
  productId: string;
  productName: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
}

const READ_NOTIFICATIONS_KEY = '@safe_envanter_read_notification_ids';
const DELETED_NOTIFICATIONS_KEY = '@safe_envanter_deleted_notification_ids';

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { products, isRefreshing, refreshProducts } = useInventory();
  const [activeTab, setActiveTab] = useState<NotificationFilterTab>('all');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [isSendingTest, setIsSendingTest] = useState(false);
  const { colors } = useTheme();
  const { t, language } = useTranslation();
  const { showSuccess, showError, showAlert } = useAlert();
  const styles = useMemo(() => getStyles(colors), [colors]);

  // Kalıcı okundu ve silindi kimliklerini yükle
  useEffect(() => {
    const loadStoredState = async () => {
      try {
        const [storedRead, storedDeleted] = await Promise.all([
          AsyncStorage.getItem(READ_NOTIFICATIONS_KEY),
          AsyncStorage.getItem(DELETED_NOTIFICATIONS_KEY),
        ]);
        if (storedRead) {
          setReadIds(new Set(JSON.parse(storedRead)));
        }
        if (storedDeleted) {
          setDeletedIds(new Set(JSON.parse(storedDeleted)));
        }
      } catch (err) {
        console.warn('Bildirim geçmişi yüklenirken hata:', err);
      }
    };
    loadStoredState();
  }, []);

  const handleSendTestNotification = async () => {
    if (isSendingTest) return;
    try {
      setIsSendingTest(true);
      await sendTestNotification();
      showSuccess(
        language === 'tr'
          ? 'Test bildirimi başarıyla planlandı. 2 saniye içinde bildirim çubuğunda görünecektir.'
          : 'Test notification scheduled. It will appear in notification bar in 2 seconds.',
        language === 'tr' ? 'Bildirim Planlandı' : 'Notification Scheduled'
      );
    } catch {
      showError(
        language === 'tr'
          ? 'Lütfen telefon ayarlarından uygulama bildirim izinlerini etkinleştirdiğinizden emin olun.'
          : 'Please make sure application notification permissions are enabled in device settings.',
        language === 'tr' ? 'Bildirim Gönderilemedi' : 'Notification Failed'
      );
    } finally {
      setIsSendingTest(false);
    }
  };

  // YALNIZCA BELİRTİLEN EŞİK TARİHLERİ GELİNCE (30 gün, 7 gün, 1 gün, 0 gün ve süresi dolanlar) BİLDİRİM OLUŞTURULUR
  // Devam eden normal garantili ürünler bildirim listesini meşgul etmez.
  const notifications: NotificationItem[] = useMemo(() => {
    const list: NotificationItem[] = [];

    products.forEach((p) => {
      const { status, daysRemaining } = calculateWarrantyStatus(p.warranty_end_date);

      // 1. Süresi Dolmuş Ürünler
      if (status === 'expired') {
        const id = `expired-${p.id}`;
        if (!deletedIds.has(id)) {
          list.push({
            id,
            productId: p.id,
            productName: p.name,
            message: language === 'tr' ? 'Garanti süresi sona erdi.' : 'Warranty has expired.',
            timestamp: p.warranty_end_date ? formatDateTurkish(p.warranty_end_date) : (language === 'tr' ? 'Süresi Doldu' : 'Expired'),
            type: 'error',
            isRead: readIds.has(id),
          });
        }
      }
      // 2. SADECE eşik tarihine girmiş ürünler (<= 30 gün kalanlar)
      else if (status === 'expiring_soon' && daysRemaining !== null && daysRemaining <= 30) {
        let msg = '';
        let type: 'warning' | 'error' = 'warning';

        if (daysRemaining === 0) {
          msg = language === 'tr' ? 'Garanti süresi bugün sona eriyor!' : 'Warranty expires today!';
          type = 'error';
        } else if (daysRemaining === 1) {
          msg = language === 'tr' ? 'Garanti süresi yarın sona eriyor!' : 'Warranty expires tomorrow!';
          type = 'error';
        } else if (daysRemaining <= 7) {
          msg = language === 'tr'
            ? `Garanti süresinin bitmesine son ${daysRemaining} gün kaldı!`
            : `Only ${daysRemaining} days left until warranty expires!`;
          type = 'warning';
        } else {
          msg = language === 'tr'
            ? `Garantinin bitmesine ${daysRemaining} gün kaldı.`
            : `${daysRemaining} days remaining until warranty ends.`;
          type = 'warning';
        }

        const id = `expiring-${p.id}`;
        if (!deletedIds.has(id)) {
          list.push({
            id,
            productId: p.id,
            productName: p.name,
            message: msg,
            timestamp: p.warranty_end_date ? formatDateTurkish(p.warranty_end_date) : (language === 'tr' ? 'Yakında' : 'Soon'),
            type,
            isRead: readIds.has(id),
          });
        }
      }
      // Devam eden normal ürünler (status === 'active' ve > 30 gün) için bildirim eklenmez!
    });

    return list;
  }, [products, readIds, deletedIds, language]);

  // Sayı Hesaplamaları (Tümü, Okunmayan, Okunan)
  const counts = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.isRead).length;
    const read = notifications.filter((n) => n.isRead).length;
    return { all: total, unread, read };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter((n) => !n.isRead);
    }
    if (activeTab === 'read') {
      return notifications.filter((n) => n.isRead);
    }
    return notifications;
  }, [notifications, activeTab]);

  // Tekil Bildirimi Okundu Yap ve Detaya Git
  const handleNotificationPress = async (item: NotificationItem) => {
    if (!item.isRead) {
      const updated = new Set(readIds).add(item.id);
      setReadIds(updated);
      try {
        await AsyncStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify([...updated]));
      } catch (err) {
        console.warn('Okundu durumu kaydedilemedi:', err);
      }
    }
    navigation.navigate('ProductDetail', { productId: item.productId });
  };

  // Tekil Bildirimi Sil
  const handleDeleteNotification = async (id: string) => {
    const updated = new Set(deletedIds).add(id);
    setDeletedIds(updated);
    try {
      await AsyncStorage.setItem(DELETED_NOTIFICATIONS_KEY, JSON.stringify([...updated]));
    } catch (err) {
      console.warn('Silme kaydedilemedi:', err);
    }
  };

  // Tüm Bildirimleri Okundu İşaretle
  const handleMarkAllRead = async () => {
    const allIds = notifications.map((n) => n.id);
    const updated = new Set([...readIds, ...allIds]);
    setReadIds(updated);
    try {
      await AsyncStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify([...updated]));
    } catch (err) {
      console.warn('Okundu durumu kaydedilemedi:', err);
    }
  };

  // Tüm Bildirimleri Sil (Onay İstemli)
  const handleClearAll = () => {
    if (notifications.length === 0) return;
    showAlert({
      type: 'danger',
      title: t('notifications.clearAllConfirmTitle'),
      message: t('notifications.clearAllConfirmMessage'),
      confirmText: language === 'tr' ? 'Tümünü Sil' : 'Clear All',
      cancelText: t('common.cancel'),
      destructive: true,
      onConfirm: async () => {
        const allIds = notifications.map((n) => n.id);
        const updated = new Set([...deletedIds, ...allIds]);
        setDeletedIds(updated);
        try {
          await AsyncStorage.setItem(DELETED_NOTIFICATIONS_KEY, JSON.stringify([...updated]));
          showSuccess(language === 'tr' ? 'Tüm bildirimler temizlendi.' : 'All notifications cleared.');
        } catch (err) {
          console.warn('Silme kaydedilemedi:', err);
        }
      },
    });
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'warning':
        return (
          <View style={[styles.iconBox, styles.iconBoxWarning]}>
            <BellRing size={20} color={colors.warning} />
          </View>
        );
      case 'error':
        return (
          <View style={[styles.iconBox, styles.iconBoxError]}>
            <AlertCircle size={20} color={colors.error} />
          </View>
        );
      case 'success':
        return (
          <View style={[styles.iconBox, styles.iconBoxSuccess]}>
            <CheckCircle2 size={20} color={colors.tertiary} />
          </View>
        );
      default:
        return (
          <View style={styles.iconBox}>
            <Bell size={20} color={colors.primary} />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>{t('notifications.screenTitle')}</Text>
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleSendTestNotification}
            disabled={isSendingTest}
            activeOpacity={0.7}
          >
            {isSendingTest ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Sparkles size={14} color={colors.primary} />
            )}
            <Text style={styles.testButtonText}>
              {isSendingTest ? '...' : (language === 'tr' ? 'Test Bildirimi' : 'Test Notification')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tümü, Okunmayan ve Okunan Sayılı Sekmeleri */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'all' && styles.tabButtonActive]}
            onPress={() => setActiveTab('all')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'all' && styles.tabTextActive,
              ]}
            >
              {language === 'tr' ? 'Tümü' : 'All'} ({counts.all})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'unread' && styles.tabButtonActive]}
            onPress={() => setActiveTab('unread')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'unread' && styles.tabTextActive,
              ]}
            >
              {language === 'tr' ? 'Okunmayan' : 'Unread'} ({counts.unread})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'read' && styles.tabButtonActive]}
            onPress={() => setActiveTab('read')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'read' && styles.tabTextActive,
              ]}
            >
              {language === 'tr' ? 'Okunan' : 'Read'} ({counts.read})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sekmelerin Altındaki Temiz Araç Çubuğu (Tümünü Oku & Tümünü Sil) */}
        {notifications.length > 0 && (
          <View style={styles.toolbarRow}>
            <Text style={styles.toolbarSummary}>
              {activeTab === 'unread'
                ? (language === 'tr' ? `${counts.unread} Okunmamış` : `${counts.unread} Unread`)
                : activeTab === 'read'
                ? (language === 'tr' ? `${counts.read} Okunmuş` : `${counts.read} Read`)
                : (language === 'tr' ? `${counts.all} Bildirim` : `${counts.all} Notifications`)}
            </Text>
            <View style={styles.toolbarActions}>
              {counts.unread > 0 && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleMarkAllRead}
                  activeOpacity={0.7}
                >
                  <CheckCheck size={13} color={colors.primary} />
                  <Text style={styles.actionButtonText}>{language === 'tr' ? 'Tümünü Oku' : 'Mark All Read'}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonDanger]}
                onPress={handleClearAll}
                activeOpacity={0.7}
              >
                <Trash2 size={13} color={colors.error} />
                <Text style={[styles.actionButtonText, styles.actionButtonDangerText]}>
                  {language === 'tr' ? 'Tümünü Sil' : 'Clear All'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshProducts}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.notificationCard}
            onPress={() => handleNotificationPress(item)}
            activeOpacity={0.7}
          >
            {getIcon(item.type)}
            <View style={styles.content}>
              <Text style={styles.title}>{item.productName}</Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
            <View style={styles.cardRight}>
              {!item.isRead && <View style={styles.unreadDot} />}
              <TouchableOpacity
                style={styles.deleteIconButton}
                onPress={() => handleDeleteNotification(item.id)}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Trash2 size={15} color={colors.outline} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={<Bell size={40} color={colors.outline} />}
            title={t('notifications.emptyTitle')}
            description={t('notifications.emptySubtitle')}
            actionText={language === 'tr' ? 'Ana Sayfaya Dön' : 'Go to Home'}
            onActionPress={() => navigation.navigate('HomeTab')}
          />
        }
      />
    </SafeAreaView>
  );
};
