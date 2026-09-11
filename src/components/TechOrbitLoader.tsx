import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import {
  Smartphone,
  Tv,
  WashingMachine,
  Laptop,
  Speaker,
  Camera,
  Monitor,
} from 'lucide-react-native';
import { useThemeColors } from '../context/ThemeContext';
import { createStyles } from './TechOrbitLoader.styles';

export interface TechOrbitLoaderProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

const ICONS = [
  { id: 'phone', Icon: Smartphone },
  { id: 'tv', Icon: Tv },
  { id: 'washing', Icon: WashingMachine },
  { id: 'laptop', Icon: Laptop },
  { id: 'speaker', Icon: Speaker },
  { id: 'camera', Icon: Camera },
  { id: 'pc', Icon: Monitor },
];

const ORBIT_RADIUS = 100;
const CYCLE_INTERVAL = 1800;

export const TechOrbitLoader: React.FC<TechOrbitLoaderProps> = ({
  message = 'Garanti Takip Yükleniyor...',
  subMessage,
  fullScreen = true,
}) => {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [activeCenterIndex, setActiveCenterIndex] = useState(0);

  // Yavaşça dönen container animasyonu (20 sn döngü)
  const spinValue = useRef(new Animated.Value(0)).current;

  // Alt metin nabız (pulse) animasyonu
  const pulseValue = useRef(new Animated.Value(0)).current;

  // Her bir baloncuk için konum ve ölçek animasyon değerleri
  const bubbleAnims = useRef(
    ICONS.map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      scale: new Animated.Value(1),
      centerProgress: new Animated.Value(0),
    }))
  ).current;

  // 1. Container dönüş ve metin nabız döngüleri
  useEffect(() => {
    // 360 derece kesintisiz yavaş dönüş (20 saniye)
    const spinLoop = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Metin yanıp sönme (pulse)
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    spinLoop.start();
    pulseLoop.start();

    return () => {
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, [spinValue, pulseValue]);

  // 2. Baloncukların yörünge ve merkeze geçiş animasyonları
  useEffect(() => {
    const orbitingIcons = ICONS.map((_, i) => i).filter(
      (idx) => idx !== activeCenterIndex
    );
    const numOrbiting = orbitingIcons.length;

    const parallelAnimations: Animated.CompositeAnimation[] = [];

    // Yörüngedeki baloncukları hesapla ve yay
    orbitingIcons.forEach((iconIndex, orbitPos) => {
      const angle = (orbitPos / numOrbiting) * (2 * Math.PI);
      const targetX = Math.cos(angle) * ORBIT_RADIUS;
      const targetY = Math.sin(angle) * ORBIT_RADIUS;

      parallelAnimations.push(
        Animated.spring(bubbleAnims[iconIndex].x, {
          toValue: targetX,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(bubbleAnims[iconIndex].y, {
          toValue: targetY,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(bubbleAnims[iconIndex].scale, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleAnims[iconIndex].centerProgress, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        })
      );
    });

    // Merkezdeki baloncuk (0, 0) noktasına gider, 1.55x büyür
    if (activeCenterIndex !== -1 && bubbleAnims[activeCenterIndex]) {
      parallelAnimations.push(
        Animated.spring(bubbleAnims[activeCenterIndex].x, {
          toValue: 0,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(bubbleAnims[activeCenterIndex].y, {
          toValue: 0,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(bubbleAnims[activeCenterIndex].scale, {
          toValue: 1.55,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleAnims[activeCenterIndex].centerProgress, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(parallelAnimations).start();
  }, [activeCenterIndex, bubbleAnims]);

  // 3. Her döngüde bir sonraki simgeyi merkeze al
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCenterIndex((prev) => (prev + 1) % ICONS.length);
    }, CYCLE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  // Dönüş interpolasyonları
  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // İkonların ters dönerek daima dik (düzgün) durmasını sağla (reverse spin)
  const counterSpinInterpolate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  // Metin animasyon interpolasyonları
  const textOpacity = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const textScale = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1.02],
  });

  return (
    <View style={fullScreen ? styles.container : styles.inlineContainer}>
      {/* 280x280 Animasyon Sahnesi */}
      <View style={styles.loaderStage}>
        {/* Yavaş dönen ana konteyner */}
        <Animated.View
          style={[
            styles.orbitContainer,
            {
              transform: [{ rotate: spinInterpolate }],
            },
          ]}
        >
          {ICONS.map((item, index) => {
            const { Icon } = item;
            const anim = bubbleAnims[index];

            return (
              <Animated.View
                key={item.id}
                style={[
                  styles.bubbleWrapper,
                  {
                    zIndex: activeCenterIndex === index ? 30 : 5,
                    transform: [
                      { translateX: anim.x },
                      { translateY: anim.y },
                      { scale: anim.scale },
                    ],
                  },
                ]}
              >
                {/* 1. Yörüngedeki Normal Baloncuk (Temaya göre hafif yüzey rengi) */}
                <Animated.View
                  style={[
                    styles.bubble,
                    {
                      backgroundColor: colors.surfaceContainerLowest,
                      borderColor: colors.outlineVariant,
                    },
                  ]}
                >
                  {/* İkonun dik durması için ters dönüş */}
                  <Animated.View
                    style={{
                      transform: [{ rotate: counterSpinInterpolate }],
                    }}
                  >
                    <Icon size={22} color={colors.onSurfaceVariant} strokeWidth={2} />
                  </Animated.View>
                </Animated.View>

                {/* 2. Merkeze Geldiğinde Parıldayan Vurgu Katmanı (Cross-fade) */}
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.bubble,
                    styles.bubbleCenterGlow,
                    {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                      opacity: anim.centerProgress,
                    },
                  ]}
                >
                  <Animated.View
                    style={{
                      transform: [{ rotate: counterSpinInterpolate }],
                    }}
                  >
                    <Icon size={22} color="#ffffff" strokeWidth={2.4} />
                  </Animated.View>
                </Animated.View>
              </Animated.View>
            );
          })}
        </Animated.View>
      </View>

      {/* Dışarıda sabit duran nabızlı yükleme metni */}
      <View style={styles.textContainer}>
        <Animated.Text
          style={[
            styles.loadingText,
            {
              opacity: textOpacity,
              transform: [{ scale: textScale }],
            },
          ]}
        >
          {message}
        </Animated.Text>
        {subMessage ? <Text style={styles.subText}>{subMessage}</Text> : null}
      </View>
    </View>
  );
};
