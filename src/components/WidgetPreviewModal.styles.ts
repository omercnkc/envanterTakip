import { StyleSheet } from 'react-native';
import { ThemeColors, SPACING, RADIUS, SHADOWS } from '../constants';

export const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RADIUS.xl,
      borderTopRightRadius: RADIUS.xl,
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.xl,
      maxHeight: '90%',
    },
    handleBar: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.surfaceContainerHighest,
      alignSelf: 'center',
      marginBottom: SPACING.md,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.lg,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    headerIconBox: {
      width: 42,
      height: 42,
      borderRadius: RADIUS.md,
      backgroundColor: colors.primary + '18',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.onBackground,
    },
    headerSubtitle: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      marginTop: 2,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: RADIUS.full,
      backgroundColor: colors.surfaceContainerHigh,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Boyut Seçici (2x2 Kompakt vs 4x2 Geniş)
    sizeSelectorRow: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceContainerHigh,
      borderRadius: RADIUS.full,
      padding: 3,
      marginBottom: SPACING.lg,
    },
    sizeTab: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      borderRadius: RADIUS.full,
    },
    sizeTabActive: {
      backgroundColor: colors.primary,
    },
    sizeTabText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.onSurfaceVariant,
    },
    sizeTabTextActive: {
      color: colors.onPrimary,
      fontWeight: '700',
    },

    // Simülasyon Alanı (Telefon Masaüstü Görünümü)
    phoneDeskCanvas: {
      backgroundColor: '#1e293b',
      borderRadius: RADIUS.xl,
      padding: SPACING.lg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.lg,
      borderWidth: 1,
      borderColor: '#334155',
    },
    phoneDeskLabel: {
      fontSize: 11,
      color: '#94a3b8',
      marginBottom: SPACING.md,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    // 2x2 Kompakt Widget Kartı
    widgetCard2x2: {
      width: 175,
      height: 175,
      backgroundColor: '#ffffff',
      borderRadius: 22,
      padding: 14,
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 6,
    },

    // 4x2 Geniş Widget Kartı
    widgetCard4x2: {
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: 22,
      padding: 16,
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 6,
      minHeight: 140,
    },

    // Widget İç Elemanları
    widgetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    widgetAppBrand: {
      fontSize: 11,
      fontWeight: '700',
      color: '#4648d4',
    },
    widgetActiveCount: {
      fontSize: 9.5,
      color: '#64748b',
      marginTop: 1,
    },
    widgetStatusBadge: {
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: RADIUS.full,
    },
    widgetStatusBadgeText: {
      fontSize: 9.5,
      fontWeight: '700',
    },

    widgetBody: {
      marginVertical: 4,
    },
    widgetProductName: {
      fontSize: 14,
      fontWeight: '800',
      color: '#0f172a',
    },
    widgetProductMeta: {
      fontSize: 11,
      color: '#64748b',
      marginTop: 2,
    },

    widgetFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f8fafc',
      borderRadius: RADIUS.md,
      paddingHorizontal: 8,
      paddingVertical: 5,
    },
    widgetDaysText: {
      fontSize: 11,
      fontWeight: '700',
    },
    widgetDateText: {
      fontSize: 10,
      color: '#64748b',
    },

    // Kurulum Adımları Rehberi
    guideSection: {
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: RADIUS.lg,
      borderWidth: 1,
      borderColor: colors.surfaceContainerHigh,
      padding: SPACING.md,
      marginBottom: SPACING.lg,
      gap: 10,
    },
    guideTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.onBackground,
      marginBottom: 2,
    },
    guideStepRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    stepBadge: {
      width: 20,
      height: 20,
      borderRadius: RADIUS.full,
      backgroundColor: colors.primary + '18',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 1,
    },
    stepBadgeText: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.primary,
    },
    stepText: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      flex: 1,
      lineHeight: 17,
    },
    buildNoteBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.tertiary + '12',
      borderRadius: RADIUS.md,
      padding: 10,
      marginTop: 4,
    },
    buildNoteText: {
      fontSize: 11,
      color: colors.tertiary,
      flex: 1,
      lineHeight: 15,
      fontWeight: '600',
    },

    // Kapat Butonu
    doneButton: {
      backgroundColor: colors.primary,
      borderRadius: RADIUS.lg,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    doneButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.onPrimary,
    },
  });
