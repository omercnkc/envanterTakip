import { StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';
import { ThemeColors } from '../../constants/colors';

export const getStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.containerMargin,
    paddingTop: SPACING.md + 4,
    paddingBottom: 135,
    gap: SPACING.stackLg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
  },
  headerLeft: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },
  headerAppLogo: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
  },
  greetingText: {
    ...TYPOGRAPHY.headlineLgMobile,
    color: colors.onBackground,
    fontWeight: '700',
  },
  subtitleText: {
    ...TYPOGRAPHY.bodySm,
    color: colors.onSecondaryContainer,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '40',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...SHADOWS.sm,
  },
  badgeDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.error,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: colors.primaryFixed,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...TYPOGRAPHY.labelMd,
    color: colors.primary,
    fontWeight: '700',
  },

  // Bento Summary Card
  bentoCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: RADIUS.xl,
    padding: SPACING.md + 4,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  bentoBlob: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.surfaceContainerLow,
    opacity: 0.6,
  },
  bentoLeft: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 10,
  },
  bentoTitle: {
    ...TYPOGRAPHY.bodyMd,
    color: colors.onSecondaryContainer,
    marginBottom: 2,
  },
  bentoNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  bentoBigNumber: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: colors.primary,
  },
  bentoNumberLabel: {
    ...TYPOGRAPHY.bodyMd,
    fontWeight: '600',
    color: colors.onBackground,
  },
  bentoRightWidget: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: RADIUS.lg,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '35',
    justifyContent: 'center',
    maxWidth: 165,
    minWidth: 140,
    zIndex: 10,
  },
  bentoRightWidgetWarning: {
    backgroundColor: colors.warranty?.expiringBg || colors.warningContainer,
    borderColor: (colors.warranty?.expiring || colors.warning) + '40',
  },
  bentoRightWidgetSafe: {
    backgroundColor: colors.warranty?.activeBg || colors.surfaceContainerLow,
    borderColor: (colors.warranty?.active || colors.tertiary) + '40',
  },
  bentoStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  bentoStatusIconBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoStatusBadgeText: {
    ...TYPOGRAPHY.labelSm,
    fontSize: 10,
    fontWeight: '700',
  },
  bentoStatusMainText: {
    ...TYPOGRAPHY.headlineMd,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.onBackground,
  },
  bentoStatusProductRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 4,
  },
  bentoStatusProductName: {
    ...TYPOGRAPHY.bodySm,
    fontSize: 11,
    color: colors.onSecondaryContainer,
    flex: 1,
  },


  // 4-Column Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.xs + 4,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    ...SHADOWS.sm,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statCount: {
    ...TYPOGRAPHY.headlineMd,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    color: colors.onSurface,
  },
  statLabel: {
    fontSize: 10,
    lineHeight: 13,
    color: colors.onSecondaryContainer,
    textAlign: 'center',
    marginTop: 2,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...TYPOGRAPHY.headlineMd,
    color: colors.onBackground,
    fontWeight: '600',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    ...TYPOGRAPHY.labelMd,
    color: colors.primary,
    fontWeight: '600',
  },

  // List Container
  productsList: {
    gap: SPACING.sm + 2,
  },
});
