import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import {
  ArrowLeft,
  Edit2,
  Heart,
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
  Maximize2,
  Wrench,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Repeat,
} from 'lucide-react-native';

import { Product, MaintenanceRecord } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useInventory } from '../../context/InventoryContext';
import { useAlert } from '../../context/AlertContext';
import { TechOrbitLoader, ImageViewerModal, ProductQrModal, MaintenanceModal } from '../../components';
import { maintenanceService } from '../../api/maintenanceService';
import {
  scheduleMaintenanceNotifications,
  cancelMaintenanceNotifications,
} from '../../utils/notificationHelper';
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

  const { getProduct, deleteProduct, isFavorite, toggleFavorite } = useInventory();
  const { showAlert, showSuccess, showError, showInfo } = useAlert();
  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const isFav = product?.id ? isFavorite(product.id) || product.is_favorite === true : false;

  const handleFavoriteToggle = async () => {
    if (!product?.id) return;
    const willBeFav = !isFav;
    await toggleFavorite(product.id);
    setProduct((prev) => (prev ? { ...prev, is_favorite: willBeFav } : null));
    if (willBeFav) {
      showSuccess('Ürün favorilere eklendi.');
    } else {
      showInfo('Ürün favorilerden çıkarıldı.');
    }
  };

  const loadProduct = useCallback(async () => {
    if (!productId) return;
    const data = await getProduct(productId);
    if (data) {
      setProduct(data);
    }
    setLoading(false);
  }, [productId, getProduct]);

  const loadMaintenance = useCallback(async () => {
    if (!productId) return;
    const res = await maintenanceService.getByProductId(productId);
    if (res.data) {
      setMaintenanceRecords(res.data);
    }
  }, [productId]);

  useFocusEffect(
    useCallback(() => {
      loadProduct();
      loadMaintenance();
    }, [loadProduct, loadMaintenance])
  );

  const handleCompleteMaintenance = (record: MaintenanceRecord) => {
    showAlert({
      type: 'success',
      title: 'Bakımı Tamamla',
      message: `"${record.title}" bakımının yapıldığını onaylıyor musunuz?${
        record.interval_months
          ? ` Otomatik olarak ${record.interval_months} ay sonrasına yeni bir periyodik bakım açılacaktır.`
          : ''
      }`,
      confirmText: 'Tamamlandı Olarak Kaydet',
      cancelText: 'Vazgeç',
      onConfirm: async () => {
        const res = await maintenanceService.complete(record.id, true);
        if (res.data) {
          await cancelMaintenanceNotifications(record.id);
          if (res.nextRecord && product) {
            await scheduleMaintenanceNotifications(res.nextRecord, product.name);
            showSuccess(
              `Bakım tamamlandı! Bir sonraki bakım: ${formatDateTurkish(res.nextRecord.maintenance_date)}`
            );
          } else {
            showSuccess('Bakım tamamlandı olarak kaydedildi.');
          }
          loadMaintenance();
        } else {
          showError(res.error || 'Bakım tamamlanamadı.');
        }
      },
    });
  };

  const handleDeleteMaintenance = (record: MaintenanceRecord) => {
    showAlert({
      type: 'danger',
      title: 'Bakım Kaydını Sil',
      message: `"${record.title}" bakım kaydını silmek istediğinize emin misiniz?`,
      confirmText: 'Sil',
      cancelText: 'Vazgeç',
      destructive: true,
      onConfirm: async () => {
        const res = await maintenanceService.delete(record.id);
        if (res.success) {
          await cancelMaintenanceNotifications(record.id);
          showSuccess('Bakım kaydı silindi.');
          loadMaintenance();
        } else {
          showError(res.error || 'Silme işlemi başarısız.');
        }
      },
    });
  };

  const handleDelete = () => {
    showAlert({
      type: 'danger',
      title: 'Ürünü Sil',
      message: `"${product?.name}" ürününü envanterinizden silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
      confirmText: 'Sil',
      cancelText: 'Vazgeç',
      destructive: true,
      onConfirm: async () => {
        if (!product?.id) return;
        const res = await deleteProduct(product.id);
        if (res.success) {
          showSuccess('Ürün envanterden silindi.');
          navigation.goBack();
        } else {
          showError(res.error || 'Ürün silinirken bir hata oluştu.');
        }
      },
    });
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
      showInfo(`Dosya adresi: ${product.invoice_path}`, 'Fatura Belgesi');
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
  const statusInfo = calculateWarrantyStatus(product.warranty_end_date, colors);

  const pendingMaintenances = useMemo(
    () => maintenanceRecords.filter((m) => m.status === 'pending'),
    [maintenanceRecords]
  );
  const completedMaintenances = useMemo(
    () => maintenanceRecords.filter((m) => m.status === 'completed'),
    [maintenanceRecords]
  );


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
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerIconButton, isFav && styles.headerIconButtonActive]}
            onPress={handleFavoriteToggle}
            activeOpacity={0.7}
          >
            <Heart
              size={19}
              color={isFav ? '#ef4444' : colors.onSurfaceVariant}
              fill={isFav ? '#ef4444' : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={handleEdit}
            activeOpacity={0.7}
          >
            <Edit2 size={19} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Görsel Hero Bölümü */}
        <TouchableOpacity
          style={styles.heroImageContainer}
          activeOpacity={product.image_path ? 0.85 : 1}
          onPress={() => {
            if (product.image_path) {
              setImageViewerOpen(true);
            }
          }}
          disabled={!product.image_path}
        >
          {product.image_path ? (
            <>
              <Image source={{ uri: product.image_path }} style={styles.heroImage} resizeMode="cover" />
              <View style={styles.zoomBadge}>
                <Maximize2 size={16} color="#ffffff" />
              </View>
            </>
          ) : (
            <View style={styles.heroPlaceholder}>
              <Package size={64} color={colors.outline} />
            </View>
          )}
        </TouchableOpacity>

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

        {/* Dijital Ürün Etiketi (QR Kod) Bölümü */}
        <View style={styles.qrSection}>
          <Text style={styles.sectionTitle}>Dijital Ürün Etiketi</Text>
          <TouchableOpacity
            style={styles.qrCard}
            onPress={() => setQrModalOpen(true)}
            activeOpacity={0.7}
          >
            <View style={styles.qrCardLeft}>
              <View style={styles.qrCardIconBox}>
                <QrCode size={22} color={colors.primary} />
              </View>
              <View style={styles.qrCardTextBox}>
                <Text style={styles.qrCardTitle}>Cihaz QR Etiketi</Text>
                <Text style={styles.qrCardSubtitle} numberOfLines={1}>
                  Çıktı alıp cihaza yapıştırın, kamerayla hızlıca açın
                </Text>
              </View>
            </View>
            <View style={styles.qrActionBadge}>
              <Text style={styles.qrActionBadgeText}>Görüntüle & Yazdır</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bakım Takvimi & Geçmişi Bölümü */}
        <View style={styles.maintenanceSection}>
          <View style={styles.maintenanceHeaderRow}>
            <Text style={styles.sectionTitle}>Bakım Takvimi & Geçmişi</Text>
            <TouchableOpacity
              style={styles.addMaintenanceBtn}
              onPress={() => setMaintenanceModalOpen(true)}
              activeOpacity={0.8}
            >
              <Plus size={14} color={colors.onPrimary} />
              <Text style={styles.addMaintenanceBtnText}>Bakım Ekle</Text>
            </TouchableOpacity>
          </View>

          {/* Aktif / Bekleyen Bakımlar */}
          {pendingMaintenances.length > 0 ? (
            pendingMaintenances.map((item) => {
              return (
                <View key={item.id} style={styles.maintenanceCard}>
                  <View style={styles.maintenanceCardTop}>
                    <View style={styles.maintenanceLeftInfo}>
                      <View style={styles.maintenanceBadgeRow}>
                        <View style={styles.maintenanceDateBadge}>
                          <Clock size={12} color={colors.primary} />
                          <Text style={styles.maintenanceDateBadgeText}>
                            {formatDateTurkish(item.maintenance_date)}
                          </Text>
                        </View>
                        {item.interval_months ? (
                          <View style={styles.maintenanceIntervalBadge}>
                            <Repeat size={11} color={colors.onSurfaceVariant} />
                            <Text style={styles.maintenanceIntervalBadgeText}>
                              {item.interval_months === 12
                                ? 'Yıllık Bakım'
                                : `${item.interval_months} Ayda Bir`}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={styles.maintenanceTitle}>{item.title}</Text>
                      {item.service_provider ? (
                        <Text style={styles.maintenanceMetaText}>
                          Servis: {item.service_provider}
                        </Text>
                      ) : null}
                      {item.notes ? (
                        <Text style={styles.maintenanceMetaText} numberOfLines={2}>
                          {item.notes}
                        </Text>
                      ) : null}
                      {item.cost ? (
                        <Text style={styles.maintenanceMetaText}>
                          Tahmini Tutar: {formatCurrency(item.cost)}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  <View style={styles.maintenanceActionRow}>
                    <TouchableOpacity
                      style={styles.completeMaintenanceBtn}
                      onPress={() => handleCompleteMaintenance(item)}
                      activeOpacity={0.75}
                    >
                      <CheckCircle2 size={15} color={colors.warranty?.active || '#10b981'} />
                      <Text style={styles.completeMaintenanceBtnText}>Bakımı Tamamla</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteMaintenanceBtn}
                      onPress={() => handleDeleteMaintenance(item)}
                      activeOpacity={0.7}
                    >
                      <Trash2 size={15} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyMaintenanceCard}>
              <View style={styles.emptyMaintenanceIconBox}>
                <Wrench size={24} color={colors.primary} />
              </View>
              <Text style={styles.emptyMaintenanceText}>
                Planlanmış periyodik bakım bulunmuyor. Servis, filtre veya düzenli kontrollerinizi takip etmek için yukarıdan ekleyin.
              </Text>
            </View>
          )}

          {/* Tamamlanan Geçmiş Bakımlar */}
          {completedMaintenances.length > 0 && (
            <View style={{ marginTop: 4 }}>
              <TouchableOpacity
                style={styles.historyToggleRow}
                onPress={() => setShowHistory(!showHistory)}
                activeOpacity={0.7}
              >
                <Text style={styles.historyToggleText}>
                  Tamamlanan Bakımlar ({completedMaintenances.length})
                </Text>
                {showHistory ? (
                  <ChevronUp size={16} color={colors.onSurfaceVariant} />
                ) : (
                  <ChevronDown size={16} color={colors.onSurfaceVariant} />
                )}
              </TouchableOpacity>

              {showHistory &&
                completedMaintenances.map((item) => (
                  <View
                    key={item.id}
                    style={[styles.maintenanceCard, styles.maintenanceCardCompleted, { marginTop: 6 }]}
                  >
                    <View style={styles.maintenanceCardTop}>
                      <View style={styles.maintenanceLeftInfo}>
                        <View style={styles.maintenanceBadgeRow}>
                          <View
                            style={[
                              styles.maintenanceDateBadge,
                              { backgroundColor: (colors.warranty?.active || '#10b981') + '20' },
                            ]}
                          >
                            <CheckCircle2 size={12} color={colors.warranty?.active || '#10b981'} />
                            <Text
                              style={[
                                styles.maintenanceDateBadgeText,
                                { color: colors.warranty?.active || '#10b981' },
                              ]}
                            >
                              Yapıldı: {formatDateTurkish(item.completed_at || item.maintenance_date)}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.maintenanceTitle}>{item.title}</Text>
                        {item.service_provider ? (
                          <Text style={styles.maintenanceMetaText}>Servis: {item.service_provider}</Text>
                        ) : null}
                        {item.cost ? (
                          <Text style={styles.maintenanceMetaText}>Maliyet: {formatCurrency(item.cost)}</Text>
                        ) : null}
                      </View>
                      <TouchableOpacity
                        style={styles.deleteMaintenanceBtn}
                        onPress={() => handleDeleteMaintenance(item)}
                        activeOpacity={0.7}
                      >
                        <Trash2 size={14} color={colors.outline} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>
          )}
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

      {/* Dijital Ürün Etiketi & Yazdırma Modalı */}
      <ProductQrModal
        visible={qrModalOpen}
        product={product}
        onClose={() => setQrModalOpen(false)}
      />

      {/* Bakım Ekleme Modalı */}
      <MaintenanceModal
        visible={maintenanceModalOpen}
        product={product}
        onClose={() => setMaintenanceModalOpen(false)}
        onCreated={loadMaintenance}
      />

      {/* Büyük Fotoğraf Önizleme Modalı */}
      <ImageViewerModal
        visible={imageViewerOpen}
        imageUrl={product.image_path}
        title={product.name}
        onClose={() => setImageViewerOpen(false)}
      />
    </SafeAreaView>
  );
};
