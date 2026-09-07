import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Package, ShieldCheck, Clock, AlertTriangle, Bell } from 'lucide-react-native';

import { useNavigation } from '@react-navigation/native';
import { MainTabParamList, Product } from '../../types';
import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../context/InventoryContext';
import { ProductCard } from '../../components/ProductCard';
import { styles } from './HomeScreen.styles';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile, user } = useAuth();
  const { products, stats, setFilterOptions } = useInventory();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı';

  // Son eklenen 3 ürün
  const recentProducts = products.slice(0, 3);

  const handleStatCardPress = (statusFilter?: string) => {
    if (statusFilter) {
      setFilterOptions((prev) => ({ ...prev, warrantyStatus: statusFilter as any }));
    }
    navigation.navigate('ProductsTab');
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
      >
        {/* Üst Karşılama ve Bildirim İkonu */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Merhaba,</Text>
            <Text style={styles.userNameText}>{displayName}</Text>
          </View>
          <TouchableOpacity
            style={styles.bellButton}
            activeOpacity={0.7}
          >
            <Bell size={20} color={COLORS.onSurface} />
          </TouchableOpacity>
        </View>

        {/* 4'lü İstatistik Izgarası */}
        <View style={styles.statsGrid}>
          {/* Toplam Ürün */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => handleStatCardPress('all')}
            activeOpacity={0.7}
          >
            <View style={styles.statHeader}>
              <Package size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.statCount}>{stats.total}</Text>
            <Text style={styles.statLabel}>Toplam Varlık</Text>
          </TouchableOpacity>

          {/* Devam Eden */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => handleStatCardPress('active')}
            activeOpacity={0.7}
          >
            <View style={styles.statHeader}>
              <ShieldCheck size={20} color={COLORS.tertiary} />
            </View>
            <Text style={[styles.statCount, { color: COLORS.tertiary }]}>{stats.active}</Text>
            <Text style={styles.statLabel}>Garanti Devam Eden</Text>
          </TouchableOpacity>

          {/* Yakında Bitecek */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => handleStatCardPress('expiring_soon')}
            activeOpacity={0.7}
          >
            <View style={styles.statHeader}>
              <Clock size={20} color={COLORS.warning} />
            </View>
            <Text style={[styles.statCount, { color: COLORS.warning }]}>{stats.expiringSoon}</Text>
            <Text style={styles.statLabel}>Yakında Bitiyor</Text>
          </TouchableOpacity>

          {/* Garanti Bitti */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => handleStatCardPress('expired')}
            activeOpacity={0.7}
          >
            <View style={styles.statHeader}>
              <AlertTriangle size={20} color={COLORS.error} />
            </View>
            <Text style={[styles.statCount, { color: COLORS.error }]}>{stats.expired}</Text>
            <Text style={styles.statLabel}>Garanti Bitti</Text>
          </TouchableOpacity>
        </View>

        {/* Son Eklenenler Başlığı */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Son Eklenenler</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProductsTab')}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAllLink}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>

        {/* Son Eklenen Ürünler Listesi veya Boş Durum */}
        {recentProducts.length > 0 ? (
          <View>
            {recentProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onPress={() => handleProductPress(p)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Package size={48} color={COLORS.outline} />
            <Text style={styles.emptyTitle}>Henüz Kayıtlı Ürününüz Yok</Text>
            <Text style={styles.emptySubtitle}>
              Elektronik aletlerinizi ve ev eşyalarınızı ekleyerek garanti sürelerini takip etmeye başlayın.
            </Text>
            <TouchableOpacity
              style={styles.addPromptButton}
              onPress={() => navigation.navigate('AddProductTab')}
              activeOpacity={0.8}
            >
              <Text style={styles.addPromptButtonText}>+ İlk Ürününü Ekle</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
