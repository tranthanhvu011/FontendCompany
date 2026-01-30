import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUI } from '@/contexts/UIContext'
import { FiX, FiEye, FiEyeOff, FiMail, FiSend } from 'react-icons/fi'
import styles from './AuthModal.module.css'
import { useAuth } from '@/contexts/AuthContext'

type AuthView = 'login' | 'register' | 'forgot'

// Helper to get localStorage key for OTP cooldown
const getOtpCooldownKey = (email: string) => `otp_cooldown_end_${email.toLowerCase().trim()}`

export const AuthModal = () => {
    const { isLoginOpen, closeLogin } = useUI()
    const [view, setView] = useState<AuthView>('login')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    // Form states
    const [loginForm, setLoginForm] = useState({ email: '', password: '' })
    const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', otp: '' })
    const [forgotForm, setForgotForm] = useState({ email: '' })
    // OTP states
    const [showOtpSection, setShowOtpSection] = useState(false)
    const [otpCooldown, setOtpCooldown] = useState(0)
    const [isOtpSending, setIsOtpSending] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const { checkUsername } = useAuth()
    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isCheckingEmail, setIsCheckingEmail] = useState(false)
    const usernameCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Reset view when modal closes
    useEffect(() => {
        if (!isLoginOpen) {
            setTimeout(() => {
                setView('login')
                setShowPassword(false)
                setShowOtpSection(false)
                setOtpSent(false)
            }, 300)
        }
    }, [isLoginOpen])

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isLoginOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isLoginOpen])

    // Initialize OTP countdown from localStorage when email changes
    const initializeCooldown = useCallback((email: string) => {
        if (!email) return
        const key = getOtpCooldownKey(email)
        const savedEndTime = localStorage.getItem(key)
        if (savedEndTime) {
            const endTime = parseInt(savedEndTime, 10)
            const now = Date.now()
            const remainingSeconds = Math.ceil((endTime - now) / 1000)
            if (remainingSeconds > 0) {
                setOtpCooldown(remainingSeconds)
                setOtpSent(true)
            } else {
                localStorage.removeItem(key)
                setOtpCooldown(0)
            }
        }
    }, [])

    // Initialize countdown when showing OTP section or email changes
    useEffect(() => {
        if (showOtpSection && registerForm.email) {
            initializeCooldown(registerForm.email)
        }
    }, [showOtpSection, registerForm.email, initializeCooldown])

    // Countdown timer
    useEffect(() => {
        if (otpCooldown <= 0) return

        const timer = setInterval(() => {
            setOtpCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [otpCooldown])

    // Validate email format
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    // Handle email change in register form
    const handleRegisterEmailChange = (email: string) => {
        setRegisterForm({ ...registerForm, email })
        if (isValidEmail(email)) {
            setShowOtpSection(true)
            initializeCooldown(email)
        } else {
            setShowOtpSection(false)
        }
    }

    // Handle send OTP
    const handleSendOtp = async () => {
        if (!registerForm.email || otpCooldown > 0 || isOtpSending) return

        setIsOtpSending(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        // Save end time to localStorage
        const cooldownDuration = 60 // seconds
        const endTime = Date.now() + cooldownDuration * 1000
        const key = getOtpCooldownKey(registerForm.email)
        localStorage.setItem(key, endTime.toString())

        setOtpCooldown(cooldownDuration)
        setOtpSent(true)
        setIsOtpSending(false)

        console.log('OTP sent to:', registerForm.email)
    }
    const handleClose = () => {
        closeLogin()
    }
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose()
        }
    }
    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Login:', loginForm)
        // TODO: Implement actual login
        handleClose()
    }
    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!otpSent) {
            alert('Vui lòng gửi mã OTP trước!')
            return
        }
        if (!registerForm.otp) {
            alert('Vui lòng nhập mã OTP!')
            return
        }
        console.log('Register:', registerForm)
        // TODO: Implement actual register with OTP verification
        handleClose()
    }
    const handleForgotSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Forgot Password:', forgotForm)
        // TODO: Implement actual forgot password
        alert('Password reset link sent to your email!')
    }
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    }
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring' as const, damping: 25, stiffness: 300 }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: 20,
            transition: { duration: 0.2 }
        }
    }
    const contentVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { delay: 0.1 }
        },
        exit: { opacity: 0, x: -20 }
    }
    const handleUsernameChange = (username: string) => {
        setRegisterForm({ ...registerForm, name: username })
        setUsernameError('')
        if (usernameCheckTimeout.current) {
            clearTimeout(usernameCheckTimeout.current)
        }
        if (username.length >= 3) {
            setIsCheckingUsername(true)
            usernameCheckTimeout.current = setTimeout(async () => {
                try {
                    const exists = await checkUsername(username)
                    if (exists) {
                        setUsernameError('Username already exists')
                    } else {
                        setUsernameError('')
                    }
                } catch (error) {
                    console.error('Error checking username:', error)

                } finally {
                    setIsCheckingUsername(false)
                }
            }, 500)

        } else {
            setIsCheckingUsername(false)
        }
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
                                <motion.div
                                    key="login"
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className={styles.content}
                                >
                                    <h2>Welcome Back, Get Login</h2>
                                    <p className={styles.subtitle}>
                                        Join your account. Don't have account?{' '}
                                        <button
                                            type="button"
                                            className={styles.linkBtn}
                                            onClick={() => setView('register')}
                                        >
                                            Create Account
                                        </button>
                                    </p>

                                    <form onSubmit={handleLoginSubmit}>
                                        <div className={styles.formGroup}>
                                            <label>Email</label>
                                            <div className={styles.inputWrapper}>
                                                <input
                                                    type="email"
                                                    placeholder="customer@demo.com"
                                                    value={loginForm.email}
                                                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Password</label>
                                            <div className={styles.inputWrapper}>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    value={loginForm.password}
                                                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.eyeBtn}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.formOptions}>
                                            <label className={styles.checkbox}>
                                                <input
                                                    type="checkbox"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                />
                                                <span className={styles.checkmark}></span>
                                                Remember me
                                            </label>
                                            <button
                                                type="button"
                                                className={styles.forgotLink}
                                                onClick={() => setView('forgot')}
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>

                                        <button type="submit" className={styles.submitBtn}>
                                            Get Login
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {view === 'register' && (
                                <motion.div
                                    key="register"
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className={styles.content}
                                >
                                    <h2>Welcome Back, Get Login</h2>
                                    <p className={styles.subtitle}>
                                        Create your account. Already have account?{' '}
                                        <button
                                            type="button"
                                            className={styles.linkBtn}
                                            onClick={() => setView('login')}
                                        >
                                            Login here
                                        </button>
                                    </p>

                                    <form onSubmit={handleRegisterSubmit}>
                                        <div className={styles.formGroup}>
                                            <label>Username</label>
                                            <div className={styles.inputWrapper}>
                                                <input
                                                    type="text"
                                                    placeholder="Nhập username"
                                                    value={registerForm.name}
                                                    onChange={(e) => handleUsernameChange(e.target.value)}
                                                    required
                                                />
                                                {isCheckingUsername && (
                                                    <span className={styles.inputLoading}>⏳</span>
                                                )}
                                                {!isCheckingUsername && !usernameError && registerForm.name.length >= 3 && (
                                                    <span className={styles.inputSuccess}>✓</span>
                                                )}
                                            </div>
                                            {usernameError && (
                                                <p className={styles.errorText}>{usernameError}</p>
                                            )}
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Email</label>
                                            <div className={styles.inputWrapper}>
                                                <input
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    value={registerForm.email}
                                                    onChange={(e) => handleRegisterEmailChange(e.target.value)}
                                                    required
                                                />
                                                <FiMail className={styles.inputIcon} />
                                            </div>
                                        </div>

                                        {/* OTP Section - appears when email is valid */}
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
                                                                    value={registerForm.otp}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                                                                        setRegisterForm({ ...registerForm, otp: value })
                                                                    }}
                                                                    maxLength={6}
                                                                    className={styles.otpInput}
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

                                        <div className={styles.formGroup}>
                                            <label>Password</label>
                                            <div className={styles.inputWrapper}>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    value={registerForm.password}
                                                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.eyeBtn}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                                </button>
                                            </div>
                                        </div>

                                        <button type="submit" className={styles.submitBtn}>
                                            Register
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {view === 'forgot' && (
                                <motion.div
                                    key="forgot"
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className={styles.content}
                                >
                                    <h2>Reset Your Password</h2>
                                    <p className={styles.subtitle}>
                                        We will send you a link to reset your password
                                    </p>

                                    <form onSubmit={handleForgotSubmit}>
                                        <div className={styles.formGroup}>
                                            <label>Email</label>
                                            <div className={styles.inputWrapper}>
                                                <input
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    value={forgotForm.email}
                                                    onChange={(e) => setForgotForm({ ...forgotForm, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" className={styles.submitBtn}>
                                            Reset Password
                                        </button>
                                    </form>

                                    <div className={styles.divider}>
                                        <span>Or</span>
                                    </div>

                                    <p className={styles.backToLogin}>
                                        Back to{' '}
                                        <button
                                            type="button"
                                            className={styles.linkBtn}
                                            onClick={() => setView('login')}
                                        >
                                            Login here
                                        </button>
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
