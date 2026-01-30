import { useState } from 'react'
import styles from './Help.module.css'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiMinus, FiSearch, FiHelpCircle, FiShoppingBag, FiCreditCard, FiUser, FiMessageCircle } from 'react-icons/fi'

const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: FiHelpCircle },
    { id: 'buying', label: 'Buying Products', icon: FiShoppingBag },
    { id: 'payments', label: 'Payments & Billing', icon: FiCreditCard },
    { id: 'account', label: 'Account Settings', icon: FiUser },
]

const faqs = [
    {
        q: 'How do I download my purchased products?',
        a: 'Once your purchase is complete, you can find all your downloads in your dashboard under the "Downloads" section. Click on any item to download it instantly. Downloads are available for the lifetime of your account.',
        category: 'buying'
    },
    {
        q: 'Can I sell my own digital assets on Pixer?',
        a: 'Yes! Simply click on "Become a Seller" in the sidebar and follow the registration steps to start selling. You\'ll need to provide some basic information and agree to our seller terms. Once approved, you can start uploading your products.',
        category: 'getting-started'
    },
    {
        q: 'What is your refund policy?',
        a: 'We offer a 14-day refund policy for items that are technically defective or significantly not as described. Digital products that work as intended are generally not refundable. Please contact support with your order details for assistance.',
        category: 'payments'
    },
    {
        q: 'How do I contact a seller directly?',
        a: 'You can contact sellers directly through the "Contact" button on their profile page or product pages. Messages are sent through our secure messaging system to protect your privacy.',
        category: 'account'
    },
    {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and various local payment methods depending on your region. All transactions are processed securely through our payment partners.',
        category: 'payments'
    },
    {
        q: 'How do I update my account information?',
        a: 'Go to your Profile settings by clicking on your avatar in the sidebar. From there, you can update your name, email, password, and other account details. Make sure to save your changes before leaving the page.',
        category: 'account'
    },
    {
        q: 'Are products updated after purchase?',
        a: 'Yes! When a seller updates their product, you automatically get access to the new version. You\'ll be notified via email when updates are available for your purchased products.',
        category: 'buying'
    },
    {
        q: 'How do I become a featured seller?',
        a: 'Featured sellers are selected based on product quality, sales performance, customer ratings, and responsiveness. Maintain great products and excellent customer service to increase your chances of being featured.',
        category: 'getting-started'
    }
]

export const Help = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(0)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = !activeCategory || faq.category === activeCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="page-content px-8 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.pageHeader}
            >
                <span className={styles.badge}>
                    <FiHelpCircle /> Help Center
                </span>
                <h1>How can we help?</h1>
                <p>Find answers to common questions about our marketplace.</p>

                <div className={styles.searchWrapper}>
                    <FiSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </motion.div>

            <div className={styles.categoriesWrapper}>
                {categories.map(cat => {
                    const Icon = cat.icon
                    return (
                        <button
                            key={cat.id}
                            className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.active : ''}`}
                            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                        >
                            <Icon />
                            {cat.label}
                        </button>
                    )
                })}
            </div>

            <div className={styles.faqList}>
                {filteredFaqs.length === 0 ? (
                    <div className={styles.noResults}>
                        <FiMessageCircle />
                        <h3>No results found</h3>
                        <p>Try a different search term or browse all categories</p>
                    </div>
                ) : (
                    filteredFaqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className={`${styles.faqItem} ${activeIndex === index ? styles.open : ''}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <button
                                className={styles.faqHeader}
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                            >
                                <span>{faq.q}</span>
                                <span className={styles.faqIcon}>
                                    {activeIndex === index ? <FiMinus /> : <FiPlus />}
                                </span>
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className={styles.faqBody}
                                    >
                                        <p>{faq.a}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={styles.contactCta}
            >
                <FiMessageCircle className={styles.ctaIcon} />
                <h3>Still need help?</h3>
                <p>Our support team is here to assist you</p>
                <button className={styles.contactBtn}>Contact Support</button>
            </motion.div>
        </div>
    )
}
