import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import {
  TrendingUp,
  X,
  PieChart,
  Calendar,
  Layers,
  Crown,
  Share2,
  Printer,
  Package,
  ShieldCheck,
} from 'lucide-react-native';

import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useInventory } from '../context/InventoryContext';
import { useTranslation } from '../i18n';
import { formatCurrency } from '../utils/warrantyCalculator';
import {
  calculateFinancialAnalytics,
  generateInsuranceReportHtml,
} from '../utils/financialCalculator';
import { CategoryDistributionChart } from './CategoryDistributionChart';
import { getStyles } from './FinancialAnalyticsModal.styles';

interface FinancialAnalyticsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
  onFilterCategory?: (categoryId: string, categoryName: string) => void;
}

const RANK_CONFIGS = [
  { rank: 1, label: '1', bg: '#fef3c7', text: '#b45309', border: '#fde68a' }, // Altın
  { rank: 2, label: '2', bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' }, // Gümüş
  { rank: 3, label: '3', bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' }, // Bronz
];

export const FinancialAnalyticsModal: React.FC<FinancialAnalyticsModalProps> = ({
  visible,
  onClose,
  onSelectProduct,
  onFilterCategory,
}) => {
  const { colors } = useTheme();
  const { allProducts } = useInventory();
  const { language } = useTranslation();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const analytics = useMemo(
    () => calculateFinancialAnalytics(allProducts),
    [allProducts]
  );

  const pricedRatio = allProducts.length > 0
    ? Math.round((analytics.pricedCount / allProducts.length) * 100)
    : 0;

  // PDF Oluştur ve Paylaşım Menüsünü Aç
  const handleSharePdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const html = generateInsuranceReportHtml(allProducts, analytics, language);
      const { uri, base64 } = await Print.printToFileAsync({
        html,
        base64: true,
      });

      let targetUri = uri;
      if (base64) {
        // Android FileProvider uyumluluğu için dosyayı doğrudan cacheDirectory içine Base64 olarak yazıyoruz
        const filename = `envanter_raporu_${Date.now()}.pdf`;
        targetUri = `${FileSystem.cacheDirectory}${filename}`;
        await FileSystem.writeAsStringAsync(targetUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(targetUri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: language === 'tr' ? 'Ev Envanter & Maddi Değer Raporu' : 'Home Inventory & Valuation Report',
        });
      } else {
        Alert.alert(
          language === 'tr' ? 'Bilgi' : 'Info',
          language === 'tr' ? 'Bu cihazda dosya paylaşım servisi desteklenmiyor.' : 'Sharing service is not supported on this device.'
        );
      }
    } catch (error: any) {
      if (error?.message?.includes('cancelled') || error?.message?.includes('dismissed')) {
        return;
      }
      console.warn('PDF paylaşım hatası:', error);
      Alert.alert(
        language === 'tr' ? 'Hata' : 'Error',
        language === 'tr' ? 'PDF raporu paylaşılırken bir sorun oluştu.' : 'A problem occurred while sharing the PDF report.'
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Doğrudan Yazdır / Sistem PDF Çıktısı Al
  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      const html = generateInsuranceReportHtml(allProducts, analytics, language);
      await Print.printAsync({ html });
    } catch (error) {
      console.warn('Yazdırma hatası:', error);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleProductPress = (product: Product) => {
    onClose();
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

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

              {/* Başlık Çubuğu */}
              <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                  <View style={styles.iconBadge}>
                    <TrendingUp size={22} color={colors.onPrimary} />
                  </View>
                  <View>
                    <Text style={styles.headerTitle}>
                      {language === 'tr' ? 'Finansal Envanter Analizi' : 'Financial Inventory Analytics'}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                      {language === 'tr'
                        ? 'Ev eşyalarınızın toplam maddi servet dökümü'
                        : 'Total asset valuation and breakdown of home items'}
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
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {/* Büyük Servet Kartı (Hero Wealth Banner) */}
                <View style={styles.heroWealthCard}>
                  <View style={styles.heroBadgeRow}>
                    <View style={styles.heroTag}>
                      <ShieldCheck size={14} color="#ffffff" />
                      <Text style={styles.heroTagText}>
                        {language === 'tr' ? 'SİGORTA & TEMİNAT DEĞERİ' : 'INSURANCE & COLLATERAL VALUE'}
                      </Text>
                    </View>
                    <Text style={styles.heroItemCountText}>
                      {analytics.pricedCount} / {allProducts.length} {language === 'tr' ? 'Fiyatlı Eşya' : 'Priced Items'}
                    </Text>
                  </View>

                  <Text style={styles.heroTotalLabel}>
                    {language === 'tr' ? 'Toplam Envanter Maddi Değeri' : 'Total Inventory Valuation'}
                  </Text>
                  <Text style={styles.heroTotalValue}>
                    {formatCurrency(analytics.totalValue)}
                  </Text>
                  <Text style={styles.heroFooterNote}>
                    {language === 'tr'
                      ? 'Taşınma veya konut sigortası durumlarında evinizdeki tescilli eşyaların toplam ikame bedelidir.'
                      : 'Total replacement cost of registered items for moving or home insurance purposes.'}
                  </Text>
                </View>

                {/* 3'lü Özet Metrik Izgarası */}
                <View style={styles.metricsGrid}>
                  {/* Ortalama Değer */}
                  <View style={styles.metricCard}>
                    <View style={[styles.metricIconBox, { backgroundColor: colors.primary + '18' }]}>
                      <Layers size={16} color={colors.primary} />
                    </View>
                    <Text style={styles.metricValue} numberOfLines={1}>
                      {formatCurrency(analytics.averageValue)}
                    </Text>
                    <Text style={styles.metricLabel}>
                      {language === 'tr' ? 'Ortalama Değer' : 'Average Value'}
                    </Text>
                  </View>

                  {/* Son 1 Yıl Harcaması */}
                  <View style={styles.metricCard}>
                    <View style={[styles.metricIconBox, { backgroundColor: '#10b9811c' }]}>
                      <Calendar size={16} color="#10b981" />
                    </View>
                    <Text style={[styles.metricValue, { color: '#10b981' }]} numberOfLines={1}>
                      {formatCurrency(analytics.lastYearTotal)}
                    </Text>
                    <Text style={styles.metricLabel}>
                      {language === 'tr' ? 'Son 1 Yılda Alınan' : 'Past Year Purchases'}
                    </Text>
                  </View>

                  {/* Fiyat Giriş Oranı */}
                  <View style={styles.metricCard}>
                    <View style={[styles.metricIconBox, { backgroundColor: '#0284c71c' }]}>
                      <PieChart size={16} color="#0284c7" />
                    </View>
                    <Text style={[styles.metricValue, { color: '#0284c7' }]} numberOfLines={1}>
                      %{pricedRatio}
                    </Text>
                    <Text style={styles.metricLabel}>
                      {language === 'tr' ? 'Fiyat Girilme Oranı' : 'Pricing Ratio'}
                    </Text>
                  </View>
                </View>

                {/* En Yüksek Değerli Eşyalar (Top 3) */}
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <Crown size={18} color={colors.warning} />
                    <Text style={styles.sectionTitle}>
                      {language === 'tr' ? 'En Yüksek Değerli Eşyalar' : 'Highest Valued Items'}
                    </Text>
                  </View>
                  <Text style={styles.sectionBadge}>Top 3</Text>
                </View>

                {analytics.topExpensiveProducts.length > 0 ? (
                  <View style={styles.topItemsContainer}>
                    {analytics.topExpensiveProducts.map((item, idx) => {
                      const rankConfig = RANK_CONFIGS[idx] || RANK_CONFIGS[0];
                      const { product } = item;
                      const brandModel = [product.brand, product.model].filter(Boolean).join(' · ');

                      return (
                        <TouchableOpacity
                          key={product.id}
                          style={styles.topItemCard}
                          onPress={() => handleProductPress(product)}
                          activeOpacity={0.75}
                        >
                          <View style={styles.topItemLeft}>
                            {/* Derece Rozeti */}
                            <View
                              style={[
                                styles.rankBadge,
                                {
                                  backgroundColor: rankConfig.bg,
                                  borderColor: rankConfig.border,
                                  borderWidth: 1,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.rankBadgeText,
                                  { color: rankConfig.text },
                                ]}
                              >
                                {rankConfig.label}
                              </Text>
                            </View>

                            {/* Görsel veya İkon */}
                            {product.image_path ? (
                              <Image
                                source={{ uri: product.image_path }}
                                style={styles.topItemThumb}
                              />
                            ) : (
                              <View style={styles.topItemThumbPlaceholder}>
                                <Package size={20} color={colors.onSurfaceVariant} />
                              </View>
                            )}

                            {/* Bilgiler */}
                            <View style={styles.topItemInfo}>
                              <Text style={styles.topItemName} numberOfLines={1}>
                                {product.name}
                              </Text>
                              <Text style={styles.topItemMeta} numberOfLines={1}>
                                {brandModel || product.category?.name || (language === 'tr' ? 'Cihaz' : 'Device')}
                              </Text>
                            </View>
                          </View>

                          {/* Fiyat ve Pay */}
                          <View style={styles.topItemRight}>
                            <Text style={styles.topItemPrice}>
                              {formatCurrency(product.purchase_price || 0)}
                            </Text>
                            <Text style={styles.topItemShare}>
                              {language === 'tr' ? `Portföyün %${item.percentageOfTotal}'i` : `${item.percentageOfTotal}% of total`}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.topItemsContainer}>
                    <Text style={{ fontSize: 13, color: colors.onSurfaceVariant }}>
                      {language === 'tr'
                        ? 'Henüz fiyat bilgisi eklenmiş ürün bulunmuyor.'
                        : 'No products with price information yet.'}
                    </Text>
                  </View>
                )}

                {/* Kategori Bazlı Donut / Halka Grafik Dağılımı */}
                <CategoryDistributionChart
                  products={allProducts}
                  initialMode="value"
                  onCategoryFilter={(catId, catName) => {
                    onClose();
                    if (onFilterCategory) {
                      onFilterCategory(catId, catName);
                    }
                  }}
                />

                {/* Sigorta & Taşınma Raporu PDF Paylaş ve Yazdır Butonları */}
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={styles.sharePdfButton}
                    onPress={handleSharePdf}
                    disabled={isGeneratingPdf || isPrinting}
                    activeOpacity={0.8}
                  >
                    {isGeneratingPdf ? (
                      <ActivityIndicator size="small" color={colors.onPrimary} />
                    ) : (
                      <Share2 size={18} color={colors.onPrimary} />
                    )}
                    <Text style={styles.sharePdfButtonText}>
                      {isGeneratingPdf
                        ? (language === 'tr' ? 'PDF Hazırlanıyor...' : 'Preparing PDF...')
                        : (language === 'tr' ? 'PDF Raporu Olarak Paylaş' : 'Share as PDF Report')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.printButton}
                    onPress={handlePrint}
                    disabled={isGeneratingPdf || isPrinting}
                    activeOpacity={0.75}
                  >
                    {isPrinting ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <Printer size={18} color={colors.primary} />
                    )}
                    <Text style={styles.printButtonText}>
                      {isPrinting
                        ? (language === 'tr' ? 'Yazıcıya Gönderiliyor...' : 'Sending to Printer...')
                        : (language === 'tr' ? 'Yazdır / Çıktı Al (PDF)' : 'Print / Export PDF')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
