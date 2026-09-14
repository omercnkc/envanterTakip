import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Info,
  Trash2,
} from 'lucide-react-native';
import { useAlert, AlertButton } from '../context/AlertContext';
import { useTheme } from '../context/ThemeContext';
import { styles } from './AppAlertModal.styles';

export const AppAlertModal: React.FC = () => {
  const { alert, hideAlert } = useAlert();
  const { colors, isDark } = useTheme();

  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (alert) {
      scaleAnim.setValue(0.92);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 20,
          stiffness: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [alert]);

  if (!alert) return null;

  const type = alert.type || (alert.destructive ? 'danger' : 'info');

  const getVisuals = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <Trash2 size={30} color={colors.error} strokeWidth={2.2} />,
          iconBg: isDark ? 'rgba(248, 113, 113, 0.15)' : '#fee2e2',
          borderColor: colors.error,
          confirmBtnBg: colors.error,
          confirmBtnText: colors.onError,
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={30} color={colors.warning} strokeWidth={2.2} />,
          iconBg: isDark ? 'rgba(251, 191, 36, 0.15)' : '#fef3c7',
          borderColor: colors.warning,
          confirmBtnBg: colors.warning,
          confirmBtnText: '#ffffff',
        };
      case 'success':
        return {
          icon: <CheckCircle2 size={30} color={colors.tertiary} strokeWidth={2.2} />,
          iconBg: isDark ? 'rgba(52, 211, 153, 0.15)' : '#dcfce7',
          borderColor: colors.tertiary,
          confirmBtnBg: colors.tertiary,
          confirmBtnText: colors.onTertiary,
        };
      case 'info':
      default:
        return {
          icon: <Info size={30} color={colors.primary} strokeWidth={2.2} />,
          iconBg: isDark ? 'rgba(114, 117, 255, 0.15)' : '#e0e7ff',
          borderColor: colors.primary,
          confirmBtnBg: colors.primary,
          confirmBtnText: colors.onPrimary,
        };
    }
  };

  const visuals = getVisuals();

  const handleConfirm = async () => {
    if (alert.onConfirm) {
      await alert.onConfirm();
    }
    hideAlert();
  };

  const handleCancel = () => {
    if (alert.onCancel) {
      alert.onCancel();
    }
    hideAlert();
  };

  const handleCustomButton = async (btn: AlertButton) => {
    if (btn.onPress) {
      await btn.onPress();
    }
    hideAlert();
  };

  return (
    <Modal
      transparent
      visible={!!alert}
      animationType="none"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleCancel}>
          <View style={styles.backdropTouchable} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.modalCard,
            {
              backgroundColor: isDark ? colors.surfaceContainerHigh : colors.surfaceContainerLowest,
              borderColor: isDark ? colors.outlineVariant : colors.borderLight,
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* İkon Rozeti */}
          <View
            style={[
              styles.iconOuterCircle,
              {
                backgroundColor: visuals.iconBg,
                borderColor: visuals.borderColor,
              },
            ]}
          >
            {visuals.icon}
          </View>

          {/* Başlık ve Mesaj */}
          <Text style={[styles.title, { color: colors.onBackground }]}>
            {alert.title}
          </Text>

          {!!alert.message && (
            <Text style={[styles.message, { color: colors.onSurfaceVariant }]}>
              {alert.message}
            </Text>
          )}

          {/* Butonlar */}
          {alert.buttons && alert.buttons.length > 0 ? (
            <View
              style={
                alert.buttons.length > 2
                  ? styles.actionsColumn
                  : styles.actionsRow
              }
            >
              {alert.buttons.map((btn, idx) => {
                const isDestructive = btn.style === 'destructive';
                const isCancel = btn.style === 'cancel';

                let btnBg = colors.primary;
                let btnTextColor = colors.onPrimary;
                let borderCol = 'transparent';

                if (isDestructive) {
                  btnBg = colors.error;
                  btnTextColor = colors.onError;
                } else if (isCancel) {
                  btnBg = isDark ? colors.surfaceContainer : colors.secondaryContainer;
                  btnTextColor = isDark ? colors.onSurface : colors.secondary;
                  borderCol = colors.outlineVariant;
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.button,
                      {
                        backgroundColor: btnBg,
                        borderColor: borderCol,
                        borderWidth: isCancel ? 1 : 0,
                      },
                    ]}
                    onPress={() => handleCustomButton(btn)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.buttonText, { color: btnTextColor }]}>
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.actionsRow}>
              {alert.showCancel !== false && (
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.cancelButton,
                    {
                      backgroundColor: isDark ? colors.surfaceContainer : colors.surfaceContainerLow,
                      borderColor: colors.outlineVariant,
                    },
                  ]}
                  onPress={handleCancel}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { color: isDark ? colors.onSurface : colors.secondary },
                    ]}
                  >
                    {alert.cancelText || 'Vazgeç'}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: visuals.confirmBtnBg,
                  },
                ]}
                onPress={handleConfirm}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: visuals.confirmBtnText },
                  ]}
                >
                  {alert.confirmText || 'Tamam'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};
