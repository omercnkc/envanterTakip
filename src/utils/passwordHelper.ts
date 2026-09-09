/**
 * Şifre Güvenliği & Rastgele Güçlü Şifre Üretici Yardımcısı
 */

export interface PasswordRuleCheck {
  id: string;
  label: string;
  isValid: boolean;
}

export interface PasswordStrengthResult {
  score: number; // 0 - 4
  label: 'Zayıf' | 'Orta' | 'İyi' | 'Çok Güçlü';
  color: string;
  percentage: number;
  checks: PasswordRuleCheck[];
}

/**
 * Şifrenin kurallara uygunluğunu ve gücünü analiz eder.
 */
export const checkPasswordStrength = (password: string): PasswordStrengthResult => {
  const checks: PasswordRuleCheck[] = [
    {
      id: 'length',
      label: 'En az 4, en fazla 12 karakter',
      isValid: password.length >= 4 && password.length <= 12,
    },
    {
      id: 'cases',
      label: 'Büyük ve küçük harf (A-Z, a-z)',
      isValid: /[A-Z]/.test(password) && /[a-z]/.test(password),
    },
    {
      id: 'number',
      label: 'En az bir rakam (0-9)',
      isValid: /[0-9]/.test(password),
    },
    {
      id: 'special',
      label: 'En az bir özel karakter (!@#$%^&* vb.)',
      isValid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const passedCount = checks.filter((c) => c.isValid).length;

  if (password.length === 0) {
    return {
      score: 0,
      label: 'Zayıf',
      color: '#e2e8f0',
      percentage: 0,
      checks,
    };
  }

  if (passedCount <= 1) {
    return {
      score: 1,
      label: 'Zayıf',
      color: '#ef4444',
      percentage: 25,
      checks,
    };
  }

  if (passedCount === 2 || passedCount === 3) {
    return {
      score: passedCount,
      label: passedCount === 2 ? 'Orta' : 'İyi',
      color: passedCount === 2 ? '#f59e0b' : '#3b82f6',
      percentage: passedCount === 2 ? 50 : 75,
      checks,
    };
  }

  return {
    score: 4,
    label: 'Çok Güçlü',
    color: '#10b981',
    percentage: 100,
    checks,
  };
};

/**
 * Yüksek güvenlikli rastgele şifre üretir (12 karakter).
 */
export const generateStrongPassword = (length: number = 12): string => {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Karışıklığı önlemek için I ve O hariç
  const lower = 'abcdefghijkmnopqrstuvwxyz'; // l hariç
  const numbers = '23456789'; // 0 ve 1 hariç
  const symbols = '!@#$%^&*_-+=';

  let password = '';
  // Her kategoriden en az 1 karakter garantile
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  const allChars = upper + lower + numbers + symbols;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Karakterleri karıştır (Shuffle)
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
};
