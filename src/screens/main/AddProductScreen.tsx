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
  Upload,
  X,
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
  { label: '4 Yıl', months: 48 },
  { label: '5 Yıl', months: 60 },
];

export const AddProductScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { addProduct, categories } = useInventory();

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(24);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [invoiceUri, setInvoiceUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Varsayılan bugünün tarihi
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultWarrantyEnd = calculateWarrantyEndDate(todayStr, 24);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    mode: 'onChange',
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

  // Örnek Görsel Seçimi (Demo)
  const handlePickMockImage = (type: 'camera' | 'gallery') => {
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

  const handlePickMockInvoice = () => {
    setInvoiceUri('fatura_ornek.pdf');
    setValue('invoice_path', 'https://example.com/fatura_ornek.pdf');
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
            reset();
            setImageUri(null);
            setInvoiceUri(null);
            setSelectedCategory(null);
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
      {/* Üst Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yeni Ürün Ekle</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Bölüm 1: Ürün Fotoğrafı */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Ürün Fotoğrafı</Text>
            {imageUri ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => {
                    setImageUri(null);
                    setValue('image_path', null);
                  }}
                  activeOpacity={0.7}
                >
                  <X size={16} color={COLORS.onError} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoActionRow}>
                <TouchableOpacity
                  style={styles.photoActionButton}
                  onPress={() => handlePickMockImage('camera')}
                  activeOpacity={0.7}
                >
                  <Camera size={26} color={COLORS.primary} />
                  <Text style={styles.photoActionText}>Kamera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.photoActionButton}
                  onPress={() => handlePickMockImage('gallery')}
                  activeOpacity={0.7}
                >
                  <ImageIcon size={26} color={COLORS.primary} />
                  <Text style={styles.photoActionText}>Galeriden Seç</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Bölüm 2: Temel Bilgiler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Temel Bilgiler</Text>

            {/* Ürün Adı */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Ürün Adı <Text style={styles.requiredStar}>*</Text>
              </Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputBox,
                      errors.name && styles.inputBoxError,
                    ]}
                  >
                    <TextInput
                      style={styles.textInput}
                      placeholder="Örn: Samsung QLED TV"
                      placeholderTextColor={COLORS.outline}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </View>
                )}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>

            {/* Marka & Model */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>
                  Marka <Text style={styles.requiredStar}>*</Text>
                </Text>
                <Controller
                  control={control}
                  name="brand"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={[
                        styles.inputBox,
                        errors.brand && styles.inputBoxError,
                      ]}
                    >
                      <TextInput
                        style={styles.textInput}
                        placeholder="Örn: Samsung"
                        placeholderTextColor={COLORS.outline}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    </View>
                  )}
                />
              </View>

              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>Model</Text>
                <Controller
                  control={control}
                  name="model"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputBox}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Örn: Q60B"
                        placeholderTextColor={COLORS.outline}
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    </View>
                  )}
                />
              </View>
            </View>

            {/* Kategori */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Kategori <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.pickerBox}
                onPress={() => setCategoryModalVisible(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.pickerText,
                    !selectedCategory && styles.placeholderText,
                  ]}
                >
                  {selectedCategory ? selectedCategory.name : 'Kategori seçin'}
                </Text>
                <ChevronDown size={18} color={COLORS.outline} />
              </TouchableOpacity>
            </View>

            {/* Seri Numarası */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Seri Numarası</Text>
              <Controller
                control={control}
                name="serial_number"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputBox}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Seri numarasını girin"
                      placeholderTextColor={COLORS.outline}
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </View>
                )}
              />
            </View>
          </View>

          {/* Bölüm 3: Satın Alma & Garanti Bilgileri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Satın Alma & Garanti Bilgileri</Text>

            <View style={styles.row}>
              {/* Satın Alma Tarihi */}
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>Satın Alma Tarihi</Text>
                <Controller
                  control={control}
                  name="purchase_date"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputBox}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="YYYY-AA-GG"
                        placeholderTextColor={COLORS.outline}
                        value={value || ''}
                        onChangeText={(text) => {
                          onChange(text);
                          const calculated = calculateWarrantyEndDate(
                            text,
                            selectedDuration
                          );
                          if (calculated) setValue('warranty_end_date', calculated);
                        }}
                        onBlur={onBlur}
                      />
                    </View>
                  )}
                />
              </View>

              {/* Satın Alma Fiyatı */}
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>Satın Alma Fiyatı</Text>
                <Controller
                  control={control}
                  name="purchase_price"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={[styles.inputBox, styles.priceInputBox]}>
                      <Text style={styles.currencySymbol}>₺</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="0,00"
                        placeholderTextColor={COLORS.outline}
                        keyboardType="numeric"
                        value={value !== undefined ? String(value) : ''}
                        onChangeText={(t) =>
                          onChange(t ? parseFloat(t.replace(',', '.')) : undefined)
                        }
                        onBlur={onBlur}
                      />
                    </View>
                  )}
                />
              </View>
            </View>

            {/* Satın Alınan Mağaza */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Satın Alınan Mağaza</Text>
              <Controller
                control={control}
                name="store_name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputBox}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Örn: Vatan Bilgisayar"
                      placeholderTextColor={COLORS.outline}
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </View>
                )}
              />
            </View>

            {/* Garanti Süresi Seçimi */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Garanti Süresi</Text>
              <View style={styles.durationPillsRow}>
                {DURATION_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.months}
                    style={[
                      styles.durationPill,
                      selectedDuration === opt.months && styles.durationPillActive,
                    ]}
                    onPress={() => handleSelectDuration(opt.months)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.durationPillText,
                        selectedDuration === opt.months &&
                          styles.durationPillTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Garanti Bitiş Tarihi */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Garanti Bitiş Tarihi</Text>
              <Controller
                control={control}
                name="warranty_end_date"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputBox}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="YYYY-AA-GG"
                      placeholderTextColor={COLORS.outline}
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </View>
                )}
              />
            </View>
          </View>

          {/* Bölüm 4: Ek Bilgiler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ek Bilgiler</Text>

            {/* Açıklama */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Açıklama</Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputBox, styles.textAreaBox]}>
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      placeholder="Eklemek istediğiniz notlar..."
                      placeholderTextColor={COLORS.outline}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </View>
                )}
              />
            </View>

            {/* Fatura Fotoğrafı */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fatura Fotoğrafı</Text>
              {invoiceUri ? (
                <View style={styles.invoiceUploadedBox}>
                  <Text style={styles.invoiceUploadedText}>{invoiceUri}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setInvoiceUri(null);
                      setValue('invoice_path', null);
                    }}
                  >
                    <X size={16} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadDashedBox}
                  onPress={handlePickMockInvoice}
                  activeOpacity={0.7}
                >
                  <Upload size={24} color={COLORS.outline} />
                  <Text style={styles.uploadDashedText}>
                    Fatura veya fiş fotoğrafı yükle
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Kaydet Butonu */}
          <View style={styles.submitSection}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.onPrimary} />
              ) : (
                <Text style={styles.submitButtonText}>Ürünü Kaydet</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Kategori Seçim Modalı */}
      <CategoryPickerModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        categories={categories}
        selectedCategoryId={selectedCategory?.id}
        onSelect={handleSelectCategory}
      />
    </SafeAreaView>
  );
};
