import { StyleSheet } from 'react-native';
import { LIGHT_COLORS, ThemeColors } from '../../constants/colors';
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../constants';

export const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
      backgroundColor: colors.background,
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
    scrollContent: {
      paddingHorizontal: SPACING.containerMargin,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.xxl + 24,
      gap: SPACING.stackLg,
    },

    // Hero Profil Kartı
    profileHeroCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: RADIUS.xl,
      borderWidth: 1,
      borderColor: colors.surfaceContainerHigh,
      padding: 16,
      ...SHADOWS.sm,
    },
    profileAvatarBox: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 4,
    },
    profileAvatarText: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.onPrimary,
      letterSpacing: 0.5,
    },
    profileInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    profileName: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.onSurface,
      letterSpacing: -0.2,
    },
    profileEmail: {
      fontSize: 13,
      color: colors.onSurfaceVariant,
      marginTop: 2,
    },
    profileStatusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 5,
    },
    statusIndicatorDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: '#10B981',
    },
    statusIndicatorText: {
      fontSize: 11,
      fontWeight: '600',
      color: '#10B981',
    },
    profileEditPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: RADIUS.full,
      backgroundColor: colors.primaryContainer,
    },
    profileEditText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.onPrimaryContainer,
    },

    // Bölümler ve Başlıklar
    section: {
      gap: 8,
    },
    sectionHeaderTitle: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.onSurfaceVariant,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      paddingHorizontal: 4,
    },

    // Kart Yapısı
    card: {
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: RADIUS.xl,
      borderWidth: 1,
      borderColor: colors.surfaceContainerHigh,
      overflow: 'hidden',
      ...SHADOWS.sm,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 13,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceContainerHigh,
    },
    cardRowNoBorder: {
      borderBottomWidth: 0,
    },

    // Satır İçeriği (İkon Kutucuğu + Metinler)
    rowLeftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 13,
      flex: 1,
      marginRight: 12,
    },
    iconTile: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowTexts: {
      flex: 1,
    },
    rowLabel: {
      fontSize: 14.5,
      fontWeight: '600',
      color: colors.onSurface,
      letterSpacing: -0.1,
    },
    rowSubtitle: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      marginTop: 2,
      lineHeight: 16,
    },
    rowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    rowValue: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.secondary,
    },

    // Tema Seçici Bölümü
    themeSelectorContainer: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceContainerHigh,
      gap: 12,
    },
    themeHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    themeCurrentLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
    },
    systemThemeInfoBox: {
      backgroundColor: colors.surfaceContainerLow,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: colors.surfaceContainerHigh,
    },
    systemThemeInfoText: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      lineHeight: 16,
    },
    // Biyometrik Kilit Süresi Bölümü
    biometricTimeoutContainer: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: colors.surfaceContainerLow,
      borderBottomWidth: 0,
      gap: 10,
    },
    biometricTimeoutHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    biometricTimeoutTitle: {
      fontSize: 12.5,
      fontWeight: '600',
      color: colors.onSurface,
      letterSpacing: -0.1,
    },
    biometricTimeoutPillsRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 2,
    },
    biometricTimeoutPill: {
      flex: 1,
      paddingVertical: 9,
      borderRadius: RADIUS.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: colors.surfaceContainerHigh,
      backgroundColor: colors.surfaceContainerLowest,
    },
    biometricTimeoutPillActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryContainer,
    },
    biometricTimeoutPillText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.onSurfaceVariant,
    },
    biometricTimeoutPillTextActive: {
      color: colors.onPrimaryContainer,
      fontWeight: '700',
    },
    biometricTimeoutHint: {
      fontSize: 11.5,
      color: colors.onSurfaceVariant,
      lineHeight: 16,
    },

    // Alt Footer Alanı
    footer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 8,
      paddingBottom: 16,
      gap: 6,
    },
    footerSecurityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    footerSecurityText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.outline,
    },
    footerAppVersion: {
      fontSize: 11,
      color: colors.outlineVariant,
      letterSpacing: 0.2,
    },
  });

export const styles = getStyles(LIGHT_COLORS);
