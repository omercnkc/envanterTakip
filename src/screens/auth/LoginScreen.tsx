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
import { useFocusEffect } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, Sparkles, Fingerprint } from 'lucide-react-native';

import { AuthStackParamList, LoginFormData, loginSchema } from '../../types';
import { COLORS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { GoogleIcon } from '../../components/GoogleIcon';
import { AnimatedLock, LockAnimState, LockStatusType } from '../../components/AnimatedLock';
import { getSavedCredentials, clearSavedCredentials, saveCredentials } from '../../utils/credentialHelper';
import { biometricHelper, BiometricCheckResult } from '../../utils/biometricHelper';
import { styles } from './LoginScreen.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [hasSavedCredential, setHasSavedCredential] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricInfo, setBiometricInfo] = useState<BiometricCheckResult | null>(null);
  const [animState, setAnimState] = useState<LockAnimState>('idle');
  const [statusType, setStatusType] = useState<LockStatusType>('idle');

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const passwordWatch = watch('password') || '';
  const showLock = passwordWatch.length > 0 || animState === 'unlock';

  // Kilit için İpeksi / Çok Yumuşak (Ultra Soft) Giriş & Çıkış Animasyonu
  const lockOpacity = useRef(new Animated.Value(0)).current;
  const lockScale = useRef(new Animated.Value(0.92)).current;
  const lockTranslateY = useRef(new Animated.Value(-10)).current;
  const [isLockVisible, setIsLockVisible] = useState(false);

  useEffect(() => {
    if (showLock) {
      setIsLockVisible(true);
      Animated.parallel([
        Animated.timing(lockOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(lockScale, {
          toValue: 1,
          duration: 450,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(lockTranslateY, {
          toValue: 0,
          duration: 450,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(lockOpacity, {
          toValue: 0,
          duration: 280,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(lockScale, {
          toValue: 0.92,
          duration: 280,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(lockTranslateY, {
          toValue: -10,
          duration: 280,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsLockVisible(false);
      });
    }
  }, [showLock, lockOpacity, lockScale, lockTranslateY]);

  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;
      const loadSaved = async () => {
        const [saved, bioEnabled, bioInfo] = await Promise.all([
          getSavedCredentials(),
          biometricHelper.isEnabled(),
          biometricHelper.checkBiometrics(),
        ]);
        if (isMounted) {
          setBiometricEnabled(bioEnabled);
          setBiometricInfo(bioInfo);
          if (saved && saved.email && saved.password) {
            setValue('email', saved.email, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            setValue('password', saved.password, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            setHasSavedCredential(true);
          }
        }
      };
      loadSaved();
      return () => {
        isMounted = false;
      };
    }, [setValue])
  );

  const handleBiometricLogin = async () => {
    const saved = await getSavedCredentials();
    if (!saved || !saved.email || !saved.password) {
      return;
    }
    const res = await biometricHelper.authenticate('Safe Envanter Girişi');
    if (res.success) {
      onSubmit({ email: saved.email, password: saved.password });
    }
  };

  const handleClearSavedCredentials = async () => {
    await clearSavedCredentials();
    setHasSavedCredential(false);
    setValue('email', '');
    setValue('password', '');
    setStatusType('idle');
    setAnimState('idle');
  };

  const onInvalid = () => {
    setStatusType('error');
    setAnimState('shake');
    setTimeout(() => setAnimState('idle'), 600);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null);
      setIsSubmitting(true);
      const result = await signIn(data);
      if (!result.success && result.error) {
        setServerError(result.error);
        setStatusType('error');
        setAnimState('shake');
        setTimeout(() => setAnimState('idle'), 600);
      } else {
        setStatusType('success');
        setAnimState('unlock');
        // Giriş başarılı olunca bilgileri yerel hafızada güncel tut ve biyometrik kilidi tazele
        await Promise.all([
          saveCredentials(data.email, data.password, false),
          biometricHelper.recordUnlock(),
        ]);
      }
    } catch {
      setServerError('Giriş yapılırken beklenmedik bir hata oluştu.');
      setStatusType('error');
      setAnimState('shake');
      setTimeout(() => setAnimState('idle'), 600);
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
        setStatusType('error');
        setAnimState('shake');
        setTimeout(() => setAnimState('idle'), 600);
      } else {
        setStatusType('success');
        setAnimState('unlock');
      }
    } catch {
      setServerError('Google ile giriş yapılırken bir hata oluştu.');
      setStatusType('error');
      setAnimState('shake');
      setTimeout(() => setAnimState('idle'), 600);
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.bgBlobTop} />
      <View style={styles.bgBlobBottom} />

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
            <Text style={styles.title}>Hoş Geldiniz</Text>
            <Text style={styles.subtitle}>Lütfen hesabınıza giriş yapın.</Text>
          </View>

          {/* Form Kartı */}
          <View style={styles.card}>
            {/* Animasyonlu Kilit (Soft animasyon ile açılır/kapanır) */}
            {isLockVisible && (
              <Animated.View
                style={{
                  opacity: lockOpacity,
                  transform: [
                    { scale: lockScale },
                    { translateY: lockTranslateY },
                  ],
                }}
              >
                <AnimatedLock animState={animState} statusType={statusType} />
              </Animated.View>
            )}

            {serverError && (
              <View style={styles.serverErrorBox}>
                <Text style={styles.serverErrorText}>{serverError}</Text>
              </View>
            )}

            {hasSavedCredential && (
              <View style={styles.autoFillBanner}>
                <View style={styles.autoFillInfo}>
                  <Sparkles size={14} color={COLORS.primary} />
                  <Text style={styles.autoFillText}>
                    Kayıtlı hesap bilgileri otomatik dolduruldu
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleClearSavedCredentials}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.autoFillClearText}>Temizle</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* E-posta Alanı */}
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
                      onChangeText={(text) => {
                        const clean = text.replace(/\s+/g, '');
                        onChange(clean);
                        if (animState === 'unlock' || statusType !== 'idle') {
                          setAnimState('idle');
                          setStatusType('idle');
                          setServerError(null);
                        }
                      }}
                      onBlur={onBlur}
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Şifre Alanı */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  Şifre <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotText}>Şifremi Unuttum</Text>
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
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        if (animState === 'unlock' || statusType !== 'idle') {
                          setAnimState('idle');
                          setStatusType('idle');
                          setServerError(null);
                        }
                      }}
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
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Giriş Butonu */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
                statusType === 'success' && { backgroundColor: COLORS.tertiary },
              ]}
              onPress={handleSubmit(onSubmit, onInvalid)}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.onPrimary} />
              ) : (
                <Text style={styles.submitButtonText}>
                  {statusType === 'success' ? 'Sisteme Giriliyor...' : 'Giriş Yap'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Biyometrik ile Giriş Yap Butonu */}
            {hasSavedCredential && biometricEnabled && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                <Fingerprint size={20} color={COLORS.primary} />
                <Text style={styles.biometricButtonText}>
                  {biometricInfo?.biometricTypeName
                    ? `${biometricInfo.biometricTypeName} ile Hızlı Giriş`
                    : 'Biyometrik Giriş Yap'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Ayırıcı */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google ile Giriş Yap Butonu */}
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
                  <Text style={styles.googleButtonText}>Google ile Giriş Yap</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Alt Kayıt Ol Linki */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Hesabınız yok mu?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.7}
            >
              <Text style={styles.footerLink}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
