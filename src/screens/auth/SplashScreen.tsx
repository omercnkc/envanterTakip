import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useThemeColors } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { TechOrbitLoader } from '../../components/TechOrbitLoader';
import { getStyles } from './SplashScreen.styles';

export interface SplashScreenProps {
  onFinish?: () => void;
}

const STATUS_MESSAGES_TR = [
  'Güvenli bağlantı kuruluyor...',
  'Varlık veritabanı senkronize ediliyor...',
  'Garanti bildirimleri kontrol ediliyor...',
  'Çalışma alanı hazırlanıyor...',
];

const STATUS_MESSAGES_EN = [
  'Establishing secure connection...',
  'Synchronizing asset database...',
  'Checking warranty notifications...',
  'Preparing workspace...',
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { loading } = useAuth();
  const { language } = useTranslation();
  const colors = useThemeColors();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [statusIndex, setStatusIndex] = useState(0);
  const messages = language === 'tr' ? STATUS_MESSAGES_TR : STATUS_MESSAGES_EN;

  // Giriş Animasyonu
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  // 3 Nokta Yükleme Animasyonu
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Giriş Açılışı
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Zıplayan Noktalar Animasyonu
    const animateDots = () => {
      Animated.loop(
        Animated.sequence([
          Animated.stagger(140, [
            Animated.sequence([
              Animated.timing(dot1, { toValue: -6, duration: 240, useNativeDriver: true }),
              Animated.timing(dot1, { toValue: 0, duration: 240, useNativeDriver: true }),
            ]),
            Animated.sequence([
              Animated.timing(dot2, { toValue: -6, duration: 240, useNativeDriver: true }),
              Animated.timing(dot2, { toValue: 0, duration: 240, useNativeDriver: true }),
            ]),
            Animated.sequence([
              Animated.timing(dot3, { toValue: -6, duration: 240, useNativeDriver: true }),
              Animated.timing(dot3, { toValue: 0, duration: 240, useNativeDriver: true }),
            ]),
          ]),
          Animated.delay(350),
        ])
      ).start();
    };
    animateDots();

    // Durum metni geçişi
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % messages.length);
    }, 1400);

    return () => {
      clearInterval(interval);
    };
  }, [fadeAnim, scaleAnim, dot1, dot2, dot3, messages.length]);

  // Oturum durumu kontrolü tamamlandığında en az 2800ms gösterip onFinish çağır
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const startTime = Date.now();
    const MIN_SPLASH_TIME = 2800; // Kullanıcının animasyonu doya doya görmesi için

    if (!loading) {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_SPLASH_TIME - elapsed);
      timer = setTimeout(() => {
        onFinish?.();
      }, remaining);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, onFinish]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Arka plan yumuşak ışık efektleri */}
      <View style={styles.bgBlobTop} />
      <View style={styles.bgBlobBottom} />

      {/* Ana Animasyonlu Cihaz Yörüngesi */}
      <Animated.View
        style={[
          styles.contentCenter,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TechOrbitLoader
          fullScreen={false}
          message={language === 'tr' ? 'Güvenli Envanter' : 'Safe Inventory'}
          subMessage={language === 'tr' ? 'GARANTİ & VARLIK YÖNETİMİ' : 'WARRANTY & ASSET MANAGEMENT'}
        />
      </Animated.View>

      {/* Alt Yükleniyor Durumu */}
      <View style={styles.bottomSection}>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
        </View>
        <Text style={styles.statusText}>{messages[statusIndex]}</Text>
      </View>
    </SafeAreaView>
  );
};
