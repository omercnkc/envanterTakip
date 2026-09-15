import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
} from 'react-native';
import { DEFAULT_CATEGORIES, CategoryItem } from '../constants';
import { getCategoryDisplayName } from '../constants/categories';
import { useTranslation } from '../i18n';
import { ProductFilterOptions } from '../types';
import { useSwipeDownToClose } from '../hooks/useSwipeDownToClose';
import { styles } from './FilterModal.styles';


type WarrantyFilterStatus = NonNullable<ProductFilterOptions['warrantyStatus']>;

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCategoryId?: number;
  onSelectCategory: (id?: number) => void;
  selectedStatus: WarrantyFilterStatus;
  onSelectStatus: (status: WarrantyFilterStatus) => void;
  onReset: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedCategoryId,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  onReset,
}) => {
  const { t, language } = useTranslation();
  const { panHandlers, translateY, handleClose } = useSwipeDownToClose({
    onClose,
    visible,
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>

          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
              <View {...panHandlers} style={styles.dragHandleContainer}>
                <View style={styles.dragHandle} />
              </View>

              <View style={styles.header}>
                <Text style={styles.title}>{t('products.filterButton')}</Text>
                <TouchableOpacity onPress={onReset} activeOpacity={0.7}>
                  <Text style={styles.resetButtonText}>{t('products.resetFilters')}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
              >
                {/* Kategori Filtresi */}
                <Text style={styles.sectionTitle}>{language === 'tr' ? 'Kategori' : 'Category'}</Text>
                <View style={styles.chipContainer}>
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      selectedCategoryId === undefined && styles.chipActive,
                    ]}
                    onPress={() => onSelectCategory(undefined)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedCategoryId === undefined && styles.chipTextActive,
                      ]}
                    >
                      {language === 'tr' ? 'Tümü' : 'All'}
                    </Text>
                  </TouchableOpacity>
                  {DEFAULT_CATEGORIES.map((cat: CategoryItem) => {
                    const isSelected = selectedCategoryId === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[styles.chip, isSelected && styles.chipActive]}
                        onPress={() =>
                          onSelectCategory(isSelected ? undefined : cat.id)
                        }
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextActive,
                          ]}
                        >
                          {getCategoryDisplayName(cat.name, language)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Garanti Durumu Filtresi */}
                <Text style={styles.sectionTitle}>{language === 'tr' ? 'Garanti Durumu' : 'Warranty Status'}</Text>
                <View style={styles.chipContainer}>
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      selectedStatus === 'all' && styles.chipActive,
                    ]}
                    onPress={() => onSelectStatus('all')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedStatus === 'all' && styles.chipTextActive,
                      ]}
                    >
                      {language === 'tr' ? 'Tümü' : 'All'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      selectedStatus === 'favorites' && styles.chipActive,
                    ]}
                    onPress={() => onSelectStatus('favorites')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedStatus === 'favorites' && styles.chipTextActive,
                      ]}
                    >
                      {language === 'tr' ? '❤️ Favoriler' : '❤️ Favorites'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      selectedStatus === 'active' && styles.chipActive,
                    ]}
                    onPress={() => onSelectStatus('active')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedStatus === 'active' && styles.chipTextActive,
                      ]}
                    >
                      {language === 'tr' ? 'Devam Ediyor' : 'Active'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      selectedStatus === 'expiring_soon' && styles.chipActive,
                    ]}
                    onPress={() => onSelectStatus('expiring_soon')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedStatus === 'expiring_soon' &&
                          styles.chipTextActive,
                      ]}
                    >
                      {language === 'tr' ? 'Yakında Bitiyor' : 'Expiring Soon'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      selectedStatus === 'expired' && styles.chipActive,
                    ]}
                    onPress={() => onSelectStatus('expired')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedStatus === 'expired' && styles.chipTextActive,
                      ]}
                    >
                      {language === 'tr' ? 'Süresi Doldu' : 'Expired'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.applyButtonText}>{language === 'tr' ? 'Uygula' : 'Apply'}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>

  );
};
