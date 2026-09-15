import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TouchableWithoutFeedback, Animated } from 'react-native';
import { useSwipeDownToClose } from '../hooks/useSwipeDownToClose';
import {

  X,
  Check,
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

import { Category } from '../types';
import { COLORS } from '../constants';
import { getCategoryDisplayName } from '../constants/categories';
import { useTranslation } from '../i18n';
import { styles } from './CategoryPickerModal.styles';

interface CategoryPickerModalProps {
  visible: boolean;
  categories: Category[];
  selectedCategoryId: number | null | undefined;
  onSelect: (category: Category) => void;
  onClose: () => void;
}

const renderCategoryIcon = (iconName: string, isSelected: boolean) => {
  const color = isSelected ? COLORS.onPrimary : COLORS.primary;
  const size = 20;

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

export const CategoryPickerModal: React.FC<CategoryPickerModalProps> = ({
  visible,
  categories,
  selectedCategoryId,
  onSelect,
  onClose,
}) => {
  const { t, language } = useTranslation();
  const { panHandlers, translateY, handleClose } = useSwipeDownToClose({
    onClose,
    visible,
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContent, { transform: [{ translateY }] }]}>
              <View {...panHandlers} style={styles.handleContainer}>
                <View style={styles.handleBar} />
              </View>

              <View style={styles.header}>
                <Text style={styles.title}>{t('modals.categoryPickerTitle')}</Text>

                <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.7}>
                  <X size={24} color={COLORS.onSurface} />
                </TouchableOpacity>
              </View>

              <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelected = selectedCategoryId === item.id;
                  return (
                    <TouchableOpacity
                      style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
                      onPress={() => {
                        onSelect(item);
                        handleClose();
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                        {renderCategoryIcon(item.icon, isSelected)}
                      </View>
                      <Text style={[styles.categoryName, isSelected && styles.categoryNameSelected]}>
                        {getCategoryDisplayName(item.name, language)}
                      </Text>
                      {isSelected && <Check size={20} color={COLORS.primary} />}
                    </TouchableOpacity>
                  );
                }}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>

  );
};
