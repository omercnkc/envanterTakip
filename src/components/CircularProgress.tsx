import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  percentage: number;
  color?: string;
  backgroundColor?: string;
  showText?: boolean;
  centerText?: string;
  centerSubtext?: string;
  textStyle?: object;
  subtextStyle?: object;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 100,
  strokeWidth = 8,
  percentage = 0,
  color,
  backgroundColor,
  showText = true,
  centerText,
  centerSubtext,
  textStyle,
  subtextStyle,
}) => {
  const { colors } = useTheme();
  const activeColor = color ?? colors.primary;
  const activeBgColor = backgroundColor ?? colors.surfaceContainer;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const validPercentage = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (circumference * validPercentage) / 100;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Arka Plan Çemberi */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={activeBgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* İlerleme Çemberi */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.percentageText, textStyle, { color: activeColor }]}>
            {centerText !== undefined ? centerText : `%${Math.round(validPercentage)}`}
          </Text>
          {centerSubtext && (
            <Text
              style={[
                styles.subtext,
                { color: colors.onSecondaryContainer },
                subtextStyle,
              ]}
            >
              {centerSubtext}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtext: {
    fontSize: 9,
    lineHeight: 12,
    textAlign: 'center',
    marginTop: 1,
  },
});

