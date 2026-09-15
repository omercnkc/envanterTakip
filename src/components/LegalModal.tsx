import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { getStyles } from './LegalModal.styles';

export type LegalTab = 'privacy' | 'kvkk' | 'terms';

interface LegalModalProps {
  visible: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  visible,
  onClose,
  initialTab = 'privacy',
}) => {
  const { colors } = useTheme();
  const { language } = useTranslation();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          {/* Tutamaç */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconBox}>
                <ShieldCheck size={22} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.headerTitle}>
                  {language === 'tr' ? 'Yasal Bilgiler & Güvenlik' : 'Legal & Privacy Information'}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {language === 'tr'
                    ? 'Gizlilik, KVKK ve Kullanım Sözleşmesi'
                    : 'Privacy, Data Protection and Terms'}
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

          {/* Sekme Seçici */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'privacy' && styles.tabItemActive]}
              onPress={() => setActiveTab('privacy')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'privacy' && styles.tabTextActive]}>
                {language === 'tr' ? 'Gizlilik' : 'Privacy'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'kvkk' && styles.tabItemActive]}
              onPress={() => setActiveTab('kvkk')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'kvkk' && styles.tabTextActive]}>
                {language === 'tr' ? 'KVKK' : 'GDPR / KVKK'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'terms' && styles.tabItemActive]}
              onPress={() => setActiveTab('terms')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'terms' && styles.tabTextActive]}>
                {language === 'tr' ? 'Kullanım Şartları' : 'Terms of Use'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Metin İçeriği */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            bounces={true}
          >
            {activeTab === 'privacy' && (
              <View>
                <View style={styles.badgeContainer}>
                  <Lock size={12} color={colors.onPrimaryContainer} />
                  <Text style={styles.badgeText}>
                    {language === 'tr' ? 'Uçtan Uca Şifreli & Yerel Öncelikli' : 'End-to-End Encrypted & Local First'}
                  </Text>
                </View>

                <Text style={styles.sectionTitle}>
                  {language === 'tr' ? '1. Gizlilik Politikası Taahhüdümüz' : '1. Our Privacy Commitment'}
                </Text>
                <Text style={styles.paragraph}>
                  {language === 'tr'
                    ? 'Güvenli Envanter olarak, ev envanteriniz, fatura belgeleriniz ve kişisel varlık verilerinizin gizliliğine en üst düzeyde önem veriyoruz. Kişisel verileriniz üçüncü şahıslara veya reklam verenlere asla satılmaz veya pazarlanmaz.'
                    : 'At Safe Inventory, we prioritize the confidentiality of your home inventory, invoices, and personal asset data. Your data is never sold or marketed to third parties or advertisers.'}
                </Text>

                <Text style={styles.sectionTitle}>
                  {language === 'tr' ? '2. Toplanan Bilgiler' : '2. Collected Information'}
                </Text>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>
                    <Text style={{ fontWeight: '700' }}>
                      {language === 'tr' ? 'Hesap Bilgileri:' : 'Account Details:'}
                    </Text>{' '}
                    {language === 'tr'
                      ? 'Kayıt ve giriş için ad, soyad ve e-posta adresi.'
                      : 'Full name and email address for registration and authentication.'}
                  </Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>
                    <Text style={{ fontWeight: '700' }}>
                      {language === 'tr' ? 'Envanter & Garanti Kayıtları:' : 'Inventory & Warranty Records:'}
                    </Text>{' '}
                    {language === 'tr'
                      ? 'Ürün adı, marka, model, seri numarası, garanti başlangıç/bitiş tarihleri ve satın alma bedelleri.'
                      : 'Product name, brand, model, serial number, warranty dates, and purchase prices.'}
                  </Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>
                    <Text style={{ fontWeight: '700' }}>
                      {language === 'tr' ? 'Fatura & Görseller:' : 'Receipts & Photos:'}
                    </Text>{' '}
                    {language === 'tr'
                      ? 'Kullanıcının isteğe bağlı olarak yüklediği ürün fotoğrafları ve garanti belgesi/fatura dosyaları.'
                      : 'Product photos, warranty certificates, and invoices uploaded optionally by the user.'}
                  </Text>
                </View>

                <Text style={styles.sectionTitle}>
                  {language === 'tr' ? '3. Veri Güvenliği ve Şifreleme' : '3. Data Security & Encryption'}
                </Text>
                <Text style={styles.paragraph}>
                  {language === 'tr'
                    ? 'Tüm veriler aktarım sırasında TLS 1.3 ve dinlenme anında AES-256 şifreleme ile saklanır. Biyometrik kimlik doğrulama verileriniz (Face ID / Parmak İzi) yalnızca kendi cihazınızın güvenli donanım alanında (Secure Enclave / KeyStore) işlenir, sunuculara asla iletilmez.'
                    : 'All communications are protected via TLS 1.3 in transit and AES-256 at rest. Biometric authentication data (Face ID / Fingerprint) is processed strictly within your device secure enclave and is never sent to any server.'}
                </Text>
              </View>
            )}

            {activeTab === 'kvkk' && (
              <View>
                <View style={styles.badgeContainer}>
                  <ShieldCheck size={12} color={colors.onPrimaryContainer} />
                  <Text style={styles.badgeText}>
                    {language === 'tr' ? '6698 Sayılı KVKK Uyumlu' : 'Compliant with GDPR & KVKK'}
                  </Text>
                </View>

                <Text style={styles.sectionTitle}>
                  {language === 'tr' ? 'KVKK Aydınlatma Metni' : 'Data Protection Notice'}
                </Text>
                <Text style={styles.paragraph}>
                  {language === 'tr'
                    ? '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla Güvenli Envanter tarafından kişisel verileriniz aşağıda açıklanan çerçevede işlenmektedir.'
                    : 'In compliance with applicable data protection legislation (GDPR / KVKK), Safe Inventory acts as the data controller and processes personal information strictly within the following scope.'}
                </Text>

                <Text style={styles.sectionTitle}>
                  {language === 'tr' ? 'Veri İşleme Amaçları' : 'Purposes of Data Processing'}
                </Text>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>
                    {language === 'tr'
                      ? 'Kullanıcı hesabınızın oluşturulması ve kimliğinizin doğrulanması.'
                      : 'Creation and authentication of your user account.'}
                  </Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>
                    {language === 'tr'
                      ? 'Ev envanterinizin takibi ve garanti süresi yaklaşan ürünler için yerel hatırlatıcıların planlanması.'
                      : 'Inventory management and scheduling local warranty expiration reminders.'}
                  </Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>
                    {language === 'tr'
                      ? 'Talep ettiğiniz sigorta ve değer raporlarının (PDF/CSV) üretilmesi.'
                      : 'Generating insurance and valuation reports (PDF/CSV) upon request.'}
                  </Text>
                </View>

                <Text style={styles.sectionTitle}>
                  {language === 'tr' ? 'Kullanıcı Hakları' : 'User Rights'}
                </Text>
                <Text style={styles.paragraph}>
                  {language === 'tr'
                    ? 'KVKK 11. maddesi uyarınca kullanıcılarımız diledikleri zaman hesaplarındaki tüm verileri dışa aktarma (CSV/JSON), düzeltme veya tek tuşla hesabını ve tüm varlık kayıtlarını kalıcı olarak silme hakkına sahiptir.'
                    : 'Users have the continuous right to export all account records (CSV/JSON), make corrections, or permanently delete their account and associated data with a single action.'}
                </Text>
              </View>
            )}

            {activeTab === 'terms' && (
              <View>
                <View style={styles.badgeContainer}>
                  <FileText size={12} color={colors.onPrimaryContainer} />
                  <Text style={styles.badgeText}>
                    {language === 'tr' ? 'Kullanıcı Sözleşmesi' : 'Terms of Service'}
                  </Text>
                </View>

                <Text style={styles.sectionTitle}>
                  {language === 'tr' ? '1. Hizmetin Kapsamı' : '1. Scope of Service'}
                </Text>
                <Text style={styles.paragraph}>
                  {language === 'tr'
                    ? 'Güvenli Envanter, kullanıcıların kişisel ev eşyalarını kayıt altına almalarına, garanti ve bakım tarihlerini organize etmelerine yardımcı olan bir dijital asistan uygulamasıdır.'
                    : 'Safe Inventory is a digital assistant designed to help users track personal belongings, warranties, and maintenance schedules.'}
                </Text>

                <Text style={styles.sectionTitle}>
                  {language === 'tr' ? '2. Sorumluluk Sınırları' : '2. Limitations of Liability'}
                </Text>
                <Text style={styles.paragraph}>
                  {language === 'tr'
                    ? 'Uygulama tarafından sağlanan garanti süresi hesaplamaları ve anlık bildirimler kullanıcının girdiği bilgilere dayanır. Üretici veya satıcı firmaların garanti şartları, yasal mevzuat ve kullanıcı hataları kaynaklı hak kayıplarından Güvenli Envanter sorumlu tutulamaz.'
                    : 'Warranty calculations and reminders are based on user inputs. Safe Inventory is not liable for manufacturer policy variations, statutory shifts, or user-entry discrepancies.'}
                </Text>

                <Text style={styles.sectionTitle}>
                  {language === 'tr' ? '3. Veri Yedekleme Sorumluluğu' : '3. Backup Responsibility'}
                </Text>
                <Text style={styles.paragraph}>
                  {language === 'tr'
                    ? 'Kullanıcılar düzenli olarak Ayarlar menüsünden envanter yedeklerini (JSON/CSV) almaktan ve cihaz değişimlerinde yedeklerini saklamaktan kendileri sorumludur.'
                    : 'Users are advised to regularly export inventory backups (JSON/CSV) from Settings when migrating between devices.'}
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Anladım Butonu */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>
              {language === 'tr' ? 'Okudum, Anladım' : 'I Understand'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
