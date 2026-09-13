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
    paddingTop: SPACING.sm + 2,
    paddingBottom: 85,
    gap: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: colors.primaryFixed,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...TYPOGRAPHY.labelMd,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 18,
  },
  greetingTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  greetingText: {
    ...TYPOGRAPHY.headlineLgMobile,
    color: colors.onBackground,
    fontWeight: '700',
    fontSize: 18,
  },
  subtitleText: {
    ...TYPOGRAPHY.bodySm,
    color: colors.onSecondaryContainer,
    marginTop: 2,
    fontSize: 12,
  },
  headerRight: {
    alignSelf: 'flex-start',
    marginTop: 4,
    marginRight: -2,
  },
  iconButton: {
    width: 35,
    height: 35,
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
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.error,
  },

  // Bento Summary Card
  bentoCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: RADIUS.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
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
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '700',
    color: colors.primary,
  },
  bentoNumberLabel: {
    ...TYPOGRAPHY.bodyMd,
    fontWeight: '600',
    color: colors.onBackground,
  },
  bentoRightWidget: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
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
    gap: 6,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    ...SHADOWS.sm,
  },
  statIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statCount: {
    ...TYPOGRAPHY.headlineMd,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.onSurface,
  },
  statLabel: {
    fontSize: 10,
    lineHeight: 12,
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
    gap: 8,
  },
});
