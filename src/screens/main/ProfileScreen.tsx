import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Moon, Shield, Info, LogOut, ChevronRight } from 'lucide-react-native';

import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { styles } from './ProfileScreen.styles';

export const ProfileScreen: React.FC = () => {
  const { profile, user, signOut } = useAuth();

  const displayName = profile?.full_name || 'Kullanıcı';
  const email = profile?.email || user?.email || 'kullanici@domain.com';

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profil Başlığı */}
        <View style={styles.header}>
          <View style={styles.avatarBox}>
            <User size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        {/* Tercihler Menüsü */}
        <View>
          <Text style={styles.sectionTitle}>Tercihler</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <Bell size={20} color={COLORS.primary} />
                <Text style={styles.menuItemLabel}>Garanti Bildirimleri</Text>
              </View>
              <ChevronRight size={18} color={COLORS.outline} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <Moon size={20} color={COLORS.primary} />
                <Text style={styles.menuItemLabel}>Karanlık Mod (Dark Mode)</Text>
              </View>
              <ChevronRight size={18} color={COLORS.outline} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Güvenlik & Hakkında */}
        <View>
          <Text style={styles.sectionTitle}>Uygulama</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <Shield size={20} color={COLORS.primary} />
                <Text style={styles.menuItemLabel}>Gizlilik ve Güvenlik</Text>
              </View>
              <ChevronRight size={18} color={COLORS.outline} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <Info size={20} color={COLORS.primary} />
                <Text style={styles.menuItemLabel}>Hakkında (v1.0.0)</Text>
              </View>
              <ChevronRight size={18} color={COLORS.outline} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Çıkış Yap Butonu */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LogOut size={20} color={COLORS.onErrorContainer} />
          <Text style={styles.logoutButtonText}>Oturumu Kapat</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
