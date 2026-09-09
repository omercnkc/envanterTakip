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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.containerMargin,
    paddingVertical: SPACING.sectionGap,
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.stackMd,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.stackLg,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.stackMd,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '40',
    ...SHADOWS.sm,
  },
  appLogoImage: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
  },
  title: {
    ...TYPOGRAPHY.headlineLg,
    color: COLORS.onSurface,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 300,
  },
  card: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '30',
    ...SHADOWS.sm,
    gap: SPACING.stackMd,
  },
  inputGroup: {
    gap: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onSurface,
  },
  requiredStar: {
    color: COLORS.error,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant + '60',
    paddingHorizontal: SPACING.md,
  },
  inputContainerError: {
    borderColor: COLORS.error,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  textInput: {
    flex: 1,
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.onSurface,
    height: '100%',
  },
  errorText: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.error,
    marginTop: 2,
  },
  successBox: {
    backgroundColor: COLORS.tertiaryFixedDim + '40',
    padding: SPACING.md,
    borderRadius: RADIUS.default,
    borderWidth: 1,
    borderColor: COLORS.tertiary,
  },
  successText: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.tertiary,
    textAlign: 'center',
    fontWeight: '500',
  },
  serverErrorBox: {
    backgroundColor: COLORS.errorContainer,
    padding: SPACING.md,
    borderRadius: RADIUS.default,
  },
  serverErrorText: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.onErrorContainer,
    textAlign: 'center',
  },
  submitButton: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xs,
    ...SHADOWS.md,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    ...TYPOGRAPHY.bodyLg,
    color: COLORS.onPrimary,
    fontWeight: '600',
  },
});
