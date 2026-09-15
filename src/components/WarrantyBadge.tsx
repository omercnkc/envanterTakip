import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../i18n';
import { calculateWarrantyStatus } from '../utils/warrantyCalculator';
import { styles } from './WarrantyBadge.styles';

interface WarrantyBadgeProps {
  warrantyEndDate: string | null | undefined;
  showDot?: boolean;
}

export const WarrantyBadge: React.FC<WarrantyBadgeProps> = ({
  warrantyEndDate,
  showDot = true,
}) => {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const { label, color, bgColor } = calculateWarrantyStatus(warrantyEndDate, colors, language);

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      {showDot && <View style={[styles.dot, { backgroundColor: color }]} />}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
};

