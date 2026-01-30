import { useUI } from '@/contexts/UIContext'
import { useCart } from '@/contexts/CartContext'
import styles from './Header.module.css'

export const Header = () => {
    const { toggleSidebar, toggleTheme, toggleCart, openLogin, isDarkMode } = useUI()
    const { itemCount } = useCart()

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

                <button
                    onClick={openLogin}
                    className={`${styles.btnSell} hide-on-mobile`}
                >
                    Start Selling
                </button>

                <button onClick={openLogin} className={styles.btnJoin}>
                    Join
                </button>
            </div>
        </header>
    )
}
