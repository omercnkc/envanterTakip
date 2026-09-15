import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
  BarcodeType,
} from 'expo-camera';
import {
  X,
  Zap,
  ZapOff,
  ScanBarcode,
  CheckCircle2,
  Camera as CameraIcon,
} from 'lucide-react-native';

import { COLORS } from '../constants';
import { useTranslation } from '../i18n';
import { permissionHelper } from '../utils/permissionHelper';
import {
  styles,
  SCAN_BOX_HEIGHT,
} from './BarcodeScannerModal.styles';

interface BarcodeScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScan: (scannedData: string) => void;
}

const SUPPORTED_BARCODE_TYPES: BarcodeType[] = [
  'qr',
  'ean13',
  'ean8',
  'code128',
  'code39',
  'code93',
  'upc_a',
  'upc_e',
  'itf14',
  'codabar',
  'pdf417',
  'aztec',
  'datamatrix',
];

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  visible,
  onClose,
  onScan,
}) => {
  const { language } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState<boolean>(false);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const isScanningLocked = useRef<boolean>(false);

  // Lazer çizgisi dikey hareket animasyonu
  const laserAnim = useRef(new Animated.Value(0)).current;

  // Lazer animasyon döngüsü
  const startLaserAnimation = useCallback(() => {
    laserAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: SCAN_BOX_HEIGHT - 12,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [laserAnim]);

  useEffect(() => {
    if (visible) {
      setHasScanned(false);
      isScanningLocked.current = false;
      setTorch(false);
      startLaserAnimation();
    } else {
      laserAnim.stopAnimation();
      setTorch(false);
    }
  }, [visible, startLaserAnimation, laserAnim]);

  // Barkod / QR Algılama
  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (isScanningLocked.current || !result.data) return;

    const trimmed = result.data.trim();
    if (!trimmed) return;

    isScanningLocked.current = true;
    setHasScanned(true);

    // 400ms başarı görseli gösterdikten sonra modalı kapatıp değeri aktar
    setTimeout(() => {
      onScan(trimmed);
      onClose();
    }, 450);
  };

  // İzin henüz kontrol edilmedi veya verilmediyse
  const renderPermissionState = () => (
    <View style={styles.permissionContainer}>
      <View style={styles.permissionCard}>
        <View style={styles.permissionIconBox}>
          <CameraIcon size={32} color={COLORS.primary} />
        </View>

        <Text style={styles.permissionTitle}>
          {language === 'tr' ? 'Kamera İzni Gerekiyor' : 'Camera Access Required'}
        </Text>
        <Text style={styles.permissionDescription}>
          {language === 'tr'
            ? 'Ürün kutusu veya fatura üzerindeki seri numarasını otomatik okumak için kamera iznine ihtiyaç duyuyoruz.'
            : 'Camera permission is required to automatically scan serial numbers on boxes or invoices.'}
        </Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={async () => {
            await permissionHelper.requestPermissionWithModal('camera');
            requestPermission();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.permissionButtonText}>
            {language === 'tr' ? 'Kamera İzni Ver' : 'Grant Camera Access'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>
            {language === 'tr' ? 'Vazgeç' : 'Cancel'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="#0a0d14" />
      <View style={styles.modalContainer}>
        {!permission?.granted ? (
          renderPermissionState()
        ) : (
          <CameraView
            style={styles.camera}
            facing="back"
            enableTorch={torch}
            barcodeScannerSettings={{
              barcodeTypes: SUPPORTED_BARCODE_TYPES,
            }}
            onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
          >
            {/* Ön Katman / HUD Arayüzü */}
            <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
              {/* Üst Bar */}
              <View style={styles.topBar}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <X size={22} color="#ffffff" />
                </TouchableOpacity>

                <View style={styles.topBarTitleContainer}>
                  <Text style={styles.topBarTitle}>
                    {language === 'tr' ? 'Barkod / QR Tarayıcı' : 'Barcode / QR Scanner'}
                  </Text>
                  <Text style={styles.topBarSubtitle}>
                    {language === 'tr' ? 'Seri No Otomatik Okuma' : 'Auto-Read Serial Number'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.iconButton, torch && styles.iconButtonActive]}
                  onPress={() => setTorch((prev) => !prev)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {torch ? (
                    <Zap size={22} color="#ffffff" />
                  ) : (
                    <ZapOff size={22} color="rgba(255, 255, 255, 0.8)" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Orta Vizör (Viewfinder) */}
              <View style={styles.centerContainer}>
                <View
                  style={[
                    styles.scannerFrame,
                    hasScanned && styles.scannerFrameSuccess,
                  ]}
                >
                  {/* Köşe Vurguları */}
                  <View
                    style={[
                      styles.corner,
                      styles.cornerTL,
                      hasScanned && styles.cornerSuccess,
                    ]}
                  />
                  <View
                    style={[
                      styles.corner,
                      styles.cornerTR,
                      hasScanned && styles.cornerSuccess,
                    ]}
                  />
                  <View
                    style={[
                      styles.corner,
                      styles.cornerBL,
                      hasScanned && styles.cornerSuccess,
                    ]}
                  />
                  <View
                    style={[
                      styles.corner,
                      styles.cornerBR,
                      hasScanned && styles.cornerSuccess,
                    ]}
                  />

                  {/* Lazer Tarama Çizgisi veya Başarılı İkonu */}
                  {hasScanned ? (
                    <CheckCircle2 size={46} color={COLORS.tertiaryFixedDim} />
                  ) : (
                    <Animated.View
                      style={[
                        styles.laserLine,
                        {
                          transform: [{ translateY: laserAnim }],
                        },
                      ]}
                    />
                  )}
                </View>
              </View>

              {/* Alt Bilgilendirme */}
              <View style={styles.bottomContainer}>
                <View style={styles.instructionBadge}>
                  <ScanBarcode size={16} color={COLORS.primaryFixed} />
                  <Text style={styles.instructionText}>
                    {hasScanned
                      ? (language === 'tr' ? 'Seri numarası okundu!' : 'Serial number scanned!')
                      : (language === 'tr' ? 'Barkodu çerçeve içine hizalayın' : 'Align barcode within frame')}
                  </Text>
                </View>
                <Text style={styles.subInstructionText}>
                  {language === 'tr'
                    ? 'Kutu veya garanti belgesi üzerindeki barkod algılandığında seri numarası otomatik doldurulur.'
                    : 'Serial number is automatically filled once the barcode is detected.'}
                </Text>
              </View>
            </SafeAreaView>
          </CameraView>
        )}
      </View>
    </Modal>
  );
};
