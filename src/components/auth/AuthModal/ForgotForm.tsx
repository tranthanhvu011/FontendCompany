import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { forgotSchema, type ForgotFormData } from '@/utils/validations'
import styles from './AuthModal.module.css'
import { useAuth } from '@/contexts/AuthContext'
import { FiMail } from 'react-icons/fi'

interface ForgotFormProps {
    onSwitchView: (view: 'login') => void
}

export const ForgotForm = ({ onSwitchView }: ForgotFormProps) => {
    const { t } = useTranslation('auth')
    const [sent, setSent] = useState(false)
    const { forgotPassword } = useAuth();
    const [submitting, setSubmitting] = useState(false)
    const isSubmittingRef = useRef(false)

    const { register, handleSubmit, formState: { errors, dirtyFields } } = useForm<ForgotFormData>({
        resolver: zodResolver(forgotSchema),
        mode: 'onChange',
    })



    const onSubmit = async (data: { email: string }) => {
        if (isSubmittingRef.current) return
        isSubmittingRef.current = true
        setSubmitting(true)
        try {
            await forgotPassword(data.email)
            setSent(true)
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
                <h2><FiMail style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} /> {t('forgot.check_email')}</h2>
                <p className={styles.subtitle}>
                    {t('forgot.check_email_desc')}
                </p>
                <button
                    type="button"
                    className={styles.submitBtn}
                    onClick={() => onSwitchView('login')}
                >
                    {t('forgot.back_to_login')}
                </button>
            </>
        )
    }

    return (
        <>
            <h2>{t('forgot.title')}</h2>
            <p className={styles.subtitle}>
                {t('forgot.subtitle')}
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formGroup}>
                    <label>{t('forgot.email')}</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            {...register('email')}
                        />
                        <FiMail className={styles.inputIcon} />
                    </div>
                    {dirtyFields.email && errors.email && (
                        <p className={styles.errorText}>{errors.email.message}</p>
                    )}


                </div>

                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                    {submitting ? t('forgot.sending') : t('forgot.submit')}
                </button>
            </form>

            <div className={styles.divider}>
                <span>{t('forgot.or')}</span>
            </div>

            <p className={styles.backToLogin}>
                {t('forgot.back_to')}{' '}
                <button type="button" className={styles.linkBtn} onClick={() => onSwitchView('login')}>
                    {t('forgot.login_here')}
                </button>
            </p>
        </>
    )
}
