import styles from './ContactUs.module.css'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiMessageCircle, FiSend, FiClock } from 'react-icons/fi'

export const ContactUs = () => {
    return (
        <div className="page-content px-8 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.pageHeader}
            >
                <span className={styles.badge}>
                    <FiMessageCircle /> Get in Touch
                </span>
                <h1>Contact Us</h1>
                <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </motion.div>

            <div className={styles.contactGrid}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={styles.contactInfo}
                >
                    <h2>Let's Talk</h2>
                    <p className={styles.infoDesc}>Have questions about Pixer? Our team is here to help you scale your digital business.</p>

                    <div className={styles.infoItems}>
                        <div className={styles.infoItem}>
                            <div className={styles.contactIcon}><FiMail /></div>
                            <div>
                                <h4>Email</h4>
                                <p>support@pixer.io</p>
                                <span className={styles.subtext}>We reply within 24 hours</span>
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.contactIcon}><FiPhone /></div>
                            <div>
                                <h4>Phone</h4>
                                <p>+1 (555) 123-4567</p>
                                <span className={styles.subtext}>Mon-Fri 9am-6pm EST</span>
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.contactIcon}><FiMapPin /></div>
                            <div>
                                <h4>Office</h4>
                                <p>123 Design Street, Silicon Valley</p>
                                <span className={styles.subtext}>California, USA 94025</span>
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.contactIcon}><FiClock /></div>
                            <div>
                                <h4>Business Hours</h4>
                                <p>Monday - Friday</p>
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
                    <h3>Send a Message</h3>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" placeholder="Your full name" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" placeholder="your@email.com" />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="subject">Subject</label>
                        <select id="subject">
                            <option value="">Select a topic</option>
                            <option value="general">General Inquiry</option>
                            <option value="support">Technical Support</option>
                            <option value="billing">Billing Question</option>
                            <option value="partnership">Partnership</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="message">Message</label>
                        <textarea id="message" rows={5} placeholder="How can we help you today?"></textarea>
                    </div>
                    <button type="submit" className={styles.submitBtn}>
                        <FiSend /> Send Message
                    </button>
                </motion.form>
            </div>
        </div>
    )
}
