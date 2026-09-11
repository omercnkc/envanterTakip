import { StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants';
import { ThemeColors } from '../constants/colors';

export const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  iconWrapper: {
    width: 88,
    height: 88,
    borderRadius: RADIUS.xl,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '40',
    ...SHADOWS.sm,
  },
  innerIconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...TYPOGRAPHY.headlineMd,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.onBackground,
    textAlign: 'center',
    marginBottom: SPACING.xs + 2,
  },
  description: {
    ...TYPOGRAPHY.bodyMd,
    fontSize: 13,
    lineHeight: 19,
    color: colors.onSecondaryContainer,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: SPACING.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: RADIUS.lg,
    gap: 6,
    ...SHADOWS.sm,
  },
  buttonIcon: {
    marginRight: 2,
  },
  actionButtonText: {
    ...TYPOGRAPHY.labelMd,
    fontSize: 14,
    color: colors.onPrimary,
    fontWeight: '600',
  },
});
