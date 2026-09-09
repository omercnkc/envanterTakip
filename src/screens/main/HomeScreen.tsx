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
import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../context/InventoryContext';
import { ProductCard } from '../../components/ProductCard';
import { CircularProgress } from '../../components/CircularProgress';
import { EmptyState } from '../../components/EmptyState';
import { styles } from './HomeScreen.styles';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile, user } = useAuth();
  const { products, stats, refreshProducts, isRefreshing } = useInventory();

  const rawName = profile?.full_name || user?.email?.split('@')[0] || 'Misafir';
  const firstName = rawName.trim().split(/\s+/)[0] || rawName;
  const userInitials = (firstName[0] || 'U').toUpperCase();

  // Aktif garanti yüzdesi
  const activePercentage = useMemo(() => {
    if (stats.total === 0) return 0;
    return Math.round((stats.active / stats.total) * 100);
  }, [stats.active, stats.total]);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshProducts}
            colors={[COLORS.primary]}
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
              <Bell size={19} color={COLORS.primary} />
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
              <TrendingUp size={14} color={COLORS.primary} />
              <Text style={styles.bentoButtonText}>Genel Durumu Gör</Text>
              <ChevronRight size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Dairesel Garanti Göstergesi */}
          <View style={styles.bentoChartWrapper}>
            <CircularProgress
              size={94}
              strokeWidth={7}
              percentage={activePercentage}
              color={COLORS.primary}
              backgroundColor={COLORS.surfaceContainer}
              centerText={`%${activePercentage}`}
              centerSubtext="Garantiler aktif"
              textStyle={{ fontSize: 16, fontWeight: '700' }}
            />
            <View style={styles.bentoShieldBadge}>
              <ShieldCheck size={13} color={COLORS.tertiary} />
            </View>
          </View>
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
                { backgroundColor: COLORS.tertiaryContainer + '18' },
              ]}
            >
              <Shield size={16} color={COLORS.tertiary} />
            </View>
            <Text style={[styles.statCount, { color: COLORS.tertiary }]}>
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
                { backgroundColor: COLORS.warningContainer },
              ]}
            >
              <Clock size={16} color={COLORS.warning} />
            </View>
            <Text style={[styles.statCount, { color: COLORS.warning }]}>
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
                { backgroundColor: COLORS.errorContainer },
              ]}
            >
              <CalendarX size={16} color={COLORS.error} />
            </View>
            <Text style={[styles.statCount, { color: COLORS.error }]}>
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
                { backgroundColor: COLORS.surfaceContainerLow },
              ]}
            >
              <Receipt size={16} color={COLORS.primary} />
            </View>
            <Text style={[styles.statCount, { color: COLORS.primary }]}>
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
            <ChevronRight size={16} color={COLORS.primary} />
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
