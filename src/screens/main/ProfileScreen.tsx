import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Settings,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';

import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../context/InventoryContext';
import { styles } from './ProfileScreen.styles';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile, user, signOut } = useAuth();
  const { stats } = useInventory();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Ömer';
  const email = profile?.email || user?.email || 'omer@example.com';
  const userInitials = (displayName[0] || 'Ö').toUpperCase();

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkış yapmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  };

  const handleHelp = () => {
    Alert.alert(
      'Yardım & Destek',
      'Sorularınız veya geri bildirimleriniz için support@safeenvanter.com adresinden bize ulaşabilirsiniz.'
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Safe Envanter',
      'Versiyon 1.0.0\n\nEvdeki varlıklarınızı ve garanti sürelerinizi güvenle takip edebileceğiniz modern envanter yönetim platformu.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Profil</Text>

        {/* Profil Kullanıcı Kartı */}
        <View style={styles.userCard}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarInitials}>{userInitials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>
        </View>

        {/* 3'lü İstatistik Izgarası */}
        <View style={styles.statsGrid}>
          {/* Stat 1: Toplam Ürün */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Toplam Ürün</Text>
            <Text style={[styles.statValue, { color: COLORS.primary }]}>
              {stats.total}
            </Text>
          </View>

          {/* Stat 2: Aktif Garanti */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Aktif Garanti</Text>
            <Text style={[styles.statValue, { color: COLORS.tertiary }]}>
              {stats.active}
            </Text>
          </View>

          {/* Stat 3: Yakında Bitecek */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Yakında Bitecek</Text>
            <Text style={[styles.statValue, { color: COLORS.error }]}>
              {stats.expiringSoon}
            </Text>
          </View>
        </View>

        {/* Menü Listesi */}
        <View style={styles.menuCard}>
          {/* Ayarlar */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Settings size={20} color={COLORS.outline} />
              <Text style={styles.menuItemLabel}>Ayarlar</Text>
            </View>
            <ChevronRight size={18} color={COLORS.outline} />
          </TouchableOpacity>

          {/* Yardım & Destek */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleHelp}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <HelpCircle size={20} color={COLORS.outline} />
              <Text style={styles.menuItemLabel}>Yardım & Destek</Text>
            </View>
            <ChevronRight size={18} color={COLORS.outline} />
          </TouchableOpacity>

          {/* Hakkında */}
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemNoBorder]}
            onPress={handleAbout}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Info size={20} color={COLORS.outline} />
              <Text style={styles.menuItemLabel}>Hakkında</Text>
            </View>
            <ChevronRight size={18} color={COLORS.outline} />
          </TouchableOpacity>
        </View>

        {/* Çıkış Yap Butonu */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LogOut size={18} color={COLORS.error} />
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>

        {/* Uygulama Marka & Versiyon Alanı */}
        <View style={styles.appBrandingContainer}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.appBrandingLogo}
            resizeMode="cover"
          />
          <Text style={styles.appBrandingTitle}>Safe Envanter</Text>
          <Text style={styles.appBrandingVersion}>v1.0.0 • Garanti & Varlık Yönetimi</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
