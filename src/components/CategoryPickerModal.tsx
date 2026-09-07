import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
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
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Kategori Seçin</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
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
                        onClose();
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                        {renderCategoryIcon(item.icon, isSelected)}
                      </View>
                      <Text style={[styles.categoryName, isSelected && styles.categoryNameSelected]}>
                        {item.name}
                      </Text>
                      {isSelected && <Check size={20} color={COLORS.primary} />}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
