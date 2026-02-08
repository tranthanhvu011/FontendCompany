import { useState, useEffect, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotSchema, type ForgotFormData } from '@/utils/validations'
import styles from './AuthModal.module.css'
import { useAuth } from '@/contexts/AuthContext'
import { email } from 'zod'
import { FiEye, FiEyeOff, FiMail, FiSend } from 'react-icons/fi'

interface ForgotFormProps {
    onSwitchView: (view: 'login') => void
}

export const ForgotForm = ({ onSwitchView }: ForgotFormProps) => {
    const [sent, setSent] = useState(false)
    const { forgotPassword, checkEmail } = useAuth();
    const [emailValid, setEmailValid] = useState(false)
    const emailCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const [submitting, setSubmitting] = useState(false)
    const isSubmittingRef = useRef(false)
    const [success, setSuccess] = useState(false)

    const { register, handleSubmit, setError, clearErrors, formState: { errors, dirtyFields } } = useForm<ForgotFormData>({
        resolver: zodResolver(forgotSchema),
        mode: 'onChange',
    })
    // const handleEmailCheck = useCallback((email: string) => {
    //     if (emailCheckTimeout.current)
    //         clearTimeout(emailCheckTimeout.current)
    //     setEmailValid(false)
    //     if (isValidEmail(email)) {
    //         emailCheckTimeout.current = setTimeout(async () => {
    //             try {
    //                 const exists = await checkEmail(email)
    //                 if (exists) {
    //                     setEmailValid(true)
    //                     clearErrors('email')
    //                 } else {
    //                     setEmailValid(false)
    //                     setError('email', { message: 'Email không tồn tại' })
    //                 }
    //             } catch (error) {
    //                 setEmailValid(false)
    //                 setError('email', { message: 'Không thể kiểm tra email' })
    //             }
    //         }, 500)
    //     } else {
    //         setEmailValid(false)
    //     }
    // }, [checkEmail, setError, clearErrors])


    const onSubmit = async (data: { email: string }) => {
        // if (!emailValid) {
        //     setError('email', { message: 'Email không hợp lệ' })
        //     return
        // }
        if (isSubmittingRef.current) return
        isSubmittingRef.current = true
        setSubmitting(true)
        try {
            await forgotPassword(data.email)
            setSent(true)
            setSuccess(true)

        } catch {
            await new Promise(resolve => setTimeout(resolve, 4000))
        } finally {
            isSubmittingRef.current = false
            setSubmitting(false)
        }
    }

    if (sent) {
        return (
            <>
                <h2>📧 Check Your Email</h2>
                <p className={styles.subtitle}>
                    We've sent a password reset link to your email. Please check your inbox and click the link to reset your password.
                </p>
                <button
                    type="button"
                    className={styles.submitBtn}
                    onClick={() => onSwitchView('login')}
                >
                    Back to Login
                </button>
            </>
        )
    }

    return (
        <>
            <h2>Reset Your Password</h2>
            <p className={styles.subtitle}>
                We will send you a link to reset your password
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formGroup}>
                    <label>Email</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            {...register('email')}
                        />
                        {/* {emailValid && (
                            <span className={styles.inputSuccess}>✓</span>
                        )} */}
                        <FiMail className={styles.inputIcon} />
                    </div>
                    {dirtyFields.email && errors.email && (
                        <p className={styles.errorText}>{errors.email.message}</p>
                    )}
                    {emailValid && !errors.email && (
                        <p className={styles.successText}>Email hợp lệ ✓</p>
                    )}

                </div>

                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                    {submitting ? 'Sending...' : 'Reset Password'}
                </button>
            </form>

            <div className={styles.divider}>
                <span>Or</span>
            </div>

            <p className={styles.backToLogin}>
                Back to{' '}
                <button type="button" className={styles.linkBtn} onClick={() => onSwitchView('login')}>
                    Login here
                </button>
            </p>
        </>
    )
}
