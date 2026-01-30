import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './ProductDetail.module.css';
import {
    FiChevronLeft,
    FiChevronRight,
    FiHeart,
    FiLink,
    FiDownload,
    FiShoppingCart,
    FiCalendar,
    FiClock,
    FiTag,
    FiLayout,
    FiCheckCircle,
    FiStar,
    FiThumbsUp,
    FiThumbsDown,
    FiChevronDown,
    FiSearch
} from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';

export const ProductDetail = () => {
    const { id } = useParams();
    const { addItem } = useCart();
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    // Mock product data to simulate "100% giống" requirement
    const product = {
        id: id || 'p1',
        title: 'Temprador WooCommerce Landing Page Theme',
        price: 59.0,
        image: 'https://via.placeholder.com/1200x800/10b981/ffffff?text=Product+Main',
        category: 'Imagineco',
        author: 'Imagineco',
        description: `Along with Wordpress Themes & Plugins, We always try to use latest trending techs like React, Next Js, Gatsby Js, GraphQL, Shopify etc to make our products special. Our rich tech choice will help ...
    
    This is a professional WooCommerce landing page theme designed for modern businesses. It features a clean, responsive design that works perfectly across all devices.`,
        sales: 142,
        downloads: 361,
        lastUpdate: 'Jan 27, 2026',
        published: 'Jan 27, 2026',
        layout: 'Liquid',
        tags: ['Dashboard', 'E-commerce', 'Landing Page', 'Retail', 'WooCommerce'],
        gallery: [
            'https://via.placeholder.com/1200x800/10b981/ffffff?text=Slide+1',
            'https://via.placeholder.com/1200x800/3b82f6/ffffff?text=Slide+2',
            'https://via.placeholder.com/1200x800/8b5cf6/ffffff?text=Slide+3',
            'https://via.placeholder.com/1200x800/ec4899/ffffff?text=Slide+4'
        ]
    };

    const handleNext = () => setCurrentImgIndex((prev) => (prev + 1) % product.gallery.length);
    const handlePrev = () => setCurrentImgIndex((prev) => (prev - 1 + product.gallery.length) % product.gallery.length);

    return (
        <div className={styles.pageWrapper}>
            {/* Breadcrumbs */}
            <nav className={styles.breadcrumbs}>
                <Link to="/dashboard">Products</Link>
                <span className={styles.separator}>/</span>
                <span>{product.title}</span>
            </nav>

            <div className={styles.mainLayout}>
                {/* Left Content Area */}
                <div className={styles.contentArea}>
                    {/* Hero Section */}
                    <div className={styles.heroSection}>
                        <div className={styles.headerRow}>
                            <h1 className={styles.productTitle}>{product.title}</h1>
                            <div className={styles.headerActions}>
                                <div className={styles.authorBadge}>
                                    <div className={styles.authorAvatar}></div>
                                    <span>{product.author}</span>
                                </div>
                                <button className={styles.wishlistBtn}>
                                    <FiHeart />
                                </button>
                            </div>
                        </div>

                        <div className={styles.galleryContainer}>
                            <div className={styles.mainImageWrapper}>
                                <img src={product.gallery[currentImgIndex]} alt={product.title} />
                                <button className={`${styles.navBtn} ${styles.prev}`} onClick={handlePrev}>
                                    <FiChevronLeft />
                                </button>
                                <button className={`${styles.navBtn} ${styles.next}`} onClick={handleNext}>
                                    <FiChevronRight />
                                </button>
                            </div>
                            <div className={styles.thumbnailStrip}>
                                {product.gallery.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`${styles.thumbnailItem} ${currentImgIndex === idx ? styles.active : ''}`}
                                        onClick={() => setCurrentImgIndex(idx)}
                                    >
                                        <img src={img} alt={`thumb-${idx}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className={styles.descriptionSection}>
                        <h3 className={styles.sectionTitle}>Description</h3>
                        <div className={styles.descriptionContent}>
                            <p>{product.description}</p>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className={styles.featuresSection}>
                        <h3 className={styles.sectionTitle}>Product Features</h3>
                        <ul className={styles.featureList}>
                            <li><FiCheckCircle className={styles.checkIcon} /> Responsive Design</li>
                            <li><FiCheckCircle className={styles.checkIcon} /> Clean Code</li>
                            <li><FiCheckCircle className={styles.checkIcon} /> Modern Typography</li>
                            <li><FiCheckCircle className={styles.checkIcon} /> Premium Support</li>
                        </ul>
                    </div>

                    {/* Reviews Section */}
                    <div className={styles.reviewsSection}>
                        <div className={styles.ratingSummary}>
                            <div className={styles.ratingLeft}>
                                <div className={styles.mainRating}>
                                    <span>5</span>
                                    <FiStar fill="currentColor" />
                                </div>
                                <span className={styles.reviewCount}>1 Reviews</span>
                            </div>
                            <div className={styles.ratingRight}>
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <div key={star} className={styles.ratingBarRow}>
                                        <span className={styles.starLabel}>{star} <FiStar /></span>
                                        <div className={styles.barContainer}>
                                            <div
                                                className={styles.barFill}
                                                style={{ width: star === 5 ? '100%' : '0%' }}
                                            ></div>
                                        </div>
                                        <span className={styles.barValue}>{star === 5 ? 1 : 0}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.reviewsHeader}>
                            <h3 className={styles.sectionTitle}>Product Reviews (3)</h3>
                            <div className={styles.sortDropdown}>
                                <span>Recent</span>
                                <FiChevronDown />
                            </div>
                        </div>

                        <div className={styles.reviewList}>
                            <div className={styles.reviewCard}>
                                <div className={styles.reviewerInfo}>
                                    <div className={styles.reviewerAvatar}>C</div>
                                    <div>
                                        <div className={styles.reviewerNameRow}>
                                            <span className={styles.reviewerName}>Customer</span>
                                            <span className={styles.ratingBadge}>5 <FiStar fill="currentColor" /></span>
                                        </div>
                                    </div>
                                </div>
                                <p className={styles.reviewText}>
                                    Exceptional digital product! Its user-friendly interface simplifies tasks, offering robust features thats.
                                </p>
                                <div className={styles.reviewImages}>
                                    <img src="https://via.placeholder.com/100x100/10b981/ffffff?text=Review" alt="review" />
                                </div>
                                <div className={styles.reviewMeta}>
                                    <span>November 17, 2023</span>
                                    <span className={styles.metaDot}>•</span>
                                    <button className={styles.reportBtn}>Report</button>
                                    <span className={styles.metaDot}>•</span>
                                    <div className={styles.reviewActions}>
                                        <button><FiThumbsUp /> 1</button>
                                        <button><FiThumbsDown /> 0</button>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.reviewCard}>
                                <div className={styles.reviewerInfo}>
                                    <div className={styles.reviewerAvatar}>C</div>
                                    <div>
                                        <div className={styles.reviewerNameRow}>
                                            <span className={styles.reviewerName}>Customer</span>
                                            <span className={styles.ratingBadge}>5 <FiStar fill="currentColor" /></span>
                                        </div>
                                    </div>
                                </div>
                                <p className={styles.reviewText}>Nice.</p>
                                <div className={styles.reviewMeta}>
                                    <span>October 3, 2024</span>
                                    <span className={styles.metaDot}>•</span>
                                    <button className={styles.reportBtn}>Report</button>
                                    <span className={styles.metaDot}>•</span>
                                    <div className={styles.reviewActions}>
                                        <button><FiThumbsUp /> 0</button>
                                        <button><FiThumbsDown /> 1</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className={styles.pagination}>
                            <span className={styles.pageInfo}>Page 1 of 1</span>
                            <div className={styles.pageNav}>
                                <button className={styles.navLink}>Prev</button>
                                <button className={`${styles.navLink} ${styles.activePage}`}>1</button>
                                <button className={styles.navLink}>Next</button>
                            </div>
                        </div>
                    </div>

                    {/* Question Section */}
                    <div className={styles.questionSection}>
                        <div className={styles.questionHeader}>
                            <h3 className={styles.sectionTitle}>Question and Answers (0)</h3>
                            <div className={styles.questionActions}>
                                <div className={styles.searchWrapper}>
                                    <FiSearch />
                                    <input type="text" placeholder="Search Question" />
                                </div>
                                <button className={styles.askBtn}>Ask Question</button>
                            </div>
                        </div>
                        <div className={styles.noQuestions}>
                            <h3>No question found</h3>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarSticky}>
                        <div className={styles.priceCard}>
                            <div className={styles.sidebarStats}>
                                <div className={styles.statBox}>
                                    <FiShoppingCart />
                                    <span>{product.sales} Sales</span>
                                </div>
                                <div className={styles.statBox}>
                                    <FiDownload />
                                    <span>{product.downloads} Downloads</span>
                                </div>
                            </div>

                            <div className={styles.sidebarMeta}>
                                <div className={styles.metaRow}>
                                    <span className={styles.metaLabel}><FiClock /> Last Update:</span>
                                    <span className={styles.metaValue}>{product.lastUpdate}</span>
                                </div>
                                <div className={styles.metaRow}>
                                    <span className={styles.metaLabel}><FiCalendar /> Published:</span>
                                    <span className={styles.metaValue}>{product.published}</span>
                                </div>
                                <div className={styles.metaRow}>
                                    <span className={styles.metaLabel}><FiLayout /> Layout:</span>
                                    <span className={styles.metaValue}>{product.layout}</span>
                                </div>
                                <div className={styles.metaRow}>
                                    <span className={styles.metaLabel}><FiTag /> Tags:</span>
                                    <div className={styles.tagCloud}>
                                        {product.tags.map(tag => (
                                            <span key={tag} className={styles.tagBadge}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.sidebarActions}>
                                <span>Share this item:</span>
                                <div className={styles.socialIcons}>
                                    <button className={styles.socialIcon}><i className="fa-brands fa-facebook-f"></i></button>
                                    <button className={styles.socialIcon}><i className="fa-brands fa-twitter"></i></button>
                                    <button className={styles.socialIcon}><i className="fa-brands fa-linkedin-in"></i></button>
                                    <button className={styles.copyLinkBtn}><FiLink /> Copy link</button>
                                </div>
                            </div>

                            <div className={styles.ctaButtons}>
                                <button
                                    className={styles.primaryBtn}
                                    onClick={() => addItem({
                                        id: product.id,
                                        title: product.title,
                                        price: product.price,
                                        image: product.image
                                    })}
                                >
                                    Add to Cart ${product.price.toFixed(2)}
                                </button>
                                <button className={styles.secondaryBtn}>
                                    Live Preview
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};
