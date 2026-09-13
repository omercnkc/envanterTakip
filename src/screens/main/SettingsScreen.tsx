import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowLeft,
  ChevronRight,
  Shield,
  Bell,
  Palette,
  Globe,
  Download,
  Trash2,
  AlertTriangle,
} from 'lucide-react-native';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useInventory } from '../../context/InventoryContext';
import { cacheHelper } from '../../utils/cacheHelper';
import {
  cancelAllWarrantyNotifications,
  syncAllWarrantyNotifications,
} from '../../utils/notificationHelper';
import {
  EditProfileModal,
  ChangePasswordModal,
  ExportDataModal,
  ThemeSegmentedControl,
} from '../../components';
import { getStyles } from './SettingsScreen.styles';

const STORAGE_KEYS = {
  WARRANTY_REMINDERS: '@safe_envanter_warranty_reminders',
  EMAIL_NOTIFICATIONS: '@safe_envanter_email_notifications',
  TWO_FACTOR: '@safe_envanter_two_factor',
};

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, profile, signOut } = useAuth();
  const { theme, setTheme, colors, systemColorScheme } = useTheme();
  const { products } = useInventory();

  const styles = useMemo(() => getStyles(colors), [colors]);

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [warrantyReminders, setWarrantyReminders] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Kayıtlı ayarları yükle
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [savedReminders, savedEmail, saved2FA] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.WARRANTY_REMINDERS),
          AsyncStorage.getItem(STORAGE_KEYS.EMAIL_NOTIFICATIONS),
          AsyncStorage.getItem(STORAGE_KEYS.TWO_FACTOR),
        ]);

        if (savedReminders !== null) {
          setWarrantyReminders(savedReminders === 'true');
        }
        if (savedEmail !== null) {
          setEmailNotifications(savedEmail === 'true');
        }
        if (saved2FA !== null) {
          setTwoFactorEnabled(saved2FA === 'true');
        }
      } catch (err) {
        console.warn('Ayarlar yüklenirken hata:', err);
      }
    };

    loadSettings();
  }, []);

  const handleToggleWarrantyReminders = async (value: boolean) => {
    setWarrantyReminders(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WARRANTY_REMINDERS, String(value));
      if (!value) {
        await cancelAllWarrantyNotifications();
        Alert.alert('Bildirimler Kapatıldı', 'Garanti hatırlatıcı yerel bildirimleri iptal edildi.');
      } else {
        await syncAllWarrantyNotifications(products);
        Alert.alert(
          'Bildirimler Açıldı',
          'Garanti süreleri yaklaşan ürünleriniz için hatırlatıcılar başarıyla planlandı.'
        );
      }
    } catch (err) {
      console.warn('Garanti bildirimi ayarı kaydedilemedi:', err);
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

  const handleToggleTwoFactor = async (value: boolean) => {
    setTwoFactorEnabled(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TWO_FACTOR, String(value));
    } catch (err) {
      console.warn('2FA ayarı kaydedilemedi:', err);
    }
  };

  const handleExportData = () => {
    setExportModalOpen(true);
  };

  const handleClearCache = async () => {
    const { sizeInBytes, fileCount } = await cacheHelper.getCacheSize();
    const formattedSize = cacheHelper.formatBytes(sizeInBytes);

    Alert.alert(
      'Önbelleği Temizle',
      `Geçici dosya önbelleği (${fileCount} dosya, ${formattedSize}) silinsin mi?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: async () => {
            const result = await cacheHelper.clearCache();
            if (result.success) {
              Alert.alert(
                'Önbellek Temizlendi',
                `${result.deletedCount} adet geçici dosya (${cacheHelper.formatBytes(
                  result.freedBytes
                )}) başarıyla silindi.`
              );
            } else {
              Alert.alert('Hata', 'Önbellek temizlenirken bir sorun oluştu.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabınızı ve tüm kayıtlı ürün verilerinizi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Hesabımı Sil',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            Alert.alert('Bilgi', 'Hesabınız başarıyla kapatıldı.');
          },
        },
      ]
    );
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
        {/* Bölüm 1: Hesap */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Hesap</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => setEditProfileOpen(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.rowLabel}>Hesap ve Profil Ayarları</Text>
              <ChevronRight size={18} color={colors.outline} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bölüm 2: Güvenlik */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Güvenlik</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => setChangePasswordOpen(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.rowLabel}>Şifre ve Güvenlik</Text>
              <ChevronRight size={18} color={colors.outline} />
            </TouchableOpacity>

            <View style={[styles.cardRow, styles.cardRowNoBorder]}>
              <Text style={styles.rowLabel}>İki Adımlı Doğrulama (2FA)</Text>
              <Switch
                value={twoFactorEnabled}
                onValueChange={handleToggleTwoFactor}
                trackColor={{ false: colors.outlineVariant, true: colors.primaryFixed }}
                thumbColor={twoFactorEnabled ? colors.primary : colors.surfaceContainerLowest}
              />
            </View>
          </View>
        </View>

        {/* Bölüm 3: Bildirimler */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Bildirimler</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.rowLabel}>Garanti Hatırlatıcıları</Text>
              <Switch
                value={warrantyReminders}
                onValueChange={handleToggleWarrantyReminders}
                trackColor={{ false: colors.outlineVariant, true: colors.primaryFixed }}
                thumbColor={warrantyReminders ? colors.primary : colors.surfaceContainerLowest}
              />
            </View>

            <View style={[styles.cardRow, styles.cardRowNoBorder]}>
              <Text style={styles.rowLabel}>E-posta Bildirimleri</Text>
              <Switch
                value={emailNotifications}
                onValueChange={handleToggleEmailNotifications}
                trackColor={{ false: colors.outlineVariant, true: colors.primaryFixed }}
                thumbColor={emailNotifications ? colors.primary : colors.surfaceContainerLowest}
              />
            </View>
          </View>
        </View>

        {/* Bölüm 4: Görünüm & Tercihler */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Görünüm & Tercihler</Text>
          <View style={styles.card}>
            {/* İnteraktif 3'lü Segment Tema Seçici */}
            <View style={styles.themeSelectorContainer}>
              <View style={styles.themeHeaderRow}>
                <View style={styles.rowLeftWithIcon}>
                  <Palette size={18} color={colors.primary} />
                  <Text style={styles.rowLabel}>Uygulama Teması</Text>
                </View>
                <Text style={styles.themeCurrentLabel}>
                  {theme === 'system'
                    ? `Sistem (${systemColorScheme === 'dark' ? 'Koyu' : 'Açık'})`
                    : theme === 'dark'
                    ? 'Koyu Mod'
                    : 'Açık Mod'}
                </Text>
              </View>

              {/* Animasyonlu Segment Tema Seçici (Sliding Pill) */}
              <ThemeSegmentedControl />

              {/* Sistem Modu Bilgi Rozeti */}
              {theme === 'system' && (
                <View style={styles.systemThemeInfoBox}>
                  <Text style={styles.systemThemeInfoText}>
                    Cihazınız şu anda{' '}
                    <Text style={{ fontWeight: '700', color: colors.primary }}>
                      {systemColorScheme === 'dark' ? 'Koyu Mod' : 'Açık Mod'}
                    </Text>{' '}
                    kullanıyor. Uygulama telefonunuzun temasıyla otomatik olarak değişir.
                  </Text>
                </View>
              )}
            </View>

            {/* Uygulama Dili */}
            <TouchableOpacity
              style={[styles.cardRow, styles.cardRowNoBorder]}
              onPress={() =>
                Alert.alert('Dil Seçimi', 'Şu anda sadece Türkçe dili desteklenmektedir.')
              }
              activeOpacity={0.7}
            >
              <View style={styles.rowLeftWithIcon}>
                <Globe size={18} color={colors.outline} />
                <Text style={styles.rowLabel}>Uygulama Dili</Text>
              </View>
              <Text style={styles.rowValue}>Türkçe</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bölüm 5: Veri & Depolama */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Veri & Depolama</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardRow}
              onPress={handleExportData}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeftWithIcon}>
                <Download size={18} color={colors.primary} />
                <Text style={styles.rowLabel}>Verileri Dışa Aktar</Text>
              </View>
              <ChevronRight size={18} color={colors.outline} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cardRow}
              onPress={handleClearCache}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeftWithIcon}>
                <Trash2 size={18} color={colors.primary} />
                <Text style={styles.rowLabel}>Önbelleği Temizle</Text>
              </View>
              <ChevronRight size={18} color={colors.outline} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cardRow, styles.cardRowNoBorder]}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeftWithIcon}>
                <AlertTriangle size={18} color={colors.error} />
                <Text style={[styles.rowLabel, { color: colors.error }]}>Hesabımı Sil</Text>
              </View>
              <ChevronRight size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Hesap & Profil Düzenleme Modalı */}
      <EditProfileModal
        visible={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />

      {/* Şifre Değiştirme Modalı */}
      <ChangePasswordModal
        visible={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />

      {/* Verileri Dışa Aktar Modalı */}
      <ExportDataModal
        visible={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </SafeAreaView>
  );
};
