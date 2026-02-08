// import { useState } from 'react'
// import { useSearchParams, Link } from 'react-router-dom'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { resetPasswordSchema, type ResetPasswordFormData } from '@/utils/validations'
// import { authService } from '@/services/authService'
// import { FiEye, FiEyeOff } from 'react-icons/fi'
// import styles from './ResetPassword.module.css'

// export const ResetPassword = () => {
//     const [searchParams] = useSearchParams()
//     const token = searchParams.get('token')

//     const [showPassword, setShowPassword] = useState(false)
//     const [showConfirm, setShowConfirm] = useState(false)
//     const [success, setSuccess] = useState(false)
//     const [submitting, setSubmitting] = useState(false)

//     const {
//         register, handleSubmit,
//         formState: { errors },
//     } = useForm<ResetPasswordFormData>({
//         resolver: zodResolver(resetPasswordSchema),
//         mode: 'onChange',
//     })

//     // Không có token → hiện lỗi
//     if (!token) {
//         return (
//             <div className={styles.resetPage}>
//                 <div className={styles.resetCard}>
//                     <div className={styles.resetContent}>
//                         <div className={styles.errorIcon}>⚠️</div>
//                         <h2>Invalid Reset Link</h2>
//                         <p className={styles.subtitle}>
//                             The password reset link is invalid or has expired.
//                             Please request a new one.
//                         </p>
//                         <Link to="/" className={styles.homeLink}>
//                             ← Back to Home
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     // Đổi mật khẩu thành công
//     if (success) {
//         return (
//             <div className={styles.resetPage}>
//                 <div className={styles.resetCard}>
//                     <div className={styles.resetContent}>
//                         <div className={styles.successIcon}>✅</div>
//                         <h2>Password Reset Successfully</h2>
//                         <p className={styles.subtitle}>
//                             Your password has been changed. You can now log in with your new password.
//                         </p>
//                         <Link to="/" className={styles.loginLink}>
//                             ← Go to Login
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     const onSubmit = async (data: ResetPasswordFormData) => {
//         setSubmitting(true)
//         try {
//             await authService.resetPassword({
//                 token,
//                 newPassword: data.password,
//             })
//             setSuccess(true)
//         } catch {
//             // interceptor hiện toast error
//         } finally {
//             setSubmitting(false)
//         }
//     }

//     return (
//         <div className={styles.resetPage}>
//             <div className={styles.resetCard}>
//                 <div className={styles.resetContent}>
//                     <h2>Set New Password</h2>
//                     <p className={styles.subtitle}>
//                         Enter your new password below
//                     </p>

//                     <form onSubmit={handleSubmit(onSubmit)}>
//                         {/* New Password */}
//                         <div className={styles.formGroup}>
//                             <label>New Password</label>
//                             <div className={styles.inputWrapper}>
//                                 <input
//                                     type={showPassword ? 'text' : 'password'}
//                                     placeholder="Enter new password"
//                                     {...register('password')}
//                                 />
//                                 <button
//                                     type="button"
//                                     className={styles.eyeBtn}
//                                     onClick={() => setShowPassword(!showPassword)}
//                                 >
//                                     {showPassword ? <FiEyeOff /> : <FiEye />}
//                                 </button>
//                             </div>
//                             {errors.password && (
//                                 <p className={styles.errorText}>{errors.password.message}</p>
//                             )}
//                         </div>

//                         {/* Confirm Password */}
//                         <div className={styles.formGroup}>
//                             <label>Confirm Password</label>
//                             <div className={styles.inputWrapper}>
//                                 <input
//                                     type={showConfirm ? 'text' : 'password'}
//                                     placeholder="Confirm new password"
//                                     {...register('confirmPassword')}
//                                 />
//                                 <button
//                                     type="button"
//                                     className={styles.eyeBtn}
//                                     onClick={() => setShowConfirm(!showConfirm)}
//                                 >
//                                     {showConfirm ? <FiEyeOff /> : <FiEye />}
//                                 </button>
//                             </div>
//                             {errors.confirmPassword && (
//                                 <p className={styles.errorText}>{errors.confirmPassword.message}</p>
//                             )}
//                         </div>

//                         <button
//                             type="submit"
//                             className={styles.submitBtn}
//                             disabled={submitting}
//                         >
//                             {submitting ? 'Resetting...' : 'Reset Password'}
//                         </button>
//                     </form>

//                     <Link to="/" className={styles.loginLink}>
//                         ← Back to Home
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     )
// }
