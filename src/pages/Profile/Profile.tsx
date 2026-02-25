import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { userService } from '@/services/userService'
import { resolveImgUrl } from '@/utils/imageUrl'
import styles from './Profile.module.css'
import {
    FiUser, FiEdit3, FiMail, FiPhone, FiAtSign, FiShield,
    FiCalendar, FiClock, FiCheckCircle, FiAlertCircle,
    FiSave, FiX, FiCheck, FiXCircle, FiLock, FiEye, FiEyeOff,
    FiCamera,
} from 'react-icons/fi'

interface ProfileData {
    id: number
    username: string
    email: string
    firstName: string | null
    lastName: string | null
    phone: string | null
    avatar: string | null
    enabled: boolean
    emailVerified: boolean
    roles: string[]
    createdAt: string
    lastLoginAt: string | null
}

/* ---- Skeleton Loading ---- */
const SkeletonLoading = () => (
    <div className={styles.loading}>
        <div className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} />
        <div className={`${styles.skeletonBlock} ${styles.skeletonProfileCard}`} />
        <div className={`${styles.skeletonBlock} ${styles.skeletonInfoCard}`} />
        <div className={`${styles.skeletonBlock} ${styles.skeletonAccountCard}`} />
    </div>
)

/* ==========================
   MAIN COMPONENT
   ========================== */
export const Profile = () => {
    const { t, i18n } = useTranslation('common')
    const { user, updateUser } = useAuth()
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [avatarUploading, setAvatarUploading] = useState(false)

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
    })

    // ── Change Password State ──
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [pwSaving, setPwSaving] = useState(false)
    const [pwMessage, setPwMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [showCurrentPw, setShowCurrentPw] = useState(false)
    const [showNewPw, setShowNewPw] = useState(false)
    const [showConfirmPw, setShowConfirmPw] = useState(false)

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            setLoading(true)
            const data = await userService.getProfile()
            setProfile(data)
            setForm({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                phone: data.phone || '',
            })
        } catch {
            setMessage({ type: 'error', text: t('profile.load_error') })
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage(null)
        try {
            const updated = await userService.updateProfile(form)
            setProfile(updated)
            setIsEditing(false)
            setMessage({ type: 'success', text: t('profile.update_success') })

            updateUser({
                firstName: updated.firstName || undefined,
                lastName: updated.lastName || undefined,
                phone: updated.phone || undefined,
            })

            setTimeout(() => setMessage(null), 3000)
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || t('profile.update_failed') })
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        if (profile) {
            setForm({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                phone: profile.phone || '',
            })
        }
        setIsEditing(false)
        setMessage(null)
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (!validTypes.includes(file.type)) {
            setMessage({ type: 'error', text: t('profile.avatar_format_error') })
            setTimeout(() => setMessage(null), 3000)
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: t('profile.avatar_size_error') })
            setTimeout(() => setMessage(null), 3000)
            return
        }

        setAvatarUploading(true)
        try {
            const updated = await userService.uploadAvatar(file)
            setProfile(updated)
            updateUser({ avatar: updated.avatar || undefined })
            setMessage({ type: 'success', text: t('profile.avatar_success') })
            setTimeout(() => setMessage(null), 3000)
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || t('profile.avatar_failed') })
        } finally {
            setAvatarUploading(false)
            e.target.value = ''
        }
    }

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return t('profile.no_date')
        const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US'
        return new Date(dateStr).toLocaleDateString(locale, {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
    }

    // ── Change Password Handler ──
    const handleChangePassword = async () => {
        setPwMessage(null)
        if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
            setPwMessage({ type: 'error', text: t('profile.pw_required') })
            return
        }
        if (pwForm.newPassword.length < 8) {
            setPwMessage({ type: 'error', text: t('profile.pw_min_length') })
            return
        }
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            setPwMessage({ type: 'error', text: t('profile.pw_mismatch') })
            return
        }
        setPwSaving(true)
        try {
            await userService.changePassword(pwForm)
            setPwMessage({ type: 'success', text: t('profile.pw_success') })
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
            setShowCurrentPw(false)
            setShowNewPw(false)
            setShowConfirmPw(false)
            setTimeout(() => setPwMessage(null), 4000)
        } catch (err: any) {
            setPwMessage({ type: 'error', text: err.response?.data?.message || t('profile.pw_failed') })
        } finally {
            setPwSaving(false)
        }
    }

    if (loading) return <SkeletonLoading />

    const displayName = profile?.firstName && profile?.lastName
        ? `${profile.firstName} ${profile.lastName}`
        : profile?.username || user?.email

    return (
        <div className={styles.profilePage}>
            <h1 className={styles.pageTitle}><FiUser /> {t('profile.title')}</h1>

            {/* ── Profile Header ── */}
            <div className={styles.card}>
                <div className={styles.profileHeaderCard}>
                    <div className={styles.avatarWrapper}>
                        <div className={styles.avatar}>
                            {profile?.avatar ? (
                                <img src={resolveImgUrl(profile.avatar)} alt="Avatar" />
                            ) : (
                                displayName?.charAt(0).toUpperCase()
                            )}
                            <label className={styles.avatarOverlay} htmlFor="avatar-upload">
                                {avatarUploading ? (
                                    <div className={styles.spinner} />
                                ) : (
                                    <FiCamera />
                                )}
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                style={{ display: 'none' }}
                                onChange={handleAvatarChange}
                                disabled={avatarUploading}
                            />
                        </div>
                        <div className={`${styles.avatarBadge} ${profile?.enabled ? styles.badgeActive : styles.badgeInactive}`}>
                            {profile?.enabled ? <FiCheck /> : <FiX />}
                        </div>
                    </div>
                    <div className={styles.headerInfo}>
                        <h2>{displayName}</h2>
                        <p>
                            <FiMail /> {profile?.email}
                            {profile?.emailVerified && (
                                <span className={styles.verifiedBadge}>
                                    <FiCheckCircle /> {t('profile.verified')}
                                </span>
                            )}
                        </p>
                        {profile?.roles && profile.roles.length > 0 && (
                            <span className={styles.roleBadge}>
                                <FiShield /> {profile.roles.join(' · ')}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Messages ── */}
            {message && (
                <div className={message.type === 'success' ? styles.successMsg : styles.errorMsg}>
                    {message.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                    {message.text}
                </div>
            )}

            {/* ── Personal Info ── */}
            <div className={styles.card}>
                <div className={styles.sectionTitle}>
                    <span className={styles.sectionTitleLeft}>
                        <FiEdit3 /> {t('profile.basic_info')}
                    </span>
                    {!isEditing && (
                        <button
                            className={styles.editBtn}
                            onClick={() => setIsEditing(true)}
                            aria-label={t('profile.edit')}
                        >
                            <FiEdit3 /> {t('profile.edit')}
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>{t('profile.first_name')}</label>
                                <input
                                    className={styles.formInput}
                                    value={form.firstName}
                                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                                    placeholder={t('profile.first_name_placeholder')}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>{t('profile.last_name')}</label>
                                <input
                                    className={styles.formInput}
                                    value={form.lastName}
                                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                                    placeholder={t('profile.last_name_placeholder')}
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>{t('profile.phone')}</label>
                            <input
                                className={styles.formInput}
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                placeholder={t('profile.phone_placeholder')}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>{t('profile.email')}</label>
                            <input
                                className={styles.formInput}
                                value={profile?.email || ''}
                                disabled
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>{t('profile.username')}</label>
                            <input
                                className={styles.formInput}
                                value={profile?.username || ''}
                                disabled
                            />
                        </div>
                        <div className={styles.actions}>
                            <button
                                className={styles.btnPrimary}
                                onClick={handleSave}
                                disabled={saving}
                                aria-label={t('profile.save')}
                            >
                                {saving ? (
                                    <><div className={styles.spinner} /> {t('profile.saving')}</>
                                ) : (
                                    <><FiSave /> {t('profile.save')}</>
                                )}
                            </button>
                            <button
                                className={styles.btnSecondary}
                                onClick={handleCancel}
                                disabled={saving}
                                aria-label={t('profile.cancel')}
                            >
                                <FiX /> {t('profile.cancel')}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}><FiUser /> {t('profile.first_name')}</span>
                            <span className={profile?.firstName ? styles.infoValue : styles.infoValueMuted}>
                                {profile?.firstName || t('profile.not_updated')}
                            </span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}><FiUser /> {t('profile.last_name')}</span>
                            <span className={profile?.lastName ? styles.infoValue : styles.infoValueMuted}>
                                {profile?.lastName || t('profile.not_updated')}
                            </span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}><FiMail /> {t('profile.email')}</span>
                            <span className={styles.infoValue}>{profile?.email}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}><FiPhone /> {t('profile.phone')}</span>
                            <span className={profile?.phone ? styles.infoValue : styles.infoValueMuted}>
                                {profile?.phone || t('profile.not_updated')}
                            </span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}><FiAtSign /> {t('profile.username')}</span>
                            <span className={styles.infoValue}>@{profile?.username}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Account Info ── */}
            <div className={styles.card}>
                <div className={styles.sectionTitle}>
                    <span className={styles.sectionTitleLeft}>
                        <FiShield /> {t('profile.account')}
                    </span>
                </div>
                <div className={styles.metaGrid}>
                    <div className={styles.metaItem}>
                        <div className={`${styles.metaIcon} ${styles.metaIconDefault}`}>
                            <FiCalendar />
                        </div>
                        <div className={styles.metaText}>
                            <div className={styles.metaLabel}>{t('profile.created_at')}</div>
                            <div className={styles.metaValue}>{formatDate(profile?.createdAt || null)}</div>
                        </div>
                    </div>
                    <div className={styles.metaItem}>
                        <div className={`${styles.metaIcon} ${styles.metaIconDefault}`}>
                            <FiClock />
                        </div>
                        <div className={styles.metaText}>
                            <div className={styles.metaLabel}>{t('profile.last_login')}</div>
                            <div className={styles.metaValue}>{formatDate(profile?.lastLoginAt || null)}</div>
                        </div>
                    </div>
                    <div className={styles.metaItem}>
                        <div className={`${styles.metaIcon} ${profile?.emailVerified ? styles.metaIconSuccess : styles.metaIconDanger}`}>
                            {profile?.emailVerified ? <FiCheckCircle /> : <FiXCircle />}
                        </div>
                        <div className={styles.metaText}>
                            <div className={styles.metaLabel}>{t('profile.email_verification')}</div>
                            <div className={styles.metaValue}>
                                {profile?.emailVerified ? t('profile.email_verified') : t('profile.email_not_verified')}
                            </div>
                        </div>
                    </div>
                    <div className={styles.metaItem}>
                        <div className={`${styles.metaIcon} ${profile?.enabled ? styles.metaIconSuccess : styles.metaIconDanger}`}>
                            {profile?.enabled ? <FiShield /> : <FiXCircle />}
                        </div>
                        <div className={styles.metaText}>
                            <div className={styles.metaLabel}>{t('profile.status')}</div>
                            <div className={styles.metaValue}>
                                {profile?.enabled ? t('profile.active') : t('profile.locked')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Change Password ── */}
            <div className={styles.card}>
                <div className={styles.sectionTitle}>
                    <span className={styles.sectionTitleLeft}>
                        <FiLock /> {t('profile.change_password')}
                    </span>
                </div>

                {pwMessage && (
                    <div className={pwMessage.type === 'success' ? styles.successMsg : styles.errorMsg}>
                        {pwMessage.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                        {pwMessage.text}
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label>{t('profile.current_password')}</label>
                    <div className={styles.passwordInputWrapper}>
                        <input
                            className={styles.formInput}
                            type={showCurrentPw ? 'text' : 'password'}
                            value={pwForm.currentPassword}
                            onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                            placeholder={t('profile.current_password_placeholder')}
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowCurrentPw(!showCurrentPw)}
                        >
                            {showCurrentPw ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>{t('profile.new_password')}</label>
                        <div className={styles.passwordInputWrapper}>
                            <input
                                className={styles.formInput}
                                type={showNewPw ? 'text' : 'password'}
                                value={pwForm.newPassword}
                                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                                placeholder={t('profile.new_password_placeholder')}
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowNewPw(!showNewPw)}
                            >
                                {showNewPw ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>{t('profile.confirm_password')}</label>
                        <div className={styles.passwordInputWrapper}>
                            <input
                                className={styles.formInput}
                                type={showConfirmPw ? 'text' : 'password'}
                                value={pwForm.confirmPassword}
                                onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                placeholder={t('profile.confirm_password_placeholder')}
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowConfirmPw(!showConfirmPw)}
                            >
                                {showConfirmPw ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.actions}>
                    <button
                        className={styles.btnPrimary}
                        onClick={handleChangePassword}
                        disabled={pwSaving}
                        aria-label={t('profile.change_password')}
                    >
                        {pwSaving ? (
                            <><div className={styles.spinner} /> {t('profile.pw_processing')}</>
                        ) : (
                            <><FiLock /> {t('profile.change_password')}</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
