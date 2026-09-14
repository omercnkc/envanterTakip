import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react-native';
import { useAlert } from '../context/AlertContext';
import { useTheme } from '../context/ThemeContext';
import { styles } from './AppToast.styles';

export const AppToast: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { toast, hideToast } = useAlert();
  const { colors, isDark } = useTheme();

  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      hideToast();
    });
  };

  // Yukarı doğru kaydırarak kapatma (swipe up to dismiss)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -15) {
          dismiss();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (toast) {
      // Önceki zamanlayıcıyı temizle
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Animasyonla aşağı indir
      translateY.setValue(-120);
      opacity.setValue(0);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          damping: 18,
          stiffness: 220,
          mass: 0.8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();

      // Belirtilen süre sonra kapat
      const duration = toast.duration || 3500;
      timerRef.current = setTimeout(() => {
        dismiss();
      }, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [toast]);

  if (!toast) return null;

  // Toast tipine göre renk ve ikon seçimi
  const getVisuals = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle2 size={20} color={colors.tertiary} strokeWidth={2.5} />,
          accentColor: colors.tertiary,
          iconBg: isDark ? 'rgba(52, 211, 153, 0.15)' : '#ecfdf5',
          borderHighlight: colors.tertiary,
          defaultTitle: 'Başarılı',
        };
      case 'error':
        return {
          icon: <AlertCircle size={20} color={colors.error} strokeWidth={2.5} />,
          accentColor: colors.error,
          iconBg: isDark ? 'rgba(248, 113, 113, 0.15)' : '#fef2f2',
          borderHighlight: colors.error,
          defaultTitle: 'Hata',
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={20} color={colors.warning} strokeWidth={2.5} />,
          accentColor: colors.warning,
          iconBg: isDark ? 'rgba(251, 191, 36, 0.15)' : '#fef3c7',
          borderHighlight: colors.warning,
          defaultTitle: 'Dikkat',
        };
      case 'info':
      default:
        return {
          icon: <Info size={20} color={colors.primary} strokeWidth={2.5} />,
          accentColor: colors.primary,
          iconBg: isDark ? 'rgba(114, 117, 255, 0.15)' : '#e1e0ff',
          borderHighlight: colors.primary,
          defaultTitle: 'Bilgi',
        };
    }
  };

  const visuals = getVisuals();
  const topPosition = Math.max(insets.top, 16) + 8;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          top: topPosition,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View
        style={[
          styles.toastCard,
          {
            backgroundColor: isDark ? colors.surfaceContainerHigh : colors.surfaceContainerLowest,
            borderColor: isDark ? colors.outlineVariant : colors.borderLight,
          },
        ]}
      >
        <View style={[styles.iconBox, { backgroundColor: visuals.iconBg }]}>
          {visuals.icon}
        </View>

        <View style={styles.contentBox}>
          <Text
            style={[
              styles.title,
              { color: visuals.accentColor },
            ]}
            numberOfLines={1}
          >
            {toast.title || visuals.defaultTitle}
          </Text>
          <Text
            style={[
              styles.message,
              { color: colors.onSurface },
            ]}
            numberOfLines={2}
          >
            {toast.message}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={dismiss}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <X size={16} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
