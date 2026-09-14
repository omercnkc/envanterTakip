import { StyleSheet } from 'react-native';
import { TYPOGRAPHY, RADIUS, SHADOWS, COLORS } from '../constants';
import { ThemeColors } from '../constants/colors';

export const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: RADIUS.lg,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.surfaceContainerHigh,
      gap: 12,
      ...SHADOWS.sm,
    },
    imageContainer: {
      width: 60,
      height: 60,
      borderRadius: RADIUS.default,
      backgroundColor: colors.surfaceContainerLow,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.outlineVariant + '40',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    iconPlaceholder: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceContainerLow,
    },
    content: {
      flex: 1,
      minWidth: 0,
      justifyContent: 'center',
    },
    title: {
      ...TYPOGRAPHY.labelMd,
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '600',
      color: colors.onBackground,
      marginBottom: 2,
    },
    categoryBrand: {
      ...TYPOGRAPHY.bodySm,
      fontSize: 12,
      lineHeight: 16,
      color: colors.secondary,
      marginBottom: 4,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    dateIcon: {
      marginTop: 0.5,
    },
    warrantyDate: {
      ...TYPOGRAPHY.bodySm,
      fontSize: 11,
      lineHeight: 15,
      color: colors.onSecondaryContainer,
    },
    rightSection: {
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      minHeight: 56,
      paddingVertical: 1,
    },
    favoriteButton: {
      width: 28,
      height: 28,
      borderRadius: RADIUS.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceContainerLow,
    },
    favoriteButtonActive: {
      backgroundColor: '#ef444418',
    },
    gaugeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    chevron: {
      marginLeft: 2,
    },
    statusBadgeWrapper: {
      alignItems: 'flex-end',
    },
    statusText: {
      ...TYPOGRAPHY.labelMd,
      fontSize: 11,
      fontWeight: '600',
    },
  });

export const styles = getStyles(COLORS);

