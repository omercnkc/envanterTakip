import React, { useState, useCallback, useMemo } from 'react';
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
import { Search, X, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react-native';

import { Product } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useInventory } from '../../context/InventoryContext';
import { ProductCard } from '../../components/ProductCard';
import { EmptyState } from '../../components/EmptyState';
import { FilterModal } from '../../components/FilterModal';
import { TechOrbitLoader } from '../../components/TechOrbitLoader';
import { getStyles } from './ProductsScreen.styles';

const ITEMS_PER_PAGE = 5;

const QUICK_FILTER_TABS = [
  { id: 'all', label: 'Tümü' },
  { id: 'favorites', label: '❤️ Favoriler' },
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

  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [searchText, setSearchText] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const flatListRef = React.useRef<FlatList<any>>(null);

  // Arama metni değiştiğinde 1. sayfaya sıfırla
  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setPage(1);
    setFilterOptions((prev) => ({ ...prev, searchQuery: text }));
  };

  // Garanti durumu sekmesi değişimi
  const handleSelectStatus = (statusId: string) => {
    setPage(1);
    setFilterOptions((prev) => ({
      ...prev,
      warrantyStatus: statusId as any,
    }));
  };

  const handleRefresh = async () => {
    await refreshProducts();
  };

  // Toplam sayfa sayısı (Her sayfada 5 ürün)
  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));

  // Filtreleme sonrası sayfa aşımı olursa son sayfaya çek
  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, products.length);

  // Lazy evaluation: SADECE AKTİF SAYFADAKİ 5 ÜRÜNÜ RENDERLA
  const activePageProducts = useMemo(() => {
    return products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [products, startIndex]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
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
          <Search size={18} color={colors.outline} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ara (ürün, marka, model, seri no)"
            placeholderTextColor={colors.outline}
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
              <X size={16} color={colors.outline} />
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
              color={hasActiveFilters ? colors.primary : colors.outline}
            />
          </TouchableOpacity>
        </View>

        {/* Ürün Sayacı ve Sayfa Bilgisi */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.productCountText}>
            {products.length > 0
              ? `${startIndex + 1}-${endIndex} / ${products.length} ürün`
              : '0 ürün'}
          </Text>
          {totalPages > 1 && (
            <Text style={styles.pageIndicatorText}>
              Sayfa {page} / {totalPages}
            </Text>
          )}
        </View>

        {/* Ürün Listesi - Yalnızca aktif sayfa renderlanır */}
        {isLoading && !isRefreshing ? (
          <TechOrbitLoader
            message="Envanter Yükleniyor..."
            subMessage="Cihazlarınız ve garantileriniz listeleniyor"
            fullScreen={false}
          />
        ) : (
          <FlatList
            ref={flatListRef}
            style={styles.flatList}
            data={activePageProducts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              totalPages <= 1 && styles.listContentSinglePage,
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                showPercentageGauge={true}
                showFavoriteButton={false}
                onPress={() => handleProductPress(item)}
              />
            )}
            ListEmptyComponent={
              <View style={styles.listEmpty}>
                <EmptyState
                  title={
                    filterOptions.warrantyStatus === 'favorites'
                      ? 'Henüz Favori Ürününüz Yok'
                      : searchText || hasActiveFilters
                      ? 'Eşleşen Ürün Bulunamadı'
                      : 'Henüz ürün eklenmemiş'
                  }
                  description={
                    filterOptions.warrantyStatus === 'favorites'
                      ? 'Sık takip etmek istediğiniz ürünlerin kalp simgesine dokunarak favorilerinize ekleyebilirsiniz.'
                      : searchText || hasActiveFilters
                      ? 'Arama kriterlerinizi veya filtrelerinizi değiştirerek tekrar deneyebilirsiniz.'
                      : 'Envanterinizi oluşturmak ve garantilerinizi takip etmek için ilk ürününüzü ekleyin.'
                  }
                  actionText={
                    filterOptions.warrantyStatus === 'favorites'
                      ? 'Tüm Ürünleri Gör'
                      : searchText || hasActiveFilters
                      ? 'Filtreleri Temizle'
                      : 'İlk Ürünü Ekle'
                  }
                  onActionPress={() => {
                    if (filterOptions.warrantyStatus === 'favorites') {
                      handleSelectStatus('all');
                    } else if (searchText || hasActiveFilters) {
                      setSearchText('');
                      setPage(1);
                      resetFilters();
                    } else {
                      navigation.navigate('AddTab');
                    }
                  }}
                />
              </View>
            }
          />
        )}

        {/* Sabit Alt Sayfalama Kontrolleri (Dolu ve Boş Sayfalarda Tamamen Aynı Hizada) */}
        {!isLoading && totalPages > 1 && (
          <View style={styles.paginationWrapper}>
            <View style={styles.paginationContainer}>
              {/* Önceki Butonu */}
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  page === 1 && styles.pageButtonDisabled,
                ]}
                onPress={() => handlePageChange(page - 1)}
                disabled={page === 1}
                activeOpacity={0.7}
              >
                <ChevronLeft
                  size={13}
                  color={page === 1 ? colors.outline : colors.onSurface}
                />
                <Text
                  style={[
                    styles.pageButtonText,
                    page === 1 && styles.pageButtonTextDisabled,
                  ]}
                >
                  Önceki
                </Text>
              </TouchableOpacity>

              {/* Sayfa Butonları */}
              <View style={styles.pagePillsContainer}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // Çok sayıda sayfa varsa akıllı elips göster
                  if (
                    totalPages > 6 &&
                    Math.abs(pageNum - page) > 2 &&
                    pageNum !== 1 &&
                    pageNum !== totalPages
                  ) {
                    if (pageNum === 2 || pageNum === totalPages - 1) {
                      return (
                        <Text key={pageNum} style={styles.ellipsisText}>
                          •
                        </Text>
                      );
                    }
                    return null;
                  }

                  const isActive = pageNum === page;
                  return (
                    <TouchableOpacity
                      key={pageNum}
                      style={[
                        styles.pagePill,
                        isActive && styles.pagePillActive,
                      ]}
                      onPress={() => handlePageChange(pageNum)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.pagePillText,
                          isActive && styles.pagePillTextActive,
                        ]}
                      >
                        {pageNum}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Sonraki Butonu */}
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  page === totalPages && styles.pageButtonDisabled,
                ]}
                onPress={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.pageButtonText,
                    page === totalPages && styles.pageButtonTextDisabled,
                  ]}
                >
                  Sonraki
                </Text>
                <ChevronRight
                  size={13}
                  color={page === totalPages ? colors.outline : colors.onSurface}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.pageSummaryText}>
              {products.length} üründen {startIndex + 1}-{endIndex} arası görüntüleniyor
            </Text>
          </View>
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
          setPage(1);
        }}
      />
    </SafeAreaView>
  );
};
