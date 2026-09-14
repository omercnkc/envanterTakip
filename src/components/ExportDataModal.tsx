import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { FileSpreadsheet, FileCode, Share2, X } from 'lucide-react-native';
import { useSwipeDownToClose } from '../hooks/useSwipeDownToClose';


import { COLORS } from '../constants';
import { useInventory } from '../context/InventoryContext';
import { useAlert } from '../context/AlertContext';
import { exportService } from '../api/exportService';
import { styles } from './ExportDataModal.styles';

interface ExportDataModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({
  visible,
  onClose,
}) => {
  const { products } = useInventory();
  const { showWarning, showError, showSuccess } = useAlert();
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json'>('csv');
  const [loading, setLoading] = useState(false);

  const { panHandlers, translateY, handleClose } = useSwipeDownToClose({
    onClose,
    visible,
  });

  const productCount = products.length;

  const handleExport = async () => {
    if (productCount === 0) {
      showWarning(
        'Dışa aktarmak için en az 1 ürün kaydınızın bulunması gerekir. Lütfen önce ürün ekleyin.',
        'Kayıtlı Ürün Yok'
      );
      return;
    }

    setLoading(true);
    try {
      const result = await exportService.exportAndShare({
        format: selectedFormat,
        products,
      });

      if (!result.success) {
        showError(result.error || 'Bir sorun oluştu.', 'Dışa Aktarma Başarısız');
        return;
      }

      showSuccess('Envanter verisi başarıyla dışa aktarıldı.', 'Başarılı');
      onClose();
    } catch {
      showError('Dosya oluşturulurken beklenmedik bir hata meydana geldi.', 'Hata');
    } finally {
      setLoading(false);
    }
  };

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

          <View style={styles.headerRow}>
            <Text style={styles.title}>Verileri Dışa Aktar</Text>
            <TouchableOpacity
              style={styles.closeIconButton}
              onPress={handleClose}
              disabled={loading}
              activeOpacity={0.7}
            >
              <X size={20} color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Envanterinizi istediğiniz formatta dışa aktarın ve paylaşın
          </Text>

          {/* Özet Kartı */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Dışa aktarılacak toplam varlık</Text>
            <View style={styles.summaryBadge}>
              <Text style={styles.summaryBadgeText}>{productCount} Ürün</Text>
            </View>
          </View>

          {/* Format Seçim Listesi */}
          <View style={styles.formatList}>
            {/* 1. CSV / Excel Formatı */}
            <TouchableOpacity
              style={[
                styles.formatCard,
                selectedFormat === 'csv' && styles.formatCardSelected,
              ]}
              onPress={() => setSelectedFormat('csv')}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.formatIconBox,
                  selectedFormat === 'csv' && styles.formatIconBoxSelected,
                ]}
              >
                <FileSpreadsheet
                  size={24}
                  color={selectedFormat === 'csv' ? COLORS.primary : COLORS.outline}
                />
              </View>
              <View style={styles.formatInfo}>
                <View style={styles.formatTitleRow}>
                  <Text style={styles.formatTitle}>Excel Tablosu (.csv)</Text>
                  <View style={styles.badgePill}>
                    <Text style={styles.badgePillText}>ÖNERİLEN</Text>
                  </View>
                </View>
                <Text style={styles.formatDescription}>
                  Excel & Google Sheets uyumlu. Garanti bitişleri, fiyatlar ve kategori bilgilerini içerir.
                </Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  selectedFormat === 'csv' && styles.radioCircleSelected,
                ]}
              >
                {selectedFormat === 'csv' && <View style={styles.radioInnerDot} />}
              </View>
            </TouchableOpacity>

            {/* 2. JSON Formatı */}
            <TouchableOpacity
              style={[
                styles.formatCard,
                selectedFormat === 'json' && styles.formatCardSelected,
              ]}
              onPress={() => setSelectedFormat('json')}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.formatIconBox,
                  selectedFormat === 'json' && styles.formatIconBoxSelected,
                ]}
              >
                <FileCode
                  size={24}
                  color={selectedFormat === 'json' ? COLORS.primary : COLORS.outline}
                />
              </View>
              <View style={styles.formatInfo}>
                <View style={styles.formatTitleRow}>
                  <Text style={styles.formatTitle}>JSON Veri Dosyası (.json)</Text>
                </View>
                <Text style={styles.formatDescription}>
                  Yedekleme ve sistemler arası veri aktarımı için yapılandırılmış ham veri formatı.
                </Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  selectedFormat === 'json' && styles.radioCircleSelected,
                ]}
              >
                {selectedFormat === 'json' && <View style={styles.radioInnerDot} />}
              </View>
            </TouchableOpacity>
          </View>

          {/* Butonlar */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Vazgeç</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.exportButton, loading && styles.exportButtonDisabled]}
              onPress={handleExport}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.onPrimary} />
              ) : (
                <>
                  <Share2 size={18} color={COLORS.onPrimary} />
                  <Text style={styles.exportButtonText}>Dışa Aktar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>

  );
};
