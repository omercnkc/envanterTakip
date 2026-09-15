import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { QrCode, Printer, Share2, X, Info } from 'lucide-react-native';

import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useAlert } from '../context/AlertContext';
import { useTranslation } from '../i18n';
import { formatDateTurkish } from '../utils/warrantyCalculator';
import { getStyles } from './ProductQrModal.styles';

interface ProductQrModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
}

export const ProductQrModal: React.FC<ProductQrModalProps> = ({
  visible,
  product,
  onClose,
}) => {
  const { colors } = useTheme();
  const { showSuccess, showError } = useAlert();
  const { language } = useTranslation();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [isProcessing, setIsProcessing] = useState(false);

  if (!product) return null;

  // Standart deeplink formatı (Hem uygulama içi hem telefon kamerası için)
  const qrData = `envantertakip://product/${product.id}`;
  const brandModelText = [product.brand, product.model].filter(Boolean).join(' • ');

  // Yazdırılabilir Etiket HTML Şablonu (80mm x 50mm Standart Yapışkanlı Etiket Boyutu)
  const generateLabelHtml = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=${encodeURIComponent(
      qrData
    )}`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page { size: 80mm 50mm; margin: 0; }
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 10px 14px;
            width: 80mm;
            height: 50mm;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            border: 2px dashed #4648d4;
            border-radius: 8px;
            background: #ffffff;
            color: #0f172a;
          }
          .info {
            flex: 1;
            padding-right: 12px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .badge {
            display: inline-block;
            font-size: 8px;
            font-weight: 800;
            color: #4648d4;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          .title {
            font-size: 13px;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 2px;
            color: #0f172a;
            max-width: 44mm;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .subtitle {
            font-size: 10px;
            color: #64748b;
            margin-bottom: 6px;
            max-width: 44mm;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .detail {
            font-size: 9px;
            color: #334155;
            margin-bottom: 2px;
          }
          .detail strong {
            color: #0f172a;
          }
          .footer {
            font-size: 7.5px;
            color: #94a3b8;
            margin-top: 6px;
            line-height: 1.2;
          }
          .qr-box {
            width: 26mm;
            height: 26mm;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 2px;
          }
          .qr-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <div class="info">
          <div class="badge">🛡️ ${language === 'tr' ? 'DİJİTAL ENVANTER ETİKETİ' : 'DIGITAL ASSET TAG'}</div>
          <div class="title">${product.name}</div>
          <div class="subtitle">${brandModelText || (language === 'tr' ? 'Genel Cihaz' : 'Home Device')}</div>
          <div class="detail"><strong>${language === 'tr' ? 'Seri No:' : 'Serial No:'}</strong> ${product.serial_number || (language === 'tr' ? 'Kayıtsız' : 'N/A')}</div>
          <div class="detail"><strong>${language === 'tr' ? 'Garanti Bitiş:' : 'Warranty Ends:'}</strong> ${formatDateTurkish(product.warranty_end_date)}</div>
          <div class="footer">${language === 'tr' ? 'Kamerayla okutarak fatura ve garanti detaylarına anında ulaşın.' : 'Scan with your camera to instantly view invoice and warranty details.'}</div>
        </div>
        <div class="qr-box">
          <img class="qr-img" src="${qrUrl}" alt="QR Kod" />
        </div>
      </body>
      </html>
    `;
  };

  // Yazdır Butonu
  const handlePrint = async () => {
    try {
      setIsProcessing(true);
      const html = generateLabelHtml();
      await Print.printAsync({ html });
      showSuccess(
        language === 'tr'
          ? 'Yazdırma işlemi başarıyla başlatıldı.'
          : 'Print process started successfully.'
      );
    } catch (err: any) {
      if (err?.message?.includes('cancelled')) return;
      showError(
        language === 'tr'
          ? 'Etiket yazdırılırken bir sorun oluştu.'
          : 'A problem occurred while printing the label.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Etiketi PDF Olarak Paylaş
  const handleShare = async () => {
    try {
      setIsProcessing(true);
      const html = generateLabelHtml();
      const { uri, base64 } = await Print.printToFileAsync({
        html,
        base64: true,
      });

      let targetUri = uri;
      if (base64) {
        const filename = `etiket_${product.id}_${Date.now()}.pdf`;
        targetUri = `${FileSystem.cacheDirectory}${filename}`;
        await FileSystem.writeAsStringAsync(targetUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      await Sharing.shareAsync(targetUri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: `${product.name} - ${language === 'tr' ? 'Dijital Garanti Etiketi' : 'Digital Warranty Tag'}`,
      });
    } catch (err: any) {
      if (err?.message?.includes('cancelled') || err?.message?.includes('dismissed')) return;
      showError(
        language === 'tr'
          ? 'Etiket paylaşılırken bir sorun oluştu.'
          : 'A problem occurred while sharing the tag.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Başlık Çubuğu */}
              <View style={styles.headerRow}>
                <View style={styles.headerTitleBox}>
                  <View style={styles.iconBadge}>
                    <QrCode size={20} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.headerTitle}>
                      {language === 'tr' ? 'Dijital Ürün Etiketi' : 'Digital Product Tag'}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                      {language === 'tr' ? 'Cihaza yapıştırmak için QR kod' : 'QR code to attach to your device'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <X size={18} color={colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>

              {/* Fiziksel Etiket Kartı Önizlemesi */}
              <View style={styles.labelCard}>
                <View style={styles.labelBadge}>
                  <Text style={styles.labelBadgeText}>
                    {language === 'tr' ? '🛡️ DİJİTAL ENVANTER ETİKETİ' : '🛡️ DIGITAL ASSET TAG'}
                  </Text>
                </View>

                {/* Yüksek Çözünürlüklü SVG QR Kod */}
                <View style={styles.qrContainer}>
                  <QRCode
                    value={qrData}
                    size={145}
                    color="#0f172a"
                    backgroundColor="#ffffff"
                  />
                </View>

                <Text style={styles.labelProductName} numberOfLines={1}>
                  {product.name}
                </Text>
                {brandModelText ? (
                  <Text style={styles.labelBrandModel} numberOfLines={1}>
                    {brandModelText}
                  </Text>
                ) : null}

                <View style={styles.labelMetaRow}>
                  <View style={styles.labelMetaItem}>
                    <Text style={styles.labelMetaLabel}>
                      {language === 'tr' ? 'Seri No' : 'Serial No'}
                    </Text>
                    <Text style={styles.labelMetaValue} numberOfLines={1}>
                      {product.serial_number || '—'}
                    </Text>
                  </View>
                  <View style={styles.labelMetaItem}>
                    <Text style={styles.labelMetaLabel}>
                      {language === 'tr' ? 'Garanti Bitişi' : 'Warranty End'}
                    </Text>
                    <Text style={styles.labelMetaValue}>
                      {formatDateTurkish(product.warranty_end_date)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Kullanım Bilgilendirme Notu */}
              <View style={styles.tipContainer}>
                <Info size={16} color={colors.primary} />
                <Text style={styles.tipText}>
                  {language === 'tr'
                    ? 'Bu etiketin çıktısını alıp cihazın altına veya arkasına yapıştırın. Arıza anında kamerayla okutarak anında faturaya ve garanti detaylarına ulaşabilirsiniz.'
                    : 'Print this tag and attach it to your device. Scan anytime with your camera to immediately access invoices and warranty info.'}
                </Text>
              </View>

              {/* Aksiyon Butonları */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.printButton}
                  onPress={handlePrint}
                  disabled={isProcessing}
                  activeOpacity={0.8}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color={colors.onPrimary} />
                  ) : (
                    <>
                      <Printer size={18} color={colors.onPrimary} />
                      <Text style={styles.printButtonText}>
                        {language === 'tr' ? 'Yazdır / Çıktı Al' : 'Print / Export Tag'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={handleShare}
                  disabled={isProcessing}
                  activeOpacity={0.7}
                >
                  <Share2 size={18} color={colors.onBackground} />
                  <Text style={styles.shareButtonText}>
                    {language === 'tr' ? 'Paylaş' : 'Share'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
