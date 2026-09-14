import { StyleSheet } from 'react-native';
import { ThemeColors, SPACING, RADIUS, SHADOWS } from '../constants';

export const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: RADIUS.xl,
      borderWidth: 1,
      borderColor: colors.surfaceContainerHigh,
      padding: SPACING.md,
      marginBottom: SPACING.lg,
      ...SHADOWS.sm,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.md,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    title: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.onBackground,
    },
    toggleGroup: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceContainerHigh,
      borderRadius: RADIUS.full,
      padding: 3,
    },
    toggleBtn: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: RADIUS.full,
    },
    toggleBtnActive: {
      backgroundColor: colors.primary,
    },
    toggleText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.onSurfaceVariant,
    },
    toggleTextActive: {
      color: colors.onPrimary,
      fontWeight: '700',
    },

    // Chart Center
    chartWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: SPACING.sm,
      minHeight: 220,
    },
    centerLabelBox: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
      maxWidth: 130,
    },
    centerLabelSub: {
      fontSize: 10,
      fontWeight: '600',
      color: colors.onSurfaceVariant,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      textAlign: 'center',
    },
    centerLabelMain: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.onBackground,
      textAlign: 'center',
      marginTop: 2,
    },
    centerLabelHint: {
      fontSize: 9.5,
      color: colors.primary,
      fontWeight: '600',
      marginTop: 2,
      textAlign: 'center',
    },

    // Legend / Category List
    legendContainer: {
      marginTop: SPACING.md,
      gap: 8,
      borderTopWidth: 1,
      borderTopColor: colors.surfaceContainerHigh,
      paddingTop: SPACING.md,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: RADIUS.md,
      backgroundColor: 'transparent',
    },
    legendItemActive: {
      backgroundColor: colors.primary + '10',
      borderWidth: 1,
      borderColor: colors.primary + '30',
    },
    legendLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
    },
    colorDot: {
      width: 10,
      height: 10,
      borderRadius: RADIUS.full,
    },
    categoryName: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.onBackground,
    },
    categoryCountText: {
      fontSize: 11,
      color: colors.onSurfaceVariant,
      marginLeft: 4,
    },
    legendRight: {
      alignItems: 'flex-end',
    },
    amountText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.onBackground,
    },
    percentageBadge: {
      fontSize: 10.5,
      fontWeight: '700',
      color: colors.primary,
    },

    // Action button to filter category
    filterActionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginTop: SPACING.sm,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: RADIUS.md,
      backgroundColor: colors.primary + '15',
    },
    filterActionText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.primary,
    },

    // Empty state
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.xl,
      gap: 6,
    },
    emptyText: {
      fontSize: 13,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
    },
  });
