import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi'
import styles from './Footer.module.css'

export const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.brand}>
                        <Link to="/" className={styles.logo}>
                            <div className={styles.logoIcon}>
                                <i className="fa-solid fa-shapes" />
                            </div>
                            <span>Pixer</span>
                        </Link>
                        <p className={styles.brandDesc}>
                            The best digital marketplace for creative assets, templates, and UI resources.
                        </p>
                        <div className={styles.social}>
                            <a href="#" aria-label="Twitter"><FiTwitter /></a>
                            <a href="#" aria-label="Instagram"><FiInstagram /></a>
                            <a href="#" aria-label="GitHub"><FiGithub /></a>
                            <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h4>Quick Links</h4>
                        <ul className={styles.links}>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/explore">Explore</Link></li>
                            <li><Link to="/popular-products">Popular</Link></li>
                            <li><Link to="/authors">Authors</Link></li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h4>Support</h4>
                        <ul className={styles.links}>
                            <li><Link to="/help">Help Center</Link></li>
                            <li><Link to="/contact-us">Contact Us</Link></li>
                            <li><Link to="/become-seller">Become Seller</Link></li>
                            <li><a href="#">Terms of Service</a></li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h4>Company</h4>
                        <ul className={styles.links}>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Refund Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© {currentYear} Pixer. All rights reserved. Made with ❤️ by REDQ</p>
                </div>
            </div>
        </footer>
    )
}
