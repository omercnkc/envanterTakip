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
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Circle,
} from 'lucide-react-native';

import { AuthStackParamList, RegisterFormData, registerSchema } from '../../types';
import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { GoogleIcon } from '../../components/GoogleIcon';
import { checkPasswordStrength, generateStrongPassword } from '../../utils/passwordHelper';
import { styles } from './RegisterScreen.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { signUp, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      terms: true,
    },
  });

  const termsWatch = watch('terms');
  const passwordWatch = watch('password') || '';
  const passwordStrength = checkPasswordStrength(passwordWatch);

  const handleSuggestPassword = () => {
    const generated = generateStrongPassword(12);
    setValue('password', generated, { shouldValidate: true });
    setValue('passwordConfirm', generated, { shouldValidate: true });
    setShowPassword(true);
    setShowConfirmPassword(true);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null);
      setIsSubmitting(true);
      const result = await signUp(data);
      if (result.success) {
        Alert.alert(
          'Kayıt Başarılı',
          'Hesabınız oluşturuldu. Lütfen e-postanızı kontrol ederek hesabınızı doğrulayın veya doğrudan giriş yapın.',
          [
            {
              text: 'Giriş Yap',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } else if (result.error) {
        setServerError(result.error);
      }
    } catch {
      setServerError('Kayıt oluşturulurken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setServerError(null);
      setIsGoogleSubmitting(true);
      const result = await signInWithGoogle();
      if (!result.success && result.error) {
        setServerError(result.error);
      }
    } catch {
      setServerError('Google ile giriş yapılırken bir hata oluştu.');
    } finally {
      setIsGoogleSubmitting(false);
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
          {/* Üst Başlık ve Logo */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Image
                source={require('../../../assets/icon.png')}
                style={styles.appLogoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.title}>Hesap Oluştur</Text>
            <Text style={styles.subtitle}>
              Hemen katılın ve varlıklarınızı güvenle yönetmeye başlayın.
            </Text>
          </View>

          {/* Form Kartı */}
          <View style={styles.card}>
            {serverError && (
              <View style={styles.serverErrorBox}>
                <Text style={styles.serverErrorText}>{serverError}</Text>
              </View>
            )}

            {/* Ad Soyad */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Ad Soyad <Text style={styles.requiredStar}>*</Text>
              </Text>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputContainer,
                      errors.fullName && styles.inputContainerError,
                    ]}
                  >
                    <User
                      size={18}
                      color={errors.fullName ? COLORS.error : COLORS.onSurfaceVariant}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Örn: Ahmet Yılmaz"
                      placeholderTextColor={COLORS.outline}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </View>
                )}
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName.message}</Text>
              )}
            </View>

            {/* E-posta Adresi */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                E-posta Adresi <Text style={styles.requiredStar}>*</Text>
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
                      size={18}
                      color={errors.email ? COLORS.error : COLORS.onSurfaceVariant}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="ornek@sirket.com"
                      placeholderTextColor={COLORS.outline}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Şifre */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  Şifre <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.suggestPasswordButton}
                  onPress={handleSuggestPassword}
                  activeOpacity={0.7}
                >
                  <Sparkles size={12} color={COLORS.primary} />
                  <Text style={styles.suggestPasswordText}>Güçlü Şifre Öner</Text>
                </TouchableOpacity>
              </View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputContainer,
                      errors.password && styles.inputContainerError,
                    ]}
                  >
                    <Lock
                      size={18}
                      color={errors.password ? COLORS.error : COLORS.onSurfaceVariant}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="••••••••"
                      placeholderTextColor={COLORS.outline}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      maxLength={12}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword((prev) => !prev)}
                      activeOpacity={0.7}
                    >
                      {showPassword ? (
                        <EyeOff size={18} color={COLORS.onSurfaceVariant} />
                      ) : (
                        <Eye size={18} color={COLORS.onSurfaceVariant} />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />

              {/* Canlı Şifre Güç Çubuğu */}
              {passwordWatch.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBarBackground}>
                    <View
                      style={[
                        styles.strengthBarFill,
                        {
                          width: `${passwordStrength.percentage}%`,
                          backgroundColor: passwordStrength.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                    Şifre Gücü: {passwordStrength.label}
                  </Text>
                </View>
              )}

              {/* Şifre Kuralları Kontrol Listesi */}
              <View style={styles.checklistContainer}>
                {passwordStrength.checks.map((rule) => (
                  <View key={rule.id} style={styles.checklistItem}>
                    {rule.isValid ? (
                      <CheckCircle2 size={13} color={COLORS.tertiary} />
                    ) : (
                      <Circle size={13} color={COLORS.outline} />
                    )}
                    <Text
                      style={[
                        styles.checklistText,
                        rule.isValid && styles.checklistTextValid,
                      ]}
                    >
                      {rule.label}
                    </Text>
                  </View>
                ))}
              </View>

              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Şifre Tekrar */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Şifre Tekrar <Text style={styles.requiredStar}>*</Text>
              </Text>
              <Controller
                control={control}
                name="passwordConfirm"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputContainer,
                      errors.passwordConfirm && styles.inputContainerError,
                    ]}
                  >
                    <Lock
                      size={18}
                      color={errors.passwordConfirm ? COLORS.error : COLORS.onSurfaceVariant}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="••••••••"
                      placeholderTextColor={COLORS.outline}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      maxLength={12}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowConfirmPassword((prev) => !prev)}
                      activeOpacity={0.7}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} color={COLORS.onSurfaceVariant} />
                      ) : (
                        <Eye size={18} color={COLORS.onSurfaceVariant} />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.passwordConfirm && (
                <Text style={styles.errorText}>{errors.passwordConfirm.message}</Text>
              )}
            </View>

            {/* Şartlar ve Gizlilik Checkbox */}
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setValue('terms', !termsWatch)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, termsWatch && styles.checkboxActive]}>
                {termsWatch && <Check size={14} color={COLORS.onPrimary} />}
              </View>
              <Text style={styles.termsText}>
                <Text style={styles.termsLink}>Kullanım Koşulları</Text>'nı ve{' '}
                <Text style={styles.termsLink}>Gizlilik Politikası</Text>'nı okudum, kabul ediyorum.
              </Text>
            </TouchableOpacity>
            {errors.terms && (
              <Text style={[styles.errorText, { marginBottom: 8 }]}>{errors.terms.message}</Text>
            )}

            {/* Kayıt Ol Butonu */}
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
                <>
                  <Text style={styles.submitButtonText}>Kayıt Ol</Text>
                  <ArrowRight size={18} color={COLORS.onPrimary} />
                </>
              )}
            </TouchableOpacity>

            {/* Ayırıcı */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google ile Kayıt Ol / Giriş Yap Butonu */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              disabled={isGoogleSubmitting || isSubmitting}
              activeOpacity={0.8}
            >
              {isGoogleSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <>
                  <GoogleIcon size={20} />
                  <Text style={styles.googleButtonText}>Google ile Devam Et</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Alt Giriş Yap Linki */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Zaten bir hesabınız var mı?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.footerLink}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
