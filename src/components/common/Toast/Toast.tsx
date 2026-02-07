import { useEffect, useState, useRef } from 'react';
import type { Toast as ToastType } from '@/contexts/ToastContext';
import styles from './Toast.module.css';

interface ToastItemProps {
    toast: ToastType;
    onRemove: (id: string) => void;
}

const icons = {
    success: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    error: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
    warning: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    info: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    ),
};

export const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
    const [exiting, setExiting] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const isPaused = useRef(false);
    const remainingRef = useRef(toast.duration);
    const startTimeRef = useRef(Date.now());

    const handleClose = () => {
        if (exiting) return;
        setExiting(true);
        setTimeout(() => onRemove(toast.id), 300);
    };

    useEffect(() => {
        startTimeRef.current = Date.now();
        timerRef.current = setTimeout(() => {
            handleClose();
        }, toast.duration);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleMouseEnter = () => {
        isPaused.current = true;
        if (timerRef.current) clearTimeout(timerRef.current);
        remainingRef.current -= Date.now() - startTimeRef.current;
    };

    const handleMouseLeave = () => {
        isPaused.current = false;
        startTimeRef.current = Date.now();
        timerRef.current = setTimeout(() => {
            handleClose();
        }, Math.max(remainingRef.current, 500));
    };

    const toastClasses = [
        styles.toast,
        styles[toast.type],
        exiting ? styles.exiting : '',
    ].filter(Boolean).join(' ');

    return (
        <div
            className={toastClasses}
            role="alert"
            aria-live="assertive"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ '--toast-duration': `${toast.duration}ms` } as React.CSSProperties}
        >
            <div className={styles.icon}>
                {icons[toast.type]}
            </div>
            <div className={styles.body}>
                <p className={styles.message}>{toast.message}</p>
            </div>
            <button
                className={styles.closeBtn}
                onClick={handleClose}
                aria-label="Đóng thông báo"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
            <div className={styles.progressBar} />
        </div>
    );
};
