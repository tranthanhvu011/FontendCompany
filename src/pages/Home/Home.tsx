import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Card } from '@/components/common'
import { FiArrowRight, FiZap, FiCode, FiLayers } from 'react-icons/fi'
import styles from './Home.module.css'

export const Home = () => {
    const { isAuthenticated } = useAuth()

    return (
        <div className={styles.home}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        <span className={styles.gradient}>ReactJS Vite</span>
                        <br />
                        Professional Base Template
                    </h1>
                    <p className={styles.heroDescription}>
                        A modern, production-ready starter template with authentication, routing, and best
                        practices built-in. Start building your app immediately!
                    </p>
                    <div className={styles.heroActions}>
                        {isAuthenticated ? (
                            <Link to="/dashboard">
                                <Button size="lg">
                                    Go to Dashboard <FiArrowRight />
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/login">
                                <Button size="lg">
                                    Get Started <FiArrowRight />
                                </Button>
                            </Link>
                        )}
                        <Button variant="secondary" size="lg">
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.features}>
                <h2 className={styles.sectionTitle}>Features</h2>
                <div className={styles.featureGrid}>
                    <Card hover>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>
                                <FiZap />
                            </div>
                            <h3>Lightning Fast</h3>
                            <p>Powered by Vite for instant HMR and optimized builds</p>
                        </div>
                    </Card>

                    <Card hover>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>
                                <FiCode />
                            </div>
                            <h3>TypeScript Ready</h3>
                            <p>Full TypeScript support with type safety out of the box</p>
                        </div>
                    </Card>

                    <Card hover>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>
                                <FiLayers />
                            </div>
                            <h3>Well Structured</h3>
                            <p>Professional folder structure following industry standards</p>
                        </div>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.cta}>
                <Card>
                    <div className={styles.ctaContent}>
                        <h2>Ready to build something amazing?</h2>
                        <p>Start your project with our production-ready template today.</p>
                        {!isAuthenticated && (
                            <Link to="/login">
                                <Button size="lg">
                                    Get Started Now <FiArrowRight />
                                </Button>
                            </Link>
                        )}
                    </div>
                </Card>
            </section>
        </div>
    )
}
