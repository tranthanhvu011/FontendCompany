import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import { useUI } from "@/contexts/UIContext";
import { useAuth } from "@/contexts/AuthContext";
import { resolveImgUrl } from "@/utils/imageUrl";
import { FiHome, FiCompass, FiZap, FiUsers, FiMail, FiHelpCircle, FiShoppingBag, FiHexagon, FiUser, FiLogOut } from 'react-icons/fi'
import styles from './Sidebar.module.css'

export const Sidebar = () => {
  const { t } = useTranslation('common')
  const { openLogin, isSidebarOpen } = useUI();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const displayName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.email

  const menuItems = [
    { to: "/", icon: <FiHome />, label: t('sidebar.home') },
    { to: "/explore", icon: <FiCompass />, label: t('sidebar.explore') },
    { to: "/popular-products", icon: <FiZap />, label: t('sidebar.popular_products') },
    { to: "/authors", icon: <FiUsers />, label: t('sidebar.top_authors') },
  ]

  const secondaryItems = [
    { to: "/contact-us", icon: <FiMail />, label: t('sidebar.contact') },
    { to: "/help", icon: <FiHelpCircle />, label: t('sidebar.help') },
    { to: "/become-seller", icon: <FiShoppingBag />, label: t('sidebar.become_seller') },
  ]

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
      <Link
        to="/"
        className="logo font-bold text-lg flex items-center gap-2 sidebar-logo"
      >
        <div className="logo-icon-wrapper">
          <FiHexagon
            className="text-primary"
            style={{ fontSize: "1.5rem" }}
          />
        </div>
        <span className="logo-text">Pixer</span>
      </Link>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`menu-item ${isActive(item.to) ? 'active' : ''}`}
          >
            {item.icon} <span>{item.label}</span>
          </Link>
        ))}

        <div className="menu-divider"></div>

        {secondaryItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`menu-item ${isActive(item.to) ? 'active' : ''}`}
          >
            {item.icon} <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {isAuthenticated && user ? (
        /* === ĐĂNG NHẬP RỒI === */
        <div className={styles.userProfile}>
          {user.avatar ? (
            <img src={resolveImgUrl(user.avatar)} alt="avatar" className={styles.sidebarAvatar} />
          ) : (
            <div className={styles.sidebarAvatarFallback}>
              <FiUser />
            </div>
          )}
          <div className={styles.userInfo}>
            <span className={styles.userDisplayName}>{displayName}</span>
            <span className={styles.userEmail}>{user.username}</span>
          </div>
          <button
            className={styles.logoutBtn}
            onClick={logout}
            title={t('nav.logout')}
          >
            <FiLogOut />
          </button>
        </div>
      ) : (
        /* === CHƯA ĐĂNG NHẬP === */
        <div className="sidebar-auth">
          <button
            onClick={openLogin}
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            {t('sidebar.join_now')}
          </button>
          <div className="text-center mt-2" style={{ marginTop: 10 }}>
            <span className="text-sm text-muted">{t('sidebar.already_member')}</span>
            <button type="button" className={styles.btnLogin} onClick={openLogin}>{t('sidebar.login')}</button>
          </div>
        </div>
      )}
    </aside>
  )
}