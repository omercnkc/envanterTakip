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
  headerTitle: {
    ...TYPOGRAPHY.headlineLgMobile,
    color: colors.onBackground,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.containerMargin,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: RADIUS.full,
    paddingHorizontal: 16,
    height: 46,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.bodyMd,
    color: colors.onSurface,
    height: '100%',
  },
  clearSearchButton: {
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: 8,
  },
  filterScroll: {
    gap: 8,
    paddingRight: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '40',
    ...SHADOWS.sm,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...TYPOGRAPHY.labelMd,
    fontSize: 12,
    color: colors.onSurface,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
  tuneButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '40',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  tuneButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryContainer + '15',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: SPACING.sm,
  },
  productCountText: {
    ...TYPOGRAPHY.labelMd,
    color: colors.secondary,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 135,
    gap: SPACING.sm + 2,
  },
  footerContainer: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    ...TYPOGRAPHY.labelMd,
    color: colors.outline,
    fontSize: 12,
  },
});
