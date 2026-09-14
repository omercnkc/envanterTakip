import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { PieChart as PieChartIcon, ChevronRight, Package, Layers } from 'lucide-react-native';

import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/warrantyCalculator';
import {
  getCategoryChartData,
  CategoryPieChartItem,
} from '../utils/financialCalculator';
import { getStyles } from './CategoryDistributionChart.styles';

interface CategoryDistributionChartProps {
  products: Product[];
  onCategoryFilter?: (categoryId: string, categoryName: string) => void;
  initialMode?: 'count' | 'value';
}

export const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  products,
  onCategoryFilter,
  initialMode = 'value',
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [mode, setMode] = useState<'count' | 'value'>(initialMode);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const { chartData, totalValue, totalCount } = useMemo(
    () => getCategoryChartData(products, mode, selectedCategoryId),
    [products, mode, selectedCategoryId]
  );

  const selectedItem = useMemo(
    () => chartData.find((item) => item.categoryId === selectedCategoryId) || null,
    [chartData, selectedCategoryId]
  );

  const handleSlicePress = (item: CategoryPieChartItem) => {
    if (selectedCategoryId === item.categoryId) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(item.categoryId);
    }
  };

  const handleFilterClick = () => {
    if (selectedItem && onCategoryFilter) {
      onCategoryFilter(selectedItem.categoryId, selectedItem.categoryName);
    }
  };

  // Gifted Charts format
  const giftedPieData = useMemo(() => {
    return chartData.map((item) => ({
      value: item.value,
      color: item.color,
      focused: item.focused,
      onPress: () => handleSlicePress(item),
    }));
  }, [chartData]);

  if (products.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Package size={28} color={colors.onSurfaceVariant} />
          <Text style={styles.emptyText}>Grafik için henüz kayıtlı ürün bulunmuyor.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Başlık & Mod Seçici (Adet / Tutar) */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <PieChartIcon size={18} color={colors.primary} />
          <Text style={styles.title}>Kategori Dağılımı</Text>
        </View>

        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'count' && styles.toggleBtnActive]}
            onPress={() => setMode('count')}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleText, mode === 'count' && styles.toggleTextActive]}>
              Adet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'value' && styles.toggleBtnActive]}
            onPress={() => setMode('value')}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleText, mode === 'value' && styles.toggleTextActive]}>
              Tutar (₺)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Donut Halka Grafik */}
      <View style={styles.chartWrapper}>
        <PieChart
          data={giftedPieData}
          donut
          isAnimated
          animationDuration={600}
          radius={100}
          innerRadius={68}
          innerCircleColor={colors.surfaceContainerLowest}
          focusOnPress
          centerLabelComponent={() => (
            <View style={styles.centerLabelBox}>
              {selectedItem ? (
                <>
                  <Text style={styles.centerLabelSub} numberOfLines={1}>
                    {selectedItem.categoryName}
                  </Text>
                  <Text style={styles.centerLabelMain} numberOfLines={1}>
                    {mode === 'count'
                      ? `${selectedItem.productCount} Eşya`
                      : formatCurrency(selectedItem.totalCost)}
                  </Text>
                  <Text style={styles.centerLabelHint}>
                    Portföyün %{selectedItem.percentage}'i
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.centerLabelSub}>
                    {mode === 'count' ? 'Toplam Eşya' : 'Toplam Değer'}
                  </Text>
                  <Text style={styles.centerLabelMain} numberOfLines={1}>
                    {mode === 'count' ? `${totalCount} Adet` : formatCurrency(totalValue)}
                  </Text>
                  <Text style={styles.centerLabelHint}>Dilime Dokun</Text>
                </>
              )}
            </View>
          )}
        />
      </View>

      {/* Seçili Kategori Hızlı Filtre Butonu */}
      {selectedItem && onCategoryFilter && (
        <TouchableOpacity
          style={styles.filterActionBtn}
          onPress={handleFilterClick}
          activeOpacity={0.75}
        >
          <Layers size={14} color={colors.primary} />
          <Text style={styles.filterActionText}>
            "{selectedItem.categoryName}" Ürünlerini Filtrele ({selectedItem.productCount})
          </Text>
          <ChevronRight size={14} color={colors.primary} />
        </TouchableOpacity>
      )}

      {/* Kategori Açıklama Listesi (Legend) */}
      <View style={styles.legendContainer}>
        {chartData.map((item) => {
          const isSelected = selectedCategoryId === item.categoryId;
          return (
            <TouchableOpacity
              key={item.categoryId}
              style={[styles.legendItem, isSelected && styles.legendItemActive]}
              onPress={() => handleSlicePress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.legendLeft}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.categoryName} numberOfLines={1}>
                  {item.categoryName}
                </Text>
                <Text style={styles.categoryCountText}>
                  ({item.productCount} adet)
                </Text>
              </View>

              <View style={styles.legendRight}>
                <Text style={styles.amountText}>
                  {mode === 'count' ? `%${item.percentage}` : formatCurrency(item.totalCost)}
                </Text>
                {mode === 'value' && (
                  <Text style={styles.percentageBadge}>%{item.percentage}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
