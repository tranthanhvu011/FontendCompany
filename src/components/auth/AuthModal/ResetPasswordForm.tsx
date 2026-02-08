import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/utils/validations'
import { authService } from '@/services/authService'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import styles from './AuthModal.module.css'

interface ResetPasswordFormProps {
    token: string
    onSwitchView: (view: 'login') => void
}

export const ResetPasswordForm = ({ token, onSwitchView }: ResetPasswordFormProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [success, setSuccess] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const isSubmittingRef = useRef(false)
    const {
        register, handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onChange',
    })

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (isSubmittingRef.current) return
        isSubmittingRef.current = true
        setSubmitting(true)
        try {
            await authService.resetPassword({
                token,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            })
            setSuccess(true)
        } catch {
            await new Promise(resolve => setTimeout(resolve, 3000))
        } finally {
            isSubmittingRef.current = false
            setSubmitting(false)
        }
    }

    if (success) {
        return (
            <>
                <h2>✅ Password Reset Successfully</h2>
                <p className={styles.subtitle}>
                    Your password has been changed. You can now log in with your new password.
                </p>
                <button
                    type="button"
                    className={styles.submitBtn}
                    onClick={() => onSwitchView('login')}
                >
                    Go to Login
                </button>
            </>
        )
    }

    return (
        <>
            <h2>Set New Password</h2>
            <p className={styles.subtitle}>
                Enter your new password below
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* New Password */}
                <div className={styles.formGroup}>
                    <label>New Password</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter new password"
                            {...register('newPassword')}
                        />
                        <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    {errors.newPassword && (
                        <p className={styles.errorText}>{errors.newPassword.message}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className={styles.formGroup}>
                    <label>Confirm Password</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            placeholder="Confirm new password"
                            {...register('confirmPassword')}
                        />
                        <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            {showConfirm ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className={styles.errorText}>{errors.confirmPassword.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={submitting}
                >
                    {submitting ? 'Resetting...' : 'Reset Password'}
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
