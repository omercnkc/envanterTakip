import { StyleSheet } from 'react-native';
import { LIGHT_COLORS, ThemeColors } from '../../constants/colors';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';

export const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingHorizontal: SPACING.containerMargin,
      paddingTop: SPACING.xs,
      paddingBottom: 135,
      gap: SPACING.stackLg,
    },
    headerTitle: {
      ...TYPOGRAPHY.headlineLgMobile,
      color: colors.onBackground,
      fontWeight: '700',
    },
    userCard: {
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: RADIUS.lg,
      padding: SPACING.lg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceContainerHigh,
      ...SHADOWS.sm,
    },
    avatarBox: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.primaryFixed,
      borderWidth: 2,
      borderColor: colors.surfaceContainerLowest,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.sm + 2,
      ...SHADOWS.sm,
    },
    avatarInitials: {
      ...TYPOGRAPHY.headlineLg,
      fontSize: 32,
      color: colors.primary,
      fontWeight: '700',
    },
    userInfo: {
      alignItems: 'center',
    },
    userName: {
      ...TYPOGRAPHY.headlineMd,
      color: colors.onBackground,
      fontWeight: '700',
    },
    userEmail: {
      ...TYPOGRAPHY.bodySm,
      color: colors.onSurfaceVariant,
      marginTop: 2,
    },
    editProfileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: SPACING.sm + 2,
      paddingHorizontal: SPACING.md,
      paddingVertical: 6,
      borderRadius: RADIUS.full,
      backgroundColor: colors.primaryFixed,
    },
    editProfileButtonText: {
      ...TYPOGRAPHY.labelMd,
      color: colors.primary,
      fontWeight: '600',
    },

    // 3-Column Stats Grid
    statsGrid: {
      flexDirection: 'row',
      gap: 8,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: RADIUS.lg,
      paddingVertical: 14,
      paddingHorizontal: 6,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceContainerHigh,
      ...SHADOWS.sm,
    },
    statLabel: {
      ...TYPOGRAPHY.bodySm,
      fontSize: 11,
      color: colors.onSecondaryContainer,
      marginBottom: 4,
      textAlign: 'center',
    },
    statValue: {
      ...TYPOGRAPHY.headlineLg,
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '700',
    },

    // Menu List Card
    menuCard: {
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: RADIUS.lg,
      borderWidth: 1,
      borderColor: colors.surfaceContainerHigh,
      overflow: 'hidden',
      ...SHADOWS.sm,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceContainerHigh,
    },
    menuItemNoBorder: {
      borderBottomWidth: 0,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    menuItemLabel: {
      ...TYPOGRAPHY.bodyLg,
      color: colors.onBackground,
      fontWeight: '500',
    },

    // Logout Button
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.errorContainer + '30',
      paddingVertical: 14,
      borderRadius: RADIUS.md,
      gap: 8,
      marginTop: SPACING.xs,
    },
    logoutButtonText: {
      ...TYPOGRAPHY.labelMd,
      fontSize: 14,
      color: colors.error,
      fontWeight: '600',
    },

    // App Branding Footer
    appBrandingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: SPACING.xl,
      paddingBottom: SPACING.xl * 2,
      gap: 4,
    },
    appBrandingLogo: {
      width: 44,
      height: 44,
      borderRadius: RADIUS.md,
      marginBottom: 4,
    },
    appBrandingTitle: {
      ...TYPOGRAPHY.labelMd,
      color: colors.onSurface,
      fontWeight: '700',
      fontSize: 14,
    },
    appBrandingVersion: {
      ...TYPOGRAPHY.bodySm,
      color: colors.onSurfaceVariant,
      fontSize: 12,
    },
  });

export const styles = getStyles(LIGHT_COLORS);
