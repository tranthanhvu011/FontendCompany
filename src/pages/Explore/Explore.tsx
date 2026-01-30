import styles from './Explore.module.css'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { FiSearch, FiExternalLink, FiFilter, FiX } from 'react-icons/fi'
import { ProductDetailModal } from '@/components/product'

const categories = [
    { name: 'All Categories', count: 142 },
    { name: 'E-commerce', count: 38 },
    { name: 'SaaS', count: 27 },
    { name: 'Portfolio', count: 24 },
    { name: 'Healthcare', count: 18 },
    { name: 'Fintech', count: 21 },
    { name: 'Education', count: 14 }
]

const priceRanges = [
    { label: 'Free', value: 'free' },
    { label: 'Under $25', value: 'under25' },
    { label: '$25 - $50', value: '25-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: 'Over $100', value: 'over100' }
]

const products = [
    {
        id: 'e1',
        title: 'Flavor Restaurant Template',
        price: 29.0,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F1%2F1-Product-thumb.jpg&w=1920&q=75',
        author: 'ThemeVault',
        category: 'E-commerce',
        isNew: true
    },
    {
        id: 'e2',
        title: 'SaaS Dashboard Pro',
        price: 49.0,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F2%2F2-Product-thumb.jpg&w=1920&q=75',
        author: 'UIBazaar',
        category: 'SaaS'
    },
    {
        id: 'e3',
        title: 'Portfolio Starter Kit',
        price: 0,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F3%2F3-Product-thumb.jpg&w=1920&q=75',
        author: 'FreeDesigns',
        category: 'Portfolio',
        isFree: true
    },
    {
        id: 'e4',
        title: 'Medical Care Admin',
        price: 79.0,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F4%2F4-Product-thumb.jpg&w=1920&q=75',
        author: 'HealthUI',
        category: 'Healthcare'
    },
    {
        id: 'e5',
        title: 'Crypto Trading Platform',
        price: 89.0,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F5%2F5-Product-thumb.jpg&w=1920&q=75',
        author: 'FinTechPro',
        category: 'Fintech',
        isNew: true
    },
    {
        id: 'e6',
        title: 'Online Course Platform',
        price: 59.0,
        image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F6%2F6-Product-thumb.jpg&w=1920&q=75',
        author: 'EduLearn',
        category: 'Education'
    }
]

export const Explore = () => {
    const navigate = useNavigate()
    const { addItem } = useCart()
    const [selectedCategory, setSelectedCategory] = useState('All Categories')
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState('latest')
    const [showMobileFilter, setShowMobileFilter] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const filteredProducts = products.filter(p =>
        selectedCategory === 'All Categories' || p.category === selectedCategory
    )

    const openProductDetail = (product: any) => {
        setSelectedProduct(product)
        setIsModalOpen(true)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.exploreWrapper}
        >
            {/* Mobile Filter Button */}
            <button
                className={styles.mobileFilterBtn}
                onClick={() => setShowMobileFilter(true)}
            >
                <FiFilter /> Filters
            </button>

            {/* Filter Sidebar */}
            <aside className={`${styles.filterSidebar} ${showMobileFilter ? styles.show : ''}`}>
                <div className={styles.filterHeader}>
                    <h3>Filters</h3>
                    <button
                        className={styles.closeFilter}
                        onClick={() => setShowMobileFilter(false)}
                    >
                        <FiX />
                    </button>
                </div>

                <div className={styles.filterGroup}>
                    <h4>Category</h4>
                    <div className={styles.filterList}>
                        {categories.map(cat => (
                            <label
                                key={cat.name}
                                className={`${styles.filterLabel} ${selectedCategory === cat.name ? styles.active : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === cat.name}
                                    onChange={() => setSelectedCategory(cat.name)}
                                />
                                <span className={styles.labelText}>{cat.name}</span>
                                <span className={styles.count}>{cat.count}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.filterGroup}>
                    <h4>Price Range</h4>
                    <div className={styles.filterList}>
                        {priceRanges.map(range => (
                            <label
                                key={range.value}
                                className={`${styles.filterLabel} ${selectedPrice === range.value ? styles.active : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="price"
                                    checked={selectedPrice === range.value}
                                    onChange={() => setSelectedPrice(range.value)}
                                />
                                <span className={styles.labelText}>{range.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    className={styles.clearFilters}
                    onClick={() => {
                        setSelectedCategory('All Categories')
                        setSelectedPrice(null)
                    }}
                >
                    Clear All Filters
                </button>
            </aside>

            {/* Overlay for mobile */}
            {showMobileFilter && (
                <div
                    className={styles.filterOverlay}
                    onClick={() => setShowMobileFilter(false)}
                />
            )}

            {/* Main Content */}
            <main className={styles.exploreContent}>
                <div className={styles.exploreHeader}>
                    <div>
                        <h2>Explore Products</h2>
                        <p className={styles.resultCount}>{filteredProducts.length} products found</p>
                    </div>
                    <select
                        className={styles.sortSelect}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="latest">Latest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="popular">Most Popular</option>
                    </select>
                </div>

                <motion.div layout className="product-grid">
                    <AnimatePresence mode='popLayout'>
                        {filteredProducts.map((product, index) => (
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
                                    {product.isNew && <span className="badge-new">NEW</span>}
                                    {product.isFree && <span className="badge-new" style={{ background: '#8b5cf6' }}>FREE</span>}
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
                                    <div className="product-meta">
                                        <div className="author flex items-center gap-2 text-sm text-light">
                                            <div className="avatar"></div>
                                            <span>{product.author}</span>
                                        </div>
                                        <button
                                            className="add-to-cart-btn btn-sm btn-outline text-primary"
                                            onClick={() => addItem(product)}
                                        >
                                            {product.price === 0 ? 'Free' : `$${product.price.toFixed(2)}`}
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
            </main>

            <ProductDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                onAddToCart={(p) => addItem(p)}
            />
        </motion.div>
    )
}
