import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 28, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.containerMargin,
    paddingBottom: SPACING.sectionGap,
    maxHeight: '80%',
    ...SHADOWS.lg,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
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
  header: {

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant + '30',
    marginBottom: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.headlineMd,
    color: COLORS.onSurface,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  list: {
    paddingVertical: SPACING.xs,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xs,
  },
  categoryItemSelected: {
    backgroundColor: COLORS.primaryContainer + '20',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxSelected: {
    backgroundColor: COLORS.primary,
  },
  categoryName: {
    flex: 1,
    ...TYPOGRAPHY.bodyMd,
    fontWeight: '500',
    color: COLORS.onSurface,
  },
  categoryNameSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
