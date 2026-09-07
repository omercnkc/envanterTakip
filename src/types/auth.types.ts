/**
 * Kimlik Doğrulama Tipleri ve Zod Validasyon Şemaları
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi boş bırakılamaz')
    .email('Geçerli bir e-posta adresi giriniz'),
  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Ad Soyad en az 2 karakter olmalıdır'),
    email: z
      .string()
      .min(1, 'E-posta adresi boş bırakılamaz')
      .email('Geçerli bir e-posta adresi giriniz'),
    password: z
      .string()
      .min(6, 'Şifre en az 6 karakter olmalıdır'),
    passwordConfirm: z
      .string()
      .min(6, 'Şifre tekrarı gereklidir'),
    terms: z
      .boolean()
      .refine((val) => val === true, {
        message: 'Kullanım koşullarını kabul etmelisiniz',
      }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Şifreler eşleşmiyor',
    path: ['passwordConfirm'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi boş bırakılamaz')
    .email('Geçerli bir e-posta adresi giriniz'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
