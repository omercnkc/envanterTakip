import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS } from '../constants';

export type LockAnimState = 'idle' | 'shake' | 'bounce' | 'unlock';
export type LockStatusType = 'idle' | 'success' | 'error' | 'warning';

interface AnimatedLockProps {
  animState?: LockAnimState;
  statusType?: LockStatusType;
  size?: number;
}

export const AnimatedLock: React.FC<AnimatedLockProps> = ({
  animState = 'idle',
  statusType = 'idle',
}) => {
  // Animasyon Değerleri
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const shackleY = useRef(new Animated.Value(0)).current;
  const shackleRotate = useRef(new Animated.Value(0)).current;

  // Renk Belirleme
  let lockColor: string = COLORS.primary;
  if (statusType === 'success' || animState === 'unlock') {
    lockColor = COLORS.tertiary;
  } else if (statusType === 'error' || animState === 'shake') {
    lockColor = COLORS.error;
  } else if (statusType === 'warning' || animState === 'bounce') {
    lockColor = COLORS.warning;
  }

  useEffect(() => {
    if (animState === 'shake') {
      shakeAnim.setValue(0);
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: -8,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 8,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -6,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 6,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -3,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 60,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (animState === 'bounce') {
      bounceAnim.setValue(0);
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 5,
          duration: 120,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (animState === 'unlock') {
      Animated.parallel([
        Animated.spring(shackleY, {
          toValue: -14,
          friction: 5,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.spring(shackleRotate, {
          toValue: 1, // maps to -22deg
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Idle durumuna geri dön
      Animated.parallel([
        Animated.timing(shackleY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(shackleRotate, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animState, shakeAnim, bounceAnim, shackleY, shackleRotate]);

  const rotateInterpolate = shackleRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-22deg'],
  });

  return (
    <Animated.View
      style={[
        styles.lockWrapper,
        {
          transform: [
            { translateX: shakeAnim },
            { translateY: bounceAnim },
          ],
        },
      ]}
    >
      <View style={styles.lockContainer}>
        {/* Kilit Halkası (Çengel) */}
        <Animated.View
          style={[
            styles.shackleContainer,
            {
              transform: [
                { translateY: shackleY },
                { rotate: rotateInterpolate },
              ],
            },
          ]}
        >
          {/* U şeklinde Kilit Halkası */}
          <View
            style={[
              styles.shackleArch,
              { borderColor: lockColor },
            ]}
          />
          {/* Kilit Gövdesine Giren Sol Bacak Uzantısı (Açılınca da gövdede kalsın diye) */}
          <View
            style={[
              styles.leftLegExtension,
              { backgroundColor: lockColor },
            ]}
          />
        </Animated.View>

        {/* Kilit Gövdesi (Ön Katman - zIndex: 20) */}
        <View
          style={[
            styles.lockBody,
            { backgroundColor: lockColor },
          ]}
        >
          {/* Anahtar Deliği */}
          <View style={styles.keyholeCircle} />
          <View style={styles.keyholeSlot} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  lockWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    marginBottom: 12,
  },
  lockContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  shackleContainer: {
    position: 'absolute',
    width: 30,
    height: 34,
    top: -24,
    zIndex: 10,
    // Dönme merkezi sol alt bacak
    transformOrigin: '15% 100%',
  },
  shackleArch: {
    width: 30,
    height: 32,
    borderWidth: 5,
    borderBottomWidth: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  leftLegExtension: {
    position: 'absolute',
    left: 0,
    bottom: -8,
    width: 5,
    height: 14,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  lockBody: {
    width: 58,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 20,
    shadowColor: '#121c2a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  keyholeCircle: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#ffffff',
    zIndex: 30,
  },
  keyholeSlot: {
    width: 5,
    height: 7,
    backgroundColor: '#ffffff',
    marginTop: -2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    zIndex: 30,
  },
});
