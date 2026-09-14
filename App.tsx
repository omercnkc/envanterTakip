import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Animated } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { AuthProvider } from './src/context/AuthContext';
import { InventoryProvider } from './src/context/InventoryContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { navigationRef, navigate } from './src/navigation/navigationRef';
import {
  setupNotificationChannel,
  requestNotificationPermissions,
} from './src/utils/notificationHelper';
import { DARK_COLORS, LIGHT_COLORS } from './src/constants/colors';
import { BiometricLockOverlay, AppToast, AppAlertModal, PermissionModal } from './src/components';
import { AlertProvider } from './src/context/AlertContext';
import { permissionHelper, PermissionPromptConfig } from './src/utils/permissionHelper';

/**
 * Temalar arası geçişte gözü yormayan pürüzsüz dissolve geçişi sağlar
 */
const ThemeTransitionOverlay: React.FC = () => {
  const { isDark } = useTheme();
  const prevIsDarkRef = useRef<boolean | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [overlayBg, setOverlayBg] = useState<string | null>(null);

  useEffect(() => {
    // İlk açılışta animasyon tetikleme
    if (prevIsDarkRef.current === null) {
      prevIsDarkRef.current = isDark;
      return;
    }

    // Yalnızca tema modu gerçekten değiştiğinde yumuşak geçiş perdesi uygula
    if (prevIsDarkRef.current !== isDark) {
      const prevColor = prevIsDarkRef.current ? DARK_COLORS.background : LIGHT_COLORS.background;
      setOverlayBg(prevColor);
      fadeAnim.setValue(0.75);

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start(() => {
        setOverlayBg(null);
      });

      prevIsDarkRef.current = isDark;
    }
  }, [isDark, fadeAnim]);

  if (!overlayBg) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: overlayBg,
          opacity: fadeAnim,
          zIndex: 99999,
        },
      ]}
    />
  );
};

const AppContent: React.FC = () => {
  const { isDark, colors } = useTheme();
  const [permissionConfig, setPermissionConfig] = useState<PermissionPromptConfig | null>(null);
  const permissionCallbackRef = useRef<((granted: boolean) => void) | null>(null);

  useEffect(() => {
    permissionHelper.setListener((config, callback) => {
      setPermissionConfig(config);
      permissionCallbackRef.current = callback || null;
    });

    return () => {
      permissionHelper.setListener(null);
    };
  }, []);

  const handleAllowPermission = () => {
    setPermissionConfig(null);
    if (permissionCallbackRef.current) {
      permissionCallbackRef.current(true);
      permissionCallbackRef.current = null;
    }
  };

  const handleDismissPermission = () => {
    setPermissionConfig(null);
    if (permissionCallbackRef.current) {
      permissionCallbackRef.current(false);
      permissionCallbackRef.current = null;
    }
  };

  const navigationTheme = useMemo(() => {
    const baseTheme = isDark ? DarkTheme : DefaultTheme;
    return {
      ...baseTheme,
      dark: isDark,
      colors: {
        ...baseTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surfaceContainerLowest,
        text: colors.onBackground,
        border: colors.outlineVariant,
        notification: colors.error,
      },
    };
  }, [isDark, colors]);

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <RootNavigator />
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemeTransitionOverlay />
      <BiometricLockOverlay />
      <AppToast />
      <AppAlertModal />
      <PermissionModal
        config={permissionConfig}
        onAllow={handleAllowPermission}
        onDismiss={handleDismissPermission}
      />
    </NavigationContainer>
  );
};

export default function App() {
  useEffect(() => {
    // 1. Android bildirim kanalını kur
    setupNotificationChannel();

    // 2. Uygulama kapalıyken bildirime tıklanarak açıldıysa (Cold Start)
    Notifications.getLastNotificationResponseAsync().then((response) => {
      const productId = response?.notification?.request?.content?.data?.productId;
      if (productId) {
        setTimeout(() => {
          navigate('ProductDetail', { productId: String(productId) });
        }, 1000);
      }
    });

    // 3. Uygulama açıkken veya arka plandayken bildirime tıklanma olayı
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const productId = response?.notification?.request?.content?.data?.productId;
      if (productId) {
        navigate('ProductDetail', { productId: String(productId) });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AlertProvider>
          <AuthProvider>
            <InventoryProvider>
              <AppContent />
            </InventoryProvider>
          </AuthProvider>
        </AlertProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
