import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import {
  Settings,
  HelpCircle,
  Info,
  ChevronRight,
  Pencil,
  FileText,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Share2,
} from 'lucide-react-native';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useInventory } from '../../context/InventoryContext';
import { useAlert } from '../../context/AlertContext';
import { EditProfileModal, LegalModal, ImageViewerModal } from '../../components';
import {
  calculateFinancialAnalytics,
  generateInsuranceReportHtml,
} from '../../utils/financialCalculator';
import { formatCurrency } from '../../utils/warrantyCalculator';
import { getStyles } from './ProfileScreen.styles';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile, user } = useAuth();
  const { colors } = useTheme();
  const { stats, products } = useInventory();
  const { showAlert, showError, showSuccess } = useAlert();

  const styles = useMemo(() => getStyles(colors), [colors]);

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı';
  const email = profile?.email || user?.email || 'kullanici@safeenvanter.com';
  const userInitials = (displayName[0] || 'K').toUpperCase();
  const avatarUrl = profile?.avatar_url;

  // Finansal analitiği hesapla
  const analytics = useMemo(() => {
    return calculateFinancialAnalytics(products);
  }, [products]);

  // Garanti Koruma Skoru (Aktif / Toplam)
  const healthScore = useMemo(() => {
    if (!stats.total || stats.total === 0) return 100;
    return Math.round((stats.active / stats.total) * 100);
  }, [stats.total, stats.active]);

  const healthScoreLabel = useMemo(() => {
    if (healthScore >= 80) return 'Mükemmel Koruma';
    if (healthScore >= 50) return 'İyi Seviye Koruma';
    return 'Garantisi Bitenler Var';
  }, [healthScore]);

  // Doğrudan Resmi PDF Sigorta Raporu Oluştur & Paylaş
  const handleGeneratePdfReport = async () => {
    if (products.length === 0) {
      showAlert({
        type: 'info',
        title: 'Envanter Boş',
        message: 'Rapor oluşturabilmek için önce birkaç ürün eklemelisiniz.',
        confirmText: 'Tamam',
        showCancel: false,
      });
      return;
    }

    try {
      setIsGeneratingPdf(true);
      const html = generateInsuranceReportHtml(products, analytics);
      const { uri, base64 } = await Print.printToFileAsync({
        html,
        base64: true,
      });

      let shareUri = uri;
      if (base64 && FileSystem.cacheDirectory) {
        const safePath = `${FileSystem.cacheDirectory}safe_envanter_sigorta_raporu_${Date.now()}.pdf`;
        await FileSystem.writeAsStringAsync(safePath, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        shareUri = safePath;
      }

      await Sharing.shareAsync(shareUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Ev Envanter & Sigorta Raporu',
        UTI: 'com.adobe.pdf',
      });
    } catch (err) {
      console.warn('PDF paylaşım hatası:', err);
      showError('PDF raporu oluşturulurken bir sorun meydana geldi.', 'Hata');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleHelp = () => {
    showAlert({
      type: 'info',
      title: 'Yardım & Destek',
      message: 'Sorularınız, önerileriniz veya geri bildirimleriniz için support@safeenvanter.com adresinden bize 7/24 ulaşabilirsiniz.',
      showCancel: false,
      confirmText: 'Anladım',
    });
  };

  const handleAbout = () => {
    showAlert({
      type: 'info',
      title: 'Safe Envanter',
      message: 'Versiyon 1.0.0\n\nEvdeki tüm maddi varlıklarınızı, garanti sürelerinizi ve bakım takvimlerinizi güvenle yönetebileceğiniz modern dijital envanter platformu.',
      showCancel: false,
      confirmText: 'Kapat',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Profil</Text>

        {/* 1. Profil Kullanıcı Kartı (Fotoğraflı veya Monogram) */}
        <View style={styles.userCard}>
          <TouchableOpacity
            style={styles.avatarBox}
            onPress={() => {
              if (avatarUrl) {
                setImageViewerOpen(true);
              } else {
                setEditProfileOpen(true);
              }
            }}
            activeOpacity={0.8}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} resizeMode="cover" />
            ) : (
              <Text style={styles.avatarInitials}>{userInitials}</Text>
            )}
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setEditProfileOpen(true)}
            activeOpacity={0.7}
          >
            <Pencil size={13} color={colors.primary} />
            <Text style={styles.editProfileButtonText}>Profili Düzenle</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Envanter Güvence & Garanti Koruma Skoru */}
        <View style={styles.healthCard}>
          <View style={styles.healthHeaderRow}>
            <View style={styles.healthLeft}>
              <ShieldCheck size={18} color="#10B981" />
              <Text style={styles.healthTitle}>Garanti Güvence Skoru</Text>
            </View>
            <View style={styles.healthScoreBadge}>
              <Sparkles size={12} color="#059669" />
              <Text style={styles.healthScoreText}>%{healthScore}</Text>
            </View>
          </View>

          <View style={styles.healthProgressBarTrack}>
            <View
              style={[
                styles.healthProgressBarFill,
                { width: `${healthScore}%` },
                healthScore < 50 && { backgroundColor: colors.error },
              ]}
            />
          </View>

          <Text style={styles.healthHintText}>
            {healthScoreLabel} • {stats.active} aktif garanti koruması
          </Text>
        </View>

        {/* 3. Hızlı Eylem: Sigorta & Taşınma Raporu Al (A4 PDF) */}
        <TouchableOpacity
          style={styles.pdfReportCard}
          onPress={handleGeneratePdfReport}
          activeOpacity={0.8}
          disabled={isGeneratingPdf}
        >
          <View style={styles.pdfReportLeft}>
            <View style={styles.pdfIconCircle}>
              {isGeneratingPdf ? (
                <ActivityIndicator size="small" color={colors.onPrimary} />
              ) : (
                <FileText size={20} color={colors.onPrimary} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pdfReportTitle}>Resmi Envanter & Sigorta Raporu</Text>
              <Text style={styles.pdfReportSubtitle}>
                A4 formatında imzalı PDF beyan dökümü oluşturun ve paylaşın
              </Text>
            </View>
          </View>
          <Share2 size={18} color={colors.primary} />
        </TouchableOpacity>

        {/* 6. Menü Listesi (Sadeleştirilmiş ve Ayarlar ile Ayrıştırılmış) */}
        <View style={styles.menuCard}>
          {/* Ayarlar */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIconBox}>
                <Settings size={18} color={colors.primary} />
              </View>
              <Text style={styles.menuItemLabel}>Uygulama & Güvenlik Ayarları</Text>
            </View>
            <ChevronRight size={18} color={colors.outline} />
          </TouchableOpacity>

          {/* Gizlilik & KVKK */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setLegalModalOpen(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIconBox}>
                <ShieldCheck size={18} color={colors.tertiary} />
              </View>
              <Text style={styles.menuItemLabel}>Gizlilik Politikası & KVKK</Text>
            </View>
            <ChevronRight size={18} color={colors.outline} />
          </TouchableOpacity>

          {/* Yardım & Destek */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleHelp}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIconBox}>
                <HelpCircle size={18} color={colors.outline} />
              </View>
              <Text style={styles.menuItemLabel}>Yardım & Destek</Text>
            </View>
            <ChevronRight size={18} color={colors.outline} />
          </TouchableOpacity>

          {/* Hakkında */}
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemNoBorder]}
            onPress={handleAbout}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIconBox}>
                <Info size={18} color={colors.outline} />
              </View>
              <Text style={styles.menuItemLabel}>Safe Envanter Hakkında</Text>
            </View>
            <ChevronRight size={18} color={colors.outline} />
          </TouchableOpacity>
        </View>

        {/* Uygulama Marka & Versiyon Alanı */}
        <View style={styles.appBrandingContainer}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.appBrandingLogo}
            resizeMode="cover"
          />
          <Text style={styles.appBrandingTitle}>Safe Envanter</Text>
          <Text style={styles.appBrandingVersion}>v1.0.0 • Varlık & Garanti Yönetimi</Text>
        </View>
      </ScrollView>

      {/* Profili Düzenle Modalı */}
      <EditProfileModal
        visible={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />

      {/* Yasal Bilgiler Modalı */}
      <LegalModal
        visible={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
      />

      {/* Profil Fotoğrafı Tam Ekran Önizleme Modalı */}
      <ImageViewerModal
        visible={imageViewerOpen}
        imageUrl={avatarUrl}
        title={displayName}
        onClose={() => setImageViewerOpen(false)}
      />
    </SafeAreaView>
  );
};
