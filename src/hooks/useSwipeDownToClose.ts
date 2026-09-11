import { useRef, useEffect } from 'react';
import { PanResponder, Animated } from 'react-native';

interface UseSwipeDownToCloseOptions {
  onClose: () => void;
  visible?: boolean;
  dismissThreshold?: number; // Varsayılan 75px
}

/**
 * Yarım açılan modallarda (Bottom Sheet) aşağı çekilerek kapatma kancası.
 * - Açılırken aşağıdan yukarı akıcı yaylanarak açılır.
 * - Çekildiğinde parmağı birebir takip eder.
 * - Kapatıldığında tek ve pürüzsüz bir kayma ile kapanır (çift kapanma animasyonu yapmaz).
 */
export const useSwipeDownToClose = ({
  onClose,
  visible = true,
  dismissThreshold = 75,
}: UseSwipeDownToCloseOptions) => {
  const translateY = useRef(new Animated.Value(450)).current;
  const isClosing = useRef(false);

  // Modal açıldığında aşağıdan yukarı akıcı yaylanarak gelsin (Slide up)
  useEffect(() => {
    if (visible) {
      isClosing.current = false;
      translateY.setValue(450);
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  // Buton veya backdrop tıklandığında da aynı akıcı aşağı kayma ile kapatma
  const handleClose = () => {
    if (isClosing.current) return;
    isClosing.current = true;
    Animated.timing(translateY, {
      toValue: 650,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (isClosing.current) return false;
        // Sadece aşağı doğru çekişlerde devreye gir
        return gestureState.dy > 4;
      },
      onPanResponderMove: (_, gestureState) => {
        if (isClosing.current) return;
        // Aşağı doğru çekerken parmağı takip et
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isClosing.current) return;
        // Eşik aşıldıysa veya hızlı savrulduysa tek seferde aşağı kaydır ve kapat
        if (gestureState.dy > dismissThreshold || (gestureState.dy > 20 && gestureState.vy > 0.4)) {
          isClosing.current = true;
          Animated.timing(translateY, {
            toValue: 650,
            duration: 180,
            useNativeDriver: true,
          }).start(() => {
            onClose();
          });
        } else {
          // Yeterince çekilmediyse yerine geri yaylan
          Animated.spring(translateY, {
            toValue: 0,
            friction: 7,
            tension: 70,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return {
    panHandlers: panResponder.panHandlers,
    translateY,
    handleClose,
  };
};
