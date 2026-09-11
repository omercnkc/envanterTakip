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
  Animated,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Eye, EyeOff, ShieldCheck, X } from 'lucide-react-native';
import { useSwipeDownToClose } from '../hooks/useSwipeDownToClose';


import { COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { changePasswordSchema, ChangePasswordFormData } from '../types';
import { styles } from './ChangePasswordModal.styles';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
}) => {
  const { updatePassword } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { panHandlers, translateY, handleClose } = useSwipeDownToClose({
    onClose,
    visible,
  });


  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        password: '',
        passwordConfirm: '',
      });
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [visible, reset]);

  const onSubmit = async (data: ChangePasswordFormData) => {
    setSubmitting(true);
    try {
      const result = await updatePassword(data.password);
      if (!result.success) {
        Alert.alert('Şifre Güncellenemedi', result.error || 'Bir hata oluştu.');
        return;
      }
      Alert.alert(
        'Şifre Güncellendi',
        'Şifreniz başarıyla değiştirildi. Yeni şifreniz sonraki girişlerinizde geçerli olacaktır.'
      );
      onClose();
    } catch {
      Alert.alert('Hata', 'Şifre güncellenirken beklenmedik bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

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
            <Text style={styles.title}>Şifre Değiştir</Text>
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
            Hesap güvenliğiniz için yeni bir şifre belirleyin
          </Text>

          <View style={styles.infoBox}>
            <ShieldCheck size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Şifreniz en az 6 karakter uzunluğunda olmalıdır.
            </Text>
          </View>

          <View style={styles.form}>
            {/* Yeni Şifre Alanı */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Yeni Şifre</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.password && styles.inputWrapperError,
                    ]}
                  >
                    <Lock size={18} color={COLORS.outline} />
                    <TextInput
                      style={styles.input}
                      placeholder="Yeni şifrenizi girin"
                      placeholderTextColor={COLORS.outline}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      editable={!submitting}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword((prev) => !prev)}
                      activeOpacity={0.7}
                    >
                      {showPassword ? (
                        <EyeOff size={18} color={COLORS.outline} />
                      ) : (
                        <Eye size={18} color={COLORS.outline} />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Yeni Şifre Tekrar Alanı */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Yeni Şifre Tekrar</Text>
              <Controller
                control={control}
                name="passwordConfirm"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.passwordConfirm && styles.inputWrapperError,
                    ]}
                  >
                    <Lock size={18} color={COLORS.outline} />
                    <TextInput
                      style={styles.input}
                      placeholder="Yeni şifrenizi tekrar girin"
                      placeholderTextColor={COLORS.outline}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      editable={!submitting}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowConfirmPassword((prev) => !prev)}
                      activeOpacity={0.7}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} color={COLORS.outline} />
                      ) : (
                        <Eye size={18} color={COLORS.outline} />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.passwordConfirm && (
                <Text style={styles.errorText}>
                  {errors.passwordConfirm.message}
                </Text>
              )}
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
                <Text style={styles.saveButtonText}>Güncelle</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>

  );
};
