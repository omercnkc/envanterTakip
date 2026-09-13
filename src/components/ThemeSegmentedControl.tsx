import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  LayoutChangeEvent,
  Platform,
} from 'react-native';
import { Sun, Moon, Smartphone } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { ThemeMode } from '../constants/colors';
import { RADIUS } from '../constants';

interface ThemeOption {
  key: ThemeMode;
  label: string;
  icon: typeof Sun;
}

const THEME_OPTIONS: ThemeOption[] = [
  { key: 'light', label: 'Açık', icon: Sun },
  { key: 'dark', label: 'Koyu', icon: Moon },
  { key: 'system', label: 'Sistem', icon: Smartphone },
];

export const ThemeSegmentedControl: React.FC = () => {
  const { theme, setTheme, colors } = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);

  const getIndex = (t: ThemeMode) => {
    switch (t) {
      case 'light':
        return 0;
      case 'dark':
        return 1;
      case 'system':
        return 2;
      default:
        return 0;
    }
  };

  const activeIndex = getIndex(theme);
  const slideAnim = useRef(new Animated.Value(activeIndex)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: activeIndex,
      damping: 20,
      stiffness: 220,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, slideAnim]);

  const onLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  const pillWidth = containerWidth > 8 ? (containerWidth - 8) / 3 : 0;

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, pillWidth, pillWidth * 2],
  });

  return (
    <View
      style={[
        styles.segmentedControl,
        {
          backgroundColor: colors.surfaceContainer,
        },
      ]}
      onLayout={onLayout}
    >
      {/* Kayan Seçim Pili (Sliding Selection Pill) */}
      {pillWidth > 0 && (
        <Animated.View
          style={[
            styles.selectionPill,
            {
              width: pillWidth,
              backgroundColor: colors.primary,
              transform: [{ translateX }],
            },
          ]}
        />
      )}

      {/* Seçenek Butonları */}
      {THEME_OPTIONS.map((opt) => {
        const isActive = theme === opt.key;
        const IconComponent = opt.icon;

        return (
          <TouchableOpacity
            key={opt.key}
            style={styles.segmentButton}
            onPress={() => setTheme(opt.key)}
            activeOpacity={0.75}
          >
            <IconComponent
              size={16}
              color={isActive ? colors.onPrimary : colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.segmentText,
                {
                  color: isActive ? colors.onPrimary : colors.onSurfaceVariant,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  segmentedControl: {
    position: 'relative',
    flexDirection: 'row',
    borderRadius: RADIUS.lg,
    padding: 4,
    width: '100%',
  },
  selectionPill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: RADIUS.md - 2,
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
    zIndex: 2,
  },
  segmentText: {
    fontSize: 13,
  },
});
