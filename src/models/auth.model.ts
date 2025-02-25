/**
 * Kullanıcı profilini temsil eden model
 */
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    preferred_language?: string;
    phone?: string;
  };
}

/**
 * Kimlik doğrulama durumunu temsil eden model
 */
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

/**
 * Giriş formu verilerini temsil eden model
 */
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * Kayıt formu verilerini temsil eden model
 */
export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
  agreeTerms: boolean;
}

/**
 * Şifre sıfırlama formu verilerini temsil eden model
 */
export interface ResetPasswordCredentials {
  email: string;
}

/**
 * Şifre güncelleme formu verilerini temsil eden model
 */
export interface UpdatePasswordCredentials {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

/**
 * Kullanıcı tercihleri modelini temsil eder
 */
export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    matches: boolean;
    tournaments: boolean;
    challenges: boolean;
    system: boolean;
  };
  privacy: {
    showProfile: 'public' | 'friends' | 'private';
    showStats: 'public' | 'friends' | 'private';
    showActivity: 'public' | 'friends' | 'private';
  };
  language: string;
  created_at: string;
  updated_at: string;
}

/**
 * Bildirim modelini temsil eder
 */
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  is_read: boolean;
  created_at: string;
} 