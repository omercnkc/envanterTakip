import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: RADIUS.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHigh,
    gap: 12,
    ...SHADOWS.sm,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.default,
    backgroundColor: COLORS.surfaceContainerLow,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
  },
  content: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  title: {
    ...TYPOGRAPHY.labelMd,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.onBackground,
    marginBottom: 2,
  },
  categoryBrand: {
    ...TYPOGRAPHY.bodySm,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.secondary,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateIcon: {
    marginTop: 0.5,
  },
  warrantyDate: {
    ...TYPOGRAPHY.bodySm,
    fontSize: 11,
    lineHeight: 15,
    color: COLORS.onSecondaryContainer,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  gaugeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chevron: {
    marginLeft: 2,
  },
  statusBadgeWrapper: {
    alignItems: 'flex-end',
  },
  statusText: {
    ...TYPOGRAPHY.labelMd,
    fontSize: 11,
    fontWeight: '600',
  },
});
