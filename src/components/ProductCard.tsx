import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {
  Tv,
  Laptop,
  Smartphone,
  Tablet,
  Refrigerator,
  Coffee,
  Armchair,
  Utensils,
  Gamepad2,
  Package,
  Calendar,
  ChevronRight,
} from 'lucide-react-native';

import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  formatDateTurkish,
  calculateWarrantyStatus,
  calculateWarrantyPercentage,
} from '../utils/warrantyCalculator';
import { CircularProgress } from './CircularProgress';
import { getStyles } from './ProductCard.styles';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  showPercentageGauge?: boolean;
}

const getCategoryIcon = (iconName?: string | null, size = 26, color = '#4648d4') => {
  switch (iconName) {
    case 'tv':
      return <Tv size={size} color={color} />;
    case 'laptop':
      return <Laptop size={size} color={color} />;
    case 'smartphone':
      return <Smartphone size={size} color={color} />;
    case 'tablet':
      return <Tablet size={size} color={color} />;
    case 'refrigerator':
      return <Refrigerator size={size} color={color} />;
    case 'coffee':
      return <Coffee size={size} color={color} />;
    case 'armchair':
      return <Armchair size={size} color={color} />;
    case 'utensils':
      return <Utensils size={size} color={color} />;
    case 'gamepad-2':
      return <Gamepad2 size={size} color={color} />;
    default:
      return <Package size={size} color={color} />;
  }
};

export const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ product, onPress, showPercentageGauge = false }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const categoryName = product.category?.name || 'Genel';
    const brandName = product.brand ? ` • ${product.brand}` : '';

    // Lazy evaluation: Yüzde hesaplamasını sadece gösterge aktifse çalıştır
    const statusInfo = useMemo(
      () => calculateWarrantyStatus(product.warranty_end_date, colors),
      [product.warranty_end_date, colors]
    );

    const percentage = useMemo(
      () =>
        showPercentageGauge
          ? calculateWarrantyPercentage(product.purchase_date, product.warranty_end_date)
          : 0,
      [showPercentageGauge, product.purchase_date, product.warranty_end_date]
    );

    return (
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        {/* Görsel / İkon Konteynırı */}
        <View style={styles.imageContainer}>
          {product.image_path ? (
            <Image
              source={{ uri: product.image_path }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.iconPlaceholder}>
              {getCategoryIcon(product.category?.icon, 26, colors.primary)}
            </View>
          )}
        </View>

        {/* Ürün Metinleri */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.categoryBrand} numberOfLines={1}>
            {categoryName}
            {brandName}
          </Text>
          <View style={styles.dateRow}>
            <Calendar size={13} color={colors.outline} style={styles.dateIcon} />
            <Text style={styles.warrantyDate} numberOfLines={1}>
              {showPercentageGauge
                ? `${formatDateTurkish(product.warranty_end_date)} tarihine kadar`
                : `Garanti bitişi: ${formatDateTurkish(product.warranty_end_date)}`}
            </Text>
          </View>
        </View>

        {/* Sağ Bölüm: Yüzde Çemberi veya Durum Rozeti */}
        <View style={styles.rightSection}>
          {showPercentageGauge ? (
            <View style={styles.gaugeContainer}>
              <CircularProgress
                size={40}
                strokeWidth={3}
                percentage={percentage}
                color={statusInfo.color}
                backgroundColor={colors.surfaceContainer}
                centerText={`%${percentage}`}
                textStyle={{ fontSize: 10, fontWeight: '700' }}
              />
              <ChevronRight size={16} color={colors.outline} style={styles.chevron} />
            </View>
          ) : (
            <View style={styles.statusBadgeWrapper}>
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

