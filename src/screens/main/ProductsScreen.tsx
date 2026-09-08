import React, { useState, useCallback } from 'react';
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
import { Search, X, SlidersHorizontal } from 'lucide-react-native';

import { Product } from '../../types';
import { COLORS } from '../../constants';
import { useInventory } from '../../context/InventoryContext';
import { ProductCard } from '../../components/ProductCard';
import { EmptyState } from '../../components/EmptyState';
import { FilterModal } from '../../components/FilterModal';
import { styles } from './ProductsScreen.styles';

const QUICK_FILTER_TABS = [
  { id: 'all', label: 'Tümü' },
  { id: 'active', label: 'Devam Eden' },
  { id: 'expiring_soon', label: 'Yakında Bitecek' },
  { id: 'expired', label: 'Süresi Doldu' },
];

export const ProductsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    products,
    isLoading,
    isRefreshing,
    refreshProducts,
    filterOptions,
    setFilterOptions,
    resetFilters,
  } = useInventory();

  const [searchText, setSearchText] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

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
      navigation.navigate('ProductDetail', {
        productId: product.id,
        initialProduct: product,
      });
    },
    [navigation]
  );

  const hasActiveFilters =
    filterOptions.categoryId !== undefined ||
    (filterOptions.warrantyStatus && filterOptions.warrantyStatus !== 'all');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Üst Başlık */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ürünler</Text>
      </View>

      <View style={styles.container}>
        {/* Arama Çubuğu */}
        <View style={styles.searchContainer}>
          <Search size={18} color={COLORS.outline} style={styles.searchIcon} />
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
              activeOpacity={0.7}
            >
              <X size={16} color={COLORS.outline} />
            </TouchableOpacity>
          )}
        </View>

        {/* Yatay Filtre Çipleri ve Filtre Butonu */}
        <View style={styles.filterRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {QUICK_FILTER_TABS.map((tab) => {
              const isSelected =
                (filterOptions.warrantyStatus || 'all') === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipSelected,
                  ]}
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

          {/* Gelişmiş Filtreleme Modalı Açma Butonu */}
          <TouchableOpacity
            style={[
              styles.tuneButton,
              hasActiveFilters && styles.tuneButtonActive,
            ]}
            onPress={() => setFilterModalVisible(true)}
            activeOpacity={0.7}
          >
            <SlidersHorizontal
              size={17}
              color={hasActiveFilters ? COLORS.primary : COLORS.outline}
            />
          </TouchableOpacity>
        </View>

        {/* Ürün Sayacı Başlığı */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.productCountText}>{products.length} ürün</Text>
        </View>

        {/* Ürün Listesi */}
        {isLoading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
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
                refreshing={isRefreshing}
                onRefresh={refreshProducts}
                tintColor={COLORS.primary}
                colors={[COLORS.primary]}
              />
            }
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                showPercentageGauge={false}
                onPress={() => handleProductPress(item)}
              />
            )}
            ListEmptyComponent={
              <EmptyState
                title={
                  searchText || hasActiveFilters
                    ? 'Eşleşen Ürün Bulunamadı'
                    : 'Henüz ürün eklenmemiş'
                }
                description={
                  searchText || hasActiveFilters
                    ? 'Arama kriterlerinizi veya filtrelerinizi değiştirerek tekrar deneyebilirsiniz.'
                    : 'Envanterinizi oluşturmak ve garantilerinizi takip etmek için ilk ürününüzü ekleyin.'
                }
                actionText={
                  searchText || hasActiveFilters
                    ? 'Filtreleri Temizle'
                    : 'İlk Ürünü Ekle'
                }
                onActionPress={() => {
                  if (searchText || hasActiveFilters) {
                    setSearchText('');
                    resetFilters();
                  } else {
                    navigation.navigate('AddTab');
                  }
                }}
              />
            }
          />
        )}
      </View>

      {/* Gelişmiş Filtreleme Modalı */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedCategoryId={filterOptions.categoryId}
        onSelectCategory={(id) =>
          setFilterOptions((prev) => ({ ...prev, categoryId: id }))
        }
        selectedStatus={filterOptions.warrantyStatus || 'all'}
        onSelectStatus={(status) =>
          setFilterOptions((prev) => ({ ...prev, warrantyStatus: status }))
        }
        onReset={() => {
          resetFilters();
          setSearchText('');
        }}
      />
    </SafeAreaView>
  );
};
