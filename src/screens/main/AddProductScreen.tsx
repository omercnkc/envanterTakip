import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
  ScanBarcode,
} from 'lucide-react-native';

import { ProductFormData, productFormSchema, Category } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../context/InventoryContext';
import { useAlert } from '../../context/AlertContext';
import { calculateWarrantyEndDate, formatDateTurkish, maskDateInput } from '../../utils/warrantyCalculator';
import { mediaHelper } from '../../utils/mediaHelper';
import { storageService } from '../../api/storageService';
import { CategoryPickerModal } from '../../components/CategoryPickerModal';
import { MediaPickerModal } from '../../components/MediaPickerModal';
import { BarcodeScannerModal } from '../../components/BarcodeScannerModal';
import { AppCameraModal } from '../../components/AppCameraModal';
import { getStyles } from './AddProductScreen.styles';

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
  const { colors } = useTheme();
  const { showSuccess, showError, showWarning } = useAlert();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [photoPickerVisible, setPhotoPickerVisible] = useState(false);
  const [invoicePickerVisible, setInvoicePickerVisible] = useState(false);
  const [barcodeScannerVisible, setBarcodeScannerVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(24);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [invoiceName, setInvoiceName] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingInvoice, setIsUploadingInvoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceInputText, setPriceInputText] = useState<string>('');
  const [appCameraVisible, setAppCameraVisible] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'product' | 'invoice'>('product');

  // Uygulama içi kameradan dönen fotoğrafı yükleme işlemi
  const handleCameraCaptured = async (capturedUri: string) => {
    if (cameraTarget === 'product') {
      setImageUri(capturedUri);
      setIsUploadingImage(true);
      const userId = user?.id || '00000000-0000-0000-0000-000000000000';
      const uploadRes = await storageService.uploadFile(
        capturedUri,
        'product-images',
        userId,
        {
          fileName: 'camera_photo.jpg',
          mimeType: 'image/jpeg',
        }
      );
      if (uploadRes.error) {
        showError(uploadRes.error, 'Yükleme Hatası');
        setImageUri(null);
        setValue('image_path', null);
      } else if (uploadRes.publicUrl) {
        setImageUri(uploadRes.publicUrl);
        setValue('image_path', uploadRes.publicUrl);
      }
      setIsUploadingImage(false);
    } else {
      setInvoiceName('camera_invoice.jpg');
      setIsUploadingInvoice(true);
      const userId = user?.id || '00000000-0000-0000-0000-000000000000';
      const uploadRes = await storageService.uploadFile(
        capturedUri,
        'invoices',
        userId,
        {
          fileName: 'camera_invoice.jpg',
          mimeType: 'image/jpeg',
        }
      );
      if (uploadRes.error) {
        showError(uploadRes.error, 'Yükleme Hatası');
        setInvoiceName(null);
        setValue('invoice_path', null);
      } else if (uploadRes.publicUrl) {
        setValue('invoice_path', uploadRes.publicUrl);
      }
      setIsUploadingInvoice(false);
    }
  };

  const handlePriceChange = (text: string, onChangeForm: (val: number | undefined) => void) => {
    // Negatif işareti (-) ve harfleri tamamen engelle
    let clean = text.replace(/[^0-9.,]/g, '');

    // Virgülü noktaya çevir
    clean = clean.replace(',', '.');

    // Birden fazla noktayı engelle
    const parts = clean.split('.');
    if (parts.length > 2) {
      clean = parts[0] + '.' + parts.slice(1).join('');
    }

    // Maksimum 2 ondalık basamağa izin ver (kuruş)
    if (parts.length === 2 && parts[1].length > 2) {
      clean = parts[0] + '.' + parts[1].slice(0, 2);
    }

    setPriceInputText(clean);

    if (!clean || clean === '.') {
      onChangeForm(undefined);
      return;
    }

    const parsed = parseFloat(clean);
    if (!isNaN(parsed) && isFinite(parsed)) {
      onChangeForm(parsed);
    } else {
      onChangeForm(undefined);
    }
  };

  // Varsayılan bugünün tarihi (gün/ay/yıl)
  const todayStr = formatDateTurkish(new Date());
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
        showError(uploadRes.error, 'Yükleme Hatası');
        setImageUri(null);
        setValue('image_path', null);
      } else if (uploadRes.publicUrl) {
        setImageUri(uploadRes.publicUrl);
        setValue('image_path', uploadRes.publicUrl);
      }
    } catch {
      showError('Fotoğraf yüklenirken beklenmeyen bir hata oluştu.', 'Hata');
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
        showError(uploadRes.error, 'Yükleme Hatası');
        setInvoiceName(null);
        setValue('invoice_path', null);
      } else if (uploadRes.publicUrl) {
        setValue('invoice_path', uploadRes.publicUrl, { shouldValidate: true });
      }
    } catch {
      showError('Fatura yüklenirken beklenmeyen bir hata oluştu.', 'Hata');
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
        showError(res.error || 'Ürün kaydedilirken bir hata oluştu.', 'Hata');
        return;
      }

      showSuccess('Ürün envanterinize başarıyla eklendi.', 'Başarılı');
      reset();
      setPriceInputText('');
      setImageUri(null);
      setInvoiceName(null);
      setSelectedCategory(null);
      navigation.navigate('ProductsTab');
    } catch {
      showError('Ürün kaydedilemedi. Lütfen tekrar deneyin.', 'Hata');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (formErrors: any) => {
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      const firstError = formErrors[errorKeys[0]]?.message;
      showWarning(
        firstError || 'Lütfen seri numarası, fatura ve satın alma bilgilerini eksiksiz doldurun.',
        'Eksik Alanlar'
      );
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
              <View style={[styles.imagePreviewContainer, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surfaceContainerLow }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.photoActionText, { marginTop: 8, color: colors.primary }]}>Görsel Yükleniyor...</Text>
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
                  <X size={16} color={colors.onError} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoActionRow}>
                <TouchableOpacity
                  style={styles.photoActionButton}
                  onPress={() => handlePickProductImage('camera')}
                  activeOpacity={0.7}
                >
                  <Camera size={26} color={colors.primary} />
                  <Text style={styles.photoActionText}>Kamera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.photoActionButton}
                  onPress={() => handlePickProductImage('gallery')}
                  activeOpacity={0.7}
                >
                  <ImageIcon size={26} color={colors.primary} />
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
                      placeholderTextColor={colors.outline}
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
                        placeholderTextColor={colors.outline}
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
                        placeholderTextColor={colors.outline}
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
                <ChevronDown size={18} color={colors.outline} />
              </TouchableOpacity>
            </View>

            {/* Seri Numarası */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Seri Numarası <Text style={styles.requiredStar}>*</Text>
              </Text>
              <Controller
                control={control}
                name="serial_number"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputBox,
                      styles.serialInputBox,
                      errors.serial_number && styles.inputBoxError,
                    ]}
                  >
                    <TextInput
                      style={styles.textInput}
                      placeholder="Seri numarasını girin veya okutun"
                      placeholderTextColor={colors.outline}
                      maxLength={35}
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                    <TouchableOpacity
                      style={styles.scanButton}
                      onPress={() => setBarcodeScannerVisible(true)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <ScanBarcode size={16} color={colors.primary} />
                      <Text style={styles.scanButtonText}>Tara</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.serial_number && (
                <Text style={styles.errorText}>{errors.serial_number.message}</Text>
              )}
            </View>
          </View>

          {/* Bölüm 3: Satın Alma & Garanti Bilgileri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Satın Alma & Garanti Bilgileri</Text>

            <View style={styles.row}>
              {/* Satın Alma Tarihi */}
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>
                  Satın Alma Tarihi <Text style={styles.requiredStar}>*</Text>
                </Text>
                <Controller
                  control={control}
                  name="purchase_date"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={[
                        styles.inputBox,
                        errors.purchase_date && styles.inputBoxError,
                      ]}
                    >
                      <TextInput
                        style={styles.textInput}
                        placeholder="GG/AA/YYYY"
                        placeholderTextColor={colors.outline}
                        keyboardType="number-pad"
                        maxLength={10}
                        value={value || ''}
                        onChangeText={(text) => {
                          const masked = maskDateInput(text, value || '');
                          onChange(masked);
                          const calculated = calculateWarrantyEndDate(
                            masked,
                            selectedDuration
                          );
                          if (calculated) setValue('warranty_end_date', calculated);
                        }}
                        onBlur={onBlur}
                      />
                    </View>
                  )}
                />
                {errors.purchase_date && (
                  <Text style={styles.errorText}>{errors.purchase_date.message}</Text>
                )}
              </View>

              {/* Satın Alma Fiyatı */}
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>
                  Satın Alma Fiyatı <Text style={styles.requiredStar}>*</Text>
                </Text>
                <Controller
                  control={control}
                  name="purchase_price"
                  render={({ field: { onChange, onBlur } }) => (
                    <View
                      style={[
                        styles.inputBox,
                        styles.priceInputBox,
                        errors.purchase_price && styles.inputBoxError,
                      ]}
                    >
                      <Text style={styles.currencySymbol}>₺</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="0,00"
                        placeholderTextColor={colors.outline}
                        keyboardType="decimal-pad"
                        value={priceInputText}
                        onChangeText={(t) => handlePriceChange(t, onChange)}
                        onBlur={() => {
                          onBlur();
                          if (priceInputText.endsWith('.')) {
                            const trimmed = priceInputText.slice(0, -1);
                            setPriceInputText(trimmed);
                            const parsed = parseFloat(trimmed);
                            onChange(!isNaN(parsed) && isFinite(parsed) ? parsed : undefined);
                          }
                        }}
                      />
                    </View>
                  )}
                />
                {errors.purchase_price && (
                  <Text style={styles.errorText}>{errors.purchase_price.message}</Text>
                )}
              </View>
            </View>

            {/* Satın Alınan Mağaza */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Satın Alınan Mağaza <Text style={styles.requiredStar}>*</Text>
              </Text>
              <Controller
                control={control}
                name="store_name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputBox,
                      errors.store_name && styles.inputBoxError,
                    ]}
                  >
                    <TextInput
                      style={styles.textInput}
                      placeholder="Örn: Vatan Bilgisayar"
                      placeholderTextColor={colors.outline}
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </View>
                )}
              />
              {errors.store_name && (
                <Text style={styles.errorText}>{errors.store_name.message}</Text>
              )}
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
              <Text style={styles.label}>
                Garanti Bitiş Tarihi <Text style={styles.requiredStar}>*</Text>
              </Text>
              <Controller
                control={control}
                name="warranty_end_date"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputBox,
                      errors.warranty_end_date && styles.inputBoxError,
                    ]}
                  >
                    <TextInput
                      style={styles.textInput}
                      placeholder="GG/AA/YYYY"
                      placeholderTextColor={colors.outline}
                      keyboardType="number-pad"
                      maxLength={10}
                      value={value || ''}
                      onChangeText={(text) => {
                        const masked = maskDateInput(text, value || '');
                        onChange(masked);
                      }}
                      onBlur={onBlur}
                    />
                  </View>
                )}
              />
              {errors.warranty_end_date && (
                <Text style={styles.errorText}>{errors.warranty_end_date.message}</Text>
              )}
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
                      placeholderTextColor={colors.outline}
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
              <Text style={styles.label}>
                Fatura Belgesi / Fotoğrafı <Text style={styles.requiredStar}>*</Text>
              </Text>
              {isUploadingInvoice ? (
                <View style={[styles.invoiceUploadedBox, { justifyContent: 'center' }]}>
                  <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 8 }} />
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
                      setValue('invoice_path', null, { shouldValidate: true });
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <X size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.uploadDashedBox,
                    errors.invoice_path && styles.uploadDashedBoxError,
                  ]}
                  onPress={() => setInvoicePickerVisible(true)}
                  activeOpacity={0.7}
                >
                  <Upload size={24} color={errors.invoice_path ? colors.error : colors.outline} />
                  <Text
                    style={[
                      styles.uploadDashedText,
                      errors.invoice_path && { color: colors.error, fontWeight: '600' },
                    ]}
                  >
                    Fatura, fiş fotoğrafı veya PDF yükle
                  </Text>
                </TouchableOpacity>
              )}
              {errors.invoice_path && (
                <Text style={styles.errorText}>{errors.invoice_path.message}</Text>
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
              onPress={handleSubmit(onSubmit, onInvalid)}
              disabled={isSubmitting || isUploadingImage || isUploadingInvoice}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.onPrimary} />
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
        onSelectCamera={() => {
          setCameraTarget('product');
          setAppCameraVisible(true);
        }}
        onSelectGallery={() => handlePickProductImage('gallery')}
        title="Ürün Fotoğrafı Ekle"
        subtitle="Kamera ile çekin veya galerinizden seçin"
      />

      {/* Fatura Seçim Modalı */}
      <MediaPickerModal
        visible={invoicePickerVisible}
        onClose={() => setInvoicePickerVisible(false)}
        onSelectCamera={() => {
          setCameraTarget('invoice');
          setAppCameraVisible(true);
        }}
        onSelectGallery={() => handlePickInvoice('gallery')}
        onSelectDocument={() => handlePickInvoice('document')}
        includeDocumentOption={true}
        title="Fatura / Belge Ekle"
        subtitle="Fotoğraf çekin, galeriden veya PDF seçin"
      />

      {/* Barkod / QR Kod Tarayıcı Modalı */}
      <BarcodeScannerModal
        visible={barcodeScannerVisible}
        onClose={() => setBarcodeScannerVisible(false)}
        onScan={(scannedCode) => {
          setValue('serial_number', scannedCode, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
      />

      {/* Uygulama İçi Güvenli Kamera Modalı (Android Çökmesini %100 Önler) */}
      <AppCameraModal
        visible={appCameraVisible}
        onClose={() => setAppCameraVisible(false)}
        onCapture={handleCameraCaptured}
        title={cameraTarget === 'product' ? 'Ürün Fotoğrafı Çek' : 'Fatura Fotoğrafı Çek'}
        subtitle={
          cameraTarget === 'product'
            ? 'Cihazınızı çerçevenin ortasına hizalayın'
            : 'Faturayı düz bir zeminde net şekilde çekin'
        }
      />
    </SafeAreaView>
  );
};
