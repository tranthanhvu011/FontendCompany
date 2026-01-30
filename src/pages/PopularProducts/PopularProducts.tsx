import styles from './PopularProducts.module.css'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { FiSearch, FiExternalLink, FiTrendingUp } from 'react-icons/fi'
import { ProductDetailModal } from '@/components/product'

const products = [
    {
        id: 'pop1',
        title: 'Flavor Restaurant Template',
        price: 29.0,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F1%2F1-Product-thumb.jpg&w=1920&q=75',
        author: 'ThemeVault',
        category: 'E-commerce',
        sales: 1247,
        rank: 1
    },
    {
        id: 'pop2',
        title: 'SaaS Dashboard Pro',
        price: 49.0,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F2%2F2-Product-thumb.jpg&w=1920&q=75',
        author: 'UIBazaar',
        category: 'SaaS',
        sales: 982,
        rank: 2
    },
    {
        id: 'pop3',
        title: 'NFT Marketplace React',
        price: 89.0,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F3%2F3-Product-thumb.jpg&w=1920&q=75',
        author: 'FutureCode',
        category: 'React',
        sales: 876,
        rank: 3
    },
    {
        id: 'pop4',
        title: 'Medical Care Admin',
        price: 79.0,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F4%2F4-Product-thumb.jpg&w=1920&q=75',
        author: 'HealthUI',
        category: 'Healthcare',
        sales: 654,
        rank: 4
    },
    {
        id: 'pop5',
        title: 'Crypto Trading Platform',
        price: 89.0,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F5%2F5-Product-thumb.jpg&w=1920&q=75',
        author: 'FinTechPro',
        category: 'Fintech',
        sales: 543,
        rank: 5
    },
    {
        id: 'pop6',
        title: 'Online Course Platform',
        price: 59.0,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F6%2F6-Product-thumb.jpg&w=1920&q=75',
        author: 'EduLearn',
        category: 'Education',
        sales: 421,
        rank: 6
    },
    {
        id: 'pop7',
        title: 'Temprador WooCommerce',
        price: 59.0,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F7%2F7-Product-thumb.jpg&w=1920&q=75',
        author: 'Imagineco',
        category: 'WooCommerce',
        sales: 389,
        rank: 7
    },
    {
        id: 'pop8',
        title: 'Fitness App Flutter',
        price: 49.0,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F8%2F8-Product-thumb.jpg&w=1920&q=75',
        author: 'MobilePro',
        category: 'Mobile',
        sales: 312,
        rank: 8
    }
]

export const PopularProducts = () => {
    const navigate = useNavigate()
    const { addItem } = useCart()
    const [activeTab, setActiveTab] = useState('all-time')
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openProductDetail = (product: any) => {
        setSelectedProduct(product)
        setIsModalOpen(true)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-content px-8 py-12"
        >
            <div className={styles.popularHeader}>
                <div>
                    <div className={styles.headerBadge}>
                        <FiTrendingUp /> Trending
                    </div>
                    <h1>Popular Products</h1>
                    <p className="text-muted">The best-selling digital assets from our global community.</p>
                </div>
                <div className={styles.filterTabs}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'this-week' ? styles.active : ''}`}
                        onClick={() => setActiveTab('this-week')}
                    >
                        This Week
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'all-time' ? styles.active : ''}`}
                        onClick={() => setActiveTab('all-time')}
                    >
                        All Time
                    </button>
                </div>
            </div>

            <motion.div layout className="product-grid">
                <AnimatePresence mode='popLayout'>
                    {products.map((product, index) => (
                        <motion.article
                            key={product.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="product-card"
                        >
                            <div className="product-img-wrapper">
                                <img src={product.image} alt={product.title} loading="lazy" />
                                <span className={styles.rankBadge}>#{product.rank}</span>
                                <div className="product-card-overlay">
                                    <div className="overlay-actions">
                                        <div className="overlay-action" onClick={() => openProductDetail(product)}>
                                            <div className="overlay-icon"><FiSearch /></div>
                                            <span>Preview</span>
                                        </div>
                                        <div className="overlay-action" onClick={() => navigate(`/product/${product.id}`)}>
                                            <div className="overlay-icon"><FiExternalLink /></div>
                                            <span>Details</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="product-info">
                                <span
                                    className="product-title cursor-pointer"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    {product.title}
                                </span>
                                <div className="product-category">{product.category}</div>
                                <div className={styles.salesInfo}>
                                    <span className={styles.salesCount}>{product.sales.toLocaleString()} Sales</span>
                                </div>
                                <div className="product-meta">
                                    <div className="author flex items-center gap-2 text-sm text-light">
                                        <div className="avatar"></div>
                                        <span>{product.author}</span>
                                    </div>
                                    <button
                                        className="add-to-cart-btn btn-sm btn-outline text-primary"
                                        onClick={() => addItem(product)}
                                    >
                                        ${product.price.toFixed(2)}
                                    </button>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </AnimatePresence>
            </motion.div>

            <div className={styles.loadMoreWrapper}>
                <button className={styles.loadMoreBtn}>Load more</button>
            </div>

            <ProductDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                onAddToCart={(p) => addItem(p)}
            />
        </motion.div>
    )
}
