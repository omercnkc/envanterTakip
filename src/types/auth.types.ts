/**
 * Kimlik Doğrulama Tipleri ve Zod Validasyon Şemaları
 */

import { z } from 'zod';

// E-posta standardı (RFC 5322 uyumlu basit format)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'E-posta adresi zorunludur')
    .regex(EMAIL_REGEX, 'Geçerli bir e-posta adresi giriniz (örn: ad@ornek.com)'),
  password: z
    .string()
    .min(1, 'Şifre alanı zorunludur'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Ad Soyad alanı zorunludur')
      .min(2, 'Ad Soyad en az 2 karakter olmalıdır')
      .max(50, 'Ad Soyad 50 karakterden uzun olamaz')
      .regex(/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/, 'Ad Soyad sadece harflerden oluşmalıdır'),
    email: z
      .string()
      .trim()
      .min(1, 'E-posta adresi zorunludur')
      .regex(EMAIL_REGEX, 'Geçerli bir e-posta adresi giriniz (örn: ad@ornek.com)'),
    password: z
      .string()
      .min(1, 'Şifre alanı zorunludur')
      .min(4, 'Şifre en az 4 karakter olmalıdır')
      .max(12, 'Şifre en fazla 12 karakter olabilir'),
    passwordConfirm: z
      .string()
      .min(1, 'Şifre tekrarı zorunludur'),
    terms: z
      .boolean()
      .refine((val) => val === true, {
        message: 'Kullanım koşulları ve gizlilik politikasını onaylamalısınız',
      }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Girdiğiniz şifreler eşleşmiyor',
    path: ['passwordConfirm'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'E-posta adresi zorunludur')
    .regex(EMAIL_REGEX, 'Geçerli bir e-posta adresi giriniz (örn: ad@ornek.com)'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
