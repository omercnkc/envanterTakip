import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { DEFAULT_CATEGORIES, CategoryItem } from '../constants';
import { ProductFilterOptions } from '../types';
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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.dragHandle} />

              <View style={styles.header}>
                <Text style={styles.title}>Filtrele</Text>
                <TouchableOpacity onPress={onReset} activeOpacity={0.7}>
                  <Text style={styles.resetButtonText}>Temizle</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
              >
                {/* Kategori Filtresi */}
                <Text style={styles.sectionTitle}>Kategori</Text>
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
                      Tümü
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
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Garanti Durumu Filtresi */}
                <Text style={styles.sectionTitle}>Garanti Durumu</Text>
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
                      Tümü
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
                      Devam Ediyor
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
                      Yakında Bitiyor
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
                      Süresi Doldu
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.applyButtonText}>Uygula</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
