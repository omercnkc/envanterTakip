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
import { useTranslation } from '../i18n';
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
  const { language } = useTranslation();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [widgetSize, setWidgetSize] = useState<'2x2' | '4x2'>('2x2');

  const widgetData = useMemo(
    () => calculateWidgetData(allProducts, language),
    [allProducts, language]
  );

  const nearest = widgetData.nearestProduct;
  const isExpiring = nearest?.status === 'expiring_soon';
  const isExpired = nearest?.status === 'expired';

  const badgeBg = isExpired ? '#fee2e2' : isExpiring ? '#ffedd5' : '#dcfce7';
  const badgeTextColor = isExpired ? '#b91c1c' : isExpiring ? '#c2410c' : '#15803d';
  const badgeText = isExpiring
    ? (language === 'tr' ? '⚠️ Yaklaşıyor' : '⚠️ Expiring Soon')
    : isExpired
    ? (language === 'tr' ? '❌ Bitti' : '❌ Expired')
    : (language === 'tr' ? '✅ Güvende' : '✅ Protected');

  const daysText =
    nearest?.daysRemaining === 0
      ? (language === 'tr' ? 'Bugün Son Gün' : 'Ends Today')
      : nearest?.daysRemaining === 1
      ? (language === 'tr' ? 'Yarın Bitiyor' : 'Ends Tomorrow')
      : nearest?.daysRemaining && nearest.daysRemaining > 0
      ? (language === 'tr' ? `${nearest.daysRemaining} Gün Kaldı` : `${nearest.daysRemaining} Days Left`)
      : (language === 'tr' ? 'Süresi Doldu' : 'Expired');

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
                    <Text style={styles.headerTitle}>
                      {language === 'tr' ? 'Ana Ekran Widget\'ı' : 'Home Screen Widget'}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                      {language === 'tr'
                        ? 'Uygulamayı açmadan canlı garanti takibi'
                        : 'Live warranty tracking right from your home screen'}
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
                      {language === 'tr' ? '2x2 Kompakt' : '2x2 Compact'}
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
                      {language === 'tr' ? '4x2 Geniş Liste' : '4x2 Wide List'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Masaüstü Simülasyon Alanı */}
                <View style={styles.phoneDeskCanvas}>
                  <Text style={styles.phoneDeskLabel}>
                    {language === 'tr' ? '📱 Telefon Masaüstü Simülasyonu' : '📱 Phone Home Screen Simulation'}
                  </Text>

                  {widgetSize === '2x2' ? (
                    // 2x2 Kompakt Widget
                    <View style={styles.widgetCard2x2}>
                      <View style={styles.widgetHeader}>
                        <View>
                          <Text style={styles.widgetAppBrand}>
                            {language === 'tr' ? '🛡️ Envanter Takip' : '🛡️ Safe Inventory'}
                          </Text>
                          <Text style={styles.widgetActiveCount}>
                            {widgetData.activeCount} {language === 'tr' ? 'aktif garanti' : 'active warranties'}
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
                              {nearest.brandModel || (language === 'tr' ? 'Kayıtlı Eşya' : 'Registered Item')}
                            </Text>
                          </>
                        ) : (
                          <>
                            <Text style={styles.widgetProductName}>
                              {language === 'tr' ? 'Garantiler Güvende' : 'Warranties Protected'}
                            </Text>
                            <Text style={styles.widgetProductMeta}>
                              {language === 'tr' ? 'Bu ay riskli ürün yok' : 'No expiring items this month'}
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
                          {nearest ? daysText : `${widgetData.totalCount} ${language === 'tr' ? 'eşya' : 'items'}`}
                        </Text>
                        <Text style={styles.widgetDateText}>
                          {nearest ? `${language === 'tr' ? 'Son:' : 'Ends:'} ${nearest.endDate}` : (language === 'tr' ? 'Güvende' : 'Safe')}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    // 4x2 Geniş Widget
                    <View style={styles.widgetCard4x2}>
                      <View style={styles.widgetHeader}>
                        <View>
                          <Text style={[styles.widgetAppBrand, { fontSize: 13 }]}>
                            {language === 'tr' ? '🛡️ Ev Envanter & Garanti Takip' : '🛡️ Home Inventory & Warranty'}
                          </Text>
                          <Text style={styles.widgetActiveCount}>
                            {language === 'tr'
                              ? `${widgetData.activeCount} aktif cihaz koruma altında · Toplam ${widgetData.totalCount} kayıt`
                              : `${widgetData.activeCount} active items protected · Total ${widgetData.totalCount} records`}
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
                              {language === 'tr' ? `Sıradaki: ${nearest.name}` : `Next: ${nearest.name}`}
                            </Text>
                            <Text style={styles.widgetProductMeta}>
                              {nearest.brandModel || (language === 'tr' ? 'Cihaz' : 'Device')} · {language === 'tr' ? 'Garanti Bitişi:' : 'Warranty End:'} {nearest.endDate}
                            </Text>
                          </>
                        ) : (
                          <>
                            <Text style={[styles.widgetProductName, { fontSize: 16 }]}>
                              {language === 'tr' ? 'Tüm Garantiler Güvende' : 'All Warranties Protected'}
                            </Text>
                            <Text style={styles.widgetProductMeta}>
                              {language === 'tr'
                                ? 'Yakın zamanda süresi dolacak kayıtlı cihazınız bulunmuyor.'
                                : 'No items expiring in the near future.'}
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
                          {nearest ? `${language === 'tr' ? 'Kalan Süre:' : 'Remaining:'} ${daysText}` : (language === 'tr' ? 'Durum: Mükemmel' : 'Status: Excellent')}
                        </Text>
                        <Text style={[styles.widgetDateText, { color: '#4648d4', fontWeight: '700' }]}>
                          {language === 'tr' ? 'Dokun ve Aç →' : 'Tap to Open →'}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Kurulum Rehberi Adımları */}
                <View style={styles.guideSection}>
                  <Text style={styles.guideTitle}>
                    {language === 'tr' ? '🚀 Ana Ekrana Nasıl Eklenir?' : '🚀 How to Add to Home Screen'}
                  </Text>

                  <View style={styles.guideStepRow}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>1</Text>
                    </View>
                    <Text style={styles.stepText}>
                      {language === 'tr'
                        ? 'Telefonunuzun ana ekranında (boş bir alanda) parmağınızı basılı tutun.'
                        : 'Long-press on an empty space on your phone home screen.'}
                    </Text>
                  </View>

                  <View style={styles.guideStepRow}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>2</Text>
                    </View>
                    <Text style={styles.stepText}>
                      {language === 'tr'
                        ? 'Altta açılan menüden "Widget\'lar" (Araçlar) seçeneğine dokunun.'
                        : 'Tap the "Widgets" option that appears.'}
                    </Text>
                  </View>

                  <View style={styles.guideStepRow}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>3</Text>
                    </View>
                    <Text style={styles.stepText}>
                      {language === 'tr'
                        ? 'Listeden "Ev Envanter & Garanti Takip" uygulamasını bulun.'
                        : 'Find "Safe Envanter" from the list of apps.'}
                    </Text>
                  </View>

                  <View style={styles.guideStepRow}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>4</Text>
                    </View>
                    <Text style={styles.stepText}>
                      {language === 'tr'
                        ? 'Widget\'ı basılı tutarak ana ekranınızda istediğiniz konuma sürükleyin.'
                        : 'Drag and place the widget on your home screen.'}
                    </Text>
                  </View>

                  <View style={styles.buildNoteBox}>
                    <Sparkles size={16} color={colors.tertiary} />
                    <Text style={styles.buildNoteText}>
                      {language === 'tr'
                        ? 'Widget verileriniz envanterinize yeni ürün eklediğinizde veya sildiğinizde arka planda otomatik güncellenir.'
                        : 'Widget data refreshes automatically in the background whenever inventory items are added, updated, or removed.'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.doneButtonText}>
                    {language === 'tr' ? 'Anladım, Kapat' : 'Got It, Close'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
