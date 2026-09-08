import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.containerMargin,
    paddingVertical: SPACING.stackSm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainerHigh,
  },
  backButton: {
    padding: 6,
    borderRadius: RADIUS.full,
  },
  headerTitle: {
    ...TYPOGRAPHY.headlineMd,
    color: COLORS.onBackground,
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
    paddingBottom: 100, // Space for fixed bottom bar
    gap: SPACING.sectionGap - 8,
  },
  section: {
    gap: SPACING.stackSm + 4,
  },
  sectionTitle: {
    ...TYPOGRAPHY.bodyLg,
    color: COLORS.onBackground,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainerHigh,
    paddingBottom: 8,
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
  fixedBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.containerMargin,
    paddingVertical: 14,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceContainerHigh,
    ...SHADOWS.md,
  },
  submitButton: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
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
