import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { loginSchema, type LoginFormData } from '@/utils/validations'
import { useAuth } from '@/contexts/AuthContext'

import styles from './AuthModal.module.css'

interface LoginFormProps {
    onClose: () => void
    onSwitchView: (view: 'register' | 'forgot') => void
}
export const LoginForm = ({ onClose, onSwitchView }: LoginFormProps) => {
    const { login } = useAuth()
    const [showPassword, setShowPassword] = useState(false)

    const { register, handleSubmit, formState: { errors, dirtyFields } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    })

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data.email, data.password)
            onClose()
        } catch {

        }
    }

    return (
        <>
            <h2>Welcome Back, Get Login</h2>
            <p className={styles.subtitle}>
                Join your account. Don't have account?{' '}
                <button type="button" className={styles.linkBtn} onClick={() => onSwitchView('register')}>
                    Create Account
                </button>
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formGroup}>
                    <label>Email</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="email"
                            placeholder="customer@demo.com"
                            {...register('email')}
                        />
                    </div>
                    {dirtyFields.email && errors.email && (
                        <p className={styles.errorText}>{errors.email.message}</p>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label>Password</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...register('password')}
                        />
                        <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    {dirtyFields.password && errors.password && (
                        <p className={styles.errorText}>{errors.password.message}</p>
                    )}
                </div>

                <div className={styles.formOptions}>
                    <label className={styles.checkbox}>
                        <input type="checkbox" />
                        <span className={styles.checkmark}></span>
                        Remember me
                    </label>
                    <button type="button" className={styles.forgotLink} onClick={() => onSwitchView('forgot')}>
                        Forgot Password?
                    </button>
                </div>

                <button type="submit" className={styles.submitBtn}>
                    Get Login
                </button>
            </form>
        </>
    )
}
