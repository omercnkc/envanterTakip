/**
 * Modern Bildirim, Onay (Alert) ve Toast Yönetim Context'i
 * React Native'in native Alert.alert'ı yerine modern Material 3 / Glassmorphic UI sağlar.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type AlertType = 'info' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number; // ms cinsinden gösterim süresi (varsayılan: 3500)
}

export interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

export interface AlertOptions {
  type?: AlertType;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  showCancel?: boolean;
  destructive?: boolean;
  buttons?: AlertButton[];
}

interface AlertContextType {
  // Toast Fonksiyonları
  toast: ToastOptions | null;
  showToast: (options: ToastOptions | string, type?: ToastType) => void;
  hideToast: () => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;

  // Modern Alert / Confirm Fonksiyonları
  alert: AlertOptions | null;
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
  confirm: (
    title: string,
    message?: string,
    options?: Partial<AlertOptions>
  ) => Promise<boolean>;
}

export interface AlertServiceType {
  showToast: (options: ToastOptions | string, type?: ToastType) => void;
  showAlert: (options: AlertOptions) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  confirm: (title: string, message?: string, options?: Partial<AlertOptions>) => Promise<boolean>;
}

export const alertService: AlertServiceType = {
  showToast: () => {},
  showAlert: () => {},
  showSuccess: () => {},
  showError: () => {},
  showWarning: () => {},
  showInfo: () => {},
  confirm: async () => false,
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [alert, setAlert] = useState<AlertOptions | null>(null);

  // --- TOAST YÖNETİMİ ---
  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback((options: ToastOptions | string, type: ToastType = 'info') => {
    if (typeof options === 'string') {
      setToast({
        id: Date.now().toString(),
        type,
        message: options,
        duration: 3500,
      });
    } else {
      setToast({
        id: Date.now().toString(),
        type: options.type || 'info',
        title: options.title,
        message: options.message,
        duration: options.duration || 3500,
      });
    }
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    showToast({ type: 'success', title: title || 'Başarılı', message });
  }, [showToast]);

  const showError = useCallback((message: string, title?: string) => {
    showToast({ type: 'error', title: title || 'Hata', message });
  }, [showToast]);

  const showWarning = useCallback((message: string, title?: string) => {
    showToast({ type: 'warning', title: title || 'Dikkat', message });
  }, [showToast]);

  const showInfo = useCallback((message: string, title?: string) => {
    showToast({ type: 'info', title: title || 'Bilgi', message });
  }, [showToast]);

  // --- ALERT / CONFIRM YÖNETİMİ ---
  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const showAlert = useCallback((options: AlertOptions) => {
    setAlert(options);
  }, []);

  // Promise tabanlı modern onay diyaloğu (await confirm('Sil', 'Emin misiniz?'))
  const confirm = useCallback(
    (title: string, message?: string, options?: Partial<AlertOptions>): Promise<boolean> => {
      return new Promise((resolve) => {
        setAlert({
          title,
          message,
          type: options?.type || 'danger',
          confirmText: options?.confirmText || 'Evet, Onayla',
          cancelText: options?.cancelText || 'Vazgeç',
          showCancel: true,
          destructive: options?.destructive ?? true,
          ...options,
          onConfirm: async () => {
            if (options?.onConfirm) {
              await options.onConfirm();
            }
            setAlert(null);
            resolve(true);
          },
          onCancel: () => {
            if (options?.onCancel) {
              options.onCancel();
            }
            setAlert(null);
            resolve(false);
          },
        });
      });
    },
    []
  );

  useEffect(() => {
    alertService.showToast = showToast;
    alertService.showAlert = showAlert;
    alertService.showSuccess = showSuccess;
    alertService.showError = showError;
    alertService.showWarning = showWarning;
    alertService.showInfo = showInfo;
    alertService.confirm = confirm;
  }, [showToast, showAlert, showSuccess, showError, showWarning, showInfo, confirm]);

  const value = useMemo(
    () => ({
      toast,
      showToast,
      hideToast,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      alert,
      showAlert,
      hideAlert,
      confirm,
    }),
    [
      toast,
      showToast,
      hideToast,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      alert,
      showAlert,
      hideAlert,
      confirm,
    ]
  );

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
