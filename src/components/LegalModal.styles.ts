import { StyleSheet } from 'react-native';
import { ThemeColors, SPACING, RADIUS, SHADOWS } from '../constants';

export const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RADIUS.xl,
      borderTopRightRadius: RADIUS.xl,
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.md,
      height: '88%',
    },
    handleBar: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.surfaceContainerHighest,
      alignSelf: 'center',
      marginBottom: SPACING.md,
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
      gap: 10,
    },
    headerIconBox: {
      width: 42,
      height: 42,
      borderRadius: RADIUS.md,
      backgroundColor: colors.primary + '18',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.onBackground,
    },
    headerSubtitle: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      marginTop: 2,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: RADIUS.full,
      backgroundColor: colors.surfaceContainerHigh,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceContainerLow,
      borderRadius: RADIUS.md,
      padding: 4,
      marginBottom: SPACING.md,
    },
    tabItem: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      borderRadius: RADIUS.sm,
    },
    tabItemActive: {
      backgroundColor: colors.surface,
      ...SHADOWS.sm,
    },
    tabText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.onSurfaceVariant,
    },
    tabTextActive: {
      color: colors.primary,
      fontWeight: '700',
    },
    scrollArea: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: SPACING.xl * 2,
    },
    badgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.primaryContainer,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: RADIUS.full,
      alignSelf: 'flex-start',
      marginBottom: SPACING.md,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.onPrimaryContainer,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.onBackground,
      marginTop: SPACING.md,
      marginBottom: 6,
    },
    paragraph: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.onSurfaceVariant,
      marginBottom: 8,
    },
    bulletItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      marginBottom: 6,
      paddingLeft: 4,
    },
    bulletDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: colors.primary,
      marginTop: 7,
    },
    bulletText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 19,
      color: colors.onSurfaceVariant,
    },
    actionButton: {
      marginTop: SPACING.md,
      backgroundColor: colors.primary,
      borderRadius: RADIUS.md,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButtonText: {
      color: colors.onPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
  });
