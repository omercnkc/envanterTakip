import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { X, Upload, FileJson, CheckCircle, AlertCircle, Info } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { useAlert } from '../context/AlertContext';
import { useTranslation } from '../i18n';
import { productService } from '../api/productService';
import { syncAllWarrantyNotifications } from '../utils/notificationHelper';
import { formatCurrency } from '../utils/warrantyCalculator';
import { biometricHelper } from '../utils/biometricHelper';
import { ProductFormData } from '../types';
import { getStyles } from './ImportDataModal.styles';

interface ImportDataModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ParsedImportItem {
  name: string;
  category_id: number;
  brand?: string | null;
  model?: string | null;
  serial_number?: string | null;
  purchase_date?: string | null;
  purchase_price?: number | null;
  warranty_duration_months?: number | null;
  warranty_end_date: string;
  store_name?: string | null;
  description?: string | null;
}

export const ImportDataModal: React.FC<ImportDataModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { refreshProducts, products } = useInventory();
  const { showSuccess, showError, showAlert } = useAlert();
  const { language } = useTranslation();

  const styles = useMemo(() => getStyles(colors), [colors]);

  const [jsonText, setJsonText] = useState('');
  const [parsedItems, setParsedItems] = useState<ParsedImportItem[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Kategori isimlerini ID'ye eşleme tablosu
  const categoryMap: Record<string, number> = {
    televizyon: 1,
    tv: 1,
    television: 1,
    bilgisayar: 2,
    pc: 2,
    computer: 2,
    telefon: 3,
    'akıllı telefon': 3,
    phone: 3,
    smartphone: 3,
    tablet: 4,
    'beyaz eşya': 5,
    'major appliances': 5,
    appliances: 5,
    'küçük ev aletleri': 6,
    'small appliances': 6,
    ses: 7,
    audio: 7,
    fotoğraf: 8,
    kamera: 8,
    camera: 8,
    oyun: 9,
    gaming: 9,
    game: 9,
    diğer: 10,
    other: 10,
  };

  const parseAndSetProducts = (rawContent: string, fileName?: string) => {
    try {
      const data = JSON.parse(rawContent);
      let itemsArray: any[] = [];

      if (Array.isArray(data)) {
        itemsArray = data;
      } else if (data && Array.isArray(data.products)) {
        itemsArray = data.products;
      } else if (data && typeof data === 'object') {
        itemsArray = [data];
      }

      if (itemsArray.length === 0) {
        showError(
          language === 'tr' ? 'Dosya içinde geçerli ürün listesi bulunamadı.' : 'No valid product list found in file.',
          language === 'tr' ? 'Geçersiz Format' : 'Invalid Format'
        );
        return;
      }

      const validItems: ParsedImportItem[] = [];

      for (const item of itemsArray) {
        const name = item.name || item.urun_adi || item.title;
        if (!name) continue;

        let categoryId = 10; // Varsayılan: Diğer
        if (typeof item.category_id === 'number') {
          categoryId = item.category_id;
        } else if (typeof item.category === 'string') {
          const lower = item.category.toLowerCase().trim();
          categoryId = categoryMap[lower] || 10;
        }

        // Bitiş tarihi
        let endDate = item.warranty_end_date || item.warrantyEndDate || item.bitis_tarihi;
        if (!endDate) {
          // 2 yıl sonrasını varsay
          const d = new Date();
          d.setFullYear(d.getFullYear() + 2);
          endDate = d.toISOString().split('T')[0];
        }

        validItems.push({
          name: String(name).trim(),
          category_id: categoryId,
          brand: item.brand || item.marka || null,
          model: item.model || null,
          serial_number: item.serial_number || item.serialNumber || item.seri_no || null,
          purchase_date: item.purchase_date || item.purchaseDate || null,
          purchase_price: Number(item.purchase_price ?? item.purchasePrice ?? item.fiyat ?? 0) || 0,
          warranty_duration_months: Number(item.warranty_duration_months ?? item.warrantyDurationMonths ?? 24) || 24,
          warranty_end_date: endDate,
          store_name: item.store_name || item.storeName || item.magaza || null,
          description: item.description || item.aciklama || null,
        });
      }

      if (validItems.length === 0) {
        showError(
          language === 'tr' ? 'İçe aktarılmaya uygun ürün verisi tespit edilemedi.' : 'No eligible product data found to import.',
          language === 'tr' ? 'Boş Veri' : 'Empty Data'
        );
        return;
      }

      setParsedItems(validItems);
      if (fileName) setSelectedFileName(fileName);
    } catch (err: any) {
      showError(
        language === 'tr' ? 'JSON verisi çözümlenemedi. Lütfen dosya formatını kontrol edin.' : 'Could not parse JSON. Please check file format.',
        language === 'tr' ? 'JSON Hatası' : 'JSON Error'
      );
    }
  };

  const handlePickDocument = async () => {
    biometricHelper.setPickerActive(true);
    setIsLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'text/*', '*/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      const content = await FileSystem.readAsStringAsync(asset.uri);
      setJsonText(content.slice(0, 500) + '...');
      parseAndSetProducts(content, asset.name);
    } catch (err) {
      console.warn('Dosya okuma hatası:', err);
      showError(
        language === 'tr' ? 'Yedek dosyası okunurken bir hata oluştu.' : 'An error occurred while reading the backup file.',
        language === 'tr' ? 'Hata' : 'Error'
      );
    } finally {
      setIsLoading(false);
      biometricHelper.setPickerActive(false);
    }
  };

  const handleTextChange = (text: string) => {
    setJsonText(text);
    if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
      parseAndSetProducts(text, language === 'tr' ? 'Yapıştırılan Metin' : 'Pasted Text');
    }
  };

  const handleConfirmImport = async () => {
    if (parsedItems.length === 0) return;

    showAlert({
      type: 'info',
      title: language === 'tr' ? 'İçe Aktarmayı Onayla' : 'Confirm Import',
      message:
        language === 'tr'
          ? `${parsedItems.length} adet ürün envanterinize eklenecek ve garanti hatırlatıcıları planlanacaktır. Devam edilsin mi?`
          : `${parsedItems.length} product(s) will be added to your inventory and warranty reminders will be scheduled. Continue?`,
      confirmText: language === 'tr' ? 'Evet, İçe Aktar' : 'Yes, Import',
      cancelText: language === 'tr' ? 'Vazgeç' : 'Cancel',
      onConfirm: async () => {
        setIsImporting(true);
        try {
          const userId = user?.id || '00000000-0000-0000-0000-000000000000';
          let successCount = 0;

          for (const item of parsedItems) {
            const formData: ProductFormData = {
              name: item.name,
              category_id: item.category_id,
              brand: item.brand || (language === 'tr' ? 'Belirtilmemiş' : 'Unspecified'),
              model: item.model || null,
              serial_number: item.serial_number || (language === 'tr' ? 'Yedekten-Aktarıldı' : 'Imported-From-Backup'),
              purchase_date: item.purchase_date || new Date().toISOString().split('T')[0],
              purchase_price: Number(item.purchase_price) || 0,
              warranty_duration_months: item.warranty_duration_months || 24,
              warranty_end_date: item.warranty_end_date,
              store_name: item.store_name || (language === 'tr' ? 'Bilinmiyor' : 'Unknown'),
              description: item.description || null,
              invoice_path: null,
              image_path: null,
            };

            const res = await productService.createProduct(formData, userId);
            if (!res.error) {
              successCount++;
            }
          }

          await refreshProducts();
          showSuccess(
            language === 'tr'
              ? `${successCount} adet ürün başarıyla envanterinize aktarıldı.`
              : `${successCount} products successfully imported to your inventory.`,
            language === 'tr' ? 'Yedek Geri Yüklendi' : 'Backup Restored'
          );
          onClose();
        } catch (err) {
          console.warn('İçe aktarma hatası:', err);
          showError(
            language === 'tr' ? 'İçe aktarma sırasında bir sorun oluştu.' : 'A problem occurred during import.',
            language === 'tr' ? 'Hata' : 'Error'
          );
        } finally {
          setIsImporting(false);
        }
      },
    });
  };

  const totalCalculatedValue = useMemo(() => {
    return parsedItems.reduce((sum, item) => sum + (item.purchase_price || 0), 0);
  }, [parsedItems]);

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
            <View style={styles.modalContent}>
              {/* Tutamaç */}
              <View style={styles.handleBar} />

              {/* Header */}
              <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                  <View style={styles.headerIconBox}>
                    <Upload size={22} color={colors.tertiary} />
                  </View>
                  <View>
                    <Text style={styles.headerTitle}>
                      {language === 'tr' ? 'Yedeği Geri Yükle' : 'Restore Backup'}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                      {language === 'tr'
                        ? 'JSON formatındaki envanter yedeğini içeri aktarın'
                        : 'Import inventory backup in JSON format'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <X size={18} color={colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Bilgi Kutusu */}
                <View style={styles.infoCallout}>
                  <Info size={18} color={colors.tertiary} style={{ marginTop: 2 }} />
                  <Text style={styles.infoCalloutText}>
                    {language === 'tr'
                      ? 'Daha önce dışa aktardığınız JSON dosyasını seçerek veya JSON içeriğini aşağıya yapıştırarak tüm ürünlerinizi tek seferde geri yükleyebilirsiniz.'
                      : 'You can restore all your products at once by selecting a previously exported JSON file or pasting the JSON content below.'}
                  </Text>
                </View>

                {/* Dosya Seçim Alanı */}
                <TouchableOpacity
                  style={styles.fileSelectCard}
                  onPress={handlePickDocument}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <View style={styles.fileSelectLeft}>
                    <View style={styles.fileSelectIconCircle}>
                      <FileJson size={22} color={colors.tertiary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.fileSelectTitle}>
                        {selectedFileName || (language === 'tr' ? 'JSON Yedek Dosyası Seç' : 'Select JSON Backup File')}
                      </Text>
                      <Text style={styles.fileSelectSubtitle}>
                        {selectedFileName
                          ? (language === 'tr' ? 'Farklı bir dosya seçmek için dokunun' : 'Tap to select a different file')
                          : (language === 'tr' ? 'Cihazınızdaki .json dosyasını yükleyin' : 'Upload the .json file from your device')}
                      </Text>
                    </View>
                  </View>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={colors.tertiary} />
                  ) : (
                    <Upload size={20} color={colors.tertiary} />
                  )}
                </TouchableOpacity>

                {/* Bulunan Ürünlerin Önizleme Kartı */}
                {parsedItems.length > 0 && (
                  <View style={styles.previewCard}>
                    <View style={styles.previewHeaderRow}>
                      <Text style={styles.previewTitle}>
                        {language === 'tr' ? 'Yedek Önizleme' : 'Backup Preview'}
                      </Text>
                      <View style={styles.previewBadge}>
                        <Text style={styles.previewBadgeText}>
                          {parsedItems.length} {language === 'tr' ? 'Ürün' : 'Items'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.previewStatRow}>
                      <Text style={styles.previewStatLabel}>
                        {language === 'tr' ? 'Toplam Envanter Değeri:' : 'Total Inventory Value:'}
                      </Text>
                      <Text style={styles.previewStatValue}>
                        {formatCurrency(totalCalculatedValue)}
                      </Text>
                    </View>

                    <View style={styles.sampleList}>
                      <Text style={styles.sampleTitle}>
                        {language === 'tr' ? 'İçerik Örnekleri:' : 'Content Samples:'}
                      </Text>
                      {parsedItems.slice(0, 3).map((item, idx) => (
                        <Text key={idx} style={styles.sampleItem} numberOfLines={1}>
                          • {item.name} ({item.brand || (language === 'tr' ? 'Belirtilmemiş' : 'Unspecified')} - {formatCurrency(item.purchase_price)})
                        </Text>
                      ))}
                      {parsedItems.length > 3 && (
                        <Text style={[styles.sampleItem, { fontStyle: 'italic', color: colors.onSurfaceVariant }]}>
                          ... {language === 'tr' ? `ve ${parsedItems.length - 3} adet daha` : `and ${parsedItems.length - 3} more`}
                        </Text>
                      )}
                    </View>
                  </View>
                )}

                {/* Manuel JSON Yapıştırma Girişi */}
                <Text style={styles.manualSectionTitle}>
                  {language === 'tr' ? 'Veya JSON Metnini Buraya Yapıştırın:' : 'Or Paste JSON Text Here:'}
                </Text>
                <TextInput
                  style={styles.jsonInput}
                  multiline
                  placeholder='[{"name": "Samsung TV", "purchasePrice": 25000, ...}]'
                  placeholderTextColor={colors.outline}
                  value={jsonText}
                  onChangeText={handleTextChange}
                />

                {/* İçe Aktarma Butonu */}
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    (parsedItems.length === 0 || isImporting) && styles.actionButtonDisabled,
                  ]}
                  onPress={handleConfirmImport}
                  disabled={parsedItems.length === 0 || isImporting}
                  activeOpacity={0.8}
                >
                  {isImporting ? (
                    <ActivityIndicator size="small" color={colors.onTertiary} />
                  ) : (
                    <Text style={styles.actionButtonText}>
                      {parsedItems.length > 0
                        ? (language === 'tr' ? `${parsedItems.length} Ürünü Envantere Yükle` : `Import ${parsedItems.length} Products to Inventory`)
                        : (language === 'tr' ? 'Dosya veya Metin Ekleyin' : 'Add File or Text')}
                    </Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
