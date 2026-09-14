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
  Heart,
} from 'lucide-react-native';

import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useInventory } from '../context/InventoryContext';
import { useAlert } from '../context/AlertContext';
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
  showFavoriteButton?: boolean;
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
  ({ product, onPress, showPercentageGauge = false, showFavoriteButton = true }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { isFavorite, toggleFavorite } = useInventory();
    const { showSuccess, showInfo } = useAlert();

    const isFav = isFavorite(product.id) || product.is_favorite === true;

    const handleFavoritePress = async () => {
      const willBeFav = !isFav;
      await toggleFavorite(product.id);
      if (willBeFav) {
        showSuccess('Ürün favorilere eklendi.');
      } else {
        showInfo('Ürün favorilerden çıkarıldı.');
      }
    };

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

        {/* Sağ Bölüm: Favori Butonu (Opsiyonel) + Yüzde Çemberi veya Durum Rozeti */}
        <View style={[styles.rightSection, !showFavoriteButton && styles.rightSectionCentered]}>
          {showFavoriteButton && (
            <TouchableOpacity
              style={[styles.favoriteButton, isFav && styles.favoriteButtonActive]}
              onPress={handleFavoritePress}
              activeOpacity={0.65}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Heart
                size={15}
                color={isFav ? '#ef4444' : colors.outline}
                fill={isFav ? '#ef4444' : 'transparent'}
              />
            </TouchableOpacity>
          )}

          {showPercentageGauge ? (
            <View style={styles.gaugeContainer}>
              <CircularProgress
                size={showFavoriteButton ? 36 : 40}
                strokeWidth={3}
                percentage={percentage}
                color={statusInfo.color}
                backgroundColor={colors.surfaceContainer}
                centerText={`%${percentage}`}
                textStyle={{ fontSize: showFavoriteButton ? 9 : 10, fontWeight: '700' }}
              />
              <ChevronRight size={showFavoriteButton ? 15 : 16} color={colors.outline} style={styles.chevron} />
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

