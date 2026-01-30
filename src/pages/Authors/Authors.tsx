import styles from './Authors.module.css'
import { motion } from 'framer-motion'
import { FiUsers, FiPackage, FiStar, FiUserPlus } from 'react-icons/fi'

const authors = [
    {
        id: 1,
        name: 'Imagineco',
        products: 124,
        followers: '12.5k',
        sales: '45.2k',
        rating: 4.9,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fusers%2F1%2F1-thumb.png&w=256&q=75',
        verified: true
    },
    {
        id: 2,
        name: 'Qubitron Solutions',
        products: 85,
        followers: '8.4k',
        sales: '28.7k',
        rating: 4.8,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fusers%2F2%2F2-thumb.png&w=256&q=75',
        verified: true
    },
    {
        id: 3,
        name: 'Maxicon Soft Tech',
        products: 210,
        followers: '35.2k',
        sales: '98.4k',
        rating: 4.9,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fusers%2F3%2F3-thumb.png&w=256&q=75',
        verified: true
    },
    {
        id: 4,
        name: 'FutureCode Labs',
        products: 45,
        followers: '5.3k',
        sales: '12.1k',
        rating: 4.7,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fusers%2F4%2F4-thumb.png&w=256&q=75',
        verified: false
    },
    {
        id: 5,
        name: 'ThemeVault',
        products: 67,
        followers: '9.1k',
        sales: '32.8k',
        rating: 4.8,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fusers%2F5%2F5-thumb.png&w=256&q=75',
        verified: true
    },
    {
        id: 6,
        name: 'UIBazaar',
        products: 156,
        followers: '21.4k',
        sales: '67.3k',
        rating: 4.9,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fusers%2F6%2F6-thumb.png&w=256&q=75',
        verified: true
    },
    {
        id: 7,
        name: 'HealthUI Pro',
        products: 34,
        followers: '3.2k',
        sales: '8.9k',
        rating: 4.6,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fusers%2F7%2F7-thumb.png&w=256&q=75',
        verified: false
    },
    {
        id: 8,
        name: 'EduLearn Design',
        products: 89,
        followers: '11.7k',
        sales: '41.2k',
        rating: 4.8,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fusers%2F8%2F8-thumb.png&w=256&q=75',
        verified: true
    }
]

export const Authors = () => {
    return (
        <div className="page-content px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.pageHeader}
            >
                <div className={styles.headerBadge}>
                    <FiUsers /> Top Creators
                </div>
                <h1>Top Authors</h1>
                <p>Meet our most talented creators who are shaping the future of digital assets.</p>
            </motion.div>

            <div className={styles.authorGrid}>
                {authors.map((author, index) => (
                    <motion.div
                        key={author.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.08 }}
                        className={styles.authorCard}
                    >
                        <div className={styles.avatarWrapper}>
                            <img src={author.image} alt={author.name} className={styles.avatar} />
                            {author.verified && (
                                <div className={styles.verifiedBadge}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <h3>{author.name}</h3>

                        <div className={styles.rating}>
                            <FiStar className={styles.starIcon} />
                            <span>{author.rating}</span>
                        </div>

                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <FiPackage />
                                <span><strong>{author.products}</strong> Products</span>
                            </div>
                            <div className={styles.statItem}>
                                <FiUsers />
                                <span><strong>{author.followers}</strong> Followers</span>
                            </div>
                        </div>

                        <div className={styles.salesBadge}>
                            {author.sales} Total Sales
                        </div>

                        <button className={styles.followBtn}>
                            <FiUserPlus />
                            Follow
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className={styles.loadMoreWrapper}>
                <button className={styles.loadMoreBtn}>Load more authors</button>
            </div>
        </div>
    )
}
