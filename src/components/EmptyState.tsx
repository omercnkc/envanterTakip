import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PackageOpen, Plus } from 'lucide-react-native';
import { COLORS } from '../constants';
import { styles } from './EmptyState.styles';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionText?: string;
  onActionPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'Henüz ürün eklenmemiş',
  description = 'Envanterinizi oluşturmak ve garantilerinizi takip etmek için ilk ürününüzü ekleyin.',
  actionText = 'Ürün Ekle',
  onActionPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <View style={styles.innerIconCircle}>
          {icon || <PackageOpen size={44} color={COLORS.primary} />}
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onActionPress && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onActionPress}
          activeOpacity={0.8}
        >
          <Plus size={18} color={COLORS.onPrimary} style={styles.buttonIcon} />
          <Text style={styles.actionButtonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
