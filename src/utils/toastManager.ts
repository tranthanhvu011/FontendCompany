// Global toast manager - cho phép gọi toast từ bên ngoài React component
// Dùng trong Axios interceptor, utility functions, v.v.

import type { ToastType } from '@/contexts/ToastContext';

interface ToastFunctions {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    addToast: (message: string, type?: ToastType, duration?: number) => void;
}

let toastFunctions: ToastFunctions | null = null;

/**
 * Đăng ký toast functions từ ToastProvider (gọi 1 lần khi app mount)
 */
export const registerToast = (fns: ToastFunctions) => {
    toastFunctions = fns;
};

/**
 * Global toast object - dùng ở bất kỳ đâu, kể cả ngoài React
 */
export const toast = {
    success: (message: string, duration?: number) => toastFunctions?.success(message, duration),
    error: (message: string, duration?: number) => toastFunctions?.error(message, duration),
    warning: (message: string, duration?: number) => toastFunctions?.warning(message, duration),
    info: (message: string, duration?: number) => toastFunctions?.info(message, duration),
};
