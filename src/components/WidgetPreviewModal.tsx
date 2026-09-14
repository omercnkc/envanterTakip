import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { LayoutGrid, X, ShieldCheck, Sparkles, Smartphone, CheckCircle } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { useInventory } from '../context/InventoryContext';
import { calculateWidgetData } from '../services/widgetSyncService';
import { getStyles } from './WidgetPreviewModal.styles';

interface WidgetPreviewModalProps {
  visible: boolean;
  onClose: () => void;
}

export const WidgetPreviewModal: React.FC<WidgetPreviewModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const { allProducts } = useInventory();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [widgetSize, setWidgetSize] = useState<'2x2' | '4x2'>('2x2');

  const widgetData = useMemo(
    () => calculateWidgetData(allProducts),
    [allProducts]
  );

  const nearest = widgetData.nearestProduct;
  const isExpiring = nearest?.status === 'expiring_soon';
  const isExpired = nearest?.status === 'expired';

  const badgeBg = isExpired ? '#fee2e2' : isExpiring ? '#ffedd5' : '#dcfce7';
  const badgeTextColor = isExpired ? '#b91c1c' : isExpiring ? '#c2410c' : '#15803d';
  const badgeText = isExpiring ? '⚠️ Yaklaşıyor' : isExpired ? '❌ Bitti' : '✅ Güvende';

  const daysText =
    nearest?.daysRemaining === 0
      ? 'Bugün Son Gün'
      : nearest?.daysRemaining === 1
      ? 'Yarın Bitiyor'
      : nearest?.daysRemaining && nearest.daysRemaining > 0
      ? `${nearest.daysRemaining} Gün Kaldı`
      : 'Süresi Doldu';

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
              <View style={styles.handleBar} />

              {/* Başlık Çubuğu */}
              <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                  <View style={styles.headerIconBox}>
                    <LayoutGrid size={22} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.headerTitle}>Ana Ekran Widget'ı</Text>
                    <Text style={styles.headerSubtitle}>
                      Uygulamayı açmadan canlı garanti takibi
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

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Boyut Seçici (2x2 vs 4x2) */}
                <View style={styles.sizeSelectorRow}>
                  <TouchableOpacity
                    style={[styles.sizeTab, widgetSize === '2x2' && styles.sizeTabActive]}
                    onPress={() => setWidgetSize('2x2')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.sizeTabText,
                        widgetSize === '2x2' && styles.sizeTabTextActive,
                      ]}
                    >
                      2x2 Kompakt
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.sizeTab, widgetSize === '4x2' && styles.sizeTabActive]}
                    onPress={() => setWidgetSize('4x2')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.sizeTabText,
                        widgetSize === '4x2' && styles.sizeTabTextActive,
                      ]}
                    >
                      4x2 Geniş Liste
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Masaüstü Simülasyon Alanı */}
                <View style={styles.phoneDeskCanvas}>
                  <Text style={styles.phoneDeskLabel}>📱 Telefon Masaüstü Simülasyonu</Text>

                  {widgetSize === '2x2' ? (
                    // 2x2 Kompakt Widget
                    <View style={styles.widgetCard2x2}>
                      <View style={styles.widgetHeader}>
                        <View>
                          <Text style={styles.widgetAppBrand}>🛡️ Envanter Takip</Text>
                          <Text style={styles.widgetActiveCount}>
                            {widgetData.activeCount} aktif garanti
                          </Text>
                        </View>
                        <View style={[styles.widgetStatusBadge, { backgroundColor: badgeBg }]}>
                          <Text style={[styles.widgetStatusBadgeText, { color: badgeTextColor }]}>
                            {badgeText}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.widgetBody}>
                        {nearest ? (
                          <>
                            <Text style={styles.widgetProductName} numberOfLines={1}>
                              {nearest.name}
                            </Text>
                            <Text style={styles.widgetProductMeta} numberOfLines={1}>
                              {nearest.brandModel || 'Kayıtlı Eşya'}
                            </Text>
                          </>
                        ) : (
                          <>
                            <Text style={styles.widgetProductName}>Garantiler Güvende</Text>
                            <Text style={styles.widgetProductMeta}>Bu ay riskli ürün yok</Text>
                          </>
                        )}
                      </View>

                      <View style={styles.widgetFooter}>
                        <Text
                          style={[
                            styles.widgetDaysText,
                            { color: nearest ? badgeTextColor : '#4648d4' },
                          ]}
                        >
                          {nearest ? daysText : `${widgetData.totalCount} eşya`}
                        </Text>
                        <Text style={styles.widgetDateText}>
                          {nearest ? `Son: ${nearest.endDate}` : 'Güvende'}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    // 4x2 Geniş Widget
                    <View style={styles.widgetCard4x2}>
                      <View style={styles.widgetHeader}>
                        <View>
                          <Text style={[styles.widgetAppBrand, { fontSize: 13 }]}>
                            🛡️ Ev Envanter & Garanti Takip
                          </Text>
                          <Text style={styles.widgetActiveCount}>
                            {widgetData.activeCount} aktif cihaz koruma altında · Toplam {widgetData.totalCount} kayıt
                          </Text>
                        </View>
                        <View style={[styles.widgetStatusBadge, { backgroundColor: badgeBg }]}>
                          <Text style={[styles.widgetStatusBadgeText, { color: badgeTextColor }]}>
                            {badgeText}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.widgetBody}>
                        {nearest ? (
                          <>
                            <Text style={[styles.widgetProductName, { fontSize: 16 }]}>
                              Sıradaki: {nearest.name}
                            </Text>
                            <Text style={styles.widgetProductMeta}>
                              {nearest.brandModel || 'Cihaz'} · Garanti Bitişi: {nearest.endDate}
                            </Text>
                          </>
                        ) : (
                          <>
                            <Text style={[styles.widgetProductName, { fontSize: 16 }]}>
                              Tüm Garantiler Güvende
                            </Text>
                            <Text style={styles.widgetProductMeta}>
                              Yakın zamanda süresi dolacak kayıtlı cihazınız bulunmuyor.
                            </Text>
                          </>
                        )}
                      </View>

                      <View style={styles.widgetFooter}>
                        <Text
                          style={[
                            styles.widgetDaysText,
                            { color: nearest ? badgeTextColor : '#4648d4' },
                          ]}
                        >
                          {nearest ? `Kalan Süre: ${daysText}` : 'Durum: Mükemmel'}
                        </Text>
                        <Text style={[styles.widgetDateText, { color: '#4648d4', fontWeight: '700' }]}>
                          Dokun ve Aç →
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Kurulum Rehberi Adımları */}
                <View style={styles.guideSection}>
                  <Text style={styles.guideTitle}>🚀 Ana Ekrana Nasıl Eklenir?</Text>

                  <View style={styles.guideStepRow}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>1</Text>
                    </View>
                    <Text style={styles.stepText}>
                      Telefonunuzun ana ekranında (boş bir alanda) parmağınızı basılı tutun.
                    </Text>
                  </View>

                  <View style={styles.guideStepRow}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>2</Text>
                    </View>
                    <Text style={styles.stepText}>
                      Altta açılan menüden <Text style={{ fontWeight: '700' }}>"Widget'lar" (Araçlar)</Text> seçeneğine dokunun.
                    </Text>
                  </View>

                  <View style={styles.guideStepRow}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>3</Text>
                    </View>
                    <Text style={styles.stepText}>
                      Listeden <Text style={{ fontWeight: '700' }}>"Ev Envanter & Garanti Takip"</Text> uygulamasını bulun.
                    </Text>
                  </View>

                  <View style={styles.guideStepRow}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>4</Text>
                    </View>
                    <Text style={styles.stepText}>
                      Widget'ı basılı tutarak ana ekranınızda istediğiniz konuma sürükleyin.
                    </Text>
                  </View>

                  <View style={styles.buildNoteBox}>
                    <Sparkles size={16} color={colors.tertiary} />
                    <Text style={styles.buildNoteText}>
                      Widget verileriniz envanterinize yeni ürün eklediğinizde veya sildiğinizde arka planda otomatik güncellenir.
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.doneButtonText}>Anladım, Kapat</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
