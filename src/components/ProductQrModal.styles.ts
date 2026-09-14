import { StyleSheet, Dimensions } from 'react-native';
import { RADIUS, SPACING } from '../constants';
import { ThemeColors } from '../constants/colors';

const { width } = Dimensions.get('window');

export const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.72)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.lg,
    },
    backdrop: {
      ...StyleSheet.absoluteFill,
    },
    modalCard: {
      width: '100%',
      maxWidth: 420,
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: RADIUS.xl,
      borderWidth: 1,
      borderColor: colors.surfaceContainerHigh,
      padding: SPACING.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.3,
      shadowRadius: 28,
      elevation: 16,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.md,
    },
    headerTitleBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    iconBadge: {
      width: 36,
      height: 36,
      borderRadius: RADIUS.md,
      backgroundColor: colors.primaryContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.onBackground,
    },
    headerSubtitle: {
      fontSize: 12,
      color: colors.secondary,
      marginTop: 1,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: RADIUS.full,
      backgroundColor: colors.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Fiziksel Etiket Kartı Önizlemesi (Mockup)
    labelCard: {
      backgroundColor: '#ffffff',
      borderRadius: RADIUS.lg,
      borderWidth: 2,
      borderColor: '#4648d4',
      borderStyle: 'dashed',
      padding: SPACING.md,
      alignItems: 'center',
      marginVertical: SPACING.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 4,
    },
    labelBadge: {
      backgroundColor: '#f0f2fe',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: RADIUS.full,
      marginBottom: 10,
    },
    labelBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#4648d4',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    qrContainer: {
      padding: 10,
      backgroundColor: '#ffffff',
      borderRadius: RADIUS.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    labelProductName: {
      fontSize: 15,
      fontWeight: '700',
      color: '#0f172a',
      textAlign: 'center',
      marginBottom: 2,
    },
    labelBrandModel: {
      fontSize: 12,
      color: '#64748b',
      textAlign: 'center',
      marginBottom: 8,
    },
    labelMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      paddingTop: 6,
      borderTopWidth: 1,
      borderTopColor: '#f1f5f9',
      width: '100%',
    },
    labelMetaItem: {
      alignItems: 'center',
    },
    labelMetaLabel: {
      fontSize: 9,
      fontWeight: '600',
      color: '#94a3b8',
      textTransform: 'uppercase',
    },
    labelMetaValue: {
      fontSize: 11,
      fontWeight: '700',
      color: '#1e293b',
      marginTop: 1,
    },

    // Bilgilendirme Notu
    tipContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.surfaceContainerLow,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: RADIUS.md,
      marginVertical: SPACING.sm,
    },
    tipText: {
      fontSize: 11,
      color: colors.onSurfaceVariant,
      flex: 1,
      lineHeight: 16,
    },

    // Aksiyon Butonları
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: SPACING.sm,
    },
    printButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      paddingVertical: 13,
      borderRadius: RADIUS.md,
    },
    printButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.onPrimary,
    },
    shareButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: colors.surfaceContainerHigh,
      paddingVertical: 13,
      paddingHorizontal: 16,
      borderRadius: RADIUS.md,
    },
    shareButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.onBackground,
    },
  });
