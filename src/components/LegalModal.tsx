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
                    <Text style={styles.headerTitle}>Yasal Bilgiler & Güvenlik</Text>
                    <Text style={styles.headerSubtitle}>Gizlilik, KVKK ve Kullanım Sözleşmesi</Text>
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
                    Gizlilik
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabItem, activeTab === 'kvkk' && styles.tabItemActive]}
                  onPress={() => setActiveTab('kvkk')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, activeTab === 'kvkk' && styles.tabTextActive]}>
                    KVKK
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabItem, activeTab === 'terms' && styles.tabItemActive]}
                  onPress={() => setActiveTab('terms')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, activeTab === 'terms' && styles.tabTextActive]}>
                    Kullanım Şartları
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
                      <Text style={styles.badgeText}>Uçtan Uca Şifreli & Yerel Öncelikli</Text>
                    </View>

                    <Text style={styles.sectionTitle}>1. Gizlilik Politikası Taahhüdümüz</Text>
                    <Text style={styles.paragraph}>
                      Safe Envanter olarak, ev envanteriniz, fatura belgeleriniz ve kişisel varlık
                      verilerinizin gizliliğine en üst düzeyde önem veriyoruz. Kişisel verileriniz
                      üçüncü şahıslara veya reklam verenlere asla satılmaz veya pazarlanmaz.
                    </Text>

                    <Text style={styles.sectionTitle}>2. Toplanan Bilgiler</Text>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.bulletText}>
                        <Text style={{ fontWeight: '700' }}>Hesap Bilgileri:</Text> Kayıt ve giriş için
                        ad, soyad ve e-posta adresi.
                      </Text>
                    </View>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.bulletText}>
                        <Text style={{ fontWeight: '700' }}>Envanter & Garanti Kayıtları:</Text> Ürün adı,
                        marka, model, seri numarası, garanti başlangıç/bitiş tarihleri ve satın alma bedelleri.
                      </Text>
                    </View>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.bulletText}>
                        <Text style={{ fontWeight: '700' }}>Fatura & Görseller:</Text> Kullanıcının isteğe bağlı
                        olarak yüklediği ürün fotoğrafları ve garanti belgesi/fatura dosyaları.
                      </Text>
                    </View>

                    <Text style={styles.sectionTitle}>3. Veri Güvenliği ve Şifreleme</Text>
                    <Text style={styles.paragraph}>
                      Tüm veriler aktarım sırasında TLS 1.3 ve dinlenme anında AES-256 şifreleme ile
                      saklanır. Biyometrik kimlik doğrulama verileriniz (Face ID / Parmak İzi) yalnızca
                      kendi cihazınızın güvenli donanım alanında (Secure Enclave / KeyStore) işlenir, sunuculara asla iletilmez.
                    </Text>
                  </View>
                )}

                {activeTab === 'kvkk' && (
                  <View>
                    <View style={styles.badgeContainer}>
                      <ShieldCheck size={12} color={colors.onPrimaryContainer} />
                      <Text style={styles.badgeText}>6698 Sayılı KVKK Uyumlu</Text>
                    </View>

                    <Text style={styles.sectionTitle}>KVKK Aydınlatma Metni</Text>
                    <Text style={styles.paragraph}>
                      6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu
                      sıfatıyla Safe Envanter tarafından kişisel verileriniz aşağıda açıklanan çerçevede
                      işlenmektedir.
                    </Text>

                    <Text style={styles.sectionTitle}>Veri İşleme Amaçları</Text>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.bulletText}>
                        Kullanıcı hesabınızın oluşturulması ve kimliğinizin doğrulanması.
                      </Text>
                    </View>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.bulletText}>
                        Ev envanterinizin takibi ve garanti süresi yaklaşan ürünler için yerel hatırlatıcıların planlanması.
                      </Text>
                    </View>
                    <View style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.bulletText}>
                        Talep ettiğiniz sigorta ve değer raporlarının (PDF/CSV) üretilmesi.
                      </Text>
                    </View>

                    <Text style={styles.sectionTitle}>Kullanıcı Hakları (Madde 11)</Text>
                    <Text style={styles.paragraph}>
                      KVKK 11. maddesi uyarınca kullanıcılarımız diledikleri zaman hesaplarındaki tüm
                      verileri dışa aktarma (CSV/JSON), düzeltme veya tek tuşla hesabını ve tüm varlık
                      kayıtlarını kalıcı olarak silme hakkına sahiptir.
                    </Text>
                  </View>
                )}

                {activeTab === 'terms' && (
                  <View>
                    <View style={styles.badgeContainer}>
                      <FileText size={12} color={colors.onPrimaryContainer} />
                      <Text style={styles.badgeText}>Kullanıcı Sözleşmesi</Text>
                    </View>

                    <Text style={styles.sectionTitle}>1. Hizmetin Kapsamı</Text>
                    <Text style={styles.paragraph}>
                      Safe Envanter, kullanıcıların kişisel ev eşyalarını kayıt altına almalarına, garanti
                      ve bakım tarihlerini organize etmelerine yardımcı olan bir dijital asistan uygulamasıdır.
                    </Text>

                    <Text style={styles.sectionTitle}>2. Sorumluluk Sınırları</Text>
                    <Text style={styles.paragraph}>
                      Uygulama tarafından sağlanan garanti süresi hesaplamaları ve anlık bildirimler
                      kullanıcının girdiği bilgilere dayanır. Üretici veya satıcı firmaların garanti şartları,
                      yasal mevzuat ve kullanıcı hataları kaynaklı hak kayıplarından Safe Envanter sorumlu tutulamaz.
                    </Text>

                    <Text style={styles.sectionTitle}>3. Veri Yedekleme Sorumluluğu</Text>
                    <Text style={styles.paragraph}>
                      Kullanıcılar düzenli olarak Ayarlar menüsünden envanter yedeklerini (JSON/CSV)
                      almaktan ve cihaz değişimlerinde yedeklerini saklamaktan kendileri sorumludur.
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
                <Text style={styles.actionButtonText}>Okudum, Anladım</Text>
              </TouchableOpacity>
            </View>
          </View>
      </Modal>
  );
};
