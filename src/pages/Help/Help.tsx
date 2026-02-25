import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './Help.module.css'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiMinus, FiSearch, FiHelpCircle, FiShoppingBag, FiCreditCard, FiUser, FiMessageCircle } from 'react-icons/fi'

export const Help = () => {
    const { t } = useTranslation('product')
    const [activeIndex, setActiveIndex] = useState<number | null>(0)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    const categories = [
        { id: 'getting-started', label: t('help.getting_started'), icon: FiHelpCircle },
        { id: 'buying', label: t('help.buying'), icon: FiShoppingBag },
        { id: 'payments', label: t('help.payments'), icon: FiCreditCard },
        { id: 'account', label: t('help.account'), icon: FiUser },
    ]

    const faqs = [
        { q: t('help.faq_1_q'), a: t('help.faq_1_a'), category: 'buying' },
        { q: t('help.faq_2_q'), a: t('help.faq_2_a'), category: 'getting-started' },
        { q: t('help.faq_3_q'), a: t('help.faq_3_a'), category: 'payments' },
        { q: t('help.faq_4_q'), a: t('help.faq_4_a'), category: 'account' },
        { q: t('help.faq_5_q'), a: t('help.faq_5_a'), category: 'payments' },
        { q: t('help.faq_6_q'), a: t('help.faq_6_a'), category: 'account' },
        { q: t('help.faq_7_q'), a: t('help.faq_7_a'), category: 'buying' },
        { q: t('help.faq_8_q'), a: t('help.faq_8_a'), category: 'getting-started' },
    ]

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
                    <FiHelpCircle /> {t('help.badge')}
                </span>
                <h1>{t('help.title')}</h1>
                <p>{t('help.subtitle')}</p>

                <div className={styles.searchWrapper}>
                    <FiSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder={t('help.search_placeholder')}
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
                        <h3>{t('help.no_results')}</h3>
                        <p>{t('help.no_results_desc')}</p>
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
                <h3>{t('help.still_need_help')}</h3>
                <p>{t('help.support_desc')}</p>
                <button className={styles.contactBtn}>{t('help.contact_support')}</button>
            </motion.div>
        </div>
    )
}
