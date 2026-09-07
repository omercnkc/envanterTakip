import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLowest,
    padding: SPACING.md - 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceVariant + '80',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceContainer,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...TYPOGRAPHY.bodyMd,
    fontWeight: '600',
    color: COLORS.onSurface,
    marginBottom: 2,
  },
  categoryBrand: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.secondary,
    marginBottom: 2,
  },
  warrantyDate: {
    ...TYPOGRAPHY.labelSm,
    color: COLORS.outline,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
