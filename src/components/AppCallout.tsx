import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { styles } from './AppCallout.styles';

export type CalloutType = 'info' | 'warning' | 'error' | 'success';

export interface AppCalloutProps {
  type?: CalloutType;
  title?: string;
  message: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const AppCallout: React.FC<AppCalloutProps> = ({
  type = 'info',
  title,
  message,
  icon,
  actionText,
  onAction,
  onClose,
  style,
}) => {
  const { colors, isDark } = useTheme();

  const getVisuals = () => {
    switch (type) {
      case 'success':
        return {
          defaultIcon: <CheckCircle2 size={18} color={colors.tertiary} strokeWidth={2.2} />,
          accentColor: colors.tertiary,
          bgColor: isDark ? 'rgba(52, 211, 153, 0.08)' : '#f0fdf4',
          borderColor: isDark ? 'rgba(52, 211, 153, 0.25)' : '#bbf7d0',
        };
      case 'error':
        return {
          defaultIcon: <AlertCircle size={18} color={colors.error} strokeWidth={2.2} />,
          accentColor: colors.error,
          bgColor: isDark ? 'rgba(248, 113, 113, 0.08)' : '#fef2f2',
          borderColor: isDark ? 'rgba(248, 113, 113, 0.25)' : '#fecaca',
        };
      case 'warning':
        return {
          defaultIcon: <AlertTriangle size={18} color={colors.warning} strokeWidth={2.2} />,
          accentColor: colors.warning,
          bgColor: isDark ? 'rgba(251, 191, 36, 0.08)' : '#fffbeb',
          borderColor: isDark ? 'rgba(251, 191, 36, 0.25)' : '#fde68a',
        };
      case 'info':
      default:
        return {
          defaultIcon: <Info size={18} color={colors.primary} strokeWidth={2.2} />,
          accentColor: colors.primary,
          bgColor: isDark ? 'rgba(114, 117, 255, 0.08)' : '#eef2ff',
          borderColor: isDark ? 'rgba(114, 117, 255, 0.25)' : '#c7d2fe',
        };
    }
  };

  const visuals = getVisuals();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: visuals.bgColor,
          borderColor: visuals.borderColor,
          borderLeftColor: visuals.accentColor,
        },
        style,
      ]}
    >
      <View style={styles.iconBox}>
        {icon || visuals.defaultIcon}
      </View>

      <View style={styles.contentBox}>
        {!!title && (
          <Text style={[styles.title, { color: visuals.accentColor }]}>
            {title}
          </Text>
        )}
        <Text style={[styles.message, { color: colors.onSurface }]}>
          {message}
        </Text>

        {!!actionText && !!onAction && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onAction}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionText, { color: visuals.accentColor }]}>
              {actionText} →
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {!!onClose && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={15} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      )}
    </View>
  );
};
