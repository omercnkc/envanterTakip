import { StyleSheet, Dimensions } from 'react-native';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';
import { ThemeColors } from '../../constants/colors';

const { width } = Dimensions.get('window');

export const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.containerMargin,
      position: 'relative',
      overflow: 'hidden',
    },
    bgBlobTop: {
      position: 'absolute',
      top: -100,
      left: -100,
      width: width * 0.9,
      height: width * 0.9,
      borderRadius: (width * 0.9) / 2,
      backgroundColor: colors.surfaceContainer,
      opacity: 0.7,
    },
    bgBlobBottom: {
      position: 'absolute',
      bottom: -120,
      right: -100,
      width: width * 0.9,
      height: width * 0.9,
      borderRadius: (width * 0.9) / 2,
      backgroundColor: colors.surfaceContainerLow,
      opacity: 0.8,
    },
    contentCenter: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    title: {
      ...TYPOGRAPHY.headlineLg,
      fontSize: 26,
      lineHeight: 34,
      color: colors.onBackground,
      fontWeight: '700',
      textAlign: 'center',
      letterSpacing: -0.3,
      marginTop: 8,
    },
    subtitle: {
      ...TYPOGRAPHY.labelMd,
      fontSize: 12,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      marginTop: 4,
      letterSpacing: 2,
      fontWeight: '600',
      opacity: 0.85,
    },
    bottomSection: {
      width: '100%',
      alignItems: 'center',
      paddingBottom: SPACING.xl + 10,
      zIndex: 10,
    },
    dotsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginBottom: SPACING.sm,
      height: 16,
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    statusText: {
      ...TYPOGRAPHY.bodySm,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      fontWeight: '500',
    },
  });

// Geriye dönük uyumluluk
export const styles = getStyles;
