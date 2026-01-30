import React, { useState } from 'react';
import { Modal } from '@/components/common';
import styles from './ProductDetailModal.module.css';
import { FiChevronLeft, FiChevronRight, FiHeart, FiLink, FiDownload, FiShoppingCart, FiCalendar, FiClock, FiTag, FiLayout } from 'react-icons/fi';

interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    author: string;
    description?: string;
}

interface ProductDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onAddToCart: (product: any) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
    isOpen,
    onClose,
    product,
    onAddToCart
}) => {
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    // Mock thumbnails for the gallery demonstration
    const images = product ? [
        product.image,
        'https://via.placeholder.com/800x600/3b82f6/ffffff?text=Slide+2',
        'https://via.placeholder.com/800x600/10b981/ffffff?text=Slide+3',
        'https://via.placeholder.com/800x600/f59e0b/ffffff?text=Slide+4'
    ] : [];

    if (!product) return null;

    const handleNext = () => setCurrentImgIndex((prev) => (prev + 1) % images.length);
    const handlePrev = () => setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <Modal isOpen={isOpen} onClose={onClose} width="1200px">
            <div className={styles.container}>
                {/* Header Section */}
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h2 className={styles.title}>{product.title}</h2>
                        <div className={styles.authorInfo}>
                            <div className={styles.authorAvatar}></div>
                            <span className={styles.authorName}>{product.author}</span>
                            <button className={styles.wishlistBtn}>
                                <FiHeart />
                            </button>
                        </div>
                    </div>
                </header>

                <div className={styles.mainContent}>
                    {/* Gallery Section */}
                    <div className={styles.gallerySection}>
                        <div className={styles.mainImageWrapper}>
                            <img src={images[currentImgIndex]} alt={product.title} className={styles.mainImage} />
                            <button className={`${styles.navBtn} ${styles.prev}`} onClick={handlePrev}>
                                <FiChevronLeft />
                            </button>
                            <button className={`${styles.navBtn} ${styles.next}`} onClick={handleNext}>
                                <FiChevronRight />
                            </button>
                        </div>
                        <div className={styles.thumbnails}>
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles.thumbnail} ${currentImgIndex === idx ? styles.active : ''}`}
                                    onClick={() => setCurrentImgIndex(idx)}
                                >
                                    <img src={img} alt="thumbnail" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Section */}
                    <aside className={styles.sidebar}>
                        <div className={styles.description}>
                            <p>Along with Wordpress Themes & Plugins, We always try to use latest trending techs like React, Next Js, Gatsby Js, GraphQL, Shopify etc to make our products special. Our rich tech choice will help ...</p>
                        </div>

                        <div className={styles.statsRow}>
                            <div className={styles.statItem}>
                                <FiShoppingCart />
                                <span>142 Sales</span>
                            </div>
                            <div className={styles.statItem}>
                                <FiDownload />
                                <span>361 Downloads</span>
                            </div>
                        </div>

                        <div className={styles.metaList}>
                            <div className={styles.metaItem}>
                                <div className={styles.metaLabel}>
                                    <FiClock /> <span>Last Update:</span>
                                </div>
                                <div className={styles.metaValue}>Jan 27, 2026</div>
                            </div>
                            <div className={styles.metaItem}>
                                <div className={styles.metaLabel}>
                                    <FiCalendar /> <span>Published:</span>
                                </div>
                                <div className={styles.metaValue}>Jan 27, 2026</div>
                            </div>
                            <div className={styles.metaItem}>
                                <div className={styles.metaLabel}>
                                    <FiLayout /> <span>Layout:</span>
                                </div>
                                <div className={styles.metaValue}>Liquid</div>
                            </div>
                            <div className={styles.metaItem}>
                                <div className={styles.metaLabel}>
                                    <FiTag /> <span>Tags:</span>
                                </div>
                                <div className={styles.tags}>
                                    {['Dashboard', 'E-commerce', 'Landing Page', 'Retail', 'WooCommerce'].map(tag => (
                                        <span key={tag} className={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.shareSection}>
                            <span>Share this item:</span>
                            <div className={styles.socialIcons}>
                                <button className={styles.socialBtn}><i className="fa-brands fa-facebook-f"></i></button>
                                <button className={styles.socialBtn}><i className="fa-brands fa-twitter"></i></button>
                                <button className={styles.socialBtn}><i className="fa-brands fa-linkedin-in"></i></button>
                                <button className={styles.copyLinkBtn}><FiLink /> Copy link</button>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Action Footer */}
                <footer className={styles.footer}>
                    <button
                        className={styles.addToCartBtn}
                        onClick={() => onAddToCart(product)}
                    >
                        Add to Cart ${product.price.toFixed(2)}
                    </button>
                    <button className={styles.livePreviewBtn}>
                        Live Preview
                    </button>
                </footer>
            </div>
        </Modal>
    );
};
