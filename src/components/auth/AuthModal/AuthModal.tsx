import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUI } from '@/contexts/UIContext'
import { FiX } from 'react-icons/fi'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { ForgotForm } from './ForgotForm'
import { ResetPasswordForm } from './ResetPasswordForm'
import styles from './AuthModal.module.css'

type AuthView = 'login' | 'register' | 'forgot' | 'resetPassword'

export const AuthModal = () => {
    const { isLoginOpen, closeLogin, openLogin } = useUI()
    const [view, setView] = useState<AuthView>('login')
    const [searchParams, setSearchParams] = useSearchParams()
    const resetToken = searchParams.get('token')

    // Auto-open modal khi có token trong URL (từ email reset link)
    useEffect(() => {
        if (resetToken) {
            setView('resetPassword')
            openLogin()
        }
    }, [resetToken])

    useEffect(() => {
        if (!isLoginOpen) {
            setTimeout(() => {
                // Chỉ reset view nếu không có token
                if (!resetToken) setView('login')
            }, 300)
        }
    }, [isLoginOpen, resetToken])

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = isLoginOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isLoginOpen])

    const handleClose = () => {
        // Xóa token khỏi URL khi đóng modal
        if (resetToken) {
            searchParams.delete('token')
            setSearchParams(searchParams, { replace: true })
        }
        closeLogin()
    }
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) handleClose()
    }

    // Animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    }
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1, scale: 1, y: 0,
            transition: { type: 'spring' as const, damping: 25, stiffness: 300 },
        },
        exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
    }
    const contentVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { delay: 0.1 } },
        exit: { opacity: 0, x: -20 },
    }

    return (
        <AnimatePresence>
            {isLoginOpen && (
                <motion.div
                    className={styles.backdrop}
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        className={styles.modal}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className={styles.closeBtn} onClick={handleClose}>
                            <FiX />
                        </button>

                        <AnimatePresence mode="wait">
                            {view === 'login' && (
                                <motion.div key="login" variants={contentVariants} initial="hidden" animate="visible" exit="exit" className={styles.content}>
                                    <LoginForm onClose={handleClose} onSwitchView={setView} />
                                </motion.div>
                            )}

                            {view === 'register' && (
                                <motion.div key="register" variants={contentVariants} initial="hidden" animate="visible" exit="exit" className={styles.content}>
                                    <RegisterForm onClose={handleClose} onSwitchView={setView} />
                                </motion.div>
                            )}

                            {view === 'forgot' && (
                                <motion.div key="forgot" variants={contentVariants} initial="hidden" animate="visible" exit="exit" className={styles.content}>
                                    <ForgotForm onSwitchView={setView} />
                                </motion.div>
                            )}

                            {view === 'resetPassword' && resetToken && (
                                <motion.div key="resetPassword" variants={contentVariants} initial="hidden" animate="visible" exit="exit" className={styles.content}>
                                    <ResetPasswordForm token={resetToken} onSwitchView={setView} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
