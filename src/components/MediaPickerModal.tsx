import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Camera, Image as ImageIcon, FileText, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../constants';
import { useSwipeDownToClose } from '../hooks/useSwipeDownToClose';
import { useTranslation } from '../i18n';
import { styles } from './MediaPickerModal.styles';

interface MediaPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCamera: () => void;
  onSelectGallery: () => void;
  onSelectDocument?: () => void;
  title?: string;
  subtitle?: string;
  includeDocumentOption?: boolean;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  visible,
  onClose,
  onSelectCamera,
  onSelectGallery,
  onSelectDocument,
  title,
  subtitle,
  includeDocumentOption = false,
}) => {
  const { language } = useTranslation();
  const { panHandlers, translateY, handleClose } = useSwipeDownToClose({
    onClose,
    visible,
  });

  const displayTitle = title || (language === 'tr' ? 'Görsel Ekle' : 'Add Media');
  const displaySubtitle = subtitle || (language === 'tr' ? 'Fotoğraf çekin veya cihazınızdan seçin' : 'Take a photo or choose from device');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.backdropTouchable} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.modalContent, { transform: [{ translateY }] }]}>
          <View {...panHandlers} style={styles.handleContainer}>
            <View style={styles.handleBar} />
          </View>
          <Text style={styles.title}>{displayTitle}</Text>

          <Text style={styles.subtitle}>{displaySubtitle}</Text>

          <View style={styles.optionsList}>
            {/* 1. Kamera İle Çek */}
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                onClose();
                setTimeout(() => {
                  onSelectCamera();
                }, 100);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconBox}>
                <Camera size={22} color={COLORS.primary} />
              </View>
              <View style={styles.optionTextBox}>
                <Text style={styles.optionTitle}>
                  {language === 'tr' ? 'Kamera ile Çek' : 'Take Photo'}
                </Text>
                <Text style={styles.optionDesc}>
                  {language === 'tr' ? 'Anlık fotoğraf çekin' : 'Take a new photo with camera'}
                </Text>
              </View>
              <ChevronRight size={18} color={COLORS.outline} />
            </TouchableOpacity>

            {/* 2. Galeriden Seç */}
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                onClose();
                setTimeout(() => {
                  onSelectGallery();
                }, 100);
              }}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.optionIconBox,
                  { backgroundColor: COLORS.tertiaryContainer + '30' },
                ]}
              >
                <ImageIcon size={22} color={COLORS.tertiary} />
              </View>
              <View style={styles.optionTextBox}>
                <Text style={styles.optionTitle}>
                  {language === 'tr' ? 'Galeriden Seç' : 'Choose from Gallery'}
                </Text>
                <Text style={styles.optionDesc}>
                  {language === 'tr' ? 'Albümünüzden fotoğraf yükleyin' : 'Upload photo from your library'}
                </Text>
              </View>
              <ChevronRight size={18} color={COLORS.outline} />
            </TouchableOpacity>

            {/* 3. Belge / PDF Seç (Fatura için) */}
            {includeDocumentOption && onSelectDocument && (
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => {
                  onClose();
                  setTimeout(() => {
                    onSelectDocument();
                  }, 100);
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.optionIconBox,
                    { backgroundColor: COLORS.warningContainer },
                  ]}
                >
                  <FileText size={22} color={COLORS.warning} />
                </View>
                <View style={styles.optionTextBox}>
                  <Text style={styles.optionTitle}>
                    {language === 'tr' ? 'Belge / PDF Seç' : 'Choose Document / PDF'}
                  </Text>
                  <Text style={styles.optionDesc}>
                    {language === 'tr' ? 'PDF veya taranmış fatura belgesi' : 'PDF or scanned invoice document'}
                  </Text>
                </View>
                <ChevronRight size={18} color={COLORS.outline} />
              </TouchableOpacity>
            )}
          </View>

          {/* Vazgeç Butonu */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>
              {language === 'tr' ? 'Vazgeç' : 'Cancel'}
            </Text>
          </TouchableOpacity>

        </Animated.View>
      </View>
    </Modal>
  );
};
