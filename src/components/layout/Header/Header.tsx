import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useUI } from '@/contexts/UIContext'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useChat } from '@/contexts/ChatContext'
import { resolveImgUrl } from '@/utils/imageUrl'
import { FiMenu, FiSearch, FiSun, FiMoon, FiShoppingCart, FiUser, FiShoppingBag, FiLogOut, FiMessageCircle } from 'react-icons/fi'
import { LanguageSwitcher } from '@/components/common'
import styles from './Header.module.css'

export const Header = () => {
    const { t } = useTranslation('common')
    const { toggleSidebar, toggleTheme, toggleCart, openLogin, isDarkMode } = useUI()
    const { user, isAuthenticated, logout } = useAuth()
    const { totalQuantity: itemCount } = useCart()
    const { totalUnread } = useChat()
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    // Tên hiển thị: firstName + lastName → fallback email
    const displayName = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.email

    // Click ngoài dropdown → đóng
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = () => {
        logout()
        setShowDropdown(false)
    }

    return (
        <header className={styles.headerWrapper}>
            <div className="flex items-center gap-4 w-full">
                <div className="mobile-toggle cursor-pointer lg:hidden" onClick={toggleSidebar} role="button" aria-label="Toggle sidebar">
                    <FiMenu size={20} />
                </div>

                {/* Search Bar */}
                <div className={styles.searchContainer}>
                    <FiSearch className="text-muted" />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder={t('nav.search_placeholder')}
                    />
                    <div className={styles.searchShortcut}>/</div>
                </div>
            </div>

            <div className={styles.actionButtons}>
                {/* Language Switcher */}
                <LanguageSwitcher />

                <button
                    className={`${styles.iconButton} ${styles.themeToggle}`}
                    onClick={toggleTheme}
                    aria-label="Toggle Theme"
                >
                    {isDarkMode ? <FiSun /> : <FiMoon />}
                </button>

                {/* Messages */}
                {isAuthenticated && (
                    <button
                        className={`${styles.iconButton} ${styles.cartToggle} ${styles.messageToggle}`}
                        onClick={() => navigate('/messages')}
                        aria-label={t('nav.messages')}
                    >
                        <FiMessageCircle />
                        {totalUnread > 0 && (
                            <span className={styles.cartBadge}>
                                {totalUnread > 99 ? '99+' : totalUnread}
                            </span>
                        )}
                    </button>
                )}

                {/* Cart Toggle */}
                <button className={`${styles.iconButton} ${styles.cartToggle}`} onClick={toggleCart} aria-label="Cart">
                    <FiShoppingCart />
                    {itemCount > 0 && (
                        <span className={styles.cartBadge}>
                            {itemCount}
                        </span>
                    )}
                </button>

                {isAuthenticated && user ? (
                    /* === ĐĂNG NHẬP RỒI === */
                    <div className={styles.userMenu} ref={dropdownRef}>
                        <button
                            className={styles.userMenuBtn}
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            {user.avatar ? (
                                <img src={resolveImgUrl(user.avatar)} alt="avatar" className={styles.userAvatar} />
                            ) : (
                                <div className={styles.userAvatarFallback}>
                                    <FiUser />
                                </div>
                            )}
                            <span className={`${styles.userName} hide-on-mobile`}>{displayName}</span>
                        </button>

                        {showDropdown && (
                            <div className={styles.dropdown}>
                                <div className={styles.dropdownHeader}>
                                    <span className={styles.dropdownName}>{displayName}</span>
                                    <span className={styles.dropdownEmail}>{user.email}</span>
                                </div>
                                <div className={styles.dropdownDivider} />
                                <button className={styles.dropdownItem} onClick={() => { navigate('/profile'); setShowDropdown(false) }}>
                                    <FiUser /> {t('nav.profile')}
                                </button>
                                <button className={styles.dropdownItem} onClick={() => { navigate('/orders'); setShowDropdown(false) }}>
                                    <FiShoppingBag /> {t('nav.my_orders')}
                                </button>
                                <div className={styles.dropdownDivider} />
                                <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>
                                    <FiLogOut /> {t('nav.logout')}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* === CHƯA ĐĂNG NHẬP === */
                    <>
                        <button
                            onClick={openLogin}
                            className={`${styles.btnSell} hide-on-mobile`}
                        >
                            {t('nav.start_selling')}
                        </button>

                        <button onClick={openLogin} className={styles.btnJoin}>
                            {t('nav.join')}
                        </button>
                    </>
                )}
            </div>
        </header>
    )
}
