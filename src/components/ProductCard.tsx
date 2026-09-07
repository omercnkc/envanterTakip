import React from 'react';
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
} from 'lucide-react-native';

import { Product } from '../types';
import { COLORS } from '../constants';
import { formatDateTurkish } from '../utils/warrantyCalculator';
import { WarrantyBadge } from './WarrantyBadge';
import { styles } from './ProductCard.styles';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const getCategoryIcon = (iconName?: string | null, size = 28) => {
  const color = COLORS.primary;
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

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onPress }) => {
  const categoryName = product.category?.name || 'Genel';
  const brandName = product.brand ? ` • ${product.brand}` : '';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Görsel / İkon Konteynırı */}
      <View style={styles.imageContainer}>
        {product.image_path ? (
          <Image source={{ uri: product.image_path }} style={styles.image} />
        ) : (
          getCategoryIcon(product.category?.icon)
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
        <Text style={styles.warrantyDate}>
          Garanti bitişi: {formatDateTurkish(product.warranty_end_date)}
        </Text>
      </View>

      {/* Garanti Durum Rozeti */}
      <View style={styles.rightSection}>
        <WarrantyBadge warrantyEndDate={product.warranty_end_date} />
      </View>
    </TouchableOpacity>
  );
});
