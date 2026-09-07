import React, { useState } from 'react';
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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Camera,
  Image as ImageIcon,
  ChevronDown,
  UploadCloud,
  X,
  ArrowLeft,
} from 'lucide-react-native';

import { ProductFormData, productFormSchema, Category } from '../../types';
import { COLORS } from '../../constants';
import { useInventory } from '../../context/InventoryContext';
import { calculateWarrantyEndDate } from '../../utils/warrantyCalculator';
import { CategoryPickerModal } from '../../components/CategoryPickerModal';
import { styles } from './AddProductScreen.styles';

const DURATION_OPTIONS = [
  { label: '1 Yıl', months: 12 },
  { label: '2 Yıl', months: 24 },
  { label: '3 Yıl', months: 36 },
  { label: '5 Yıl', months: 60 },
];

export const AddProductScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { addProduct, categories } = useInventory();

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(24);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Varsayılan bugünün tarihi
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultWarrantyEnd = calculateWarrantyEndDate(todayStr, 24);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      brand: '',
      model: '',
      category_id: 1,
      serial_number: '',
      purchase_date: todayStr,
      purchase_price: undefined,
      warranty_duration_months: 24,
      warranty_end_date: defaultWarrantyEnd,
      store_name: '',
      description: '',
      image_path: null,
      invoice_path: null,
    },
  });

  const purchaseDateWatch = watch('purchase_date');

  // Garanti Süresi Seçimi ve Otomatik Bitiş Tarihi
  const handleSelectDuration = (months: number) => {
    setSelectedDuration(months);
    setValue('warranty_duration_months', months);
    if (purchaseDateWatch) {
      const calculated = calculateWarrantyEndDate(purchaseDateWatch, months);
      setValue('warranty_end_date', calculated);
    }
  };

  // Kategori Seçimi
  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setValue('category_id', cat.id);
  };

  // Mock Görsel Seçimi (3. Hafta Expo ImagePicker ile tam bağlanacak)
  const handlePickMockImage = () => {
    const sampleImages = [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&auto=format&fit=crop&q=80',
    ];
    const randomImg = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    setImageUri(randomImg);
    setValue('image_path', randomImg);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      const res = await addProduct(data);
      if (!res.success) {
        Alert.alert('Hata', res.error || 'Ürün kaydedilirken bir hata oluştu.');
        return;
      }

      Alert.alert('Başarılı', 'Ürün envanterinize başarıyla eklendi.', [
        {
          text: 'Tamam',
          onPress: () => {
            navigation.navigate('ProductsTab');
          },
        },
      ]);
    } catch {
      Alert.alert('Hata', 'Ürün kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Text style={styles.headerTitle}>Ürün Ekle</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 1. Ürün Fotoğrafı Bölümü */}
          <View style={styles.section}>
            <Text style={styles.label}>Ürün Fotoğrafı</Text>
            {imageUri ? (
              <View style={styles.previewContainer}>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => {
                    setImageUri(null);
                    setValue('image_path', null);
                  }}
                >
                  <X size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoGrid}>
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={handlePickMockImage}
                  activeOpacity={0.7}
                >
                  <Camera size={28} color={COLORS.primary} />
                  <Text style={styles.photoButtonText}>Kamera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={handlePickMockImage}
                  activeOpacity={0.7}
                >
                  <ImageIcon size={28} color={COLORS.primary} />
                  <Text style={styles.photoButtonText}>Galeriden Seç</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* 2. Temel Bilgiler */}
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

            {/* Marka & Model (2 Sütun) */}
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

          {/* 3. Satın Alma & Garanti Bilgileri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Satın Alma & Garanti Bilgileri</Text>

            {/* Satın Alma Tarihi & Fiyatı (2 Sütun) */}
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
                      onChangeText={(val) => {
                        onChange(val);
                        if (val && val.length === 10) {
                          const calculated = calculateWarrantyEndDate(val, selectedDuration);
                          setValue('warranty_end_date', calculated);
                        }
                      }}
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

            {/* Satın Alınan Mağaza */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Satın Alınan Mağaza</Text>
              <Controller
                control={control}
                name="store_name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Örn. Vatan Bilgisayar, MediaMarkt"
                    placeholderTextColor={COLORS.outline}
                    value={value ?? ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>

            {/* Garanti Süresi Hızlı Seçici */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Garanti Süresi</Text>
              <View style={styles.durationSelector}>
                {DURATION_OPTIONS.map((opt) => {
                  const isSelected = selectedDuration === opt.months;
                  return (
                    <TouchableOpacity
                      key={opt.months}
                      style={[styles.durationChip, isSelected && styles.durationChipSelected]}
                      onPress={() => handleSelectDuration(opt.months)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.durationChipText,
                          isSelected && styles.durationChipTextSelected,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Garanti Bitiş Tarihi */}
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

          {/* 4. Ek Bilgiler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ek Bilgiler</Text>

            {/* Açıklama */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Açıklama</Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textArea}
                    placeholder="Eklemek istediğiniz notlar veya garanti koşulları..."
                    placeholderTextColor={COLORS.outline}
                    multiline
                    value={value ?? ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>

            {/* Fatura Fotoğrafı Yükleme */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Fatura Fotoğrafı</Text>
              <TouchableOpacity
                style={styles.invoiceDashedCard}
                onPress={() => Alert.alert('Fatura', 'Fatura yükleme 3. hafta kapsamında aktifleştirilecektir.')}
                activeOpacity={0.7}
              >
                <UploadCloud size={32} color={COLORS.primary} />
                <Text style={styles.invoiceDashedText}>Fatura veya fiş görseli seçin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Alt Sabit Kaydet Butonu */}
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
              <Text style={styles.submitButtonText}>Kaydet</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Kategori Seçim Modalı */}
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
