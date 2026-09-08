import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.containerMargin,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.sm,
  },
  headerTitle: {
    ...TYPOGRAPHY.headlineLgMobile,
    color: COLORS.onBackground,
    fontWeight: '700',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.containerMargin,
    paddingTop: SPACING.sm,
    paddingBottom: 110, // Space for floating bottom navigation bar
    gap: SPACING.sectionGap - 8,
  },
  section: {
    gap: SPACING.stackSm + 4,
  },
  sectionLabel: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onSurfaceVariant,
  },
  sectionTitle: {
    ...TYPOGRAPHY.bodyLg,
    color: COLORS.onBackground,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainerHigh,
    paddingBottom: 8,
  },
  photoActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoActionButton: {
    flex: 1,
    height: 96,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '50',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...SHADOWS.sm,
  },
  photoActionText: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onSurface,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 140,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '50',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onSurfaceVariant,
  },
  requiredStar: {
    color: COLORS.error,
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
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: RADIUS.default,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '50',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  inputBoxError: {
    borderColor: COLORS.error,
  },
  priceInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  currencySymbol: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.outline,
    marginRight: 6,
    fontWeight: '600',
  },
  pickerBox: {
    height: 48,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: RADIUS.default,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '50',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.onSurface,
  },
  placeholderText: {
    color: COLORS.outline,
  },
  textInput: {
    flex: 1,
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.onSurface,
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
    color: COLORS.error,
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
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '40',
  },
  durationPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  durationPillText: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onSurfaceVariant,
    fontSize: 12,
  },
  durationPillTextActive: {
    color: COLORS.onPrimary,
    fontWeight: '600',
  },
  uploadDashedBox: {
    height: 90,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.outlineVariant + '80',
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  uploadDashedText: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.onSurfaceVariant,
  },
  invoiceUploadedBox: {
    height: 48,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.default,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  invoiceUploadedText: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.primary,
    fontWeight: '500',
  },

  // Submit Section
  submitSection: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  submitButton: {
    height: 52,
    backgroundColor: COLORS.primary,
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
    color: COLORS.onPrimary,
    fontWeight: '600',
  },
});
