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

  title: {
    ...TYPOGRAPHY.headlineMd,
    color: COLORS.onBackground,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: SPACING.md + 4,
  },
  optionsList: {
    gap: SPACING.sm + 2,
    marginBottom: SPACING.md,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHigh,
  },
  optionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  optionTextBox: {
    flex: 1,
  },
  optionTitle: {
    ...TYPOGRAPHY.labelMd,
    fontSize: 14,
    color: COLORS.onBackground,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionDesc: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.onSurfaceVariant,
    fontSize: 12,
  },
  cancelButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceContainerHighest,
  },
  cancelButtonText: {
    ...TYPOGRAPHY.labelMd,
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    fontWeight: '600',
  },
});
