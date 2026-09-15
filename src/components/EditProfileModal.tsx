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
  Animated,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, X, Camera } from 'lucide-react-native';
import { Image } from 'react-native';
import { useSwipeDownToClose } from '../hooks/useSwipeDownToClose';

import { COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { useTranslation } from '../i18n';
import { mediaHelper } from '../utils/mediaHelper';
import { updateProfileSchema, UpdateProfileFormData } from '../types';
import { MediaPickerModal } from './MediaPickerModal';
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
  const { showSuccess, showError } = useAlert();
  const { language } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(profile?.avatar_url || null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const { panHandlers, translateY, handleClose } = useSwipeDownToClose({
    onClose,
    visible,
  });

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

  // Modal her açıldığında mevcut profil verisiyle doldur
  useEffect(() => {
    if (visible) {
      reset({
        fullName: profile?.full_name || '',
      });
      setAvatarUri(profile?.avatar_url || null);
    }
  }, [visible, profile, reset]);

  const handlePickAvatar = () => {
    setMediaPickerOpen(true);
  };

  const handleSelectCamera = async () => {
    const res = await mediaHelper.pickFromCamera();
    if (!res.canceled && res.uri) {
      setAvatarUri(res.uri);
    }
  };

  const handleSelectGallery = async () => {
    const res = await mediaHelper.pickFromGallery();
    if (!res.canceled && res.uri) {
      setAvatarUri(res.uri);
    }
  };

  const onSubmit = async (data: UpdateProfileFormData) => {
    setSubmitting(true);
    try {
      const result = await updateProfile(data.fullName, avatarUri);
      if (!result.success) {
        showError(
          result.error || (language === 'tr' ? 'Bir hata oluştu.' : 'An error occurred.'),
          language === 'tr' ? 'Profil Güncellenemedi' : 'Profile Update Failed'
        );
        return;
      }
      showSuccess(
        language === 'tr' ? 'Profil bilgileriniz başarıyla güncellendi.' : 'Your profile information has been updated.',
        language === 'tr' ? 'Başarılı' : 'Success'
      );
      onClose();
    } catch {
      showError(
        language === 'tr' ? 'Profil güncellenirken beklenmedik bir hata oluştu.' : 'An unexpected error occurred while updating profile.',
        language === 'tr' ? 'Hata' : 'Error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const userEmail = profile?.email || user?.email || '';
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'K';
  const userInitials = (displayName[0] || 'K').toUpperCase();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.backdropTouchable} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.modalContent, { transform: [{ translateY }] }]}>
          <View {...panHandlers} style={styles.handleContainer}>
            <View style={styles.handleBar} />
          </View>

          <View style={styles.headerRow}>
            <Text style={styles.title}>
              {language === 'tr' ? 'Profili Düzenle' : 'Edit Profile'}
            </Text>
            <TouchableOpacity
              style={styles.closeIconButton}
              onPress={handleClose}
              disabled={submitting}
              activeOpacity={0.7}
            >
              <X size={20} color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            {language === 'tr' ? 'Hesap bilgilerinizi güncelleyin' : 'Update your account details'}
          </Text>

          {/* Profil Fotoğrafı Seçici */}
          <View style={styles.avatarPickerContainer}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={handlePickAvatar}
              disabled={submitting}
              activeOpacity={0.8}
            >
              <View style={styles.avatarBox}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatarImage} resizeMode="cover" />
                ) : (
                  <Text style={styles.avatarInitials}>{userInitials}</Text>
                )}
              </View>
              <View style={styles.avatarCameraBadge}>
                <Camera size={14} color={COLORS.onPrimary} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePickAvatar} disabled={submitting}>
              <Text style={styles.avatarHintText}>
                {language === 'tr' ? 'Fotoğrafı Değiştir' : 'Change Photo'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            {/* Ad Soyad Alanı */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {language === 'tr' ? 'Ad Soyad' : 'Full Name'}
              </Text>
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
                      placeholder={language === 'tr' ? 'Örn: Ahmet Yılmaz' : 'e.g. John Doe'}
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
              <Text style={styles.label}>
                {language === 'tr' ? 'E-posta Adresi' : 'Email Address'}
              </Text>
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
                {language === 'tr'
                  ? 'E-posta adresi güvenlik sebebiyle değiştirilemez.'
                  : 'Email address cannot be changed for security reasons.'}
              </Text>
            </View>
          </View>

          {/* Butonlar */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={submitting}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>
                {language === 'tr' ? 'Vazgeç' : 'Cancel'}
              </Text>
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
                <Text style={styles.saveButtonText}>
                  {language === 'tr' ? 'Kaydet' : 'Save'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Profil Fotoğrafı Seçici Modal */}
      <MediaPickerModal
        visible={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        title={language === 'tr' ? 'Profil Fotoğrafı Seç' : 'Choose Profile Photo'}
        subtitle={language === 'tr' ? 'Fotoğraf çekin veya galerinizden seçin' : 'Take a photo or choose from gallery'}
        onSelectCamera={handleSelectCamera}
        onSelectGallery={handleSelectGallery}
      />
    </Modal>
  );
};
