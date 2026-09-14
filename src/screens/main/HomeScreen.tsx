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
  const { allProducts, stats, refreshProducts, isRefreshing } = useInventory();
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const rawName = profile?.full_name || user?.email?.split('@')[0] || 'Misafir';
  const firstName = rawName.trim().split(/\s+/)[0] || rawName;
  const userInitials = (firstName[0] || 'U').toUpperCase();

  // Sıradaki / En yakın garanti bitişine sahip ürünü hesapla (Tüm ürünler arasından, filtreden bağımsız)
  const closestWarrantyInfo = useMemo(() => {
    if (!allProducts || allProducts.length === 0) {
      return { type: 'empty' as const, product: null, daysRemaining: null };
    }

    // Aktif veya süresi yaklaşan ürünleri filtrele
    const activeProductsWithDays = allProducts
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
  }, [allProducts, colors]);

  // Yaklaşan garantili ve son eklenen ürünler (Filtrelerden bağımsız en son eklenen 3 ürün)
  const recentProducts = useMemo(() => allProducts.slice(0, 3), [allProducts]);

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
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => navigation.navigate('ProfileTab')}
              activeOpacity={0.7}
            >
              <Text style={styles.avatarText}>{userInitials}</Text>
            </TouchableOpacity>

            <View style={styles.greetingTextContainer}>
              <Text style={styles.greetingText} numberOfLines={1}>
                Merhaba, {firstName}
              </Text>
              <Text style={styles.subtitleText} numberOfLines={1}>
                Envanterin güvende, garantilerini takip et.
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Bell size={17} color={colors.primary} />
              {stats.expiringSoon > 0 && <View style={styles.badgeDot} />}
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
                      { backgroundColor: (colors.warranty?.expiring || colors.warning) + '20' },
                    ]}
                  >
                    <Clock size={12} color={colors.warranty?.expiring || colors.warning} />
                  </View>
                  <Text style={[styles.bentoStatusBadgeText, { color: colors.warranty?.expiring || colors.warning }]}>
                    Yaklaşan Garanti
                  </Text>
                </View>
                <Text
                  style={styles.bentoStatusMainText}
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
                  <ChevronRight size={13} color={colors.outline} />
                </View>
              </>
            ) : closestWarrantyInfo.type === 'safe' ? (
              <>
                <View style={styles.bentoStatusRow}>
                  <View
                    style={[
                      styles.bentoStatusIconBox,
                      { backgroundColor: (colors.warranty?.active || colors.tertiary) + '20' },
                    ]}
                  >
                    <ShieldCheck size={12} color={colors.warranty?.active || colors.tertiary} />
                  </View>
                  <Text style={[styles.bentoStatusBadgeText, { color: colors.warranty?.active || colors.tertiary }]}>
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


        {/* 4'lü İstatistik Izgarası (Salt Bilgi Kartları - Click Event'siz) */}
        <View style={styles.statsGrid}>
          {/* Stat 1: Aktif Garanti */}
          <View style={styles.statCard}>
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
          </View>

          {/* Stat 2: Yakında Bitecek */}
          <View style={styles.statCard}>
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
          </View>

          {/* Stat 3: Süresi Dolmuş */}
          <View style={styles.statCard}>
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
          </View>

          {/* Stat 4: Tüm Ürünler */}
          <View style={styles.statCard}>
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
          </View>
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
                showFavoriteButton={false}
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
