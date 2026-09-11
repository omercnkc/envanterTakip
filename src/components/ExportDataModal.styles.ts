import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.containerMargin,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    ...SHADOWS.lg,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: -SPACING.xs,
    marginBottom: SPACING.xs,
  },
  handleBar: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.outlineVariant,
    alignSelf: 'center',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  title: {
    ...TYPOGRAPHY.headlineMd,
    color: COLORS.onBackground,
    fontWeight: '700',
  },
  closeIconButton: {
    padding: 4,
  },
  subtitle: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.md,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceContainerLow,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHigh,
  },
  summaryLabel: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.onSurfaceVariant,
  },
  summaryBadge: {
    backgroundColor: COLORS.primaryFixed,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  summaryBadgeText: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.primary,
    fontWeight: '700',
  },
  formatList: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  formatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceContainerHigh,
  },
  formatCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryFixed + '25',
  },
  formatIconBox: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  formatIconBoxSelected: {
    backgroundColor: COLORS.primaryFixed,
  },
  formatInfo: {
    flex: 1,
  },
  formatTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  formatTitle: {
    ...TYPOGRAPHY.bodyLg,
    color: COLORS.onBackground,
    fontWeight: '700',
  },
  badgePill: {
    backgroundColor: COLORS.tertiaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgePillText: {
    ...TYPOGRAPHY.labelSm,
    color: COLORS.tertiary,
    fontWeight: '700',
    fontSize: 10,
  },
  formatDescription: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.onSurfaceVariant,
    lineHeight: 18,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.outline,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  radioCircleSelected: {
    borderColor: COLORS.primary,
  },
  radioInnerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.onSurfaceVariant,
    fontWeight: '600',
  },
  exportButton: {
    flex: 2,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  exportButtonDisabled: {
    opacity: 0.6,
  },
  exportButtonText: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.onPrimary,
    fontWeight: '700',
  },
});
