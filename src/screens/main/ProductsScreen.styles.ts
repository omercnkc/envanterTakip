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
  pageIndicatorText: {
    ...TYPOGRAPHY.labelMd,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 140,
    gap: SPACING.sm + 2,
  },
  paginationWrapper: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  pageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '40',
    ...SHADOWS.sm,
  },
  pageButtonDisabled: {
    opacity: 0.35,
  },
  pageButtonText: {
    ...TYPOGRAPHY.labelMd,
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurface,
  },
  pageButtonTextDisabled: {
    color: colors.outline,
  },
  pagePillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flex: 1,
  },
  pagePill: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '40',
    ...SHADOWS.sm,
  },
  pagePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pagePillText: {
    ...TYPOGRAPHY.labelMd,
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurface,
  },
  pagePillTextActive: {
    color: colors.onPrimary,
    fontWeight: '700',
  },
  ellipsisText: {
    color: colors.outline,
    fontSize: 14,
    paddingHorizontal: 2,
  },
  pageSummaryText: {
    ...TYPOGRAPHY.labelSm,
    color: colors.outline,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
  },
});
