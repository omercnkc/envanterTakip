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
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
  },
  backButton: {
    padding: 6,
    borderRadius: RADIUS.full,
  },
  headerTitle: {
    ...TYPOGRAPHY.headlineMd,
    color: colors.onBackground,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerRightPlaceholder: {
    width: 32,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.containerMargin,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxl,
    gap: SPACING.sectionGap - 8,
  },
  section: {
    gap: SPACING.stackSm + 4,
  },
  sectionLabel: {
    ...TYPOGRAPHY.labelMd,
    color: colors.onSurfaceVariant,
  },
  sectionTitle: {
    ...TYPOGRAPHY.bodyLg,
    color: colors.onBackground,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
    paddingBottom: 8,
  },
  photoActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoActionButton: {
    flex: 1,
    height: 96,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '50',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...SHADOWS.sm,
  },
  photoActionText: {
    ...TYPOGRAPHY.labelMd,
    color: colors.onSurface,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 140,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.outlineVariant + '50',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePreviewClickable: {
    width: '100%',
    height: '100%',
  },
  zoomBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadDashedBox: {
    height: 90,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant + '80',
    borderRadius: RADIUS.lg,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  uploadDashedBoxError: {
    borderColor: colors.error,
    backgroundColor: colors.errorContainer + '20',
  },
  uploadDashedText: {
    ...TYPOGRAPHY.bodySm,
    color: colors.onSurfaceVariant,
  },
  invoiceUploadedBox: {
    height: 48,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: RADIUS.default,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  invoiceUploadedText: {
    ...TYPOGRAPHY.bodySm,
    color: colors.primary,
    fontWeight: '500',
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    ...TYPOGRAPHY.labelMd,
    color: colors.onSurfaceVariant,
  },
  requiredStar: {
    color: colors.error,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  inputBox: {
    height: 48,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: RADIUS.default,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '50',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  inputBoxError: {
    borderColor: colors.error,
  },
  priceInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  currencySymbol: {
    ...TYPOGRAPHY.bodyMd,
    color: colors.outline,
    marginRight: 6,
    fontWeight: '600',
  },
  serialInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 6,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  scanButtonText: {
    ...TYPOGRAPHY.labelSm,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  pickerBox: {
    height: 48,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: RADIUS.default,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '50',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    ...TYPOGRAPHY.bodyMd,
    color: colors.onSurface,
  },
  placeholderText: {
    color: colors.outline,
  },
  textInput: {
    flex: 1,
    ...TYPOGRAPHY.bodyMd,
    color: colors.onSurface,
    height: '100%',
  },
  textAreaBox: {
    height: 90,
    paddingVertical: 10,
  },
  textArea: {
    textAlignVertical: 'top',
  },
  errorText: {
    ...TYPOGRAPHY.bodySm,
    fontSize: 11,
    color: colors.error,
  },
  durationPillsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  durationPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '40',
  },
  durationPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  durationPillText: {
    ...TYPOGRAPHY.labelMd,
    color: colors.onSurfaceVariant,
    fontSize: 12,
  },
  durationPillTextActive: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
  // Submit Section
  submitSection: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  submitButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  submitButtonDisabled: {
    opacity: 0.65,
  },
  submitButtonText: {
    ...TYPOGRAPHY.labelMd,
    fontSize: 15,
    color: colors.onPrimary,
    fontWeight: '600',
  },
});
