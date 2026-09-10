import React, { useState } from 'react';
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
import {
  ArrowLeft,
  ChevronRight,
  Shield,
  Bell,
  Moon,
  Globe,
  Download,
  Trash2,
  AlertTriangle,
} from 'lucide-react-native';

import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import {
  EditProfileModal,
  ChangePasswordModal,
  ExportDataModal,
} from '../../components';
import { styles } from './SettingsScreen.styles';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, profile } = useAuth();

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [warrantyReminders, setWarrantyReminders] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleExportData = () => {
    setExportModalOpen(true);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Önbelleği Temizle',
      'Uygulama geçici önbelleği başarıyla temizlendi.',
      [{ text: 'Tamam' }]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabınızı ve tüm verilerinizi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Hesabımı Sil',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Bilgi', 'Hesap silme talebiniz işleme alındı.');
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
          <ArrowLeft size={22} color={COLORS.onBackground} />
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
              <ChevronRight size={18} color={COLORS.outline} />
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
              <ChevronRight size={18} color={COLORS.outline} />
            </TouchableOpacity>

            <View style={[styles.cardRow, styles.cardRowNoBorder]}>
              <Text style={styles.rowLabel}>İki Adımlı Doğrulama (2FA)</Text>
              <Switch
                value={twoFactorEnabled}
                onValueChange={setTwoFactorEnabled}
                trackColor={{ false: COLORS.outlineVariant, true: COLORS.primaryFixed }}
                thumbColor={twoFactorEnabled ? COLORS.primary : COLORS.surfaceContainerLowest}
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
                onValueChange={setWarrantyReminders}
                trackColor={{ false: COLORS.outlineVariant, true: COLORS.primaryFixed }}
                thumbColor={warrantyReminders ? COLORS.primary : COLORS.surfaceContainerLowest}
              />
            </View>

            <View style={[styles.cardRow, styles.cardRowNoBorder]}>
              <Text style={styles.rowLabel}>E-posta Bildirimleri</Text>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: COLORS.outlineVariant, true: COLORS.primaryFixed }}
                thumbColor={emailNotifications ? COLORS.primary : COLORS.surfaceContainerLowest}
              />
            </View>
          </View>
        </View>

        {/* Bölüm 4: Görünüm & Tercihler */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Görünüm & Tercihler</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.rowLabel}>Karanlık Mod (Dark Mode)</Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: COLORS.outlineVariant, true: COLORS.primaryFixed }}
                thumbColor={darkMode ? COLORS.primary : COLORS.surfaceContainerLowest}
              />
            </View>

            <TouchableOpacity
              style={[styles.cardRow, styles.cardRowNoBorder]}
              onPress={() => Alert.alert('Dil Seçimi', 'Şu anda sadece Türkçe dili desteklenmektedir.')}
              activeOpacity={0.7}
            >
              <Text style={styles.rowLabel}>Uygulama Dili</Text>
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
                <Download size={18} color={COLORS.primary} />
                <Text style={styles.rowLabel}>Verileri Dışa Aktar</Text>
              </View>
              <ChevronRight size={18} color={COLORS.outline} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cardRow}
              onPress={handleClearCache}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeftWithIcon}>
                <Trash2 size={18} color={COLORS.primary} />
                <Text style={styles.rowLabel}>Önbelleği Temizle</Text>
              </View>
              <ChevronRight size={18} color={COLORS.outline} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cardRow, styles.cardRowNoBorder]}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeftWithIcon}>
                <AlertTriangle size={18} color={COLORS.error} />
                <Text style={[styles.rowLabel, { color: COLORS.error }]}>Hesabımı Sil</Text>
              </View>
              <ChevronRight size={18} color={COLORS.error} />
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
