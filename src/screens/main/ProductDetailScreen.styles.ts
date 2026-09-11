import { StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';
import { ThemeColors } from '../../constants/colors';

export const getStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.containerMargin,
    paddingVertical: SPACING.stackSm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 6,
    borderRadius: RADIUS.full,
  },
  headerTitle: {
    ...TYPOGRAPHY.headlineMd,
    color: colors.onBackground,
    fontWeight: '700',
  },
  editIconButton: {
    padding: 8,
    borderRadius: RADIUS.full,
  },
  scrollContent: {
    paddingHorizontal: SPACING.containerMargin,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xxl + 20,
    gap: SPACING.stackMd,
  },
  heroImageContainer: {
    width: '100%',
    height: 192,
    borderRadius: RADIUS.lg,
    backgroundColor: colors.surfaceContainerLowest,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
  },
  titleSection: {
    gap: 4,
    marginTop: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  productName: {
    flex: 1,
    ...TYPOGRAPHY.headlineMd,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: colors.onBackground,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  statusPillText: {
    ...TYPOGRAPHY.labelMd,
    fontSize: 11,
    fontWeight: '600',
  },
  categoryBrandText: {
    ...TYPOGRAPHY.bodySm,
    color: colors.onSurfaceVariant,
  },

  // Details Divided Card
  detailsCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
  },
  descriptionRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  detailLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailLabel: {
    ...TYPOGRAPHY.bodyMd,
    color: colors.onSurfaceVariant,
  },
  detailValue: {
    ...TYPOGRAPHY.bodyMd,
    fontWeight: '500',
    color: colors.onBackground,
  },
  descriptionText: {
    ...TYPOGRAPHY.bodySm,
    color: colors.onBackground,
    paddingLeft: 27,
    lineHeight: 18,
  },

  // Invoice Section
  invoiceSection: {
    gap: SPACING.sm,
    marginTop: 4,
  },
  sectionTitle: {
    ...TYPOGRAPHY.headlineMd,
    fontSize: 16,
    fontWeight: '600',
    color: colors.onBackground,
    paddingHorizontal: 2,
  },
  invoiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    ...SHADOWS.sm,
  },
  invoiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  invoiceIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.default,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceFileName: {
    ...TYPOGRAPHY.bodyMd,
    fontWeight: '500',
    color: colors.onBackground,
  },
  invoiceFileSize: {
    ...TYPOGRAPHY.bodySm,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  downloadButton: {
    padding: 8,
    borderRadius: RADIUS.full,
    backgroundColor: colors.primaryContainer + '15',
  },

  // Action Buttons
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  editButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    ...TYPOGRAPHY.bodyLg,
    color: colors.primary,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    backgroundColor: colors.errorContainer + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    ...TYPOGRAPHY.bodyLg,
    color: colors.error,
    fontWeight: '600',
  },
});
