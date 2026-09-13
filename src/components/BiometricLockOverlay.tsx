import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AppState,
  AppStateStatus,
  Animated,
  Platform,
} from 'react-native';
import { Fingerprint, Lock, LogOut } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { biometricHelper, BiometricCheckResult } from '../utils/biometricHelper';
import { RADIUS, SPACING } from '../constants';

export const BiometricLockOverlay: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { colors, isDark } = useTheme();

  const [isLocked, setIsLocked] = useState(false);
  const [biometricInfo, setBiometricInfo] = useState<BiometricCheckResult | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const appState = useRef(AppState.currentState);

  // Biyometrik donanım bilgisini al
  useEffect(() => {
    biometricHelper.checkBiometrics().then(setBiometricInfo);
  }, []);

  // Nabız animasyonu
  useEffect(() => {
    if (isLocked) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isLocked, pulseAnim]);

  // Kimlik doğrulama işlemi
  const triggerAuth = useCallback(async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);

    try {
      const res = await biometricHelper.authenticate('Safe Envanter Kilidini Aç');
      if (res.success) {
        setIsLocked(false);
      }
    } finally {
      setIsAuthenticating(false);
    }
  }, [isAuthenticating]);

  // İlk açılışta ve arka plandan dönüşte kilit kontrolü
  useEffect(() => {
    const checkAndLock = async () => {
      if (!user) {
        setIsLocked(false);
        return;
      }

      const shouldLock = await biometricHelper.shouldLockOnResume();
      if (shouldLock) {
        setIsLocked(true);
        // Otomatik doğrulamayı tetikle
        setTimeout(() => {
          triggerAuth();
        }, 350);
      } else {
        setIsLocked(false);
      }
    };

    checkAndLock();

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      // Arka plana geçerken zamanı kaydet
      if (nextAppState.match(/inactive|background/)) {
        biometricHelper.recordBackground();
      }

      // Ön plana geri döndüğünde zaman aşımına göre kilit kontrolü yap
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkAndLock();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [user, triggerAuth]);

  if (!isLocked || !user) {
    return null;
  }

  const typeName = biometricInfo?.biometricTypeName || 'Biyometri';

  return (
    <View
      style={[
        styles.overlay,
        {
          backgroundColor: colors.background,
          paddingTop: Math.max(insets.top, 24) + 32,
          paddingBottom: Math.max(insets.bottom, 24) + 24,
        },
      ]}
    >
      {/* Üst Kilit İkonu & İllüstrasyon */}
      <View style={styles.centerContainer}>
        <Animated.View
          style={[
            styles.iconOuterRing,
            {
              backgroundColor: isDark ? 'rgba(79, 70, 229, 0.15)' : '#EEF2FF',
              borderColor: colors.primary,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={[styles.iconInnerCircle, { backgroundColor: colors.primary }]}>
            <Fingerprint size={42} color={colors.onPrimary} />
          </View>
        </Animated.View>

        <Text style={[styles.title, { color: colors.onBackground }]}>
          Safe Envanter Kilitli
        </Text>
        <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
          Varlıklarınıza ve garanti verilerinize erişmek için {typeName} ile doğrulayın.
        </Text>

        <TouchableOpacity
          style={[styles.unlockButton, { backgroundColor: colors.primary }]}
          onPress={triggerAuth}
          activeOpacity={0.8}
        >
          <Lock size={18} color={colors.onPrimary} />
          <Text style={[styles.unlockButtonText, { color: colors.onPrimary }]}>
            {typeName} ile Aç
          </Text>
        </TouchableOpacity>
      </View>

      {/* Alt Çıkış Butonu */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            setIsLocked(false);
            await signOut();
          }}
          activeOpacity={0.7}
        >
          <LogOut size={16} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Farklı Hesapla Giriş Yap / Çıkış Yap
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999999,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  iconOuterRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  iconInnerCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 16,
    marginBottom: 36,
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  unlockButtonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  footerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
