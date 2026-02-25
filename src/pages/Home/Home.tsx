import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Card } from '@/components/common'
import { FiArrowRight, FiZap, FiCode, FiLayers } from 'react-icons/fi'
import styles from './Home.module.css'

export const Home = () => {
    const { t } = useTranslation('common')
    const { isAuthenticated } = useAuth()

    return (
        <div className={styles.home}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        <span className={styles.gradient}>{t('home.hero_title_1')}</span>
                        <br />
                        {t('home.hero_title_2')}
                    </h1>
                    <p className={styles.heroDescription}>
                        {t('home.hero_desc')}
                    </p>
                    <div className={styles.heroActions}>
                        {isAuthenticated ? (
                            <Link to="/dashboard">
                                <Button size="lg">
                                    {t('home.go_dashboard')} <FiArrowRight />
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/login">
                                <Button size="lg">
                                    {t('home.get_started')} <FiArrowRight />
                                </Button>
                            </Link>
                        )}
                        <Button variant="secondary" size="lg">
                            {t('home.learn_more')}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.features}>
                <h2 className={styles.sectionTitle}>{t('home.features')}</h2>
                <div className={styles.featureGrid}>
                    <Card hover>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>
                                <FiZap />
                            </div>
                            <h3>{t('home.lightning_fast')}</h3>
                            <p>{t('home.lightning_desc')}</p>
                        </div>
                    </Card>

                    <Card hover>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>
                                <FiCode />
                            </div>
                            <h3>{t('home.typescript')}</h3>
                            <p>{t('home.typescript_desc')}</p>
                        </div>
                    </Card>

                    <Card hover>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>
                                <FiLayers />
                            </div>
                            <h3>{t('home.structured')}</h3>
                            <p>{t('home.structured_desc')}</p>
                        </div>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.cta}>
                <Card>
                    <div className={styles.ctaContent}>
                        <h2>{t('home.cta_title')}</h2>
                        <p>{t('home.cta_desc')}</p>
                        {!isAuthenticated && (
                            <Link to="/login">
                                <Button size="lg">
                                    {t('home.get_started_now')} <FiArrowRight />
                                </Button>
                            </Link>
                        )}
                    </div>
                </Card>
            </section>
        </div>
    )
}
