import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ArrowLeft } from 'lucide-react-native';

import { ProductFormData, productFormSchema, Category } from '../../types';
import { COLORS } from '../../constants';
import { useInventory } from '../../context/InventoryContext';
import { CategoryPickerModal } from '../../components/CategoryPickerModal';
import { styles } from './EditProductScreen.styles';

export const EditProductScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { productId, product: initialProduct } = route.params || {};

  const { updateProduct, getProduct, categories } = useInventory();

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(!initialProduct);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialProduct
      ? {
          name: initialProduct.name,
          brand: initialProduct.brand || '',
          model: initialProduct.model || '',
          category_id: initialProduct.category_id,
          serial_number: initialProduct.serial_number || '',
          purchase_date: initialProduct.purchase_date || '',
          purchase_price: initialProduct.purchase_price ?? undefined,
          warranty_duration_months: initialProduct.warranty_duration_months ?? 24,
          warranty_end_date: initialProduct.warranty_end_date,
          store_name: initialProduct.store_name || '',
          description: initialProduct.description || '',
          image_path: initialProduct.image_path || null,
          invoice_path: initialProduct.invoice_path || null,
        }
      : undefined,
  });

  useEffect(() => {
    if (initialProduct) {
      const cat = categories.find((c) => c.id === initialProduct.category_id);
      if (cat) setSelectedCategory(cat);
      return;
    }

    if (productId) {
      const fetchInitial = async () => {
        setLoadingInitial(true);
        const prod = await getProduct(productId);
        if (prod) {
          reset({
            name: prod.name,
            brand: prod.brand || '',
            model: prod.model || '',
            category_id: prod.category_id,
            serial_number: prod.serial_number || '',
            purchase_date: prod.purchase_date || '',
            purchase_price: prod.purchase_price ?? undefined,
            warranty_duration_months: prod.warranty_duration_months ?? 24,
            warranty_end_date: prod.warranty_end_date,
            store_name: prod.store_name || '',
            description: prod.description || '',
            image_path: prod.image_path || null,
            invoice_path: prod.invoice_path || null,
          });
          const cat = categories.find((c) => c.id === prod.category_id);
          if (cat) setSelectedCategory(cat);
        }
        setLoadingInitial(false);
      };
      fetchInitial();
    }
  }, [productId, initialProduct, categories, getProduct, reset]);

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setValue('category_id', cat.id);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      const res = await updateProduct(productId, data);
      if (!res.success) {
        Alert.alert('Hata', res.error || 'Ürün güncellenirken bir hata oluştu.');
        return;
      }

      Alert.alert('Başarılı', 'Ürün bilgileri başarıyla güncellendi.', [
        {
          text: 'Tamam',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch {
      Alert.alert('Hata', 'Ürün güncellenemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Üst Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={COLORS.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ürünü Düzenle</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Temel Bilgiler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Temel Bilgiler</Text>

            {/* Ürün Adı */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Ürün Adı <Text style={styles.requiredStar}>*</Text>
              </Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="Örn. Samsung QLED 4K TV"
                    placeholderTextColor={COLORS.outline}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
            </View>

            {/* Marka & Model */}
            <View style={styles.twoColumnRow}>
              <View style={[styles.formGroup, styles.twoColumnItem]}>
                <Text style={styles.label}>
                  Marka <Text style={styles.requiredStar}>*</Text>
                </Text>
                <Controller
                  control={control}
                  name="brand"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, errors.brand && styles.inputError]}
                      placeholder="Örn. Samsung"
                      placeholderTextColor={COLORS.outline}
                      value={value ?? ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.brand && <Text style={styles.errorText}>{errors.brand.message}</Text>}
              </View>

              <View style={[styles.formGroup, styles.twoColumnItem]}>
                <Text style={styles.label}>Model</Text>
                <Controller
                  control={control}
                  name="model"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Örn. Q60B 55 Inch"
                      placeholderTextColor={COLORS.outline}
                      value={value ?? ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </View>
            </View>

            {/* Kategori Seçimi */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Kategori <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.pickerButton, errors.category_id && styles.inputError]}
                onPress={() => setCategoryModalVisible(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={
                    selectedCategory ? styles.pickerButtonText : styles.pickerPlaceholderText
                  }
                >
                  {selectedCategory?.name || 'Kategori seçin'}
                </Text>
                <ChevronDown size={20} color={COLORS.outline} />
              </TouchableOpacity>
              {errors.category_id && (
                <Text style={styles.errorText}>{errors.category_id.message}</Text>
              )}
            </View>

            {/* Seri Numarası */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Seri Numarası</Text>
              <Controller
                control={control}
                name="serial_number"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Örn. SN-98214300"
                    placeholderTextColor={COLORS.outline}
                    value={value ?? ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
          </View>

          {/* Satın Alma & Garanti Bilgileri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Satın Alma & Garanti Bilgileri</Text>

            <View style={styles.twoColumnRow}>
              <View style={[styles.formGroup, styles.twoColumnItem]}>
                <Text style={styles.label}>Satın Alma Tarihi</Text>
                <Controller
                  control={control}
                  name="purchase_date"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-AA-GG"
                      placeholderTextColor={COLORS.outline}
                      value={value ?? ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </View>

              <View style={[styles.formGroup, styles.twoColumnItem]}>
                <Text style={styles.label}>Satın Alma Fiyatı</Text>
                <Controller
                  control={control}
                  name="purchase_price"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.priceInputWrapper}>
                      <Text style={styles.currencyPrefix}>₺</Text>
                      <TextInput
                        style={styles.priceTextInput}
                        placeholder="0,00"
                        placeholderTextColor={COLORS.outline}
                        keyboardType="numeric"
                        value={value !== undefined && value !== null ? String(value) : ''}
                        onChangeText={(val) => onChange(val ? parseFloat(val) : undefined)}
                        onBlur={onBlur}
                      />
                    </View>
                  )}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Satın Alınan Mağaza</Text>
              <Controller
                control={control}
                name="store_name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Örn. Teknosa"
                    placeholderTextColor={COLORS.outline}
                    value={value ?? ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Garanti Bitiş Tarihi <Text style={styles.requiredStar}>*</Text>
              </Text>
              <Controller
                control={control}
                name="warranty_end_date"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.warranty_end_date && styles.inputError]}
                    placeholder="YYYY-AA-GG"
                    placeholderTextColor={COLORS.outline}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.warranty_end_date && (
                <Text style={styles.errorText}>{errors.warranty_end_date.message}</Text>
              )}
            </View>
          </View>

          {/* Ek Bilgiler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ek Bilgiler</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Açıklama</Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textArea}
                    placeholder="Eklemek istediğiniz notlar..."
                    placeholderTextColor={COLORS.outline}
                    multiline
                    value={value ?? ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>

        {/* Alt Sabit Güncelle Butonu */}
        <View style={styles.fixedBottomBar}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color={COLORS.onPrimary} />
            ) : (
              <Text style={styles.submitButtonText}>Değişiklikleri Kaydet</Text>
            )}
          </TouchableOpacity>
        </View>

        <CategoryPickerModal
          visible={categoryModalVisible}
          categories={categories}
          selectedCategoryId={selectedCategory?.id}
          onSelect={handleSelectCategory}
          onClose={() => setCategoryModalVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
