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
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../context/InventoryContext';
import { calculateWarrantyEndDate } from '../../utils/warrantyCalculator';
import { mediaHelper } from '../../utils/mediaHelper';
import { storageService } from '../../api/storageService';
import { CategoryPickerModal } from '../../components/CategoryPickerModal';
import { MediaPickerModal } from '../../components/MediaPickerModal';
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
  const { user } = useAuth();
  const { addProduct, categories } = useInventory();

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [photoPickerVisible, setPhotoPickerVisible] = useState(false);
  const [invoicePickerVisible, setInvoicePickerVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(24);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [invoiceName, setInvoiceName] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingInvoice, setIsUploadingInvoice] = useState(false);
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

  // Fotoğraf Yükleme İşlemi (Kamera veya Galeri)
  const handlePickProductImage = async (source: 'camera' | 'gallery') => {
    try {
      const result =
        source === 'camera'
          ? await mediaHelper.pickFromCamera()
          : await mediaHelper.pickFromGallery();

      if (result.canceled || !result.uri) return;

      setImageUri(result.uri);
      setIsUploadingImage(true);

      const userId = user?.id || '00000000-0000-0000-0000-000000000000';
      const uploadRes = await storageService.uploadFile(
        result.uri,
        'product-images',
        userId,
        {
          fileName: result.name,
          mimeType: result.mimeType,
        }
      );

      if (uploadRes.error) {
        Alert.alert('Yükleme Hatası', uploadRes.error);
        setImageUri(null);
        setValue('image_path', null);
      } else if (uploadRes.publicUrl) {
        setImageUri(uploadRes.publicUrl);
        setValue('image_path', uploadRes.publicUrl);
      }
    } catch {
      Alert.alert('Hata', 'Fotoğraf yüklenirken beklenmeyen bir hata oluştu.');
      setImageUri(null);
      setValue('image_path', null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Fatura Yükleme İşlemi (Kamera, Galeri veya Belge)
  const handlePickInvoice = async (source: 'camera' | 'gallery' | 'document') => {
    try {
      let result;
      if (source === 'camera') {
        result = await mediaHelper.pickFromCamera();
      } else if (source === 'gallery') {
        result = await mediaHelper.pickFromGallery();
      } else {
        result = await mediaHelper.pickDocument();
      }

      if (result.canceled || !result.uri) return;

      const fileName = result.name || 'fatura_belgesi.pdf';
      setInvoiceName(fileName);
      setIsUploadingInvoice(true);

      const userId = user?.id || '00000000-0000-0000-0000-000000000000';
      const uploadRes = await storageService.uploadFile(
        result.uri,
        'invoices',
        userId,
        {
          fileName: fileName,
          mimeType: result.mimeType,
        }
      );

      if (uploadRes.error) {
        Alert.alert('Yükleme Hatası', uploadRes.error);
        setInvoiceName(null);
        setValue('invoice_path', null);
      } else if (uploadRes.publicUrl) {
        setValue('invoice_path', uploadRes.publicUrl);
      }
    } catch {
      Alert.alert('Hata', 'Fatura yüklenirken beklenmeyen bir hata oluştu.');
      setInvoiceName(null);
      setValue('invoice_path', null);
    } finally {
      setIsUploadingInvoice(false);
    }
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
            setInvoiceName(null);
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
            {isUploadingImage ? (
              <View style={[styles.imagePreviewContainer, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surfaceContainerLow }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={[styles.photoActionText, { marginTop: 8, color: COLORS.primary }]}>Görsel Yükleniyor...</Text>
              </View>
            ) : imageUri ? (
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
                  onPress={() => handlePickProductImage('camera')}
                  activeOpacity={0.7}
                >
                  <Camera size={26} color={COLORS.primary} />
                  <Text style={styles.photoActionText}>Kamera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.photoActionButton}
                  onPress={() => handlePickProductImage('gallery')}
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
              <Text style={styles.label}>Fatura Belgesi / Fotoğrafı</Text>
              {isUploadingInvoice ? (
                <View style={[styles.invoiceUploadedBox, { justifyContent: 'center' }]}>
                  <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 8 }} />
                  <Text style={styles.invoiceUploadedText}>Fatura Yükleniyor...</Text>
                </View>
              ) : invoiceName ? (
                <View style={styles.invoiceUploadedBox}>
                  <Text style={styles.invoiceUploadedText} numberOfLines={1}>
                    {invoiceName}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setInvoiceName(null);
                      setValue('invoice_path', null);
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <X size={16} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadDashedBox}
                  onPress={() => setInvoicePickerVisible(true)}
                  activeOpacity={0.7}
                >
                  <Upload size={24} color={COLORS.outline} />
                  <Text style={styles.uploadDashedText}>
                    Fatura, fiş fotoğrafı veya PDF yükle
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
              disabled={isSubmitting || isUploadingImage || isUploadingInvoice}
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

      {/* Fotoğraf Seçim Modalı */}
      <MediaPickerModal
        visible={photoPickerVisible}
        onClose={() => setPhotoPickerVisible(false)}
        onSelectCamera={() => handlePickProductImage('camera')}
        onSelectGallery={() => handlePickProductImage('gallery')}
        title="Ürün Fotoğrafı Ekle"
        subtitle="Kamera ile çekin veya galerinizden seçin"
      />

      {/* Fatura Seçim Modalı */}
      <MediaPickerModal
        visible={invoicePickerVisible}
        onClose={() => setInvoicePickerVisible(false)}
        onSelectCamera={() => handlePickInvoice('camera')}
        onSelectGallery={() => handlePickInvoice('gallery')}
        onSelectDocument={() => handlePickInvoice('document')}
        includeDocumentOption={true}
        title="Fatura / Belge Ekle"
        subtitle="Fotoğraf çekin, galeriden veya PDF seçin"
      />
    </SafeAreaView>
  );
};
