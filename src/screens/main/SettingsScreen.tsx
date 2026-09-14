import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowLeft,
  ChevronRight,
  User,
  Lock,
  Fingerprint,
  Bell,
  Mail,
  Palette,
  Globe,
  Download,
  Upload,
  Trash2,
  LogOut,
  AlertTriangle,
  Shield,
  Pencil,
  Clock,
  LayoutGrid,
  Coins,
  Wrench,
  FileText,
  Sparkles,
} from 'lucide-react-native';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useInventory } from '../../context/InventoryContext';
import { useAlert } from '../../context/AlertContext';
import { cacheHelper } from '../../utils/cacheHelper';
import {
  biometricHelper,
  BiometricCheckResult,
  BiometricTimeout,
  BIOMETRIC_TIMEOUT_OPTIONS,
} from '../../utils/biometricHelper';
import {
  cancelAllWarrantyNotifications,
  syncAllWarrantyNotifications,
} from '../../utils/notificationHelper';
import { permissionHelper } from '../../utils/permissionHelper';
import {
  appPreferencesHelper,
  CURRENCY_OPTIONS,
  CurrencyCode,
  WARRANTY_MILESTONE_OPTIONS,
  DEFAULT_WARRANTY_DURATION_OPTIONS,
} from '../../utils/appPreferencesHelper';
import {
  EditProfileModal,
  ChangePasswordModal,
  ExportDataModal,
  ImportDataModal,
  LegalModal,
  ThemeSegmentedControl,
  WidgetPreviewModal,
} from '../../components';
import { getStyles } from './SettingsScreen.styles';

const STORAGE_KEYS = {
  WARRANTY_REMINDERS: '@safe_envanter_warranty_reminders',
  EMAIL_NOTIFICATIONS: '@safe_envanter_email_notifications',
};

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, profile, signOut } = useAuth();
  const { theme, colors, systemColorScheme } = useTheme();
  const { products } = useInventory();
  const { showAlert, showSuccess, showError, showWarning, showInfo } = useAlert();

  const styles = useMemo(() => getStyles(colors), [colors]);
  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [widgetPreviewOpen, setWidgetPreviewOpen] = useState(false);

  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricTimeout, setBiometricTimeout] = useState<BiometricTimeout>('immediately');
  const [biometricInfo, setBiometricInfo] = useState<BiometricCheckResult | null>(null);
  const [warrantyReminders, setWarrantyReminders] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Gelişmiş tercihler state'i
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('TRY');
  const [selectedWarrantyDays, setSelectedWarrantyDays] = useState<number[]>([30, 14, 7, 1]);
  const [maintenanceReminders, setMaintenanceReminders] = useState(true);
  const [defaultWarrantyMonths, setDefaultWarrantyMonths] = useState(24);

  // Kullanıcı bilgileri
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı';
  const displayEmail = profile?.email || user?.email || 'kullanici@safeenvanter.com';
  const userInitials = (displayName[0] || 'K').toUpperCase();
  const avatarUrl = profile?.avatar_url;

  // İkon kutucuk renkleri paleti (iOS/Bento Tarzı Soft Pastel)
  const tileColors = useMemo(
    () => ({
      account: {
        bg: isDark ? 'rgba(79, 70, 229, 0.22)' : '#EEF2FF',
        icon: isDark ? '#A5B4FC' : '#4F46E5',
      },
      password: {
        bg: isDark ? 'rgba(217, 119, 6, 0.22)' : '#FEF3C7',
        icon: isDark ? '#FCD34D' : '#D97706',
      },
      biometric: {
        bg: isDark ? 'rgba(16, 185, 129, 0.22)' : '#D1FAE5',
        icon: isDark ? '#6EE7B7' : '#059669',
      },
      notifications: {
        bg: isDark ? 'rgba(124, 58, 237, 0.22)' : '#EDE9FE',
        icon: isDark ? '#C4B5FD' : '#7C3AED',
      },
      maintenance: {
        bg: isDark ? 'rgba(14, 165, 233, 0.22)' : '#E0F2FE',
        icon: isDark ? '#7DD3FC' : '#0284C7',
      },
      email: {
        bg: isDark ? 'rgba(59, 130, 246, 0.22)' : '#DBEAFE',
        icon: isDark ? '#93C5FD' : '#2563EB',
      },
      appearance: {
        bg: isDark ? 'rgba(236, 72, 153, 0.22)' : '#FCE7F3',
        icon: isDark ? '#F472B6' : '#DB2777',
      },
      currency: {
        bg: isDark ? 'rgba(245, 158, 11, 0.22)' : '#FEF3C7',
        icon: isDark ? '#FBBF24' : '#D97706',
      },
      warrantyDuration: {
        bg: isDark ? 'rgba(99, 102, 241, 0.22)' : '#EEF2FF',
        icon: isDark ? '#A5B4FC' : '#6366F1',
      },
      language: {
        bg: isDark ? 'rgba(14, 165, 233, 0.22)' : '#E0F2FE',
        icon: isDark ? '#7DD3FC' : '#0284C7',
      },
      export: {
        bg: isDark ? 'rgba(20, 184, 166, 0.22)' : '#CCFBF1',
        icon: isDark ? '#5EEAD4' : '#0D9488',
      },
      import: {
        bg: isDark ? 'rgba(16, 185, 129, 0.22)' : '#D1FAE5',
        icon: isDark ? '#6EE7B7' : '#059669',
      },
      cache: {
        bg: isDark ? 'rgba(148, 163, 184, 0.22)' : '#F1F5F9',
        icon: isDark ? '#CBD5E1' : '#64748B',
      },
      legal: {
        bg: isDark ? 'rgba(99, 102, 241, 0.22)' : '#EEF2FF',
        icon: isDark ? '#A5B4FC' : '#6366F1',
      },
      logout: {
        bg: isDark ? 'rgba(245, 158, 11, 0.22)' : '#FEF3C7',
        icon: isDark ? '#FBBF24' : '#D97706',
      },
      deleteAccount: {
        bg: isDark ? 'rgba(239, 68, 68, 0.22)' : '#FEE2E2',
        icon: isDark ? '#F87171' : '#DC2626',
      },
    }),
    [isDark]
  );

  // Kayıtlı ayarları yükle
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [
          savedReminders,
          savedEmail,
          isBioEnabled,
          bioInfo,
          bioTimeout,
          prefs,
        ] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.WARRANTY_REMINDERS),
          AsyncStorage.getItem(STORAGE_KEYS.EMAIL_NOTIFICATIONS),
          biometricHelper.isEnabled(),
          biometricHelper.checkBiometrics(),
          biometricHelper.getTimeout(),
          appPreferencesHelper.getPreferences(),
        ]);

        if (savedReminders !== null) {
          setWarrantyReminders(savedReminders === 'true');
        }
        if (savedEmail !== null) {
          setEmailNotifications(savedEmail === 'true');
        }
        setBiometricEnabled(isBioEnabled);
        setBiometricInfo(bioInfo);
        setBiometricTimeout(bioTimeout);

        // Gelişmiş tercihler
        setSelectedCurrency(prefs.currency);
        setSelectedWarrantyDays(prefs.warrantyDays);
        setMaintenanceReminders(prefs.maintenanceReminders);
        setDefaultWarrantyMonths(prefs.defaultWarrantyMonths);
      } catch (err) {
        console.warn('Ayarlar yüklenirken hata:', err);
      }
    };

    loadSettings();
  }, []);

  const handleSelectTimeout = async (timeout: BiometricTimeout) => {
    setBiometricTimeout(timeout);
    await biometricHelper.setTimeout(timeout);
  };

  const handleToggleWarrantyReminders = async (value: boolean) => {
    if (value) {
      const granted = await permissionHelper.requestPermissionWithModal('notifications');
      if (!granted) {
        setWarrantyReminders(false);
        return;
      }
    }

    setWarrantyReminders(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WARRANTY_REMINDERS, String(value));
      if (!value) {
        await cancelAllWarrantyNotifications();
        showInfo('Garanti hatırlatıcı yerel bildirimleri iptal edildi.', 'Bildirimler Kapatıldı');
      } else {
        await syncAllWarrantyNotifications(products);
        showSuccess(
          'Garanti süreleri yaklaşan ürünleriniz için hatırlatıcılar başarıyla planlandı.',
          'Bildirimler Açıldı'
        );
      }
    } catch (err) {
      console.warn('Garanti bildirimi ayarı kaydedilemedi:', err);
    }
  };

  const handleToggleMilestoneDay = async (day: number) => {
    let updated: number[];
    if (selectedWarrantyDays.includes(day)) {
      // En az 1 gün seçili kalmalı
      if (selectedWarrantyDays.length === 1) {
        showWarning('En az bir bildirim günü seçili olmalıdır.', 'Uyarı');
        return;
      }
      updated = selectedWarrantyDays.filter((d) => d !== day);
    } else {
      updated = [...selectedWarrantyDays, day].sort((a, b) => b - a);
    }

    setSelectedWarrantyDays(updated);
    await appPreferencesHelper.setWarrantyDays(updated);

    // Bildirimleri yeniden senkronize et
    if (warrantyReminders) {
      await syncAllWarrantyNotifications(products);
    }
  };

  const handleToggleMaintenanceReminders = async (value: boolean) => {
    setMaintenanceReminders(value);
    await appPreferencesHelper.setMaintenanceReminders(value);
    if (value) {
      showSuccess('Periyodik bakım ve servis hatırlatıcıları aktifleştirildi.', 'Bakım Bildirimleri');
    } else {
      showInfo('Periyodik bakım bildirimleri kapatıldı.', 'Bilgi');
    }
  };

  const handleToggleEmailNotifications = async (value: boolean) => {
    setEmailNotifications(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EMAIL_NOTIFICATIONS, String(value));
    } catch (err) {
      console.warn('E-posta bildirimi ayarı kaydedilemedi:', err);
    }
  };

  const handleSelectCurrency = async (code: CurrencyCode) => {
    setSelectedCurrency(code);
    await appPreferencesHelper.setCurrency(code);
    showSuccess(
      `Varsayılan para birimi ${code} olarak güncellendi.`,
      'Para Birimi Güncellendi'
    );
  };

  const handleSelectDefaultWarranty = async (months: number) => {
    setDefaultWarrantyMonths(months);
    await appPreferencesHelper.setDefaultWarrantyMonths(months);
    showSuccess(
      `Yeni ürünler için varsayılan garanti süresi ${months} ay yapıldı.`,
      'Garanti Süresi Kaydedildi'
    );
  };

  const handleToggleBiometric = async (value: boolean) => {
    if (value) {
      const check = await biometricHelper.checkBiometrics();
      if (!check.hasHardware) {
        showWarning(
          'Cihazınızda biyometrik kimlik doğrulama (Face ID / Parmak İzi) donanımı bulunamadı.',
          'Desteklenmiyor'
        );
        return;
      }
      if (!check.isEnrolled) {
        showWarning(
          'Cihazınızda kayıtlı Face ID veya Parmak İzi bulunamadı. Lütfen cihaz ayarlarınızdan biyometri ekleyin.',
          'Kayıt Bulunamadı'
        );
        return;
      }

      const authRes = await biometricHelper.authenticate(
        `${check.biometricTypeName} ile Kilidi Aktifleştir`
      );
      if (authRes.success) {
        await biometricHelper.setEnabled(true);
        setBiometricEnabled(true);
        showSuccess(
          `Safe Envanter artık ${check.biometricTypeName} ile korunuyor.`,
          'Biyometrik Kilit Aktif'
        );
      }
    } else {
      const authRes = await biometricHelper.authenticate(
        'Biyometrik Kilidi Kapatmak İçin Doğrulayın'
      );
      if (authRes.success) {
        await biometricHelper.setEnabled(false);
        setBiometricEnabled(false);
        showInfo('Uygulama açılış kilidi devre dışı bırakıldı.', 'Biyometrik Kilit Kapatıldı');
      }
    }
  };

  const handleClearCache = async () => {
    const { sizeInBytes, fileCount } = await cacheHelper.getCacheSize();
    const formattedSize = cacheHelper.formatBytes(sizeInBytes);

    showAlert({
      type: 'warning',
      title: 'Önbelleği Temizle',
      message: `Geçici dosya önbelleği (${fileCount} dosya, ${formattedSize}) silinsin mi?`,
      confirmText: 'Temizle',
      cancelText: 'Vazgeç',
      onConfirm: async () => {
        const result = await cacheHelper.clearCache();
        if (result.success) {
          showSuccess(
            `${result.deletedCount} adet geçici dosya (${cacheHelper.formatBytes(
              result.freedBytes
            )}) silindi.`,
            'Önbellek Temizlendi'
          );
        } else {
          showError('Önbellek temizlenirken bir sorun oluştu.', 'Hata');
        }
      },
    });
  };

  const handleLogout = () => {
    showAlert({
      type: 'danger',
      title: 'Oturumu Kapat',
      message: 'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      confirmText: 'Çıkış Yap',
      cancelText: 'Vazgeç',
      destructive: true,
      onConfirm: async () => {
        await signOut();
      },
    });
  };

  const handleDeleteAccount = () => {
    showAlert({
      type: 'danger',
      title: 'Hesabı Kalıcı Olarak Sil',
      message: 'Hesabınızı ve kayıtlı tüm ürün, garanti ve fatura verilerinizi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
      confirmText: 'Hesabımı Sil',
      cancelText: 'Vazgeç',
      destructive: true,
      onConfirm: async () => {
        await signOut();
        showSuccess('Hesabınız başarıyla kapatıldı.', 'Bilgi');
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Üst Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={colors.onBackground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Üst Kompakt Hesap Kartı (Artık Profil ekranını taklit etmeyen sade ve modern satır) */}
        <TouchableOpacity
          style={styles.compactAccountCard}
          onPress={() => setEditProfileOpen(true)}
          activeOpacity={0.8}
        >
          <View style={styles.compactAccountLeft}>
            <View style={styles.compactAvatarBox}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.compactAvatarImage} resizeMode="cover" />
              ) : (
                <Text style={styles.compactAvatarText}>{userInitials}</Text>
              )}
            </View>
            <View style={styles.compactAccountInfo}>
              <Text style={styles.compactAccountName} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={styles.compactAccountEmail} numberOfLines={1}>
                {displayEmail}
              </Text>
            </View>
          </View>
          <View style={styles.compactEditPill}>
            <Pencil size={11} color={colors.primary} />
            <Text style={styles.compactEditText}>Düzenle</Text>
          </View>
        </TouchableOpacity>

        {/* Bölüm 1: Hesap & Güvenlik */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Hesap & Güvenlik</Text>
          <View style={styles.card}>
            {/* Profil Bilgileri */}
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => setEditProfileOpen(true)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeftContainer}>
                <View style={[styles.iconTile, { backgroundColor: tileColors.account.bg }]}>
                  <User size={18} color={tileColors.account.icon} />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={styles.rowLabel}>Hesap ve Profil Bilgileri</Text>
                  <Text style={styles.rowSubtitle}>Ad soyad ve profil fotoğrafı</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.outline} />
            </TouchableOpacity>

            {/* Şifre Değiştirme */}
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => setChangePasswordOpen(true)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeftContainer}>
                <View style={[styles.iconTile, { backgroundColor: tileColors.password.bg }]}>
                  <Lock size={18} color={tileColors.password.icon} />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={styles.rowLabel}>Şifre ve Güvenlik</Text>
                  <Text style={styles.rowSubtitle}>Giriş şifrenizi güncelleyin</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.outline} />
            </TouchableOpacity>

            {/* Biyometrik Kilit */}
            <View style={[styles.cardRow, !biometricEnabled && styles.cardRowNoBorder]}>
              <View style={styles.rowLeftContainer}>
                <View style={[styles.iconTile, { backgroundColor: tileColors.biometric.bg }]}>
                  <Fingerprint size={18} color={tileColors.biometric.icon} />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={styles.rowLabel}>
                    {biometricInfo?.biometricTypeName
                      ? `${biometricInfo.biometricTypeName} ile Kilit`
                      : 'Biyometrik Kilit'}
                  </Text>
                  <Text style={styles.rowSubtitle}>
                    Uygulama açılışlarında biyometrik doğrulama iste
                  </Text>
                </View>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={handleToggleBiometric}
                trackColor={{ false: colors.outlineVariant, true: colors.primaryFixed }}
                thumbColor={biometricEnabled ? colors.primary : colors.surfaceContainerLowest}
              />
            </View>

            {/* Biyometrik Kilit Bekleme Süresi Seçici */}
            {biometricEnabled && (
              <View style={styles.biometricTimeoutContainer}>
                <View style={styles.biometricTimeoutHeader}>
                  <Text style={styles.biometricTimeoutTitle}>Doğrulama İsteme Aralığı</Text>
                </View>
                <View style={styles.biometricTimeoutPillsRow}>
                  {BIOMETRIC_TIMEOUT_OPTIONS.map((opt) => {
                    const isActive = biometricTimeout === opt.id;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        style={[
                          styles.biometricTimeoutPill,
                          isActive && styles.biometricTimeoutPillActive,
                        ]}
                        onPress={() => handleSelectTimeout(opt.id)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.biometricTimeoutPillText,
                            isActive && styles.biometricTimeoutPillTextActive,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Text style={styles.biometricTimeoutHint}>
                  {BIOMETRIC_TIMEOUT_OPTIONS.find((o) => o.id === biometricTimeout)?.description}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Bölüm 2: Bildirimler & Uyarılar */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Bildirimler & Uyarılar</Text>
          <View style={styles.card}>
            {/* Garanti Hatırlatıcıları Switch */}
            <View style={styles.cardRow}>
              <View style={styles.rowLeftContainer}>
                <View style={[styles.iconTile, { backgroundColor: tileColors.notifications.bg }]}>
                  <Bell size={18} color={tileColors.notifications.icon} />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={styles.rowLabel}>Garanti Hatırlatıcıları</Text>
                  <Text style={styles.rowSubtitle}>Bitiş öncesi yerel anlık uyarılar</Text>
                </View>
              </View>
              <Switch
                value={warrantyReminders}
                onValueChange={handleToggleWarrantyReminders}
                trackColor={{ false: colors.outlineVariant, true: colors.primaryFixed }}
                thumbColor={warrantyReminders ? colors.primary : colors.surfaceContainerLowest}
              />
            </View>

            {/* Hatırlatma Günleri Seçici (Pills) */}
            {warrantyReminders && (
              <View style={styles.preferenceBlock}>
                <View style={styles.preferenceHeader}>
                  <Text style={styles.preferenceTitle}>Garanti Bildirim Günleri</Text>
                  <Text style={styles.preferenceSubtitle}>Kaç gün önce uyarılsın?</Text>
                </View>
                <View style={styles.pillsRow}>
                  {WARRANTY_MILESTONE_OPTIONS.map((opt) => {
                    const isSelected = selectedWarrantyDays.includes(opt.days);
                    return (
                      <TouchableOpacity
                        key={opt.days}
                        style={[styles.pill, isSelected && styles.pillActive]}
                        onPress={() => handleToggleMilestoneDay(opt.days)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Periyodik Bakım & Servis Bildirimleri Switch */}
            <View style={styles.cardRow}>
              <View style={styles.rowLeftContainer}>
                <View style={[styles.iconTile, { backgroundColor: tileColors.maintenance.bg }]}>
                  <Wrench size={18} color={tileColors.maintenance.icon} />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={styles.rowLabel}>Bakım & Servis Uyarıları</Text>
                  <Text style={styles.rowSubtitle}>Kombi, filtre ve araç bakım tarihleri</Text>
                </View>
              </View>
              <Switch
                value={maintenanceReminders}
                onValueChange={handleToggleMaintenanceReminders}
                trackColor={{ false: colors.outlineVariant, true: colors.primaryFixed }}
                thumbColor={maintenanceReminders ? colors.primary : colors.surfaceContainerLowest}
              />
            </View>

            {/* E-posta Bildirimleri Switch */}
            <View style={[styles.cardRow, styles.cardRowNoBorder]}>
              <View style={styles.rowLeftContainer}>
                <View style={[styles.iconTile, { backgroundColor: tileColors.email.bg }]}>
                  <Mail size={18} color={tileColors.email.icon} />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={styles.rowLabel}>E-posta Bildirimleri</Text>
                  <Text style={styles.rowSubtitle}>Aylık özet ve kritik durum raporları</Text>
                </View>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={handleToggleEmailNotifications}
                trackColor={{ false: colors.outlineVariant, true: colors.primaryFixed }}
                thumbColor={emailNotifications ? colors.primary : colors.surfaceContainerLowest}
              />
            </View>
          </View>
        </View>

        {/* Bölüm 3: Görünüm & Tercihler */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Görünüm & Tercihler</Text>
          <View style={styles.card}>
            {/* Tema Seçici Kartı */}
            <View style={styles.themeSelectorContainer}>
              <View style={styles.themeHeaderRow}>
                <View style={styles.rowLeftContainer}>
                  <View style={[styles.iconTile, { backgroundColor: tileColors.appearance.bg }]}>
                    <Palette size={18} color={tileColors.appearance.icon} />
                  </View>
                  <View style={styles.rowTexts}>
                    <Text style={styles.rowLabel}>Uygulama Teması</Text>
                    <Text style={styles.rowSubtitle}>Açık, koyu veya sistem teması</Text>
                  </View>
                </View>
                <Text style={styles.themeCurrentLabel}>
                  {theme === 'system'
                    ? `Sistem (${systemColorScheme === 'dark' ? 'Koyu' : 'Açık'})`
                    : theme === 'dark'
                    ? 'Koyu Mod'
                    : 'Açık Mod'}
                </Text>
              </View>

              <ThemeSegmentedControl />

              {theme === 'system' && (
                <View style={styles.systemThemeInfoBox}>
                  <Text style={styles.systemThemeInfoText}>
                    Cihazınız şu anda{' '}
                    <Text style={{ fontWeight: '700', color: colors.primary }}>
                      {systemColorScheme === 'dark' ? 'Koyu Mod' : 'Açık Mod'}
                    </Text>{' '}
                    kullanıyor. Uygulama sistem rengine göre otomatik uyum sağlar.
                  </Text>
                </View>
              )}
            </View>

            {/* Para Birimi Seçici (Pills) */}
            <View style={styles.preferenceBlock}>
              <View style={styles.preferenceHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Coins size={16} color={tileColors.currency.icon} />
                  <Text style={styles.preferenceTitle}>Varsayılan Para Birimi</Text>
                </View>
                <Text style={styles.preferenceSubtitle}>
                  {CURRENCY_OPTIONS.find((c) => c.code === selectedCurrency)?.symbol} {selectedCurrency}
                </Text>
              </View>
              <View style={styles.pillsRow}>
                {CURRENCY_OPTIONS.map((c) => {
                  const isSelected = selectedCurrency === c.code;
                  return (
                    <TouchableOpacity
                      key={c.code}
                      style={[styles.pill, isSelected && styles.pillActive]}
                      onPress={() => handleSelectCurrency(c.code)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                        {c.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Varsayılan Garanti Süresi (Pills) */}
            <View style={styles.preferenceBlock}>
              <View style={styles.preferenceHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Clock size={16} color={tileColors.warrantyDuration.icon} />
                  <Text style={styles.preferenceTitle}>Varsayılan Garanti Süresi</Text>
                </View>
                <Text style={styles.preferenceSubtitle}>{defaultWarrantyMonths} Ay</Text>
              </View>
              <View style={styles.pillsRow}>
                {DEFAULT_WARRANTY_DURATION_OPTIONS.map((opt) => {
                  const isSelected = defaultWarrantyMonths === opt.months;
                  return (
                    <TouchableOpacity
                      key={opt.months}
                      style={[styles.pill, isSelected && styles.pillActive]}
                      onPress={() => handleSelectDefaultWarranty(opt.months)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Ana Ekran Widget'ı */}
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => setWidgetPreviewOpen(true)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeftContainer}>
                <View style={[styles.iconTile, { backgroundColor: colors.primary + '18' }]}>
                  <LayoutGrid size={18} color={colors.primary} />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={styles.rowLabel}>Ana Ekran Widget'ı</Text>
                  <Text style={styles.rowSubtitle}>Canlı garanti panosu & önizleme</Text>
                </View>
              </View>
              <ChevronRight size={16} color={colors.outline} />
            </TouchableOpacity>

            {/* Uygulama Dili */}
            <TouchableOpacity
              style={[styles.cardRow, styles.cardRowNoBorder]}
              onPress={() =>
                showInfo('Şu anda sadece Türkçe dili desteklenmektedir.', 'Dil Seçimi')
              }
              activeOpacity={0.7}
            >
              <View style={styles.rowLeftContainer}>
                <View style={[styles.iconTile, { backgroundColor: tileColors.language.bg }]}>
                  <Globe size={18} color={tileColors.language.icon} />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={styles.rowLabel}>Uygulama Dili</Text>
                  <Text style={styles.rowSubtitle}>Varsayılan arayüz dili</Text>
                </View>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.rowValue}>Türkçe</Text>
                <ChevronRight size={16} color={colors.outline} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bölüm 4: Veri & Depolama */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Veri & Depolama</Text>
          <View style={styles.card}>
            {/* Dışa Aktar */}
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => setExportModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeftContainer}>
                <View style={[styles.iconTile, { backgroundColor: tileColors.export.bg }]}>
                  <Download size={18} color={tileColors.export.icon} />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={styles.rowLabel}>Verileri Dışa Aktar</Text>
                  <Text style={styles.rowSubtitle}>Envanter listenizi Excel veya JSON olarak alın</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.outline} />
            </TouchableOpacity>

            {/* Yedeği Geri Yükle (İçe Aktar) */}
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => setImportModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeftContainer}>
                <View style={[styles.iconTile, { backgroundColor: tileColors.import.bg }]}>
                  <Upload size={18} color={tileColors.import.icon} />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={styles.rowLabel}>Yedeği Geri Yükle</Text>
                  <Text style={styles.rowSubtitle}>JSON yedeğinden ürünleri tekrar aktarın</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.outline} />
            </TouchableOpacity>

            {/* Önbellek Temizleme */}
            <TouchableOpacity
              style={[styles.cardRow, styles.cardRowNoBorder]}
              onPress={handleClearCache}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeftContainer}>
                <View style={[styles.iconTile, { backgroundColor: tileColors.cache.bg }]}>
                  <Trash2 size={18} color={tileColors.cache.icon} />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={styles.rowLabel}>Önbelleği Temizle</Text>
                  <Text style={styles.rowSubtitle}>Geçici dosya ve görsel önbelleğini silin</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.outline} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bölüm 5: Yasal Bilgiler & Güvenlik */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Yasal & Güvenlik</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={[styles.cardRow, styles.cardRowNoBorder]}
              onPress={() => setLegalModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeftContainer}>
                <View style={[styles.iconTile, { backgroundColor: tileColors.legal.bg }]}>
                  <FileText size={18} color={tileColors.legal.icon} />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={styles.rowLabel}>Gizlilik Politikası, KVKK & Şartlar</Text>
                  <Text style={styles.rowSubtitle}>Veri koruma ilkeleri ve kullanıcı sözleşmesi</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.outline} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bölüm 6: Oturum & Hesap Yönetimi */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Hesap İşlemleri</Text>
          <View style={styles.card}>
            {/* Oturumu Kapat */}
            <TouchableOpacity
              style={styles.cardRow}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeftContainer}>
                <View style={[styles.iconTile, { backgroundColor: tileColors.logout.bg }]}>
                  <LogOut size={18} color={tileColors.logout.icon} />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={[styles.rowLabel, { color: tileColors.logout.icon }]}>
                    Oturumu Kapat
                  </Text>
                  <Text style={styles.rowSubtitle}>Bu cihazdaki aktif oturumu sonlandırın</Text>
                </View>
              </View>
              <ChevronRight size={18} color={tileColors.logout.icon} />
            </TouchableOpacity>

            {/* Hesabı Sil */}
            <TouchableOpacity
              style={[styles.cardRow, styles.cardRowNoBorder]}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeftContainer}>
                <View style={[styles.iconTile, { backgroundColor: tileColors.deleteAccount.bg }]}>
                  <AlertTriangle size={18} color={tileColors.deleteAccount.icon} />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={[styles.rowLabel, { color: colors.error }]}>Hesabımı Sil</Text>
                  <Text style={styles.rowSubtitle}>Tüm varlık ve garanti verilerinizi kalıcı silin</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Alt Footer & Güvenlik Mührü */}
        <View style={styles.footer}>
          <View style={styles.footerSecurityRow}>
            <Shield size={14} color={colors.outline} />
            <Text style={styles.footerSecurityText}>Uçtan Uca Şifreli & Güvenli Yerel Depolama</Text>
          </View>
          <Text style={styles.footerAppVersion}>Safe Envanter v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Modallar */}
      <EditProfileModal
        visible={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />

      <ChangePasswordModal
        visible={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />

      <ExportDataModal
        visible={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />

      <ImportDataModal
        visible={importModalOpen}
        onClose={() => setImportModalOpen(false)}
      />

      <LegalModal
        visible={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
      />

      <WidgetPreviewModal
        visible={widgetPreviewOpen}
        onClose={() => setWidgetPreviewOpen(false)}
      />
    </SafeAreaView>
  );
};
