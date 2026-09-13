import { StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';
import { ThemeColors } from '../../constants/colors';

export const getStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: SPACING.containerMargin,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.sm,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.headlineLgMobile,
    color: colors.onBackground,
    fontWeight: '700',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryContainer + '40',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  testButtonText: {
    ...TYPOGRAPHY.labelSm,
    color: colors.primary,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: RADIUS.full,
    padding: 4,
    ...SHADOWS.sm,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: colors.surfaceContainerLowest,
    ...SHADOWS.sm,
  },
  tabText: {
    ...TYPOGRAPHY.labelMd,
    color: colors.secondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: SPACING.containerMargin,
    paddingTop: SPACING.xs,
    paddingBottom: 135,
    gap: SPACING.sm + 2,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    position: 'relative',
    ...SHADOWS.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBoxWarning: {
    backgroundColor: colors.warningContainer,
  },
  iconBoxError: {
    backgroundColor: colors.errorContainer,
  },
  iconBoxSuccess: {
    backgroundColor: colors.tertiaryContainer + '20',
  },
  content: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.bodyLg,
    fontWeight: '600',
    color: colors.onBackground,
  },
  message: {
    ...TYPOGRAPHY.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  timestamp: {
    ...TYPOGRAPHY.bodySm,
    color: colors.secondary,
    marginTop: 4,
    fontSize: 11,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    marginLeft: 8,
  },
  deleteIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm + 2,
    paddingHorizontal: 4,
  },
  toolbarSummary: {
    ...TYPOGRAPHY.labelMd,
    color: colors.secondary,
    fontWeight: '600',
  },
  toolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: RADIUS.full,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '35',
  },
  actionButtonDanger: {
    backgroundColor: colors.errorContainer + '25',
    borderColor: colors.error + '25',
  },
  actionButtonText: {
    ...TYPOGRAPHY.labelSm,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  actionButtonDangerText: {
    color: colors.error,
  },
});
