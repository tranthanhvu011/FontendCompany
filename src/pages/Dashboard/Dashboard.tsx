import { useCart } from '@/contexts/CartContext'
import styles from './Dashboard.module.css'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiSearch, FiExternalLink } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductDetailModal } from '@/components/product'

export const Dashboard = () => {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openProductDetail = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  // Danh sách categories
  const categories = [
    'All',
    'Free',
    'PHP Script',
    'HTML',
    'React',
    'WordPress Plugin',
    'WordPress Theme',
    'Angular',
    'CMS',
    'Wireframe Kits',
    'UI templates',
    'Illustrations',
    'Icon Sets',
    'Mobile App',
    '3D Assets',
    'Bootstrap',
    'Vue.js',
    'Laravel',
    'Next.js',
    'Tailwind CSS'
  ]

  // Hàm cập nhật hiển thị nút scroll
  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftButton(scrollLeft > 10)
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  // Scroll sang trái
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 300
    }
  }

  // Scroll sang phải
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 300
    }
  }

  useEffect(() => {
    updateScrollButtons()
    window.addEventListener('resize', updateScrollButtons)
    return () => window.removeEventListener('resize', updateScrollButtons)
  }, [])

  const products = [
    {
      id: 'p1',
      title: 'Temprador WooCommerce',
      price: 59.0,
      image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F1%2F1-Product-thumb.jpg&w=1920&q=75',
      author: 'Imagineco',
      category: 'WooCommerce',
      isNew: true
    },
    {
      id: 'p2',
      title: 'Shoppie UI Kit PSD',
      price: 7.99,
      image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F2%2F2-Product-thumb.jpg&w=1920&q=75',
      author: 'Qubitron Solutions',
      category: 'UI Kit'
    },
    {
      id: 'p3',
      title: 'Bookify Rental Script',
      price: 43.0,
      image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F3%2F3-Product-thumb.jpg&w=1920&q=75',
      author: 'Maxicon Soft Tech',
      category: 'Script'
    },
    {
      id: 'p4',
      title: 'NFT Marketplace React',
      price: 89.0,
      image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F4%2F4-Product-thumb.jpg&w=1920&q=75',
      author: 'FutureCode',
      category: 'React'
    },
    {
      id: 'p5',
      title: 'Fitness App Flutter',
      price: 49.0,
      image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F5%2F5-Product-thumb.jpg&w=1920&q=75',
      author: 'MobilePro',
      category: 'Mobile'
    },
    {
      id: 'p6',
      title: 'LMS Portfolio Theme',
      price: 29.0,
      image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F6%2F6-Product-thumb.jpg&w=1920&q=75',
      author: 'EduTheme',
      category: 'WordPress'
    },
    {
      id: 'p7',
      title: 'Modern Coffee Shop',
      price: 19.0,
      image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F7%2F7-Product-thumb.jpg&w=1920&q=75',
      author: 'FreshDesign',
      category: 'HTML'
    },
    {
      id: 'p8',
      title: 'Saas Dashboard Kit',
      price: 35.0,
      image: 'https://pixer.redq.io/_next/image?url=https%3A%2F%2Fs3.amazonaws.com%2Fredq-pixer%2Fproducts%2F8%2F8-Product-thumb.jpg&w=1920&q=75',
      author: 'SaaSify',
      category: 'UI Kit'
    }
  ]

  return (
    <>
      <div className="page-content">
        {/* Scrollable Category Navigation */}
        <section className="mb-8" style={{ width: '100%', overflow: 'hidden' }}>
          <div className={styles.navbarContainer}>
            <div className={styles.navbarWrapper}>
              {showLeftButton && (
                <button className={`${styles.scrollBtn} ${styles.left}`} onClick={scrollLeft}>
                  <FiChevronLeft size={24} />
                </button>
              )}

              <div ref={scrollRef} className={styles.navScrollContainer} onScroll={updateScrollButtons}>
                <div className={styles.navList}>
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`${styles.navBtn} ${activeCategory === category ? styles.active : ''}`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {showRightButton && (
                <button className={`${styles.scrollBtn} ${styles.right}`} onClick={scrollRight}>
                  <FiChevronRight size={24} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="w-full pb-10 px-6">
          <motion.div layout className="product-grid">
            <AnimatePresence mode='popLayout'>
              {products.map((product, index) => (
                <motion.article
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="product-card"
                >
                  <div className="product-img-wrapper">
                    <img src={product.image} alt={product.title} loading="lazy" />
                    {product.isNew && <span className="badge-new">NEW</span>}
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
                    <span className="product-title cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                      {product.title}
                    </span>
                    <div className="product-category">{product.category}</div>
                    <div className="product-meta">
                      <div className="author flex items-center gap-2 text-sm text-light">
                        <div className="avatar"></div>
                        <span>{product.author.substring(0, 5)}</span>
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
        </section>

        <div className={styles.loadMoreWrapper}>
          <button className={styles.loadMoreBtn}>Load more</button>
        </div>

        <ProductDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
          onAddToCart={(p) => addItem(p)}
        />
      </div>
    </>
  )
}