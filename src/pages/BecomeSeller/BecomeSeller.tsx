import styles from './BecomeSeller.module.css'
import { motion } from 'framer-motion'
import { FiUserPlus, FiUpload, FiDollarSign, FiTrendingUp, FiCheck, FiArrowRight } from 'react-icons/fi'

const steps = [
    {
        step: 1,
        title: 'Create Account',
        desc: 'Sign up for free and set up your seller profile in minutes.',
        icon: FiUserPlus
    },
    {
        step: 2,
        title: 'Upload Products',
        desc: 'Add your digital assets with descriptions and set your prices.',
        icon: FiUpload
    },
    {
        step: 3,
        title: 'Start Earning',
        desc: 'Get 80% commission on every sale you make on our platform.',
        icon: FiDollarSign
    },
    {
        step: 4,
        title: 'Grow Business',
        desc: 'Use our tools to promote and scale your digital business.',
        icon: FiTrendingUp
    }
]

const benefits = [
    'No upfront costs or hidden fees',
    'Secure payment processing',
    'Global customer base access',
    'Marketing and promotion tools',
    'Real-time analytics dashboard',
    'Dedicated seller support'
]

export const BecomeSeller = () => {
    return (
        <div className="page-content">
            {/* Hero Section */}
            <section className={styles.hero}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.heroContent}
                >
                    <span className={styles.badge}>
                        <FiTrendingUp /> Become a seller
                    </span>
                    <h1>Launch your online store effortlessly with Pixer and start selling today.</h1>
                    <p>Transform your creativity into income. Join thousands of creators earning with our global marketplace for digital assets.</p>
                    <div className={styles.heroActions}>
                        <button className={styles.primaryBtn}>
                            <FiUserPlus /> Sign Up Now
                        </button>
                        <button className={styles.secondaryBtn}>
                            Visit Help Center <FiArrowRight />
                        </button>
                    </div>
                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <strong>50K+</strong>
                            <span>Active Sellers</span>
                        </div>
                        <div className={styles.statItem}>
                            <strong>$10M+</strong>
                            <span>Payouts Made</span>
                        </div>
                        <div className={styles.statItem}>
                            <strong>80%</strong>
                            <span>Commission Rate</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Steps Section */}
            <section className={styles.stepsSection}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={styles.sectionHeader}
                >
                    <h2>Start Selling in 4 Simple Steps</h2>
                    <p>Get your store up and running in minutes, not hours.</p>
                </motion.div>
                <div className={styles.stepsGrid}>
                    {steps.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <motion.div
                                key={item.step}
                                className={styles.stepCard}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className={styles.stepNumber}>{item.step}</div>
                                <div className={styles.stepIcon}>
                                    <Icon />
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* Benefits Section */}
            <section className={styles.benefitsSection}>
                <div className={styles.benefitsContent}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={styles.benefitsText}
                    >
                        <h2>Why Sell With Us?</h2>
                        <p>Join a community of creators who trust Pixer for their digital business.</p>
                        <ul className={styles.benefitsList}>
                            {benefits.map((benefit, i) => (
                                <li key={i}>
                                    <span className={styles.checkIcon}><FiCheck /></span>
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                        <button className={styles.primaryBtn}>
                            Get Started Free <FiArrowRight />
                        </button>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={styles.benefitsImage}
                    >
                        <div className={styles.imagePlaceholder}>
                            <FiTrendingUp />
                            <span>Your Success Starts Here</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className={styles.ctaCard}
                >
                    <h2>Ready to start your journey?</h2>
                    <p>Join thousands of successful sellers on Pixer today.</p>
                    <button className={styles.ctaBtn}>
                        Create Your Store <FiArrowRight />
                    </button>
                </motion.div>
            </section>
        </div>
    )
}
