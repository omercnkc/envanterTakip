import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, X, Package, SlidersHorizontal } from 'lucide-react-native';

import { Product } from '../../types';
import { COLORS } from '../../constants';
import { useInventory } from '../../context/InventoryContext';
import { ProductCard } from '../../components/ProductCard';
import { styles } from './ProductsScreen.styles';

const FILTER_TABS = [
  { id: 'all', label: 'Tümü' },
  { id: 'active', label: 'Devam Eden' },
  { id: 'expiring_soon', label: 'Yakında Bitecek' },
  { id: 'expired', label: 'Süresi Doldu' },
];

export const ProductsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { products, loading, refreshing, refresh, filterOptions, setFilterOptions } = useInventory();

  const [searchText, setSearchText] = useState('');

  // Arama metni değiştiğinde filtre seçeneklerini güncelle
  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setFilterOptions((prev) => ({ ...prev, searchQuery: text }));
  };

  // Garanti durumu sekmesi değişimi
  const handleSelectStatus = (statusId: string) => {
    setFilterOptions((prev) => ({
      ...prev,
      warrantyStatus: statusId as any,
    }));
  };

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetail', { productId: product.id, initialProduct: product });
    },
    [navigation]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Üst Başlık */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Varlıklarım</Text>
      </View>

      <View style={styles.container}>
        {/* Arama Çubuğu */}
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.outline} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ara (ürün, marka, model, seri no)"
            placeholderTextColor={COLORS.outline}
            value={searchText}
            onChangeText={handleSearchChange}
            autoCapitalize="none"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={() => handleSearchChange('')}
            >
              <X size={18} color={COLORS.outline} />
            </TouchableOpacity>
          )}
        </View>

        {/* Yatay Filtre Çipleri */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTER_TABS.map((tab) => {
            const isSelected = (filterOptions.warrantyStatus || 'all') === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                onPress={() => handleSelectStatus(tab.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextSelected,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Ürün Sayacı Başlığı */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.productCountText}>{products.length} ürün</Text>
        </View>

        {/* Ürün Listesi (FlatList) */}
        {loading && !refreshing ? (
          <View style={[styles.emptyContainer, { flex: 1 }]}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                tintColor={COLORS.primary}
              />
            }
            renderItem={({ item }) => (
              <ProductCard product={item} onPress={() => handleProductPress(item)} />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Package size={56} color={COLORS.outline} />
                <Text style={styles.emptyTitle}>Kayıtlı Ürün Bulunamadı</Text>
                <Text style={styles.emptySubtitle}>
                  {searchText
                    ? `"${searchText}" aramasına uygun ürün bulunamadı.`
                    : 'Henüz bir ürün eklemediniz. "+ Ekle" sekmesinden yeni ürün ekleyebilirsiniz.'}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};
