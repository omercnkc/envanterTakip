import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const SCAN_BOX_WIDTH = Math.min(SCREEN_WIDTH * 0.8, 300);
export const SCAN_BOX_HEIGHT = 180;

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#0a0d14',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    zIndex: 10,
  },

  // Üst Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    backgroundColor: 'rgba(10, 13, 20, 0.4)',
  },
  topBarTitleContainer: {
    alignItems: 'center',
  },
  topBarTitle: {
    ...TYPOGRAPHY.headlineMd,
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 17,
  },
  topBarSubtitle: {
    ...TYPOGRAPHY.labelSm,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginTop: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  iconButtonActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#fbbf24',
  },

  // Orta Vizör Alanı
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerFrame: {
    width: SCAN_BOX_WIDTH,
    height: SCAN_BOX_HEIGHT,
    borderRadius: RADIUS.lg,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  scannerFrameSuccess: {
    borderColor: COLORS.tertiaryFixedDim,
    backgroundColor: 'rgba(78, 222, 163, 0.1)',
  },

  // Vizör Köşe İşaretleri (Bracket Markers)
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: COLORS.primaryFixed,
  },
  cornerSuccess: {
    borderColor: COLORS.tertiaryFixedDim,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: RADIUS.md,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: RADIUS.md,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: RADIUS.md,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: RADIUS.md,
  },

  // Lazer Tarama Çizgisi
  laserLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 2.5,
    backgroundColor: COLORS.primaryFixed,
    borderRadius: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 8,
  },
  laserLineSuccess: {
    backgroundColor: COLORS.tertiaryFixedDim,
    shadowColor: COLORS.tertiaryFixed,
  },

  // Alt Bilgilendirme Alanı
  bottomContainer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
    alignItems: 'center',
    backgroundColor: 'rgba(10, 13, 20, 0.45)',
    paddingTop: SPACING.md,
  },
  instructionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: SPACING.xs,
    gap: SPACING.xs,
  },
  instructionText: {
    ...TYPOGRAPHY.labelMd,
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  subInstructionText: {
    ...TYPOGRAPHY.bodySm,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontSize: 12,
  },

  // İzin İsteme & Hata Durumu
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    backgroundColor: '#0f172a',
  },
  permissionCard: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  permissionIconBox: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(70, 72, 212, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  permissionTitle: {
    ...TYPOGRAPHY.headlineMd,
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  permissionDescription: {
    ...TYPOGRAPHY.bodyMd,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  permissionButton: {
    width: '100%',
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  permissionButtonText: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.onPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  cancelButton: {
    paddingVertical: SPACING.sm,
  },
  cancelButtonText: {
    ...TYPOGRAPHY.bodySm,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
});
