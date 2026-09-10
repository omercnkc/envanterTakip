import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, X } from 'lucide-react-native';

import { COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { updateProfileSchema, UpdateProfileFormData } from '../types';
import { styles } from './EditProfileModal.styles';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
}) => {
  const { profile, user, updateProfile } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const initialFullName = profile?.full_name || '';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: initialFullName,
    },
  });

  // Modal her açıldığında mevcut profil ismiyle doldur
  useEffect(() => {
    if (visible) {
      reset({
        fullName: profile?.full_name || '',
      });
    }
  }, [visible, profile, reset]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    setSubmitting(true);
    try {
      const result = await updateProfile(data.fullName);
      if (!result.success) {
        Alert.alert('Profil Güncellenemedi', result.error || 'Bir hata oluştu.');
        return;
      }
      Alert.alert('Başarılı', 'Profil bilgileriniz başarıyla güncellendi.');
      onClose();
    } catch {
      Alert.alert('Hata', 'Profil güncellenirken beklenmedik bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const userEmail = profile?.email || user?.email || '';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdropTouchable} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <View style={styles.handleBar} />

          <View style={styles.headerRow}>
            <Text style={styles.title}>Profili Düzenle</Text>
            <TouchableOpacity
              style={styles.closeIconButton}
              onPress={onClose}
              disabled={submitting}
              activeOpacity={0.7}
            >
              <X size={20} color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Hesap bilgilerinizi güncelleyin</Text>

          <View style={styles.form}>
            {/* Ad Soyad Alanı */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ad Soyad</Text>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.fullName && styles.inputWrapperError,
                    ]}
                  >
                    <User size={18} color={COLORS.outline} />
                    <TextInput
                      style={styles.input}
                      placeholder="Örn: Ahmet Yılmaz"
                      placeholderTextColor={COLORS.outline}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      editable={!submitting}
                    />
                  </View>
                )}
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName.message}</Text>
              )}
            </View>

            {/* E-posta Alanı (Sabit / Bilgilendirme) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-posta Adresi</Text>
              <View style={[styles.inputWrapper, styles.inputWrapperDisabled]}>
                <Mail size={18} color={COLORS.outline} />
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={userEmail}
                  editable={false}
                />
                <Lock size={16} color={COLORS.outline} />
              </View>
              <Text style={styles.helperText}>
                E-posta adresi güvenlik sebebiyle değiştirilemez.
              </Text>
            </View>
          </View>

          {/* Butonlar */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={submitting}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Vazgeç</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={COLORS.onPrimary} />
              ) : (
                <Text style={styles.saveButtonText}>Kaydet</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
