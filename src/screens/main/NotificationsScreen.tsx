import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Bell,
  BellRing,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react-native';

import { COLORS } from '../../constants';
import { useInventory } from '../../context/InventoryContext';
import { calculateWarrantyStatus, formatDateTurkish } from '../../utils/warrantyCalculator';
import { sendTestNotification } from '../../utils/notificationHelper';
import { EmptyState } from '../../components/EmptyState';
import { styles } from './NotificationsScreen.styles';

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

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { products, isRefreshing, refreshProducts } = useInventory();
  const [activeTab, setActiveTab] = useState<NotificationFilterTab>('all');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleSendTestNotification = async () => {
    if (isSendingTest) return;
    try {
      setIsSendingTest(true);
      await sendTestNotification();
      Alert.alert(
        '🔔 Bildirim Planlandı',
        'Test bildirimi başarıyla oluşturuldu. 2 saniye içinde telefonunuzun bildirim çubuğunda görünecektir.',
        [{ text: 'Harika' }]
      );
    } catch {
      Alert.alert(
        'Bildirim Gönderilemedi',
        'Lütfen telefon ayarlarından uygulama bildirim izinlerini etkinleştirdiğinizden emin olun.'
      );
    } finally {
      setIsSendingTest(false);
    }
  };

  // Ürünlerin garanti durumlarına göre dinamik bildirimler oluşturma
  const notifications: NotificationItem[] = useMemo(() => {
    const list: NotificationItem[] = [];

    products.forEach((p) => {
      const { status, daysRemaining } = calculateWarrantyStatus(p.warranty_end_date);

      if (status === 'expired') {
        list.push({
          id: `expired-${p.id}`,
          productId: p.id,
          productName: p.name,
          message: 'Garanti süresi sona erdi.',
          timestamp: p.warranty_end_date ? formatDateTurkish(p.warranty_end_date) : 'Geçti',
          type: 'error',
          isRead: readIds.has(`expired-${p.id}`),
        });
      } else if (status === 'expiring_soon') {
        list.push({
          id: `expiring-${p.id}`,
          productId: p.id,
          productName: p.name,
          message: `Garantinin bitmesine ${daysRemaining} gün kaldı.`,
          timestamp: p.warranty_end_date ? formatDateTurkish(p.warranty_end_date) : 'Yakında',
          type: 'warning',
          isRead: readIds.has(`expiring-${p.id}`),
        });
      } else {
        list.push({
          id: `active-${p.id}`,
          productId: p.id,
          productName: p.name,
          message: 'Garanti koruması aktif olarak devam ediyor.',
          timestamp: p.warranty_end_date ? formatDateTurkish(p.warranty_end_date) : 'Aktif',
          type: 'info',
          isRead: readIds.has(`active-${p.id}`),
        });
      }
    });

    return list;
  }, [products, readIds]);

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter((n) => !n.isRead);
    }
    if (activeTab === 'read') {
      return notifications.filter((n) => n.isRead);
    }
    return notifications;
  }, [notifications, activeTab]);

  const handleNotificationPress = (item: NotificationItem) => {
    setReadIds((prev) => new Set(prev).add(item.id));
    navigation.navigate('ProductDetail', { productId: item.productId });
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'warning':
        return (
          <View style={[styles.iconBox, styles.iconBoxWarning]}>
            <BellRing size={20} color={COLORS.warning} />
          </View>
        );
      case 'error':
        return (
          <View style={[styles.iconBox, styles.iconBoxError]}>
            <AlertCircle size={20} color={COLORS.error} />
          </View>
        );
      case 'success':
        return (
          <View style={[styles.iconBox, styles.iconBoxSuccess]}>
            <CheckCircle2 size={20} color={COLORS.tertiary} />
          </View>
        );
      default:
        return (
          <View style={styles.iconBox}>
            <Bell size={20} color={COLORS.primary} />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Bildirimler</Text>
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleSendTestNotification}
            disabled={isSendingTest}
            activeOpacity={0.7}
          >
            {isSendingTest ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Sparkles size={14} color={COLORS.primary} />
            )}
            <Text style={styles.testButtonText}>
              {isSendingTest ? 'Gönderiliyor...' : 'Test Bildirimi'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Segmented Capsule Tabs */}
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
              Tümü
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'unread' && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab('unread')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'unread' && styles.tabTextActive,
              ]}
            >
              Okunmadı
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'read' && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab('read')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'read' && styles.tabTextActive,
              ]}
            >
              Okundu
            </Text>
          </TouchableOpacity>
        </View>
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
            colors={[COLORS.primary]}
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
            {!item.isRead && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={<Bell size={40} color={COLORS.outline} />}
            title="Bildirim Bulunmuyor"
            description="Garanti bitişleri ve sistem güncellemeleri burada listelenecektir."
            actionText="Ana Sayfaya Dön"
            onActionPress={() => navigation.navigate('HomeTab')}
          />
        }
      />
    </SafeAreaView>
  );
};
