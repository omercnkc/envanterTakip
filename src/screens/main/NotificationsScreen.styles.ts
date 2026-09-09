import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.containerMargin,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.sm,
  },
  headerTitle: {
    ...TYPOGRAPHY.headlineLgMobile,
    color: COLORS.onBackground,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainerLow,
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
    backgroundColor: COLORS.surfaceContainerLowest,
    ...SHADOWS.sm,
  },
  tabText: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
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
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHigh,
    position: 'relative',
    ...SHADOWS.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBoxWarning: {
    backgroundColor: COLORS.warningContainer,
  },
  iconBoxError: {
    backgroundColor: COLORS.errorContainer,
  },
  iconBoxSuccess: {
    backgroundColor: COLORS.tertiaryContainer + '20',
  },
  content: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.bodyLg,
    fontWeight: '600',
    color: COLORS.onBackground,
  },
  message: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  timestamp: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.secondary,
    marginTop: 4,
    fontSize: 11,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    top: 14,
    right: 14,
  },
});
