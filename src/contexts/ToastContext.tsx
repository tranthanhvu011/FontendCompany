import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ToastContainer } from '@/components/common/Toast';
import { registerToast } from '@/utils/toastManager';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration: number;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);
const MAX_TOASTS = 5;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const counterRef = useRef(0);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType = 'info', duration: number = 4000) => {
        const id = `toast-${Date.now()}-${counterRef.current++}`;
        const newToast: Toast = { id, message, type, duration };

        setToasts(prev => {
            const updated = [...prev, newToast];
            if (updated.length > MAX_TOASTS) {
                return updated.slice(updated.length - MAX_TOASTS);
            }
            return updated;
        });
    }, []);

    const success = useCallback((message: string, duration?: number) => addToast(message, 'success', duration), [addToast]);
    const error = useCallback((message: string, duration?: number) => addToast(message, 'error', duration), [addToast]);
    const warning = useCallback((message: string, duration?: number) => addToast(message, 'warning', duration), [addToast]);
    const info = useCallback((message: string, duration?: number) => addToast(message, 'info', duration), [addToast]);

    // Đăng ký toast functions vào global manager (cho Axios interceptor dùng)
    useEffect(() => {
        registerToast({ success, error, warning, info, addToast });
    }, [success, error, warning, info, addToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
