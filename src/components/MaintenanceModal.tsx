import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Wrench,
  Calendar,
  DollarSign,
  UserCheck,
  FileText,
  X,
  Plus,
  Sparkles,
  Repeat,
} from 'lucide-react-native';
import { addMonths, format } from 'date-fns';

import { Product, MaintenanceFormData } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { useTranslation } from '../i18n';
import { maskDateInput } from '../utils/warrantyCalculator';
import { maintenanceService } from '../api/maintenanceService';
import { scheduleMaintenanceNotifications } from '../utils/notificationHelper';
import { getStyles } from './MaintenanceModal.styles';

interface MaintenanceModalProps {
  visible: boolean;
  product: Product;
  onClose: () => void;
  onCreated: () => void;
}

interface TemplateOption {
  title: string;
  interval: number;
  icon: string;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  visible,
  product,
  onClose,
  onCreated,
}) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const { showSuccess, showError, showWarning } = useAlert();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const templates: TemplateOption[] = useMemo(() => [
    { title: language === 'tr' ? 'Periyodik Genel Bakım' : 'Periodic General Maintenance', interval: 12, icon: '🔧' },
    { title: language === 'tr' ? 'Filtre Değişimi & Temizliği' : 'Filter Replacement & Cleaning', interval: 6, icon: '🪶' },
    { title: language === 'tr' ? 'Detaylı Temizlik & Hijyen' : 'Deep Cleaning & Hygiene', interval: 3, icon: '✨' },
    { title: language === 'tr' ? 'Parça & Sarf Malzeme Değişimi' : 'Parts & Consumables Replacement', interval: 6, icon: '⚙️' },
    { title: language === 'tr' ? 'Yetkili Servis Kontrolü' : 'Authorized Service Inspection', interval: 12, icon: '🛡️' },
  ], [language]);

  const intervalOptions = useMemo(() => [
    { label: language === 'tr' ? 'Tek Seferlik' : 'One-time', value: null },
    { label: language === 'tr' ? '1 Ay' : '1 Month', value: 1 },
    { label: language === 'tr' ? '3 Ay' : '3 Months', value: 3 },
    { label: language === 'tr' ? '6 Ay' : '6 Months', value: 6 },
    { label: language === 'tr' ? '1 Yıl' : '1 Year', value: 12 },
    { label: language === 'tr' ? '2 Yıl' : '2 Years', value: 24 },
  ], [language]);

  // Form durumları
  const [title, setTitle] = useState('');
  const [maintenanceDate, setMaintenanceDate] = useState(() => {
    // Varsayılan olarak bugünden 3 ay sonrası
    return format(addMonths(new Date(), 3), 'dd/MM/yyyy');
  });
  const [intervalMonths, setIntervalMonths] = useState<number | null>(6);
  const [cost, setCost] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Doğrulama durumları
  const isTitleInvalid = !title.trim();
  const isDateInvalid = !maintenanceDate || maintenanceDate.trim().length < 10;

  // Şablon seçildiğinde formu doldur
  const handleSelectTemplate = (template: TemplateOption) => {
    setTitle(template.title);
    setIntervalMonths(template.interval);
    setMaintenanceDate(format(addMonths(new Date(), template.interval), 'dd/MM/yyyy'));
  };

  const handleDateChange = (text: string) => {
    setMaintenanceDate(maskDateInput(text));
  };

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    if (isTitleInvalid) {
      showWarning(language === 'tr' ? 'Lütfen bakım başlığını giriniz.' : 'Please enter the maintenance title.');
      return;
    }

    if (isDateInvalid) {
      showWarning(language === 'tr' ? 'Lütfen geçerli bir bakım tarihi giriniz (GG/AA/YYYY).' : 'Please enter a valid maintenance date (DD/MM/YYYY).');
      return;
    }

    try {
      setIsSubmitting(true);
      const parsedCost = cost.trim() ? parseFloat(cost.replace(',', '.')) : 0;
      const formData: MaintenanceFormData = {
        title: title.trim(),
        maintenance_date: maintenanceDate,
        interval_months: intervalMonths,
        cost: isNaN(parsedCost) ? 0 : parsedCost,
        service_provider: serviceProvider.trim() || null,
        notes: notes.trim() || null,
      };

      const userId = user?.id || '00000000-0000-0000-0000-000000000000';
      const { data, error } = await maintenanceService.create(product.id, userId, formData);

      if (error || !data) {
        showError(error || (language === 'tr' ? 'Bakım kaydı oluşturulamadı.' : 'Could not create maintenance record.'));
        return;
      }

      // Hatırlatma bildirimini zamanla (7 gün ve 1 gün kala)
      await scheduleMaintenanceNotifications(data, product.name);

      showSuccess(
        language === 'tr'
          ? `"${data.title}" bakım takvimine eklendi.`
          : `"${data.title}" added to maintenance schedule.`
      );
      // Formu sıfırla
      setTitle('');
      setCost('');
      setServiceProvider('');
      setNotes('');
      setHasAttemptedSubmit(false);
      onCreated();
      onClose();
    } catch (err: any) {
      showError(err?.message || (language === 'tr' ? 'Bir hata oluştu.' : 'An error occurred.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.modalContent}
            >
              {/* Tutamaç */}
              <View style={styles.handleBar} />

              {/* Başlık Çubuğu */}
              <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                  <View style={styles.iconBadge}>
                    <Wrench size={20} color={colors.onPrimary} />
                  </View>
                  <View>
                    <Text style={styles.headerTitle}>
                      {language === 'tr' ? 'Yeni Bakım Planla' : 'Schedule New Maintenance'}
                    </Text>
                    <Text style={styles.headerSubtitle} numberOfLines={1}>
                      {product.name}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                  activeOpacity={0.7}
                >
                  <X size={18} color={colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {/* Hızlı Şablonlar */}
                <Text style={styles.sectionLabel}>
                  {language === 'tr' ? 'Hızlı Şablonlar' : 'Quick Templates'}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.templatesScroll}
                >
                  {templates.map((tmpl, idx) => {
                    const isActive = title === tmpl.title;
                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.templateChip,
                          isActive && styles.templateChipActive,
                        ]}
                        onPress={() => handleSelectTemplate(tmpl)}
                        activeOpacity={0.7}
                      >
                        <Text style={{ fontSize: 13 }}>{tmpl.icon}</Text>
                        <Text
                          style={[
                            styles.templateChipText,
                            isActive && styles.templateChipTextActive,
                          ]}
                        >
                          {tmpl.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Bakım Başlığı */}
                <View style={[styles.fieldGroup, { marginTop: 12 }]}>
                  <Text style={styles.inputLabel}>
                    {language === 'tr' ? 'Bakım Başlığı' : 'Maintenance Title'} <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <View
                    style={[
                      styles.inputBox,
                      hasAttemptedSubmit && isTitleInvalid && styles.inputBoxError,
                    ]}
                  >
                    <Sparkles
                      size={18}
                      color={hasAttemptedSubmit && isTitleInvalid ? colors.error : colors.primary}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder={language === 'tr' ? 'Örn: Periyodik Bakım, Filtre Değişimi' : 'e.g. Periodic Maintenance, Filter Replacement'}
                      placeholderTextColor={colors.onSurfaceVariant + '80'}
                      value={title}
                      onChangeText={(val) => {
                        setTitle(val);
                      }}
                    />
                  </View>
                  {hasAttemptedSubmit && isTitleInvalid ? (
                    <Text style={styles.errorText}>
                      {language === 'tr' ? 'Bakım başlığı zorunludur.' : 'Maintenance title is required.'}
                    </Text>
                  ) : null}
                </View>

                {/* Bakım Tarihi */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>
                    {language === 'tr' ? 'Bakım Tarihi (GG/AA/YYYY)' : 'Maintenance Date (DD/MM/YYYY)'} <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <View
                    style={[
                      styles.inputBox,
                      hasAttemptedSubmit && isDateInvalid && styles.inputBoxError,
                    ]}
                  >
                    <Calendar
                      size={18}
                      color={hasAttemptedSubmit && isDateInvalid ? colors.error : colors.primary}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder={language === 'tr' ? 'GG/AA/YYYY' : 'DD/MM/YYYY'}
                      placeholderTextColor={colors.onSurfaceVariant + '80'}
                      value={maintenanceDate}
                      onChangeText={handleDateChange}
                      keyboardType="numeric"
                      maxLength={10}
                    />
                  </View>
                  {hasAttemptedSubmit && isDateInvalid ? (
                    <Text style={styles.errorText}>
                      {language === 'tr' ? 'Lütfen geçerli bir tarih giriniz (GG/AA/YYYY).' : 'Please enter a valid date (DD/MM/YYYY).'}
                    </Text>
                  ) : (
                    <Text style={styles.helperText}>
                      {language === 'tr'
                        ? 'Bu tarihe 7 gün ve 1 gün kala telefonunuza otomatik hatırlatma bildirimi gönderilir.'
                        : 'Automatic reminders will be sent 7 days and 1 day prior to this date.'}
                    </Text>
                  )}
                </View>

                {/* Tekrar Periyodu */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>
                    {language === 'tr' ? 'Tekrar Periyodu' : 'Recurrence Interval'}
                  </Text>
                  <View style={styles.intervalsRow}>
                    {intervalOptions.map((opt, idx) => {
                      const isSelected = intervalMonths === opt.value;
                      return (
                        <TouchableOpacity
                          key={idx}
                          style={[
                            styles.intervalChip,
                            isSelected && styles.intervalChipSelected,
                          ]}
                          onPress={() => setIntervalMonths(opt.value)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.intervalChipText,
                              isSelected && styles.intervalChipTextSelected,
                            ]}
                          >
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <Text style={styles.helperText}>
                    {intervalMonths
                      ? (language === 'tr'
                          ? `Bakım tamamlandığında otomatik olarak ${intervalMonths} ay sonrasına yeni bir planlama açılır.`
                          : `When completed, automatically schedules the next occurrence in ${intervalMonths} month(s).`)
                      : (language === 'tr'
                          ? 'Bu bakım tek seferliktir, tamamlandığında otomatik yinelenmez.'
                          : 'This is a one-time maintenance; it will not recur automatically.')}
                  </Text>
                </View>

                {/* Servis Sağlayıcı (Geniş & Taşmayan Alan) */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>
                    {language === 'tr' ? 'Servis / Yapan Kişi' : 'Service Provider / Performed By'}
                  </Text>
                  <View style={styles.inputBox}>
                    <UserCheck size={18} color={colors.primary} />
                    <TextInput
                      style={styles.textInput}
                      placeholder={language === 'tr' ? 'Örn: Yetkili Servis, Özel Servis veya Kendim' : 'e.g. Authorized Service, Technician or Self'}
                      placeholderTextColor={colors.onSurfaceVariant + '80'}
                      value={serviceProvider}
                      onChangeText={setServiceProvider}
                    />
                  </View>
                </View>

                {/* Tahmini Masraf */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>
                    {language === 'tr' ? 'Tahmini Masraf (₺)' : 'Estimated Cost (₺)'}
                  </Text>
                  <View style={styles.inputBox}>
                    <DollarSign size={18} color={colors.primary} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="0.00"
                      placeholderTextColor={colors.onSurfaceVariant + '80'}
                      value={cost}
                      onChangeText={setCost}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Notlar */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>
                    {language === 'tr' ? 'Notlar & Talimatlar' : 'Notes & Instructions'}
                  </Text>
                  <View style={[styles.inputBox, styles.notesInput]}>
                    <FileText size={18} color={colors.primary} style={{ marginTop: 2 }} />
                    <TextInput
                      style={[styles.textInput, { height: '100%', textAlignVertical: 'top' }]}
                      placeholder={language === 'tr' ? 'Bakım notları, yapılan işlemler veya hatırlatmalar...' : 'Maintenance notes, actions taken, or reminders...'}
                      placeholderTextColor={colors.onSurfaceVariant + '80'}
                      value={notes}
                      onChangeText={setNotes}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>

                {/* Kaydet Butonu */}
                <TouchableOpacity
                  style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  activeOpacity={0.8}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={colors.onPrimary} />
                  ) : (
                    <>
                      <Plus size={20} color={colors.onPrimary} />
                      <Text style={styles.submitButtonText}>
                        {language === 'tr' ? 'Bakım Takvimine Ekle' : 'Add to Maintenance Calendar'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

