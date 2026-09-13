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

const getTabsConfig = (colors: ThemeColors) => [
  { id: 'home', name: 'HomeTab', title: 'Ana Sayfa', icon: Home, color: colors.primary }, // #4648d4 (Ana marka moru)
  { id: 'products', name: 'ProductsTab', title: 'Ürünler', icon: Package, color: colors.tertiary }, // #006c49 (Başarı & garanti yeşili)
  { id: 'add', name: 'AddTab', title: 'Ekle', icon: Plus, color: colors.primaryContainer }, // #6063ee (Açık / vurgulu mor)
  { id: 'notifications', name: 'NotificationsTab', title: 'Bildirimler', icon: Bell, color: colors.error }, // #ba1a1a (Hata ve dikkat kırmızısı)
  { id: 'profile', name: 'ProfileTab', title: 'Profil', icon: User, color: colors.warning }, // #d97706 (Uyarı turuncusu)
];

const Tab = createBottomTabNavigator<MainTabParamList>();

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Uçan çizgi ile hedefteki çemberi TEK BİR parça olarak çizen özel yol bileşeni
interface ShootingLineProps {
  x1: number;
  x2: number;
  color: string;
}

const ShootingLine: React.FC<ShootingLineProps> = ({ x1, x2, color }) => {
  const isRight = x2 > x1;
  const lineLength = Math.abs(x2 - x1);
  const circleCircumference = 116.24; // 2 * PI * Yarıçap (18.5)

  // Çizgi desenini başlangıçta yolun tamamen dışında başlatıyoruz
  const offset = useRef(new Animated.Value(circleCircumference)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // M = X1 noktasından ve tam hedefin tabanı olan 43.5px yüksekliğinden başla
  // L = Hedef X2 noktasına düz bir çizgi çek
  // A = Çember çiz. İvme yönüne göre sağdan veya soldan kıvrılarak yukarı çıkar.
  const pathData = isRight
    ? `M ${x1} 43.5 L ${x2} 43.5 A 18.5 18.5 0 1 0 ${x2 - 0.01} 43.5`
    : `M ${x1} 43.5 L ${x2} 43.5 A 18.5 18.5 0 1 1 ${x2 + 0.01} 43.5`;

  useEffect(() => {
    // 1. Çizim animasyonu (400ms cubic-bezier(0.4, 0, 0.2, 1))
    Animated.timing(offset, {
      toValue: -lineLength,
      duration: 400,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();

    // 2. Çember tamamen çizildiği an (400ms) çizgiyi yavaşça sil (200ms)
    const fadeTimer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }, 400);

    return () => clearTimeout(fadeTimer);
  }, [lineLength, offset, opacity]);

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity }]}>
      <Svg width={TAB_BAR_WIDTH} height={74} viewBox={`0 0 ${TAB_BAR_WIDTH} 74`}>
        <AnimatedPath
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={[circleCircumference, 9999]}
          strokeDashoffset={offset}
        />
      </Svg>
    </Animated.View>
  );
};

// Tekil Tab Öğesi
interface TabItemProps {
  tab: { id: string; name: string; title: string; icon: any; color: string };
  isActive: boolean;
  onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ tab, isActive, onPress }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const Icon = tab.icon;

  // Boncuk ve İkon Animasyon Değerleri
  const beadAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const iconPosAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const iconColorAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    if (isActive) {
      // 1. İKON ANINDA MERKEZE YÜKSELİR (Hiç gecikme olmaksızın akıcı yaylanma)
      Animated.spring(iconPosAnim, {
        toValue: 1,
        friction: 6.5,
        tension: 110,
        useNativeDriver: true,
      }).start();

      // 2. Işın hedefe varırken renk dolumu ve beyaz crossfade senkronize patlar (140ms)
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.spring(beadAnim, {
            toValue: 1,
            friction: 6,
            tension: 130,
            useNativeDriver: true,
          }),
          Animated.timing(iconColorAnim, {
            toValue: 1,
            duration: 160,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }),
        ]).start();
      }, 140);

      return () => clearTimeout(timer);
    } else {
      // Pasife geçerken anında yumuşakça yerine iner ve söner
      Animated.parallel([
        Animated.timing(beadAnim, {
          toValue: 0,
          duration: 180,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.spring(iconPosAnim, {
          toValue: 0,
          friction: 7,
          tension: 90,
          useNativeDriver: true,
        }),
        Animated.timing(iconColorAnim, {
          toValue: 0,
          duration: 160,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive, beadAnim, iconPosAnim, iconColorAnim]);

  // Glow Bead İnterpolasyonu
  const glowScale = beadAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1.3],
  });
  const glowOpacity = beadAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.25],
  });

  // Solid Bead İnterpolasyonu
  const solidScale = beadAnim;
  const solidOpacity = beadAnim;

  // İkon Yükselme ve Büyüme (Anında merkeze oturur)
  const iconTranslateY = iconPosAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -22],
  });
  const iconScale = iconPosAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  // İkon Renk Geçişi (Renk dolumuyla uyumlu)
  const activeIconOpacity = iconColorAnim;
  const passiveIconOpacity = iconColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  // Başlık Yazısı İnterpolasyonu
  const labelOpacity = iconPosAnim;
  const labelTranslateY = iconPosAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={styles.tabButton}
    >
      {/* Boncuk Kapsayıcı (bead-wrapper) */}
      <View style={styles.beadWrapper} pointerEvents="none">
        {/* Glow Bead */}
        <Animated.View
          style={[
            styles.glowBead,
            {
              backgroundColor: tab.color,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />
        {/* Solid Bead */}
        <Animated.View
          style={[
            styles.solidBead,
            {
              backgroundColor: tab.color,
              opacity: solidOpacity,
              transform: [{ scale: solidScale }],
            },
          ]}
        />
      </View>

      {/* İkon Kapsayıcı */}
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ translateY: iconTranslateY }, { scale: iconScale }],
          },
        ]}
      >
        {/* Pasif İkon (Gri) */}
        <Animated.View style={[styles.iconAbsolute, { opacity: passiveIconOpacity }]}>
          <Icon size={21} color={colors.secondary} strokeWidth={2.4} />
        </Animated.View>

        {/* Aktif İkon (Beyaz) */}
        <Animated.View style={[styles.iconAbsolute, { opacity: activeIconOpacity }]}>
          <Icon size={21} color={colors.onPrimary} strokeWidth={2.4} />
        </Animated.View>
      </Animated.View>

      {/* Alt Başlık Yazısı */}
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

// Özel Tab Bar Komponenti
const FloatingBeadTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const tabsConfig = useMemo(() => getTabsConfig(colors), [colors]);
  const activeIndex = state.index;

  // Çizgi kuyruğu (birden fazla hızlı tıklamayı destekleyen dizi)
  const [lines, setLines] = useState<
    Array<{ id: number; x1: number; x2: number; color: string }>
  >([]);

  const handleTabClick = (index: number, routeName: string) => {
    if (index === activeIndex) return;

    // Her sekmenin tam merkez noktası (X ekseni)
    const startX = activeIndex * TAB_WIDTH + TAB_WIDTH / 2;
    const endX = index * TAB_WIDTH + TAB_WIDTH / 2;
    const newId = Date.now();

    setLines((prev) => [
      ...prev,
      { id: newId, x1: startX, x2: endX, color: tabsConfig[index].color },
    ]);

    // Çizginin yolculuğunu tamamlaması, çemberi sarması ve silinmesi için süreyi uzattık (700ms)
    setTimeout(() => {
      setLines((prev) => prev.filter((l) => l.id !== newId));
    }, 700);

    navigation.navigate(routeName);
  };

  const bottomOffset =
    Math.max(insets.bottom, 6) + (Platform.OS === 'android' ? 6 : 2);

  return (
    <View style={[styles.tabBarWrapper, { bottom: bottomOffset }]}>
      <View style={styles.tabBarContainer}>
        {/* Beyaz Kapsayıcı Zemin */}
        <View style={styles.pillBackground} />

        {/* Sürekli Çizgi Overlay'i: Eski ve yeni sekme arasındaki uçan çizgiyi ve çemberi çizer */}
        <View style={styles.svgOverlay} pointerEvents="none">
          {lines.map((line) => (
            <ShootingLine
              key={line.id}
              x1={line.x1}
              x2={line.x2}
              color={line.color}
            />
          ))}
        </View>

        {/* Tıklanabilir Sekme Alanları */}
        <View style={styles.tabsRow}>
          {tabsConfig.map((tab, index) => (
            <TabItem
              key={tab.id}
              tab={tab}
              isActive={activeIndex === index}
              onPress={() => handleTabClick(index, tab.name)}
            />
          ))}
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

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
      height: 74,
      justifyContent: 'flex-end',
    },
    pillBackground: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 58,
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: 29,
      borderWidth: 1,
      borderColor: colors.surfaceContainerHigh,
      // iOS Shadow
      shadowColor: '#121c2a',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.07,
      shadowRadius: 18,
      // Android Elevation
      elevation: 6,
    },
    svgOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: TAB_BAR_WIDTH,
      height: 74,
      zIndex: 15,
    },
    tabsRow: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 58,
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
    beadWrapper: {
      position: 'absolute',
      bottom: 29,
      left: '50%',
      marginLeft: -20,
      width: 40,
      height: 40,
      zIndex: 10,
    },
    glowBead: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: 20,
    },
    solidBead: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: 20,
      shadowColor: '#121c2a',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    iconContainer: {
      position: 'absolute',
      bottom: 11,
      left: '50%',
      marginLeft: -18,
      width: 36,
      height: 36,
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
      bottom: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    labelText: {
      fontSize: 10,
      fontWeight: '700',
      textAlign: 'center',
    },
  });
