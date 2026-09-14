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
      gap: SPACING.md,
    },
    headerTitle: {
      ...TYPOGRAPHY.headlineLgMobile,
      color: colors.onBackground,
      fontWeight: '700',
      marginBottom: 2,
    },

    // User Identity Card
    userCard: {
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: RADIUS.xl,
      padding: SPACING.lg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceContainerHigh,
      ...SHADOWS.sm,
    },
    avatarBox: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: colors.primaryContainer,
      borderWidth: 2.5,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.sm,
      overflow: 'hidden',
      ...SHADOWS.sm,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      borderRadius: 45,
    },
    avatarInitials: {
      ...TYPOGRAPHY.headlineLg,
      fontSize: 34,
      color: colors.onPrimaryContainer,
      fontWeight: '800',
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

    // Toplam Envanter Serveti Kartı (Net Worth Hero)
    wealthHeroCard: {
      borderRadius: RADIUS.xl,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.primary + '30',
      backgroundColor: colors.surfaceContainerLowest,
      padding: SPACING.lg,
      ...SHADOWS.md,
    },
    wealthHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    wealthTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: colors.primary + '18',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: RADIUS.full,
    },
    wealthTagText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    wealthItemCount: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      fontWeight: '500',
    },
    wealthAmount: {
      fontSize: 30,
      fontWeight: '800',
      color: colors.onBackground,
      letterSpacing: -0.5,
      marginBottom: 12,
    },
    wealthSubMetricsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.outlineVariant + '40',
    },
    wealthSubMetric: {
      flex: 1,
    },
    wealthSubMetricLabel: {
      fontSize: 11,
      color: colors.onSurfaceVariant,
      marginBottom: 2,
    },
    wealthSubMetricValue: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.onBackground,
    },

    // Envanter Güvence & Sağlık Skoru Kartı
    healthCard: {
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: RADIUS.lg,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: colors.surfaceContainerHigh,
      ...SHADOWS.sm,
    },
    healthHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    healthLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    healthTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.onBackground,
    },
    healthScoreBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: '#10B98118',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: RADIUS.full,
    },
    healthScoreText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#059669',
    },
    healthProgressBarTrack: {
      width: '100%',
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.surfaceContainerHigh,
      overflow: 'hidden',
      marginBottom: 8,
    },
    healthProgressBarFill: {
      height: '100%',
      borderRadius: 4,
      backgroundColor: '#10B981',
    },
    healthHintText: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
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

    // Resmi PDF Raporu Aksiyon Butonu
    pdfReportCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.primaryContainer,
      borderRadius: RADIUS.lg,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: colors.primary + '30',
      ...SHADOWS.sm,
    },
    pdfReportLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    pdfIconCircle: {
      width: 42,
      height: 42,
      borderRadius: RADIUS.md,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pdfReportTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.onPrimaryContainer,
    },
    pdfReportSubtitle: {
      fontSize: 12,
      color: colors.onPrimaryContainer,
      opacity: 0.8,
      marginTop: 2,
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
      paddingVertical: 15,
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
    menuItemIconBox: {
      width: 34,
      height: 34,
      borderRadius: RADIUS.sm,
      backgroundColor: colors.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuItemLabel: {
      ...TYPOGRAPHY.bodyLg,
      color: colors.onBackground,
      fontWeight: '600',
      fontSize: 14,
    },

    // App Branding Footer
    appBrandingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: SPACING.sm,
      paddingBottom: SPACING.lg,
      gap: 4,
    },
    appBrandingLogo: {
      width: 40,
      height: 40,
      borderRadius: RADIUS.md,
      marginBottom: 2,
    },
    appBrandingTitle: {
      ...TYPOGRAPHY.labelMd,
      color: colors.onSurface,
      fontWeight: '700',
      fontSize: 13,
    },
    appBrandingVersion: {
      ...TYPOGRAPHY.bodySm,
      color: colors.onSurfaceVariant,
      fontSize: 11,
    },
  });

export const styles = getStyles(LIGHT_COLORS);
