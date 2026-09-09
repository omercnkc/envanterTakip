import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { AuthProvider } from './src/context/AuthContext';
import { InventoryProvider } from './src/context/InventoryContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { navigationRef, navigate } from './src/navigation/navigationRef';
import {
  setupNotificationChannel,
  requestNotificationPermissions,
} from './src/utils/notificationHelper';

export default function App() {
  useEffect(() => {
    // 1. Bildirim izinlerini ve Android kanalını kur
    setupNotificationChannel();
    requestNotificationPermissions();

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
      <AuthProvider>
        <InventoryProvider>
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
            <StatusBar style="dark" />
          </NavigationContainer>
        </InventoryProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

