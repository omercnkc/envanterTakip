import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { Home, Package, Plus, Bell, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../constants';
import { MainTabParamList } from '../types';
import { HomeScreen } from '../screens/main/HomeScreen';
import { ProductsScreen } from '../screens/main/ProductsScreen';
import { AddProductScreen } from '../screens/main/AddProductScreen';
import { NotificationsScreen } from '../screens/main/NotificationsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 5 Buton için genişlik hesabı (Ekran genişliğine göre max 380px)
const TAB_BAR_WIDTH = Math.min(380, SCREEN_WIDTH - 32);
const TAB_WIDTH = TAB_BAR_WIDTH / 5;
const BEAD_SIZE = 48; // Yüzen boncuk boyutu

const TABS_CONFIG = [
  { name: 'HomeTab', title: 'Ana Sayfa', icon: Home, color: COLORS.primary },
  { name: 'ProductsTab', title: 'Ürünler', icon: Package, color: COLORS.tertiary },
  { name: 'AddTab', title: 'Ekle', icon: Plus, color: COLORS.primaryContainer },
  { name: 'NotificationsTab', title: 'Bildirimler', icon: Bell, color: COLORS.error },
  { name: 'ProfileTab', title: 'Profil', icon: User, color: COLORS.warning },
];

const Tab = createBottomTabNavigator<MainTabParamList>();

// Tekil Tab Öğesi
interface TabItemProps {
  tab: (typeof TABS_CONFIG)[0];
  isActive: boolean;
  onPress: () => void;
}

const AnimatedTabItem: React.FC<TabItemProps> = ({ tab, isActive, onPress }) => {
  const Icon = tab.icon;
  const animValue = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: isActive ? 1 : 0,
      friction: 6,
      tension: 65,
      useNativeDriver: true,
    }).start();
  }, [isActive, animValue]);

  const iconTranslateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -24],
  });

  const iconScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const activeIconOpacity = animValue.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.2, 1],
  });

  const passiveIconOpacity = animValue.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [1, 0.3, 0],
  });

  const labelOpacity = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const labelTranslateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.tabButton}
    >
      {/* İkon Kapsayıcı (Aktifken boncuğun tam merkezine yükselir) */}
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ translateY: iconTranslateY }, { scale: iconScale }],
          },
        ]}
      >
        {/* Pasif İkon (Gri) */}
        <Animated.View
          style={[
            styles.iconAbsolute,
            {
              opacity: passiveIconOpacity,
            },
          ]}
        >
          <Icon size={22} color={COLORS.secondary} strokeWidth={2.5} />
        </Animated.View>

        {/* Aktif İkon (Beyaz) */}
        <Animated.View
          style={[
            styles.iconAbsolute,
            {
              opacity: activeIconOpacity,
            },
          ]}
        >
          <Icon size={22} color={COLORS.onPrimary} strokeWidth={2.5} />
        </Animated.View>
      </Animated.View>

      {/* Alt Başlık Yazısı (Sadece aktifken yumuşakça görünür) */}
      <Animated.View
        style={[
          styles.labelContainer,
          {
            opacity: labelOpacity,
            transform: [{ translateY: labelTranslateY }],
          },
        ]}
      >
        <Text style={styles.labelText} numberOfLines={1}>
          {tab.title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Özel Yüzen Boncuklu Tab Bar Komponenti (Damlacık / Jelly Esneme Efektli)
const FloatingBeadTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const activeIndex = state.index;
  const activeTabConfig = TABS_CONFIG[activeIndex] || TABS_CONFIG[0];

  const beadX = useRef(
    new Animated.Value(
      activeIndex * TAB_WIDTH + TAB_WIDTH / 2 - BEAD_SIZE / 2
    )
  ).current;

  // Damlacık / Jelly esneme efekti (Stretch)
  const stretchAnim = useRef(new Animated.Value(1)).current;
  const prevIndexRef = useRef(activeIndex);

  useEffect(() => {
    const targetX = activeIndex * TAB_WIDTH + TAB_WIDTH / 2 - BEAD_SIZE / 2;
    Animated.spring(beadX, {
      toValue: targetX,
      friction: 6,
      tension: 65,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, beadX]);

  const handleTabPress = (index: number, routeName: string) => {
    if (index !== activeIndex) {
      // Gidilecek hedefin uzaklığını ölçme
      const distance = Math.abs(index - activeIndex);
      const stretchFactor = 1 + distance * 0.25;

      // Harekete başlarken yatay esneme
      stretchAnim.setValue(stretchFactor);

      // Hedefe yaklaşırken damlacığın toparlanıp yuvarlak formuna dönmesi (Jelly bounce)
      setTimeout(() => {
        Animated.spring(stretchAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }).start();
      }, 180);
    }

    prevIndexRef.current = index;

    const isFocused = state.index === index;
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes[index]?.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const bottomOffset = Platform.OS === 'ios' ? Math.max(insets.bottom, 16) : 16;

  return (
    <View style={[styles.tabBarWrapper, { bottom: bottomOffset }]}>
      <View style={styles.tabBarContainer}>
        {/* Alt Beyaz Kapsayıcı (Pill) */}
        <View style={styles.pillBackground} />

        {/* Yüzen Renkli Halka (Glow Efekti - Arkadaki Yumuşak Işık) */}
        <Animated.View
          style={[
            styles.beadGlow,
            {
              backgroundColor: activeTabConfig.color,
              transform: [
                { translateX: beadX },
                { scaleX: stretchAnim },
                { scale: 1.3 },
              ],
            },
          ]}
        />

        {/* Yüzen Renkli Halka (Ana Boncuk - Damlacık) */}
        <Animated.View
          style={[
            styles.beadCircle,
            {
              backgroundColor: activeTabConfig.color,
              transform: [
                { translateX: beadX },
                { scaleX: stretchAnim },
              ],
            },
          ]}
        />

        {/* Sekmeler (Tıklanabilir İkonlar ve Yazılar) */}
        <View style={styles.tabsRow}>
          {TABS_CONFIG.map((tab, index) => {
            const isActive = state.index === index;
            return (
              <AnimatedTabItem
                key={tab.name}
                tab={tab}
                isActive={isActive}
                onPress={() => handleTabPress(index, tab.name)}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      tabBar={(props) => <FloatingBeadTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="ProductsTab" component={ProductsScreen} />
      <Tab.Screen name="AddTab" component={AddProductScreen} />
      <Tab.Screen name="NotificationsTab" component={NotificationsScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  tabBarContainer: {
    position: 'relative',
    width: TAB_BAR_WIDTH,
    height: 90,
    justifyContent: 'flex-end',
  },
  pillBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHigh,
    // iOS Shadow
    shadowColor: '#121c2a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    // Android Elevation
    elevation: 10,
  },
  beadGlow: {
    position: 'absolute',
    bottom: 36,
    left: 0,
    width: BEAD_SIZE,
    height: BEAD_SIZE,
    borderRadius: BEAD_SIZE / 2,
    opacity: 0.25,
  },
  beadCircle: {
    position: 'absolute',
    bottom: 36,
    left: 0,
    width: BEAD_SIZE,
    height: BEAD_SIZE,
    borderRadius: BEAD_SIZE / 2,
    zIndex: 10,
    // Soft drop shadow
    shadowColor: '#121c2a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  tabsRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    flexDirection: 'row',
    zIndex: 20,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  iconAbsolute: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    bottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.onSurface,
    textAlign: 'center',
  },
});
