import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Shield,
  Clock,
  CalendarX,
  Receipt,
  Bell,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react-native';

import { Product } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../context/InventoryContext';
import { ProductCard } from '../../components/ProductCard';
import { EmptyState } from '../../components/EmptyState';
import { calculateWarrantyStatus } from '../../utils/warrantyCalculator';
import { getStyles } from './HomeScreen.styles';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile, user } = useAuth();
  const { products, stats, refreshProducts, isRefreshing } = useInventory();
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const rawName = profile?.full_name || user?.email?.split('@')[0] || 'Misafir';
  const firstName = rawName.trim().split(/\s+/)[0] || rawName;
  const userInitials = (firstName[0] || 'U').toUpperCase();

  // Sıradaki / En yakın garanti bitişine sahip ürünü hesapla
  const closestWarrantyInfo = useMemo(() => {
    if (!products || products.length === 0) {
      return { type: 'empty' as const, product: null, daysRemaining: null };
    }

    // Aktif veya süresi yaklaşan ürünleri filtrele
    const activeProductsWithDays = products
      .map((p) => {
        const status = calculateWarrantyStatus(p.warranty_end_date, colors);
        return {
          product: p,
          status,
          daysRemaining: status.daysRemaining,
          isExpired: status.status === 'expired',
          isExpiringSoon: status.status === 'expiring_soon',
        };
      })
      .filter((item) => !item.isExpired && item.product.warranty_end_date);

    if (activeProductsWithDays.length === 0) {
      return {
        type: 'none' as const,
        product: null,
        daysRemaining: null,
      };
    }

    // Kalan güne göre en yakından en uzağa sırala
    activeProductsWithDays.sort((a, b) => a.daysRemaining - b.daysRemaining);
    const nearest = activeProductsWithDays[0];

    return {
      type: nearest.isExpiringSoon ? ('expiring_soon' as const) : ('safe' as const),
      product: nearest.product,
      daysRemaining: nearest.daysRemaining,
    };
  }, [products, colors]);

  // Yaklaşan garantili ve son eklenen ürünler
  const recentProducts = useMemo(() => products.slice(0, 5), [products]);

  const handleStatCardPress = (statusFilter?: string) => {
    navigation.navigate('ProductsTab', { filterStatus: statusFilter });
  };

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetail', {
        productId: product.id,
        initialProduct: product,
      });
    },
    [navigation]
  );

  const handleClosestProductPress = useCallback(() => {
    if (closestWarrantyInfo.product) {
      handleProductPress(closestWarrantyInfo.product);
    } else if (closestWarrantyInfo.type === 'empty') {
      navigation.navigate('AddTab');
    } else {
      navigation.navigate('ProductsTab');
    }
  }, [closestWarrantyInfo, handleProductPress, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshProducts}
            colors={[colors.primary]}
          />
        }
      >
        {/* Top App Bar Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.greetingRow}>
              <Text style={styles.greetingText}>Merhaba, {firstName}</Text>
            </View>
            <Text style={styles.subtitleText}>
              Envanterin güvende, garantilerini takip et.
            </Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Bell size={19} color={colors.primary} />
              {stats.expiringSoon > 0 && <View style={styles.badgeDot} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatar}
              onPress={() => navigation.navigate('ProfileTab')}
              activeOpacity={0.7}
            >
              <Text style={styles.avatarText}>{userInitials}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bento Summary Card */}
        <View style={styles.bentoCard}>
          <View style={styles.bentoBlob} />

          <View style={styles.bentoLeft}>
            <Text style={styles.bentoTitle}>Toplam Ürün</Text>
            <View style={styles.bentoNumberRow}>
              <Text style={styles.bentoBigNumber}>{stats.total}</Text>
              <Text style={styles.bentoNumberLabel}>ürün</Text>
            </View>
            <TouchableOpacity
              style={styles.bentoButton}
              onPress={() => navigation.navigate('ProductsTab')}
              activeOpacity={0.8}
            >
              <TrendingUp size={14} color={colors.primary} />
              <Text style={styles.bentoButtonText}>Genel Durumu Gör</Text>
              <ChevronRight size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* En Yakın Garanti Bitiş / Güvende Rozeti */}
          <TouchableOpacity
            style={[
              styles.bentoRightWidget,
              closestWarrantyInfo.type === 'expiring_soon'
                ? styles.bentoRightWidgetWarning
                : closestWarrantyInfo.type === 'safe'
                ? styles.bentoRightWidgetSafe
                : null,
            ]}
            onPress={handleClosestProductPress}
            activeOpacity={0.75}
          >
            {closestWarrantyInfo.type === 'expiring_soon' ? (
              <>
                <View style={styles.bentoStatusRow}>
                  <View
                    style={[
                      styles.bentoStatusIconBox,
                      { backgroundColor: colors.warning + '25' },
                    ]}
                  >
                    <Clock size={12} color={colors.warning} />
                  </View>
                  <Text style={[styles.bentoStatusBadgeText, { color: colors.warning }]}>
                    Yaklaşan Garanti
                  </Text>
                </View>
                <Text
                  style={[styles.bentoStatusMainText, { color: colors.warning }]}
                  numberOfLines={1}
                >
                  {closestWarrantyInfo.daysRemaining === 0
                    ? 'Bugün Son Gün'
                    : closestWarrantyInfo.daysRemaining === 1
                    ? 'Yarın Bitiyor'
                    : `Sıradaki: ${closestWarrantyInfo.daysRemaining} gün`}
                </Text>
                <View style={styles.bentoStatusProductRow}>
                  <Text style={styles.bentoStatusProductName} numberOfLines={1}>
                    {closestWarrantyInfo.product?.name}
                  </Text>
                  <ChevronRight size={13} color={colors.warning} />
                </View>
              </>
            ) : closestWarrantyInfo.type === 'safe' ? (
              <>
                <View style={styles.bentoStatusRow}>
                  <View
                    style={[
                      styles.bentoStatusIconBox,
                      { backgroundColor: colors.tertiary + '25' },
                    ]}
                  >
                    <ShieldCheck size={12} color={colors.tertiary} />
                  </View>
                  <Text style={[styles.bentoStatusBadgeText, { color: colors.tertiary }]}>
                    Garantiler Güvende
                  </Text>
                </View>
                <Text style={styles.bentoStatusMainText} numberOfLines={1}>
                  Bu Ay Risk Yok
                </Text>
                <View style={styles.bentoStatusProductRow}>
                  <Text style={styles.bentoStatusProductName} numberOfLines={1}>
                    {closestWarrantyInfo.product
                      ? `Sıradaki: ${closestWarrantyInfo.product.name}`
                      : 'Tümü koruma altında'}
                  </Text>
                  <ChevronRight size={13} color={colors.outline} />
                </View>
              </>
            ) : (
              <>
                <View style={styles.bentoStatusRow}>
                  <View
                    style={[
                      styles.bentoStatusIconBox,
                      { backgroundColor: colors.primary + '20' },
                    ]}
                  >
                    <ShieldCheck size={12} color={colors.primary} />
                  </View>
                  <Text style={[styles.bentoStatusBadgeText, { color: colors.primary }]}>
                    Garantiler Güvende
                  </Text>
                </View>
                <Text style={styles.bentoStatusMainText} numberOfLines={1}>
                  {stats.total === 0 ? 'Ürün Eklenmedi' : 'Aktif Garanti Yok'}
                </Text>
                <View style={styles.bentoStatusProductRow}>
                  <Text style={styles.bentoStatusProductName} numberOfLines={1}>
                    {stats.total === 0 ? 'İlk ürünü ekleyin' : 'Tümü sona erdi'}
                  </Text>
                  <ChevronRight size={13} color={colors.outline} />
                </View>
              </>
            )}
          </TouchableOpacity>
        </View>


        {/* 4'lü İstatistik Izgarası */}
        <View style={styles.statsGrid}>
          {/* Stat 1: Aktif Garanti */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => handleStatCardPress('active')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.statIconBox,
                { backgroundColor: colors.tertiaryContainer + '18' },
              ]}
            >
              <Shield size={16} color={colors.tertiary} />
            </View>
            <Text style={[styles.statCount, { color: colors.tertiary }]}>
              {stats.active}
            </Text>
            <Text style={styles.statLabel} numberOfLines={2}>
              Aktif Garanti
            </Text>
          </TouchableOpacity>

          {/* Stat 2: Yakında Bitecek */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => handleStatCardPress('expiring_soon')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.statIconBox,
                { backgroundColor: colors.warningContainer },
              ]}
            >
              <Clock size={16} color={colors.warning} />
            </View>
            <Text style={[styles.statCount, { color: colors.warning }]}>
              {stats.expiringSoon}
            </Text>
            <Text style={styles.statLabel} numberOfLines={2}>
              Yakında Bitecek
            </Text>
          </TouchableOpacity>

          {/* Stat 3: Süresi Dolmuş */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => handleStatCardPress('expired')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.statIconBox,
                { backgroundColor: colors.errorContainer },
              ]}
            >
              <CalendarX size={16} color={colors.error} />
            </View>
            <Text style={[styles.statCount, { color: colors.error }]}>
              {stats.expired}
            </Text>
            <Text style={styles.statLabel} numberOfLines={2}>
              Süresi Dolmuş
            </Text>
          </TouchableOpacity>

          {/* Stat 4: Tüm Ürünler */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => handleStatCardPress('all')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.statIconBox,
                { backgroundColor: colors.surfaceContainerLow },
              ]}
            >
              <Receipt size={16} color={colors.primary} />
            </View>
            <Text style={[styles.statCount, { color: colors.primary }]}>
              {stats.total}
            </Text>
            <Text style={styles.statLabel} numberOfLines={2}>
              Tüm Ürünler
            </Text>
          </TouchableOpacity>
        </View>

        {/* Yaklaşan / Son Ürünler Bölümü */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Yaklaşan Garantiler</Text>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('ProductsTab')}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAllText}>Tümünü Gör</Text>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {recentProducts.length > 0 ? (
          <View style={styles.productsList}>
            {recentProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                showPercentageGauge={true}
                onPress={() => handleProductPress(p)}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title="Henüz ürün eklenmemiş"
            description="Envanterinizi oluşturmak ve garantilerinizi takip etmek için ilk ürününüzü ekleyin."
            actionText="İlk Ürünü Ekle"
            onActionPress={() => navigation.navigate('AddTab')}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
