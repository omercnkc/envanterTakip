import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Easing,
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
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react-native';

import { AuthStackParamList, RegisterFormData, registerSchema } from '../../types';
import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { useTranslation } from '../../i18n';
import { GoogleIcon } from '../../components/GoogleIcon';
import { AppCallout } from '../../components/AppCallout';
import { checkPasswordStrength, generateStrongPassword } from '../../utils/passwordHelper';
import { saveCredentials } from '../../utils/credentialHelper';
import { styles } from './RegisterScreen.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { signUp, signInWithGoogle } = useAuth();
  const { showAlert } = useAlert();
  const { t, language } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [saveOnRegister, setSaveOnRegister] = useState(false);
  const [isCredentialSaved, setIsCredentialSaved] = useState(false);

  // Sarsıntı (Shake) Animasyonu
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -3, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

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
  const showPasswordRules = passwordWatch.length > 0;

  // Şifre Kuralları Kartı için İpeksi / Çok Yumuşak (Ultra Soft) Giriş & Çıkış Animasyonu
  const rulesOpacity = useRef(new Animated.Value(0)).current;
  const rulesTranslateY = useRef(new Animated.Value(-10)).current;
  const rulesScale = useRef(new Animated.Value(0.96)).current;
  const [isRulesVisible, setIsRulesVisible] = useState(false);

  useEffect(() => {
    if (showPasswordRules) {
      setIsRulesVisible(true);
      Animated.parallel([
        Animated.timing(rulesOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(rulesTranslateY, {
          toValue: 0,
          duration: 450,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(rulesScale, {
          toValue: 1,
          duration: 450,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(rulesOpacity, {
          toValue: 0,
          duration: 280,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(rulesTranslateY, {
          toValue: -10,
          duration: 280,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(rulesScale, {
          toValue: 0.96,
          duration: 280,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsRulesVisible(false);
      });
    }
  }, [showPasswordRules, rulesOpacity, rulesTranslateY, rulesScale]);

  const handleSuggestPassword = () => {
    const generated = generateStrongPassword(12);
    setValue('password', generated, { shouldValidate: true });
    setValue('passwordConfirm', generated, { shouldValidate: true });
    setShowPassword(true);
    setShowConfirmPassword(true);

    showAlert({
      type: 'info',
      title: language === 'tr' ? 'Şifre Kaydedilsin mi?' : 'Save Password?',
      message: language === 'tr'
        ? 'Önerilen güçlü şifre bu cihaza kaydedilsin mi? Bir sonraki girişinizde e-posta ve şifreniz otomatik doldurulacaktır.'
        : 'Save the suggested strong password on this device? Email and password will be auto-filled on next login.',
      confirmText: language === 'tr' ? 'Evet, Kaydet' : 'Yes, Save',
      cancelText: language === 'tr' ? 'Hayır' : 'No',
      onConfirm: async () => {
        setSaveOnRegister(true);
        setIsCredentialSaved(true);
        const currentEmail = watch('email');
        if (currentEmail && currentEmail.trim().length > 0) {
          await saveCredentials(currentEmail, generated, true);
        }
      },
    });
  };

  const onInvalid = () => {
    triggerShake();
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null);
      setIsSubmitting(true);
      const result = await signUp(data);
      if (result.success) {
        if (saveOnRegister || isCredentialSaved) {
          await saveCredentials(data.email, data.password, true);
        }
        showAlert({
          type: 'success',
          title: language === 'tr' ? 'Kayıt Başarılı' : 'Registration Successful',
          message:
            language === 'tr'
              ? 'Hesabınız oluşturuldu. Lütfen e-postanızı kontrol ederek hesabınızı doğrulayın veya doğrudan giriş yapın.'
              : 'Your account has been created. Please verify your email or log in directly.',
          confirmText: language === 'tr' ? 'Giriş Yap' : 'Log In',
          showCancel: false,
          onConfirm: () => navigation.navigate('Login'),
        });
      } else if (result.error) {
        setServerError(result.error);
        triggerShake();
      }
    } catch {
      setServerError('Kayıt oluşturulurken bir hata oluştu.');
      triggerShake();
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
            <Text style={styles.title}>{language === 'tr' ? 'Hesap Oluştur' : 'Create Account'}</Text>
            <Text style={styles.subtitle}>
              {language === 'tr' ? 'Hemen katılın ve varlıklarınızı güvenle yönetmeye başlayın.' : 'Join now and securely manage your home assets.'}
            </Text>
          </View>

          {/* Form Kartı */}
          <Animated.View
            style={[
              styles.card,
              { transform: [{ translateX: shakeAnim }] },
            ]}
          >
            {serverError && (
              <AppCallout
                type="error"
                message={serverError}
                onClose={() => setServerError(null)}
                style={{ marginBottom: 16 }}
              />
            )}

            {/* Ad Soyad */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('auth.fullNameLabel')} <Text style={styles.requiredStar}>*</Text>
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
                      placeholder={t('auth.fullNamePlaceholder')}
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
                {t('auth.emailLabel')} <Text style={styles.requiredStar}>*</Text>
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
                      placeholder={t('auth.emailPlaceholder')}
                      placeholderTextColor={COLORS.outline}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
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

            {/* Şifre */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  {t('auth.passwordLabel')} <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.suggestPasswordButton}
                  onPress={handleSuggestPassword}
                  activeOpacity={0.7}
                >
                  <Sparkles size={12} color={COLORS.primary} />
                  <Text style={styles.suggestPasswordText}>{language === 'tr' ? 'Güçlü Şifre Öner' : 'Suggest Strong Password'}</Text>
                </TouchableOpacity>
              </View>

              {isCredentialSaved && (
                <View style={styles.savedBadge}>
                  <Check size={12} color={COLORS.tertiary} />
                  <Text style={styles.savedBadgeText}>
                    {language === 'tr' ? 'Şifre cihaza kaydedilecek (Girişte otomatik doldurulur)' : 'Password will be saved on device (auto-filled on login)'}
                  </Text>
                </View>
              )}
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

              {/* Kullanıcı şifre girmeye başladığında yumuşak animasyonla açılan kurallar ve güç barı */}
              {isRulesVisible && (
                <Animated.View
                  style={{
                    opacity: rulesOpacity,
                    transform: [
                      { translateY: rulesTranslateY },
                      { scale: rulesScale },
                    ],
                  }}
                >
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
                        {language === 'tr' ? 'Şifre Gücü' : 'Password Strength'}: {passwordStrength.label}
                      </Text>
                    </View>
                  )}

                  {/* Şifre Kuralları Kontrol Listesi */}
                  <View style={styles.checklistContainer}>
                    {passwordStrength.checks.map((rule) => {
                      const isFailed = !!errors.password && !rule.isValid;
                      return (
                        <View key={rule.id} style={styles.checklistItem}>
                          <View
                            style={[
                              styles.checklistIconBox,
                              rule.isValid && styles.checklistIconBoxValid,
                              isFailed && styles.checklistIconBoxError,
                            ]}
                          >
                            {rule.isValid ? (
                              <Check size={11} color={COLORS.tertiary} strokeWidth={3} />
                            ) : isFailed ? (
                              <X size={11} color={COLORS.error} strokeWidth={3} />
                            ) : (
                              <View
                                style={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: 2,
                                  backgroundColor: COLORS.outline,
                                }}
                              />
                            )}
                          </View>
                          <Text
                            style={[
                              styles.checklistText,
                              rule.isValid && styles.checklistTextValid,
                              isFailed && styles.checklistTextError,
                            ]}
                          >
                            {rule.label}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </Animated.View>
              )}

              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Şifre Tekrar */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('auth.passwordConfirmLabel')} <Text style={styles.requiredStar}>*</Text>
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
                {t('auth.termsAgreementPrefix')}
                <Text style={styles.termsLink}>{t('auth.termsOfService')}</Text>
                {t('auth.andConjunction')}
                <Text style={styles.termsLink}>{t('auth.privacyPolicy')}</Text>
                {t('auth.termsAgreementSuffix')}
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
              onPress={handleSubmit(onSubmit, onInvalid)}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.onPrimary} />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>{t('auth.registerButton')}</Text>
                  <ArrowRight size={18} color={COLORS.onPrimary} />
                </>
              )}
            </TouchableOpacity>

            {/* Ayırıcı */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('auth.orDivider')}</Text>
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
                  <Text style={styles.googleButtonText}>{t('auth.googleSignIn')}</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Alt Giriş Yap Linki */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.hasAccountPrompt')}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.footerLink}>{t('auth.signInAction')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
