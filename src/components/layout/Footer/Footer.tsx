import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiTwitter, FiInstagram, FiGithub, FiLinkedin, FiHexagon, FiHeart } from 'react-icons/fi'
import styles from './Footer.module.css'

export const Footer = () => {
    const { t } = useTranslation('common')
    const currentYear = new Date().getFullYear()

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.brand}>
                        <Link to="/" className={styles.logo}>
                            <div className={styles.logoIcon}>
                                <FiHexagon />
                            </div>
                            <span>Pixer</span>
                        </Link>
                        <p className={styles.brandDesc}>
                            {t('footer.brand_desc')}
                        </p>
                        <div className={styles.social}>
                            <a href="#" aria-label="Twitter"><FiTwitter /></a>
                            <a href="#" aria-label="Instagram"><FiInstagram /></a>
                            <a href="#" aria-label="GitHub"><FiGithub /></a>
                            <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h4>{t('footer.quick_links')}</h4>
                        <ul className={styles.links}>
                            <li><Link to="/">{t('footer.home')}</Link></li>
                            <li><Link to="/explore">{t('footer.explore')}</Link></li>
                            <li><Link to="/popular-products">{t('footer.popular')}</Link></li>
                            <li><Link to="/authors">{t('footer.authors')}</Link></li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h4>{t('footer.support')}</h4>
                        <ul className={styles.links}>
                            <li><Link to="/help">{t('footer.help_center')}</Link></li>
                            <li><Link to="/contact-us">{t('footer.contact_us')}</Link></li>
                            <li><Link to="/become-seller">{t('footer.become_seller')}</Link></li>
                            <li><a href="#">{t('footer.terms')}</a></li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h4>{t('footer.company')}</h4>
                        <ul className={styles.links}>
                            <li><a href="#">{t('footer.about')}</a></li>
                            <li><a href="#">{t('footer.careers')}</a></li>
                            <li><a href="#">{t('footer.privacy')}</a></li>
                            <li><a href="#">{t('footer.refund')}</a></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>{t('footer.copyright', { year: currentYear })} <FiHeart style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--danger)', margin: '0 4px' }} /> {t('footer.by')}</p>
                </div>
            </div>
        </footer>
    )
}
