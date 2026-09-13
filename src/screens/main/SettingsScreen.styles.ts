import { StyleSheet } from 'react-native';
import { LIGHT_COLORS, ThemeColors } from '../../constants/colors';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';

export const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.containerMargin,
      paddingVertical: SPACING.stackSm,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceContainerHigh,
    },
    backButton: {
      padding: 6,
      borderRadius: RADIUS.full,
    },
    headerTitle: {
      ...TYPOGRAPHY.headlineMd,
      color: colors.onBackground,
      fontWeight: '700',
      textAlign: 'center',
    },
    headerRightPlaceholder: {
      width: 32,
    },
    scrollContent: {
      paddingHorizontal: SPACING.containerMargin,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.xxl + 20,
      gap: SPACING.stackLg,
    },
    section: {
      gap: SPACING.stackSm,
    },
    sectionHeaderTitle: {
      ...TYPOGRAPHY.bodySm,
      color: colors.onSurfaceVariant,
      paddingHorizontal: 4,
      fontWeight: '500',
    },
    card: {
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: RADIUS.lg,
      borderWidth: 1,
      borderColor: colors.surfaceContainerHigh,
      overflow: 'hidden',
      ...SHADOWS.sm,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceContainerHigh,
    },
    cardRowNoBorder: {
      borderBottomWidth: 0,
    },
    rowLeftWithIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    rowLabel: {
      ...TYPOGRAPHY.bodyLg,
      color: colors.onSurface,
      fontWeight: '500',
    },
    rowValue: {
      ...TYPOGRAPHY.bodyMd,
      color: colors.secondary,
    },
    themeSelectorContainer: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceContainerHigh,
      gap: 12,
    },
    themeHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    themeCurrentLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
    },

    systemThemeInfoBox: {
      backgroundColor: colors.surfaceContainerLow,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: colors.surfaceContainerHigh,
    },
    systemThemeInfoText: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      lineHeight: 16,
    },
  });

export const styles = getStyles(LIGHT_COLORS);
