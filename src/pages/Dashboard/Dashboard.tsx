import styles from './Dashboard.module.css'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiChevronLeft, FiChevronRight, FiSearch, FiExternalLink } from 'react-icons/fi'

import { ProductDetailModal } from '@/components/product'
import { StarRating } from '@/components/common'
import { formatVND } from '@/data/productData'
import { productApi } from '@/services/productService'
import type { CategoryResponse, ProductCardResponse, ProductDetailResponse } from '@/services/productService'
import { resolveImgUrl } from '@/utils/imageUrl'

export const Dashboard = () => {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)

  // Data states
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [products, setProducts] = useState<ProductCardResponse[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<ProductDetailResponse | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await productApi.getCategories()
        setCategories(data)
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }
    loadCategories()
  }, [])

  // Fetch products when category or page changes
  const loadProducts = useCallback(async (categoryId: number | null, pageNum: number, append = false) => {
    setLoading(true)
    try {
      const data = await productApi.getProducts({
        categoryId,
        page: pageNum,
        size: 12,
      })
      setProducts(prev => append ? [...prev, ...data.content] : data.content)
      setHasMore(!data.last)
      setPage(pageNum)
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts(activeCategoryId, 0)
  }, [activeCategoryId, loadProducts])

  // Open product detail modal
  const openProductDetail = async (slug: string) => {
    setModalLoading(true)
    setIsModalOpen(true)
    try {
      const detail = await productApi.getProductBySlug(slug)
      setSelectedProduct(detail)
    } catch (err) {
      console.error('Failed to load product detail:', err)
      setIsModalOpen(false)
    } finally {
      setModalLoading(false)
    }
  }

  // Load more products
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadProducts(activeCategoryId, page + 1, true)
    }
  }

  // Scroll logic
  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftButton(scrollLeft > 10)
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scrollLeftFn = () => {
    if (scrollRef.current) scrollRef.current.scrollLeft -= 300
  }

  const scrollRightFn = () => {
    if (scrollRef.current) scrollRef.current.scrollLeft += 300
  }

  useEffect(() => {
    updateScrollButtons()
    window.addEventListener('resize', updateScrollButtons)
    return () => window.removeEventListener('resize', updateScrollButtons)
  }, [categories])

  // Handle category click
  const handleCategoryClick = (categoryId: number | null) => {
    setActiveCategoryId(categoryId)
    setPage(0)
  }

  return (
    <>
      <div className="page-content">
        {/* Scrollable Category Navigation */}
        <section className="mb-8" style={{ width: '100%', overflow: 'hidden' }}>
          <div className={styles.navbarContainer}>
            <div className={styles.navbarWrapper}>
              {showLeftButton && (
                <button className={`${styles.scrollBtn} ${styles.left}`} onClick={scrollLeftFn}>
                  <FiChevronLeft size={24} />
                </button>
              )}

              <div ref={scrollRef} className={styles.navScrollContainer} onScroll={updateScrollButtons}>
                <div className={styles.navList}>
                  <button
                    className={`${styles.navBtn} ${activeCategoryId === null ? styles.active : ''}`}
                    onClick={() => handleCategoryClick(null)}
                  >
                    {t('dashboard.all_categories')}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`${styles.navBtn} ${activeCategoryId === cat.id ? styles.active : ''}`}
                      onClick={() => handleCategoryClick(cat.id)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {showRightButton && (
                <button className={`${styles.scrollBtn} ${styles.right}`} onClick={scrollRightFn}>
                  <FiChevronRight size={24} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="w-full pb-10 px-6">
          <div className="product-grid">
            {products.map((product) => (
              <article
                key={product.id}
                className="product-card"
              >
                <div className="product-img-wrapper">
                  <img
                    src={resolveImgUrl(product.primaryImageUrl) || 'https://via.placeholder.com/800x500/1a1a2e/ffffff?text=No+Image'}
                    alt={product.name}
                    loading="lazy"
                  />
                  {product.totalSold > 1000 && <span className="badge-hot">HOT</span>}
                  <div className="product-card-overlay">
                    <div className="overlay-actions">
                      <div className="overlay-action" onClick={() => openProductDetail(product.slug)}>
                        <div className="overlay-icon"><FiSearch /></div>
                        <span>{t('dashboard.quick_view')}</span>
                      </div>
                      <div className="overlay-action" onClick={() => navigate(`/product/${product.slug}`)}>
                        <div className="overlay-icon"><FiExternalLink /></div>
                        <span>{t('dashboard.view_detail')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="product-info">
                  <span className="product-title cursor-pointer" onClick={() => navigate(`/product/${product.slug}`)}>
                    {product.name}
                  </span>
                  <div className="product-category">{product.categoryName}</div>
                  <div className={styles.cardRating}>
                    <StarRating rating={product.ratingAvg} count={product.ratingCount} size="sm" />
                    <span className={styles.soldCount}>{product.totalSold} {t('dashboard.sold')}</span>
                  </div>
                  <div className="product-meta">
                    <div className={styles.sellerRow}>
                      <img
                        src={product.sellerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.sellerName)}&background=10b981&color=fff&size=64`}
                        alt={product.sellerName}
                        className={styles.sellerAvatar}
                      />
                      <span className={styles.sellerName}>{product.sellerName}</span>
                    </div>
                    <div className={styles.priceTag}>
                      Từ {formatVND(product.minPrice)}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              {t('dashboard.loading')}
            </div>
          )}
        </section >

        {hasMore && !loading && (
          <div className={styles.loadMoreWrapper}>
            <button className={styles.loadMoreBtn} onClick={handleLoadMore}>{t('dashboard.load_more')}</button>
          </div>
        )
        }

        <ProductDetailModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedProduct(null) }}
          product={selectedProduct}
          loading={modalLoading}
        />
      </div >
    </>
  )
}