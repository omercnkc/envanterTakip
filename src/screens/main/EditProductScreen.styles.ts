import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.containerMargin,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant + '30',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.headlineMd,
    color: COLORS.onSurface,
    fontWeight: '700',
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: SPACING.containerMargin,
    paddingTop: SPACING.sm,
    paddingBottom: 100,
    gap: SPACING.sectionGap,
  },
  section: {
    gap: SPACING.stackSm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.bodyLg,
    fontWeight: '600',
    color: COLORS.onBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainerHighest,
    paddingBottom: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  formGroup: {
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  twoColumnItem: {
    flex: 1,
  },
  label: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onSurfaceVariant,
  },
  requiredStar: {
    color: COLORS.error,
  },
  input: {
    height: 48,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '60',
    borderRadius: RADIUS.default,
    paddingHorizontal: SPACING.md,
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.onSurface,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  priceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '60',
    borderRadius: RADIUS.default,
    paddingHorizontal: SPACING.md,
  },
  currencyPrefix: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.outline,
    marginRight: SPACING.xs,
    fontWeight: '600',
  },
  priceTextInput: {
    flex: 1,
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.onSurface,
    height: '100%',
  },
  pickerButton: {
    height: 48,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '60',
    borderRadius: RADIUS.default,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerButtonText: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.onSurface,
  },
  pickerPlaceholderText: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.outline,
  },
  textArea: {
    height: 90,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '60',
    borderRadius: RADIUS.default,
    padding: SPACING.md,
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.onSurface,
    textAlignVertical: 'top',
  },
  errorText: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.error,
  },
  fixedBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.containerMargin,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.outlineVariant + '30',
  },
  submitButton: {
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
