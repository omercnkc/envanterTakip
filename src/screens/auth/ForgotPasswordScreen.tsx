import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft } from 'lucide-react-native';

import { AuthStackParamList, ForgotPasswordFormData, forgotPasswordSchema } from '../../types';
import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { AppCallout } from '../../components/AppCallout';
import { styles } from './ForgotPasswordScreen.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const { resetPassword } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: route.params?.email || '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setServerError(null);
      setSuccessMessage(null);
      setIsSubmitting(true);
      const result = await resetPassword(data);
      if (!result.success && result.error) {
        setServerError(result.error);
      } else {
        setSuccessMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
      }
    } catch {
      setServerError('İşlem sırasında bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Geri Butonu */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={COLORS.onSurface} />
          </TouchableOpacity>

          {/* Üst Başlık */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Image
                source={require('../../../assets/icon.png')}
                style={styles.appLogoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.title}>Şifremi Unuttum</Text>
            <Text style={styles.subtitle}>
              Hesabınıza kayıtlı e-posta adresinizi girin, sıfırlama bağlantısını iletelim.
            </Text>
          </View>

          {/* Form Kartı */}
          <View style={styles.card}>
            {serverError && (
              <AppCallout
                type="error"
                message={serverError}
                onClose={() => setServerError(null)}
                style={{ marginBottom: 16 }}
              />
            )}

            {successMessage && (
              <AppCallout
                type="success"
                title="E-posta Gönderildi"
                message={successMessage}
                onClose={() => setSuccessMessage(null)}
                style={{ marginBottom: 16 }}
              />
            )}

            {/* E-posta */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                E-posta <Text style={styles.requiredStar}>*</Text>
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputContainer,
                      errors.email && styles.inputContainerError,
                    ]}
                  >
                    <Mail
                      size={20}
                      color={errors.email ? COLORS.error : COLORS.onSurfaceVariant}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="ornek@domain.com"
                      placeholderTextColor={COLORS.outline}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={(text) => onChange(text.replace(/\s+/g, ''))}
                      onBlur={onBlur}
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Gönder Butonu */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.onPrimary} />
              ) : (
                <Text style={styles.submitButtonText}>Sıfırlama Bağlantısı Gönder</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
