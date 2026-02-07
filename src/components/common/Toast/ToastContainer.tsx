import type { Toast } from '@/contexts/ToastContext';
import { ToastItem } from './Toast';
import styles from './Toast.module.css';

interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: string) => void;
}

export const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
    if (toasts.length === 0) return null;

    return (
        <div className={styles.container} aria-label="Thông báo">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};
