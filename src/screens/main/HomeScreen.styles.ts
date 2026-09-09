import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.containerMargin,
    paddingTop: SPACING.stackSm,
    paddingBottom: 110,
    gap: SPACING.stackLg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
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
    color: COLORS.onBackground,
    fontWeight: '700',
  },
  subtitleText: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.onSecondaryContainer,
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
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '40',
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
    backgroundColor: COLORS.error,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryFixed,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.primary,
    fontWeight: '700',
  },

  // Bento Summary Card
  bentoCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: RADIUS.xl,
    padding: SPACING.md + 4,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHigh,
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
    backgroundColor: COLORS.surfaceContainerLow,
    opacity: 0.6,
  },
  bentoLeft: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 10,
  },
  bentoTitle: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.onSecondaryContainer,
    marginBottom: 2,
  },
  bentoNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: SPACING.md,
  },
  bentoBigNumber: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: COLORS.primary,
  },
  bentoNumberLabel: {
    ...TYPOGRAPHY.bodyMd,
    fontWeight: '600',
    color: COLORS.onBackground,
  },
  bentoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  bentoButtonText: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.primary,
    fontWeight: '600',
  },
  bentoChartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  bentoShieldBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '40',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },

  // 4-Column Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.xs + 4,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHigh,
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
  },
  statLabel: {
    fontSize: 10,
    lineHeight: 13,
    color: COLORS.onSecondaryContainer,
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
    color: COLORS.onBackground,
    fontWeight: '600',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // List Container
  productsList: {
    gap: SPACING.sm + 2,
  },
});
