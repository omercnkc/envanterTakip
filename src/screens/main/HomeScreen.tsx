import React, { useState, useCallback, useMemo } from 'react';
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
  QrCode,
  TrendingUp,
} from 'lucide-react-native';

import { Product } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../context/InventoryContext';
import { useAlert } from '../../context/AlertContext';
import { ProductCard } from '../../components/ProductCard';
import { EmptyState } from '../../components/EmptyState';
import { BarcodeScannerModal } from '../../components/BarcodeScannerModal';
import { FinancialAnalyticsModal } from '../../components/FinancialAnalyticsModal';
import { calculateWarrantyStatus, formatCurrency } from '../../utils/warrantyCalculator';
import { calculateFinancialAnalytics } from '../../utils/financialCalculator';
import { getStyles } from './HomeScreen.styles';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile, user } = useAuth();
  const {
    allProducts,
    stats,
    refreshProducts,
    isRefreshing,
    getProduct,
    setFilterOptions,
  } = useInventory();
  const { showSuccess, showAlert } = useAlert();
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [financialModalOpen, setFinancialModalOpen] = useState(false);
  const financialStats = useMemo(() => calculateFinancialAnalytics(allProducts), [allProducts]);

  const handleFilterCategoryFromModal = (categoryId: string) => {
    setFinancialModalOpen(false);
    const catNum = Number(categoryId);
    if (!isNaN(catNum) && catNum > 0) {
      setFilterOptions((prev) => ({ ...prev, categoryId: catNum }));
    }
    navigation.navigate('ProductsTab');
  };

  const handleQrScan = async (scannedData: string) => {
    let targetId = scannedData.trim();
    if (targetId.includes('product/')) {
      targetId = targetId.split('product/')[1].split('?')[0].split('/')[0];
    } else if (targetId.startsWith('ENVANTER:')) {
      targetId = targetId.replace('ENVANTER:', '').trim();
    }

    // 1. Önce allProducts içinde ID veya Seri No ile ara
    const found = allProducts.find(
      (p) =>
        p.id === targetId ||
        (p.serial_number && p.serial_number.toLowerCase() === scannedData.toLowerCase())
    );

    if (found) {
      showSuccess(`"${found.name}" etiketi okundu.`);
      navigation.navigate('ProductDetail', {
        productId: found.id,
        initialProduct: found,
      });
      return;
    }

    // 2. Uzak sunucudan kontrol et (ID ise)
    if (targetId.includes('-')) {
      const res = await getProduct(targetId);
      if (res) {
        showSuccess(`"${res.name}" etiketi okundu.`);
        navigation.navigate('ProductDetail', {
          productId: res.id,
          initialProduct: res,
        });
        return;
      }
    }

    // 3. Eşleşme yoksa kullanıcıya seçenek sun
    showAlert({
      type: 'info',
      title: 'Ürün Bulunamadı',
      message: `"${scannedData}" kodlu etiket envanterinizdeki herhangi bir ürünle eşleşmedi. Bu kodla yeni bir ürün kaydetmek ister misiniz?`,
      confirmText: 'Ürün Ekle',
      cancelText: 'Vazgeç',
      onConfirm: () => {
        navigation.navigate('AddTab');
      },
    });
  };

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
              {profile?.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.avatarText}>{userInitials}</Text>
              )}
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
              onPress={() => setScannerOpen(true)}
              activeOpacity={0.7}
            >
              <QrCode size={18} color={colors.primary} />
            </TouchableOpacity>
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

        {/* Maddi Envanter & Finans Özeti Kartı */}
        <TouchableOpacity
          style={styles.financialBentoCard}
          onPress={() => setFinancialModalOpen(true)}
          activeOpacity={0.8}
        >
          <View style={styles.financialLeft}>
            <View style={styles.financialIconBox}>
              <TrendingUp size={20} color={colors.primary} />
            </View>
            <View style={styles.financialLabelGroup}>
              <Text style={styles.financialTitle}>Maddi Envanter Değeri</Text>
              <Text style={styles.financialValue}>
                {formatCurrency(financialStats.totalValue)}
              </Text>
              <Text style={styles.financialSubValue}>
                {financialStats.pricedCount > 0
                  ? `${financialStats.pricedCount} kayıtlı eşya · Ort: ${formatCurrency(financialStats.averageValue)}`
                  : 'Fiyat bilgisi girilmemiş'}
              </Text>
            </View>
          </View>

          <View style={styles.financialActionBadge}>
            <Text style={styles.financialActionBadgeText}>Analiz</Text>
            <ChevronRight size={13} color={colors.onPrimary} />
          </View>
        </TouchableOpacity>

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

      {/* QR Kod / Barkod Tarayıcı Modalı */}
      <BarcodeScannerModal
        visible={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleQrScan}
      />

      {/* Finansal Envanter Analizi Modalı */}
      <FinancialAnalyticsModal
        visible={financialModalOpen}
        onClose={() => setFinancialModalOpen(false)}
        onSelectProduct={(p) => handleProductPress(p)}
        onFilterCategory={handleFilterCategoryFromModal}
      />
    </SafeAreaView>
  );
};
