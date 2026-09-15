import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CameraView,
  useCameraPermissions,
  CameraType,
} from 'expo-camera';
import {
  X,
  Zap,
  ZapOff,
  SwitchCamera,
  Check,
  RotateCcw,
  Camera as CameraIcon,
} from 'lucide-react-native';

import { COLORS } from '../constants';
import { useTranslation } from '../i18n';
import { styles } from './AppCameraModal.styles';

interface AppCameraModalProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (uri: string) => void;
  title?: string;
  subtitle?: string;
}

export const AppCameraModal: React.FC<AppCameraModalProps> = ({
  visible,
  onClose,
  onCapture,
  title,
  subtitle,
}) => {
  const { language } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [torch, setTorch] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);

  const displayTitle = title || (language === 'tr' ? 'Fotoğraf Çek' : 'Take Photo');
  const displaySubtitle = subtitle || (language === 'tr' ? 'Ürün veya faturanızı çerçeveye hizalayın' : 'Align item or receipt within frame');

  const cameraRef = useRef<any>(null);

  const handleClose = () => {
    setCapturedUri(null);
    setIsCapturing(false);
    onClose();
  };

  const handleTakePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });

      if (photo?.uri) {
        setCapturedUri(photo.uri);
      }
    } catch (err) {
      console.error('Fotoğraf çekme hatası:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleConfirmPhoto = () => {
    if (capturedUri) {
      const uri = capturedUri;
      handleClose();
      onCapture(uri);
    }
  };

  const handleRetake = () => {
    setCapturedUri(null);
  };

  // İzin verilmediyse
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
            ? 'Ürün ve fatura fotoğrafı çekebilmek için uygulamanın kameraya erişmesine izin vermelisiniz.'
            : 'You must grant camera access to take photos of items and receipts.'}
        </Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
          activeOpacity={0.8}
        >
          <Text style={styles.permissionButtonText}>
            {language === 'tr' ? 'Kamera İzni Ver' : 'Grant Camera Access'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleClose}
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
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.modalContainer}>
        {!permission?.granted ? (
          renderPermissionState()
        ) : capturedUri ? (
          /* Fotoğraf Önizleme & Onay Ekranı */
          <View style={styles.previewContainer}>
            <Image source={{ uri: capturedUri }} style={styles.previewImage} />
            <SafeAreaView style={styles.previewOverlay} edges={['top', 'bottom']}>
              <View style={styles.topBar}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleRetake}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <RotateCcw size={20} color="#ffffff" />
                </TouchableOpacity>

                <View style={styles.topBarTitleContainer}>
                  <Text style={styles.topBarTitle}>
                    {language === 'tr' ? 'Fotoğrafı Onayla' : 'Confirm Photo'}
                  </Text>
                  <Text style={styles.topBarSubtitle}>
                    {language === 'tr' ? 'Görsel net ve okunabilir mi?' : 'Is the photo clear and readable?'}
                  </Text>
                </View>

                <View style={styles.placeholderSideButton} />
              </View>

              <View style={styles.previewBottomBar}>
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={handleRetake}
                  activeOpacity={0.7}
                >
                  <RotateCcw size={18} color="#ffffff" />
                  <Text style={styles.retakeButtonText}>
                    {language === 'tr' ? 'Tekrar Çek' : 'Retake'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmPhoto}
                  activeOpacity={0.8}
                >
                  <Check size={20} color="#ffffff" />
                  <Text style={styles.confirmButtonText}>
                    {language === 'tr' ? 'Bu Fotoğrafı Kullan' : 'Use This Photo'}
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        ) : (
          /* Canlı Kamera Vizörü */
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            enableTorch={torch}
          >
            <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
              {/* Üst Kontrol Barı */}
              <View style={styles.topBar}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleClose}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <X size={22} color="#ffffff" />
                </TouchableOpacity>

                <View style={styles.topBarTitleContainer}>
                  <Text style={styles.topBarTitle}>{displayTitle}</Text>
                  <Text style={styles.topBarSubtitle}>{displaySubtitle}</Text>
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

              {/* Alt Deklanşör Barı */}
              <View style={styles.bottomBar}>
                {/* Kamera Çevir (Ön/Arka) */}
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() =>
                    setFacing((prev) => (prev === 'back' ? 'front' : 'back'))
                  }
                  activeOpacity={0.7}
                >
                  <SwitchCamera size={22} color="#ffffff" />
                </TouchableOpacity>

                {/* Deklanşör Butonu */}
                <TouchableOpacity
                  style={styles.shutterOuter}
                  onPress={handleTakePicture}
                  disabled={isCapturing}
                  activeOpacity={0.7}
                >
                  {isCapturing ? (
                    <ActivityIndicator size="small" color="#4648d4" />
                  ) : (
                    <View style={styles.shutterInner} />
                  )}
                </TouchableOpacity>

                {/* Simetri için boş alan */}
                <View style={styles.placeholderSideButton} />
              </View>
            </SafeAreaView>
          </CameraView>
        )}
      </View>
    </Modal>
  );
};
