import { Link, useLocation } from "react-router-dom";
import { useUI } from "@/contexts/UIContext";
import styles from './Sidebar.module.css'

export const Sidebar = () => {
  const { openLogin, isSidebarOpen } = useUI();
  const location = useLocation();

  const menuItems = [
    { to: "/", icon: "fa-solid fa-house", label: "Home" },
    { to: "/explore", icon: "fa-solid fa-compass", label: "Explore" },
    { to: "/popular-products", icon: "fa-solid fa-bolt", label: "Popular Products" },
    { to: "/authors", icon: "fa-solid fa-users", label: "Top Authors" },
  ]

  const secondaryItems = [
    { to: "/contact-us", icon: "fa-regular fa-envelope", label: "Contact" },
    { to: "/help", icon: "fa-regular fa-circle-question", label: "Help" },
    { to: "/become-seller", icon: "fa-solid fa-store", label: "Become Seller" },
  ]

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
      <Link
        to="/"
        className="logo font-bold text-lg flex items-center gap-2 sidebar-logo"
      >
        <div className="logo-icon-wrapper">
          <i
            className="fa-solid fa-shapes text-primary"
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
            <i className={item.icon} /> <span>{item.label}</span>
          </Link>
        ))}

        <div className="menu-divider"></div>

        {secondaryItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`menu-item ${isActive(item.to) ? 'active' : ''}`}
          >
            <i className={item.icon} /> <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-auth">
        <button
          onClick={openLogin}
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          Join Now
        </button>
        <div className="text-center mt-2" style={{ marginTop: 10 }}>
          <span className="text-sm text-muted">Already a member?</span>
          <button type="button" className={styles.btnLogin} onClick={openLogin}>Đăng Nhập</button>
        </div>
      </div>
    </aside>
  )
}