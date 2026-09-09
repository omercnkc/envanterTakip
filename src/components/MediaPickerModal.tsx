import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Camera, Image as ImageIcon, FileText, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../constants';
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
  title = 'Görsel Ekle',
  subtitle = 'Fotoğraf çekin veya cihazınızdan seçin',
  includeDocumentOption = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdropTouchable} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <View style={styles.handleBar} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.optionsList}>
            {/* 1. Kamera İle Çek */}
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                onClose();
                onSelectCamera();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconBox}>
                <Camera size={22} color={COLORS.primary} />
              </View>
              <View style={styles.optionTextBox}>
                <Text style={styles.optionTitle}>Kamera ile Çek</Text>
                <Text style={styles.optionDesc}>Anlık fotoğraf çekin</Text>
              </View>
              <ChevronRight size={18} color={COLORS.outline} />
            </TouchableOpacity>

            {/* 2. Galeriden Seç */}
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                onClose();
                onSelectGallery();
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
                <Text style={styles.optionTitle}>Galeriden Seç</Text>
                <Text style={styles.optionDesc}>Albümünüzden fotoğraf yükleyin</Text>
              </View>
              <ChevronRight size={18} color={COLORS.outline} />
            </TouchableOpacity>

            {/* 3. Belge / PDF Seç (Fatura için) */}
            {includeDocumentOption && onSelectDocument && (
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => {
                  onClose();
                  onSelectDocument();
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
                  <Text style={styles.optionTitle}>Belge / PDF Seç</Text>
                  <Text style={styles.optionDesc}>PDF veya taranmış fatura belgesi</Text>
                </View>
                <ChevronRight size={18} color={COLORS.outline} />
              </TouchableOpacity>
            )}
          </View>

          {/* Vazgeç Butonu */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Vazgeç</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
