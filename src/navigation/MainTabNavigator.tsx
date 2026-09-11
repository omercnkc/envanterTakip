import React, { useEffect, useRef, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
  Easing,
} from 'react-native';

import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { Home, Package, Plus, Bell, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';


import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../constants/colors';
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

const getTabsConfig = (colors: ThemeColors) => [
  { name: 'HomeTab', title: 'Ana Sayfa', icon: Home, color: colors.primary },
  { name: 'ProductsTab', title: 'Ürünler', icon: Package, color: colors.primary },
  { name: 'AddTab', title: 'Ekle', icon: Plus, color: colors.primary },
  { name: 'NotificationsTab', title: 'Bildirimler', icon: Bell, color: colors.primary },
  { name: 'ProfileTab', title: 'Profil', icon: User, color: colors.primary },
];


const Tab = createBottomTabNavigator<MainTabParamList>();

// Tekil Tab Öğesi
interface TabItemProps {
  tab: { name: string; title: string; icon: any; color: string };
  isActive: boolean;
  onPress: () => void;
}

const AnimatedTabItem: React.FC<TabItemProps> = ({ tab, isActive, onPress }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const Icon = tab.icon;
  const animValue = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: isActive ? 1 : 0,
      friction: 7.5,
      tension: 70,
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
          <Icon size={22} color={colors.secondary} strokeWidth={2.5} />
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
          <Icon size={22} color={colors.onPrimary} strokeWidth={2.5} />
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
        <Text style={[styles.labelText, { color: colors.onSurface }]} numberOfLines={1}>
          {tab.title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Özel Yüzen Boncuklu Tab Bar Komponenti (Gerçek Su Damlası & Jöle Titremesi - Liquid Teardrop)
const FloatingBeadTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const tabsConfig = useMemo(() => getTabsConfig(colors), [colors]);
  const activeIndex = state.index;

  const getBeadX = (index: number) => index * TAB_WIDTH + TAB_WIDTH / 2 - BEAD_SIZE / 2;

  // Ana Su Damlası Pozisyonu
  const beadX = useRef(new Animated.Value(getBeadX(activeIndex))).current;

  // Arkasından Gelen Sıvı Kuyruk (Gooey trailing tail)
  const tailX = useRef(new Animated.Value(getBeadX(activeIndex))).current;
  const tailOpacity = useRef(new Animated.Value(0)).current;

  // Uçuş Hali (SVG Sivri Su Damlası) vs Durma Hali Geçişi
  const flyingOpacity = useRef(new Animated.Value(0)).current;
  const restingOpacity = useRef(new Animated.Value(1)).current;

  // Hedefe Varış Anındaki Su / Jöle Titremesi (Wobble Oscillation)
  const wobbleX = useRef(new Animated.Value(1)).current;
  const wobbleY = useRef(new Animated.Value(1)).current;
  const rippleGlow = useRef(new Animated.Value(1)).current;

  // Hareket Yönü: +1 (Sağa doğru), -1 (Sola doğru)
  const [moveDirection, setMoveDirection] = useState<1 | -1>(1);
  const prevIndexRef = useRef(activeIndex);

  useEffect(() => {
    const prevIndex = prevIndexRef.current;
    const isChanging = prevIndex !== activeIndex;
    prevIndexRef.current = activeIndex;

    const targetX = getBeadX(activeIndex);

    if (isChanging) {
      const distance = Math.abs(activeIndex - prevIndex);
      const dir: 1 | -1 = activeIndex >= prevIndex ? 1 : -1;
      setMoveDirection(dir);

      // Mesafeye göre optimize edilmiş akıcı su hızı (200ms - 320ms)
      const travelDuration = Math.min(320, 190 + distance * 35);

      // 1. Su damlası uçuş moduna geç
      flyingOpacity.setValue(1);
      restingOpacity.setValue(0);
      tailOpacity.setValue(0.75);

      // Ana damla ve kuyruk koordineli akışı
      Animated.parallel([
        // A. Ana Damla: Su gibi hızlı fırlayıp hedefe yaklaşırken yumuşar
        Animated.timing(beadX, {
          toValue: targetX,
          duration: travelDuration,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
          useNativeDriver: true,
        }),

        // B. Arkadan Gelen Sıvı Kuyruk: Ana damlanın hemen arkasından su gibi takip eder
        Animated.sequence([
          Animated.timing(tailX, {
            toValue: targetX,
            duration: travelDuration + 35,
            easing: Easing.bezier(0.25, 0.8, 0.45, 1),
            useNativeDriver: true,
          }),
          Animated.timing(tailOpacity, {
            toValue: 0,
            duration: 60,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Hedefe varıldığında uçuş damlasından duran su damlasına yumuşak geçiş
        Animated.parallel([
          Animated.timing(flyingOpacity, { toValue: 0, duration: 80, useNativeDriver: true }),
          Animated.timing(restingOpacity, { toValue: 1, duration: 80, useNativeDriver: true }),
        ]).start();

        // 2. HEDEFE VARIŞ: Su Damlası Jöle Titremesi (Liquid Wobble / Ripple)
        wobbleX.setValue(1);
        wobbleY.setValue(1);
        rippleGlow.setValue(1.4);

        Animated.parallel([
          // Yatay Dalgalanma (Yayılma -> Geri Sekme -> Titreme -> Durulma)
          Animated.sequence([
            Animated.timing(wobbleX, { toValue: 1.28, duration: 70, useNativeDriver: true }),
            Animated.timing(wobbleX, { toValue: 0.85, duration: 80, useNativeDriver: true }),
            Animated.timing(wobbleX, { toValue: 1.12, duration: 70, useNativeDriver: true }),
            Animated.timing(wobbleX, { toValue: 0.96, duration: 60, useNativeDriver: true }),
            Animated.timing(wobbleX, { toValue: 1.0, duration: 50, useNativeDriver: true }),
          ]),
          // Dikey Dalgalanma (Sıkışma -> Yukarı Fırlama -> Titreme -> Durulma)
          Animated.sequence([
            Animated.timing(wobbleY, { toValue: 0.76, duration: 70, useNativeDriver: true }),
            Animated.timing(wobbleY, { toValue: 1.22, duration: 80, useNativeDriver: true }),
            Animated.timing(wobbleY, { toValue: 0.91, duration: 70, useNativeDriver: true }),
            Animated.timing(wobbleY, { toValue: 1.04, duration: 60, useNativeDriver: true }),
            Animated.timing(wobbleY, { toValue: 1.0, duration: 50, useNativeDriver: true }),
          ]),
          // Su Parıltısı Halka Yayılımı
          Animated.sequence([
            Animated.timing(rippleGlow, { toValue: 1.65, duration: 110, useNativeDriver: true }),
            Animated.timing(rippleGlow, { toValue: 1.0, duration: 220, useNativeDriver: true }),
          ]),
        ]).start();
      });
    } else {
      beadX.setValue(targetX);
      tailX.setValue(targetX);
    }
  }, [activeIndex, beadX, tailX, tailOpacity, flyingOpacity, restingOpacity, wobbleX, wobbleY, rippleGlow]);

  const handleTabPress = (index: number, routeName: string) => {
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

  const bottomOffset = Math.max(insets.bottom, 12) + (Platform.OS === 'android' ? 12 : 6);

  return (
    <View style={[styles.tabBarWrapper, { bottom: bottomOffset }]}>
      <View style={styles.tabBarContainer}>
        {/* Alt Kapsayıcı (Pill) */}
        <View
          style={[
            styles.pillBackground,
            {
              backgroundColor: colors.surfaceContainerLowest,
              borderColor: colors.surfaceContainerHigh,
            },
          ]}
        />

        {/* Arkasından Gelen Sıvı Kuyruk Damlası (Trailing Gooey Drop) */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.trailingDrop,
            {
              backgroundColor: colors.primary,
              transform: [
                { translateX: tailX },
                { scale: 0.62 },
              ],
              opacity: tailOpacity,
            },
          ]}
        />

        {/* Yüzen Renkli Halka (Glow Efekti - Arkadaki Yumuşak Işık & Dalgalanma) */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.beadGlow,
            {
              backgroundColor: colors.primary,
              transform: [
                { translateX: beadX },
                { scaleX: wobbleX },
                { scaleY: wobbleY },
                { scale: rippleGlow },
              ],
            },
          ]}
        />

        {/* Ana Su Damlası Gövdesi (Main Liquid Droplet) */}
        <Animated.View
          style={[
            styles.beadContainer,
            {
              transform: [
                { translateX: beadX },
                { scaleX: wobbleX },
                { scaleY: wobbleY },
              ],
            },
          ]}
        >
          {/* A. HAREKET HALİNDEKİ SİVRİ SU DAMLASI (SVG STREAMLINED TEARDROP) */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.flyingDropletWrapper,
              {
                opacity: flyingOpacity,
                left: moveDirection === 1 ? 0 : -16,
              },
            ]}
          >
            <Svg width={64} height={48} viewBox="0 0 64 48">
              {/* Damla Gövdesi */}
              <Path
                d={
                  moveDirection === 1
                    ? "M 24,0 C 38,0 52,11 64,24 C 52,37 38,48 24,48 A 24,24 0 0,1 24,0 Z"
                    : "M 40,0 C 26,0 12,11 0,24 C 12,37 26,48 40,48 A 24,24 0 0,0 40,0 Z"
                }
                fill={colors.primary}
              />
              {/* Su Damlası Üst Işıltısı */}
              <Path
                d={
                  moveDirection === 1
                    ? "M 13,8 C 20,4 28,6 32,10 C 28,8 19,7 14,11 Z"
                    : "M 33,8 C 40,4 48,6 52,10 C 48,8 39,7 34,11 Z"
                }
                fill="rgba(255, 255, 255, 0.45)"
              />
            </Svg>
          </Animated.View>

          {/* B. DURMA HALİNDEKİ SU DAMLASI (RESTING WATER DROPLET WITH SHEEN) */}
          <Animated.View
            style={[
              styles.beadCircle,
              {
                backgroundColor: colors.primary,
                opacity: restingOpacity,
              },
            ]}
          >
            {/* Su Damlası Üst Parlaması (Glossy Water Sheen) */}
            <View style={styles.waterGlossHighlight} />
          </Animated.View>
        </Animated.View>




        {/* Sekmeler (Tıklanabilir İkonlar ve Yazılar) */}
        <View style={styles.tabsRow}>
          {tabsConfig.map((tab, index) => {
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

const getStyles = (colors: ThemeColors) => StyleSheet.create({
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
    height: 84,
    justifyContent: 'flex-end',
  },
  pillBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 66,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 33,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    // iOS Shadow
    shadowColor: '#121c2a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    // Android Elevation
    elevation: 10,
  },
  trailingDrop: {
    position: 'absolute',
    bottom: 38,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    zIndex: 8,
  },
  beadContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    width: BEAD_SIZE,
    height: BEAD_SIZE,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flyingDropletWrapper: {
    position: 'absolute',
    top: 0,
    width: 64,
    height: 48,
    zIndex: 12,
  },
  beadGlow: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    width: BEAD_SIZE,
    height: BEAD_SIZE,
    borderRadius: BEAD_SIZE / 2,
    opacity: 0.25,
  },
  beadCircle: {
    width: BEAD_SIZE,
    height: BEAD_SIZE,
    borderRadius: BEAD_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    // Soft drop shadow
    shadowColor: '#121c2a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 8,
  },
  waterGlossHighlight: {
    position: 'absolute',
    top: 6,
    left: 10,
    width: 14,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    transform: [{ rotate: '-28deg' }],
  },


  tabsRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 66,
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
    bottom: 13,
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
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.onSurface,
    textAlign: 'center',
  },
});
