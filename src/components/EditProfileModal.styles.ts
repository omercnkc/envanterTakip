import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.containerMargin,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    ...SHADOWS.lg,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
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

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  title: {
    ...TYPOGRAPHY.headlineMd,
    color: COLORS.onBackground,
    fontWeight: '700',
  },
  closeIconButton: {
    padding: 4,
  },
  subtitle: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.md,
  },
  avatarPickerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarWrapper: {
    position: 'relative',
    width: 86,
    height: 86,
  },
  avatarBox: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 43,
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.onPrimaryContainer,
  },
  avatarCameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.surfaceContainerLowest,
    ...SHADOWS.sm,
  },
  avatarHintText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 8,
  },
  form: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onSurfaceVariant,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHigh,
    paddingHorizontal: SPACING.md,
    height: 48,
    gap: SPACING.sm,
  },
  inputWrapperDisabled: {
    backgroundColor: COLORS.surfaceContainer,
    borderColor: COLORS.surfaceContainerHigh,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.onBackground,
    padding: 0,
  },
  inputDisabled: {
    color: COLORS.onSurfaceVariant,
  },
  errorText: {
    ...TYPOGRAPHY.labelSm,
    color: COLORS.error,
    marginTop: 2,
  },
  helperText: {
    ...TYPOGRAPHY.labelSm,
    color: COLORS.outline,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.onSurfaceVariant,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.onPrimary,
    fontWeight: '700',
  },
});
