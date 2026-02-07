import { useState, useEffect, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { FiEye, FiEyeOff, FiMail, FiSend } from 'react-icons/fi'
import { registerSchema, type RegisterFormData } from '@/utils/validations'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/services/authService'
import { useOtpCooldown } from '@/hooks/useOtpCooldown'
import styles from './AuthModal.module.css'

interface RegisterFormProps {
    onClose: () => void
    onSwitchView: (view: 'login') => void
}

export const RegisterForm = ({ onClose, onSwitchView }: RegisterFormProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showOtpSection, setShowOtpSection] = useState(false)
    const [usernameValid, setUsernameValid] = useState(false)
    const [emailValid, setEmailValid] = useState(false)
    const { checkUsername, checkEmail, sendOtp } = useAuth()
    const { otpCooldown, isOtpSending, otpSent, sendOtpToEmail, initializeCooldown } = useOtpCooldown()

    // Debounce refs
    const usernameCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    const emailCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    const {
        register, handleSubmit, watch, setValue, setError, clearErrors,
        formState: { errors, dirtyFields },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
    })

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    // Watch email để show/hide OTP section
    const watchedEmail = watch('email')

    useEffect(() => {
        if (watchedEmail && isValidEmail(watchedEmail)) {
            setShowOtpSection(true)
            initializeCooldown(watchedEmail)
        } else {
            setShowOtpSection(false)
        }
    }, [watchedEmail, initializeCooldown])

    // ========== Debounce API Checks ==========
    const handleUsernameCheck = useCallback((username: string) => {
        if (usernameCheckTimeout.current) clearTimeout(usernameCheckTimeout.current)
        setUsernameValid(false) // reset tick khi đang gõ
        if (username.length >= 3) {
            usernameCheckTimeout.current = setTimeout(async () => {
                try {
                    const exists = await checkUsername(username)
                    if (exists) {
                        setUsernameValid(false)
                        setError('username', { message: 'Username đã tồn tại' })
                    } else {
                        setUsernameValid(true)
                        clearErrors('username')
                    }
                } catch {
                    setUsernameValid(false)
                    setError('username', { message: 'Không thể kiểm tra username' })
                }
            }, 500)
        } else {
            setUsernameValid(false)
        }
    }, [checkUsername, setError, clearErrors])

    const handleEmailCheck = useCallback((email: string) => {
        if (emailCheckTimeout.current) clearTimeout(emailCheckTimeout.current)
        setEmailValid(false) // reset tick khi đang gõ
        if (isValidEmail(email)) {
            emailCheckTimeout.current = setTimeout(async () => {
                try {
                    const exists = await checkEmail(email)
                    if (exists) {
                        setEmailValid(false)
                        setError('email', { message: 'Email đã tồn tại' })
                    } else {
                        setEmailValid(true)
                        clearErrors('email')
                    }
                } catch {
                    setEmailValid(false)
                    setError('email', { message: 'Không thể kiểm tra email' })
                }
            }, 500)
        } else {
            setEmailValid(false)
        }
    }, [checkEmail, setError, clearErrors])

    // ========== Send OTP ==========
    const handleSendOtp = async () => {
        const email = watch('email')
        if (!email || !isValidEmail(email)) return
        await sendOtpToEmail(email, sendOtp)
    }

    // ========== Submit ==========
    const onSubmit = async (data: RegisterFormData) => {
        if (!otpSent) {
            setError('otp', { message: 'Vui lòng gửi mã OTP trước' })
            return
        }
        try {
            await authService.register({
                username: data.username,
                email: data.email,
                password: data.password,
                otp: data.otp,
            })
            onClose()
        } catch {
            // interceptor hiện toast error
        }
    }

    return (
        <>
            <h2>Welcome Back, Get Login</h2>
            <p className={styles.subtitle}>
                Create your account. Already have account?{' '}
                <button type="button" className={styles.linkBtn} onClick={() => onSwitchView('login')}>
                    Login here
                </button>
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Username */}
                <div className={styles.formGroup}>
                    <label>Username</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            placeholder="Nhập username"
                            {...register('username', {
                                onChange: (e) => handleUsernameCheck(e.target.value),
                            })}
                        />
                        {usernameValid && (
                            <span className={styles.inputSuccess}>✓</span>
                        )}
                    </div>
                    {usernameValid && !errors.username && (
                        <p className={styles.successText}>Username hợp lệ ✓</p>
                    )}
                    {errors.username && (
                        <p className={styles.errorText}>{errors.username.message}</p>
                    )}
                </div>

                {/* Email */}
                <div className={styles.formGroup}>
                    <label>Email</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            {...register('email', {
                                onChange: (e) => handleEmailCheck(e.target.value),
                            })}
                        />
                        {emailValid && (
                            <span className={styles.inputSuccess}>✓</span>
                        )}
                        <FiMail className={styles.inputIcon} />
                    </div>
                    {emailValid && !errors.email && (
                        <p className={styles.successText}>Email hợp lệ ✓</p>
                    )}
                    {errors.email && (
                        <p className={styles.errorText}>{errors.email.message}</p>
                    )}
                </div>

                {/* OTP Section */}
                <AnimatePresence>
                    {showOtpSection && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className={styles.otpSection}
                        >
                            <div className={styles.formGroup}>
                                <label>Mã OTP</label>
                                <div className={styles.otpRow}>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="text"
                                            placeholder="Nhập mã 6 số"
                                            maxLength={6}
                                            className={styles.otpInput}
                                            {...register('otp', {
                                                onChange: (e) => {
                                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                                                    setValue('otp', value)
                                                },
                                            })}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className={`${styles.sendOtpBtn} ${otpCooldown > 0 || isOtpSending ? styles.sendOtpBtnDisabled : ''}`}
                                        onClick={handleSendOtp}
                                        disabled={otpCooldown > 0 || isOtpSending}
                                    >
                                        {isOtpSending ? (
                                            <span className={styles.spinner}></span>
                                        ) : otpCooldown > 0 ? (
                                            <>
                                                <FiSend />
                                                <span>({otpCooldown}s)</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiSend />
                                                <span>Gửi mã</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                {dirtyFields.otp && errors.otp && (
                                    <p className={styles.errorText}>{errors.otp.message}</p>
                                )}
                                {otpSent && otpCooldown === 0 && (
                                    <p className={styles.otpHint}>Bạn có thể gửi lại mã OTP</p>
                                )}
                                {otpCooldown > 0 && (
                                    <p className={styles.otpHint}>Mã OTP đã được gửi đến email của bạn</p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Password */}
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

                <button type="submit" className={styles.submitBtn}>
                    Register
                </button>
            </form>
        </>
    )
}
