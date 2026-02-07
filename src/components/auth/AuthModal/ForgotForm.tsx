import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotSchema, type ForgotFormData } from '@/utils/validations'
import styles from './AuthModal.module.css'

interface ForgotFormProps {
    onSwitchView: (view: 'login') => void
}

export const ForgotForm = ({ onSwitchView }: ForgotFormProps) => {
    const { register, handleSubmit, formState: { errors, dirtyFields } } = useForm<ForgotFormData>({
        resolver: zodResolver(forgotSchema),
        mode: 'onBlur',
    })

    const onSubmit = async (data: ForgotFormData) => {
        try {
            console.log('Forgot password:', data.email)
        } catch {
            // interceptor hiện toast error
        }
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
                    </div>
                    {dirtyFields.email && errors.email && (
                        <p className={styles.errorText}>{errors.email.message}</p>
                    )}
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
                <button type="button" className={styles.linkBtn} onClick={() => onSwitchView('login')}>
                    Login here
                </button>
            </p>
        </>
    )
}
