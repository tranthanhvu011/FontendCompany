import { useTranslation } from 'react-i18next'
import styles from './ContactUs.module.css'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiMessageCircle, FiSend, FiClock } from 'react-icons/fi'

export const ContactUs = () => {
    const { t } = useTranslation('product')

    return (
        <div className="page-content px-8 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.pageHeader}
            >
                <span className={styles.badge}>
                    <FiMessageCircle /> {t('contact.badge')}
                </span>
                <h1>{t('contact.title')}</h1>
                <p>{t('contact.subtitle')}</p>
            </motion.div>

            <div className={styles.contactGrid}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={styles.contactInfo}
                >
                    <h2>{t('contact.lets_talk')}</h2>
                    <p className={styles.infoDesc}>{t('contact.info_desc')}</p>

                    <div className={styles.infoItems}>
                        <div className={styles.infoItem}>
                            <div className={styles.contactIcon}><FiMail /></div>
                            <div>
                                <h4>{t('contact.email')}</h4>
                                <p>support@pixer.io</p>
                                <span className={styles.subtext}>{t('contact.email_reply')}</span>
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.contactIcon}><FiPhone /></div>
                            <div>
                                <h4>{t('contact.phone')}</h4>
                                <p>+1 (555) 123-4567</p>
                                <span className={styles.subtext}>{t('contact.phone_hours')}</span>
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.contactIcon}><FiMapPin /></div>
                            <div>
                                <h4>{t('contact.office')}</h4>
                                <p>123 Design Street, Silicon Valley</p>
                                <span className={styles.subtext}>California, USA 94025</span>
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.contactIcon}><FiClock /></div>
                            <div>
                                <h4>{t('contact.business_hours')}</h4>
                                <p>{t('contact.mon_fri')}</p>
                                <span className={styles.subtext}>9:00 AM - 6:00 PM EST</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={styles.contactForm}
                    onSubmit={(e) => e.preventDefault()}
                >
                    <h3>{t('contact.send_message')}</h3>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">{t('contact.name')}</label>
                            <input type="text" id="name" placeholder={t('contact.name_placeholder')} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">{t('contact.email')}</label>
                            <input type="email" id="email" placeholder={t('contact.email_placeholder')} />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="subject">{t('contact.subject')}</label>
                        <select id="subject">
                            <option value="">{t('contact.select_topic')}</option>
                            <option value="general">{t('contact.general')}</option>
                            <option value="support">{t('contact.tech_support')}</option>
                            <option value="billing">{t('contact.billing')}</option>
                            <option value="partnership">{t('contact.partnership')}</option>
                            <option value="other">{t('contact.other')}</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="message">{t('contact.message')}</label>
                        <textarea id="message" rows={5} placeholder={t('contact.message_placeholder')}></textarea>
                    </div>
                    <button type="submit" className={styles.submitBtn}>
                        <FiSend /> {t('contact.submit')}
                    </button>
                </motion.form>
            </div>
        </div>
    )
}
