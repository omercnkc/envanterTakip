import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 28, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '85%',
    paddingBottom: SPACING.xl,
    ...SHADOWS.lg,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.outlineVariant,
    alignSelf: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.containerMargin,
    paddingVertical: SPACING.stackMd,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainerHigh,
  },
  title: {
    ...TYPOGRAPHY.headlineLgMobile,
    color: COLORS.onBackground,
    fontWeight: '700',
  },
  resetButtonText: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: SPACING.containerMargin,
    paddingTop: SPACING.stackMd,
  },
  sectionTitle: {
    ...TYPOGRAPHY.headlineMd,
    color: COLORS.onBackground,
    marginBottom: SPACING.stackMd,
    marginTop: SPACING.stackSm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.stackLg,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.onSurfaceVariant,
    fontWeight: '500',
  },
  chipTextActive: {
    color: COLORS.onPrimary,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: SPACING.containerMargin,
    paddingTop: SPACING.stackMd,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceContainerHigh,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  applyButtonText: {
    ...TYPOGRAPHY.bodyLg,
    color: COLORS.onPrimary,
    fontWeight: '600',
  },
});
