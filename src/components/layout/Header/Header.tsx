import { useState, useRef, useEffect } from 'react'
import { useUI } from '@/contexts/UIContext'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import styles from './Header.module.css'

export const Header = () => {
    const { toggleSidebar, toggleTheme, toggleCart, openLogin, isDarkMode } = useUI()
    const { user, isAuthenticated, logout } = useAuth()
    const { itemCount } = useCart()
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

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
                <div className="mobile-toggle cursor-pointer lg:hidden" onClick={toggleSidebar}>
                    <i className="fa-solid fa-bars text-xl" />
                </div>

                {/* Search Bar */}
                <div className={styles.searchContainer}>
                    <i className="fa-solid fa-magnifying-glass text-muted" />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search your products..."
                    />
                    <div className={styles.searchShortcut}>/</div>
                </div>
            </div>

            <div className={styles.actionButtons}>
                <button
                    className={styles.iconButton}
                    onClick={toggleTheme}
                    aria-label="Toggle Theme"
                >
                    {isDarkMode ? <i className="fa-solid fa-sun" /> : <i className="fa-solid fa-moon" />}
                </button>

                {/* Cart Toggle */}
                <button className={`${styles.iconButton} ${styles.cartToggle}`} onClick={toggleCart}>
                    <i className="fa-solid fa-cart-shopping" />
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
                                <img src={user.avatar} alt="avatar" className={styles.userAvatar} />
                            ) : (
                                <div className={styles.userAvatarFallback}>
                                    <i className="fa-solid fa-user" />
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
                                <button className={styles.dropdownItem}>
                                    <i className="fa-solid fa-user" /> Profile
                                </button>
                                <button className={styles.dropdownItem}>
                                    <i className="fa-solid fa-bag-shopping" /> My Orders
                                </button>
                                <div className={styles.dropdownDivider} />
                                <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>
                                    <i className="fa-solid fa-right-from-bracket" /> Logout
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
                            Start Selling
                        </button>

                        <button onClick={openLogin} className={styles.btnJoin}>
                            Join
                        </button>
                    </>
                )}
            </div>
        </header>
    )
}
