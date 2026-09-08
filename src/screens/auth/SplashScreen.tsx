import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package } from 'lucide-react-native';
import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { styles } from './SplashScreen.styles';

export interface SplashScreenProps {
  onFinish?: () => void;
}

const STATUS_MESSAGES = [
  'Güvenli bağlantı kuruluyor...',
  'Varlık veritabanı senkronize ediliyor...',
  'Garanti bildirimleri kontrol ediliyor...',
  'Çalışma alanı hazırlanıyor...',
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { loading } = useAuth();
  const [statusIndex, setStatusIndex] = useState(0);

  // Animasyon Değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 3 Nokta Yükleme Animasyonu
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Giriş Animasyonu
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse Animasyonu
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // Zıplayan Noktalar Animasyonu
    const animateDots = () => {
      Animated.loop(
        Animated.sequence([
          Animated.stagger(150, [
            Animated.sequence([
              Animated.timing(dot1, { toValue: -6, duration: 250, useNativeDriver: true }),
              Animated.timing(dot1, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]),
            Animated.sequence([
              Animated.timing(dot2, { toValue: -6, duration: 250, useNativeDriver: true }),
              Animated.timing(dot2, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]),
            Animated.sequence([
              Animated.timing(dot3, { toValue: -6, duration: 250, useNativeDriver: true }),
              Animated.timing(dot3, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]),
          ]),
          Animated.delay(400),
        ])
      ).start();
    };
    animateDots();

    // Durum metni geçişi
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 1400);

    return () => {
      pulseLoop.stop();
      clearInterval(interval);
    };
  }, [fadeAnim, scaleAnim, pulseAnim, dot1, dot2, dot3]);

  // Oturum durumu kontrolü tamamlandığında en az 2000ms gösterip onFinish çağır
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const startTime = Date.now();
    const MIN_SPLASH_TIME = 2000;

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

      {/* Ana Logo ve Başlık */}
      <Animated.View
        style={[
          styles.contentCenter,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoWrapper}>
          <Animated.View
            style={[
              styles.logoGlow,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <View style={styles.logoContainer}>
            <Package size={48} color={COLORS.primary} strokeWidth={2.2} />
          </View>
        </View>

        <Text style={styles.title}>Safe Envanter</Text>
        <Text style={styles.subtitle}>GARANTİ & VARLIK YÖNETİMİ</Text>
      </Animated.View>

      {/* Alt Yükleniyor Durumu */}
      <View style={styles.bottomSection}>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
        </View>
        <Text style={styles.statusText}>{STATUS_MESSAGES[statusIndex]}</Text>
      </View>
    </SafeAreaView>
  );
};
