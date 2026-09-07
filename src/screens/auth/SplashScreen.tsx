import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ShieldCheck } from 'lucide-react-native';
import { AuthStackParamList } from '../../types';
import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { styles } from './SplashScreen.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

const STATUS_MESSAGES = [
  'Güvenli bağlantı kuruluyor...',
  'Varlık veritabanı senkronize ediliyor...',
  'Garanti bildirimleri kontrol ediliyor...',
  'Çalışma alanı hazırlanıyor...',
];

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { user, loading } = useAuth();
  const [statusIndex, setStatusIndex] = useState(0);

  // Animasyon Değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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
          toValue: 1.08,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // Durum metni geçişi
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 1200);

    return () => {
      pulseLoop.stop();
      clearInterval(interval);
    };
  }, [fadeAnim, scaleAnim, pulseAnim]);

  // Oturum durumuna göre yönlendirme
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (!user) {
          navigation.replace('Login');
        }
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [loading, user, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundDecorator} />
      <View style={styles.backgroundDecoratorBottom} />

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
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <ShieldCheck size={48} color={COLORS.primary} strokeWidth={2} />
        </Animated.View>

        <Text style={styles.title}>Ev Envanter & Garanti</Text>
        <Text style={styles.subtitle}>GÜVENLİ TAKİP MERKEZİ</Text>
      </Animated.View>

      {/* Alt Yükleniyor Durumu */}
      <View style={styles.bottomSection}>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, { opacity: 1 }]} />
          <View style={[styles.dot, { opacity: 0.6 }]} />
          <View style={[styles.dot, { opacity: 0.3 }]} />
        </View>
        <Text style={styles.statusText}>{STATUS_MESSAGES[statusIndex]}</Text>
      </View>
    </SafeAreaView>
  );
};
