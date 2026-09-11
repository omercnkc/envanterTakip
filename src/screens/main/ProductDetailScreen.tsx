import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import {
  ArrowLeft,
  Edit2,
  Cpu,
  QrCode,
  Layers,
  Calendar,
  CreditCard,
  ShieldCheck,
  Store,
  FileText,
  Receipt,
  Download,
  ExternalLink,
  Package,
} from 'lucide-react-native';

import { Product } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useInventory } from '../../context/InventoryContext';
import { TechOrbitLoader } from '../../components';
import {
  formatDateTurkish,
  formatCurrency,
  calculateWarrantyStatus,
} from '../../utils/warrantyCalculator';
import { getStyles } from './ProductDetailScreen.styles';

export const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { productId, initialProduct } = route.params || {};

  const { getProduct, deleteProduct } = useInventory();
  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);

  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const loadProduct = useCallback(async () => {
    if (!productId) return;
    const data = await getProduct(productId);
    if (data) {
      setProduct(data);
    }
    setLoading(false);
  }, [productId, getProduct]);

  useFocusEffect(
    useCallback(() => {
      loadProduct();
    }, [loadProduct])
  );

  const handleDelete = () => {
    Alert.alert(
      'Ürünü Sil',
      `"${product?.name}" ürününü envanterinizden silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            if (!product?.id) return;
            const res = await deleteProduct(product.id);
            if (res.success) {
              navigation.goBack();
            } else {
              Alert.alert('Hata', res.error || 'Ürün silinirken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    if (!product) return;
    navigation.navigate('EditProduct', { productId: product.id, product });
  };

  const handleOpenInvoice = async () => {
    if (!product?.invoice_path) return;
    try {
      if (product.invoice_path.startsWith('http')) {
        await WebBrowser.openBrowserAsync(product.invoice_path);
      } else {
        await Linking.openURL(product.invoice_path);
      }
    } catch {
      Alert.alert('Fatura Belgesi', `Dosya adresi: ${product.invoice_path}`);
    }
  };

  if (loading || !product) {
    return (
      <TechOrbitLoader
        message="Ürün Detayları Yükleniyor..."
        subMessage="Garanti ve fatura bilgileri getiriliyor"
      />
    );
  }


  const categoryName = product.category?.name || 'Genel';
  const brandText = product.brand ? ` · ${product.brand}` : '';
  const statusInfo = calculateWarrantyStatus(product.warranty_end_date);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Üst Başlık Barı */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color={colors.onBackground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ürün Detayı</Text>
        </View>
        <TouchableOpacity style={styles.editIconButton} onPress={handleEdit} activeOpacity={0.7}>
          <Edit2 size={19} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Görsel Hero Bölümü */}
        <View style={styles.heroImageContainer}>
          {product.image_path ? (
            <Image source={{ uri: product.image_path }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Package size={64} color={colors.outline} />
            </View>
          )}
        </View>

        {/* Ürün Adı & Garanti Durumu */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            <View style={[styles.statusPill, { backgroundColor: statusInfo.bgColor }]}>
              <Text style={[styles.statusPillText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>
          </View>
          <Text style={styles.categoryBrandText}>
            {categoryName}
            {brandText}
          </Text>
        </View>

        {/* Detaylar Kartı (Divided List) */}
        <View style={styles.detailsCard}>
          {/* Model */}
          {product.model && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabelGroup}>
                <Cpu size={17} color={colors.onSurfaceVariant} />
                <Text style={styles.detailLabel}>Model</Text>
              </View>
              <Text style={styles.detailValue}>{product.model}</Text>
            </View>
          )}

          {/* Seri Numarası */}
          {product.serial_number && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabelGroup}>
                <QrCode size={17} color={colors.onSurfaceVariant} />
                <Text style={styles.detailLabel}>Seri Numarası</Text>
              </View>
              <Text style={styles.detailValue}>{product.serial_number}</Text>
            </View>
          )}

          {/* Kategori */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabelGroup}>
              <Layers size={17} color={colors.onSurfaceVariant} />
              <Text style={styles.detailLabel}>Kategori</Text>
            </View>
            <Text style={styles.detailValue}>{categoryName}</Text>
          </View>

          {/* Satın Alma Tarihi */}
          {product.purchase_date && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabelGroup}>
                <Calendar size={17} color={colors.onSurfaceVariant} />
                <Text style={styles.detailLabel}>Satın Alma Tarihi</Text>
              </View>
              <Text style={styles.detailValue}>{formatDateTurkish(product.purchase_date)}</Text>
            </View>
          )}

          {/* Satın Alma Fiyatı */}
          {product.purchase_price !== null && product.purchase_price !== undefined && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabelGroup}>
                <CreditCard size={17} color={colors.onSurfaceVariant} />
                <Text style={styles.detailLabel}>Satın Alınan Fiyatı</Text>
              </View>
              <Text style={styles.detailValue}>{formatCurrency(product.purchase_price)}</Text>
            </View>
          )}

          {/* Garanti Bitiş Tarihi */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabelGroup}>
              <ShieldCheck size={17} color={colors.onSurfaceVariant} />
              <Text style={styles.detailLabel}>Garanti Bitiş Tarihi</Text>
            </View>
            <Text style={styles.detailValue}>{formatDateTurkish(product.warranty_end_date)}</Text>
          </View>

          {/* Mağaza */}
          {product.store_name && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabelGroup}>
                <Store size={17} color={colors.onSurfaceVariant} />
                <Text style={styles.detailLabel}>Satın Alınan Mağaza</Text>
              </View>
              <Text style={styles.detailValue}>{product.store_name}</Text>
            </View>
          )}

          {/* Açıklama */}
          {product.description && (
            <View style={styles.descriptionRow}>
              <View style={styles.detailLabelGroup}>
                <FileText size={17} color={colors.onSurfaceVariant} />
                <Text style={styles.detailLabel}>Açıklama</Text>
              </View>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
          )}
        </View>

        {/* Fatura Bölümü */}
        <View style={styles.invoiceSection}>
          <Text style={styles.sectionTitle}>Fatura</Text>
          <TouchableOpacity
            style={styles.invoiceCard}
            onPress={product.invoice_path ? handleOpenInvoice : undefined}
            activeOpacity={product.invoice_path ? 0.7 : 1}
          >
            <View style={styles.invoiceLeft}>
              <View style={styles.invoiceIconBox}>
                <Receipt size={22} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.invoiceFileName}>
                  {product.invoice_path ? 'Fatura Belgesi' : 'Fatura Eklenmedi'}
                </Text>
                <Text style={styles.invoiceFileSize}>
                  {product.invoice_path ? 'Görüntülemek için dokunun' : 'Kayıtlı dosya yok'}
                </Text>
              </View>
            </View>
            {product.invoice_path && (
              <View style={styles.downloadButton}>
                <ExternalLink size={18} color={colors.primary} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Aksiyon Butonları (Düzenle / Sil) */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit} activeOpacity={0.8}>
            <Text style={styles.editButtonText}>Düzenle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.8}>
            <Text style={styles.deleteButtonText}>Sil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
