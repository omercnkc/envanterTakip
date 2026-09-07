import React from 'react';
import { View, Text } from 'react-native';
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
  const { label, color, bgColor } = calculateWarrantyStatus(warrantyEndDate);

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      {showDot && <View style={[styles.dot, { backgroundColor: color }]} />}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
};
