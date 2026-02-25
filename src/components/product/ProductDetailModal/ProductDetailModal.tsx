import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Modal, StarRating } from '@/components/common';
import styles from './ProductDetailModal.module.css';
import { FiChevronLeft, FiChevronRight, FiShoppingCart, FiShield, FiMinus, FiPlus } from 'react-icons/fi';
import { formatVND } from '@/data/productData';
import type { ProductDetailResponse } from '@/services/productService';
import { useCart } from '@/contexts/CartContext';
import { resolveImgUrl } from '@/utils/imageUrl';

interface ProductDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: ProductDetailResponse | null;
    loading?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
    isOpen,
    onClose,
    product,
    loading = false
}) => {
    const { t } = useTranslation('product');
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
    const [selectedPricingId, setSelectedPricingId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number | string>(1);
    const { addItem } = useCart();
    const navigate = useNavigate();

    // Reset selections when product changes
    React.useEffect(() => {
        if (product) {
            const firstVariant = product.variants[0];
            setSelectedVariantId(firstVariant?.id ?? null);
            setSelectedPricingId(firstVariant?.pricing[0]?.id ?? null);
            setCurrentImgIndex(0);
            setQuantity(1);
        }
    }, [product]);

    const selectedVariant = useMemo(
        () => product?.variants.find(v => v.id === selectedVariantId) ?? null,
        [product, selectedVariantId]
    );

    const selectedPricing = useMemo(
        () => selectedVariant?.pricing.find(p => p.id === selectedPricingId) ?? null,
        [selectedVariant, selectedPricingId]
    );

    if (loading) return (
        <Modal isOpen={isOpen} onClose={onClose} width="1200px">
            <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t('detail.loading')}</div>
            </div>
        </Modal>
    );
    if (!product) return null;

    const images = product.images.sort((a, b) => a.displayOrder - b.displayOrder);
    const handleNext = () => setCurrentImgIndex((prev) => (prev + 1) % images.length);
    const handlePrev = () => setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);

    const handleVariantChange = (variantId: number) => {
        setSelectedVariantId(variantId);
        const variant = product.variants.find(v => v.id === variantId);
        setSelectedPricingId(variant?.pricing[0]?.id ?? null);
    };

    const discount = selectedPricing?.originalPrice
        ? Math.round((1 - selectedPricing.price / selectedPricing.originalPrice) * 100)
        : 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} width="1200px">
            <div className={styles.container}>
                {/* Header Section */}
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h2 className={styles.title}>{product.name}</h2>
                        <div className={styles.authorInfo}>
                            <img
                                src={product.sellerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.sellerName)}&background=10b981&color=fff&size=64`}
                                alt={product.sellerName}
                                className={styles.authorAvatar}
                            />
                            <span className={styles.authorName}>{product.sellerName}</span>
                        </div>
                    </div>
                    <div className={styles.headerRight}>
                        <StarRating rating={product.ratingAvg} count={product.ratingCount} size="md" />
                        <span className={styles.soldBadge}>
                            <FiShoppingCart /> {product.totalSold} {t('detail.sold')}
                        </span>
                    </div>
                </header>

                <div className={styles.mainContent}>
                    {/* Gallery Section */}
                    <div className={styles.gallerySection}>
                        <div className={styles.mainImageWrapper}>
                            <img src={resolveImgUrl(images[currentImgIndex]?.imageUrl)} alt={product.name} className={styles.mainImage} />
                            {images.length > 1 && (
                                <>
                                    <button className={`${styles.navBtn} ${styles.prev}`} onClick={handlePrev}>
                                        <FiChevronLeft />
                                    </button>
                                    <button className={`${styles.navBtn} ${styles.next}`} onClick={handleNext}>
                                        <FiChevronRight />
                                    </button>
                                </>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className={styles.thumbnails}>
                                {images.map((img, idx) => (
                                    <div
                                        key={img.id}
                                        className={`${styles.thumbnail} ${currentImgIndex === idx ? styles.active : ''}`}
                                        onClick={() => setCurrentImgIndex(idx)}
                                    >
                                        <img src={resolveImgUrl(img.imageUrl)} alt={`thumb-${idx}`} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        <div className={styles.description}>
                            <p>{product.detailDescription || product.shortDescription || t('detail.no_description')}</p>
                        </div>
                    </div>

                    {/* Sidebar Section */}
                    <aside className={styles.sidebar}>
                        {/* Variant Selector */}
                        <div className={styles.selectorSection}>
                            <h4 className={styles.selectorTitle}>{t('detail.select_variant')}</h4>
                            <div className={styles.variantList}>
                                {product.variants.map(variant => (
                                    <button
                                        key={variant.id}
                                        className={`${styles.variantBtn} ${selectedVariantId === variant.id ? styles.selected : ''}`}
                                        onClick={() => handleVariantChange(variant.id)}
                                    >
                                        <span className={styles.variantName}>{variant.name}</span>
                                        <span className={styles.variantDesc}>{variant.description}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration Selector */}
                        {selectedVariant && (
                            <div className={styles.selectorSection}>
                                <h4 className={styles.selectorTitle}>{t('detail.select_duration')}</h4>
                                <div className={styles.durationList}>
                                    {selectedVariant.pricing.map(pricing => (
                                        <button
                                            key={pricing.id}
                                            className={`${styles.durationBtn} ${selectedPricingId === pricing.id ? styles.selected : ''} ${pricing.availableStock === 0 ? styles.outOfStock : ''}`}
                                            onClick={() => setSelectedPricingId(pricing.id)}
                                            disabled={pricing.availableStock === 0}
                                        >
                                            <span>{pricing.durationLabel}</span>
                                            <span className={`${styles.stockBadge} ${pricing.availableStock === 0 ? styles.stockEmpty : pricing.availableStock <= 3 ? styles.stockLow : ''}`}>
                                                {pricing.availableStock === 0 ? t('detail.out_of_stock') : t('detail.stock_left', { count: pricing.availableStock })}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Price Display */}
                        {selectedPricing && (
                            <div className={styles.priceDisplay}>
                                <div className={styles.priceRow}>
                                    <span className={styles.currentPrice}>{formatVND(selectedPricing.price)}</span>
                                    {selectedPricing.originalPrice && (
                                        <>
                                            <span className={styles.originalPrice}>{formatVND(selectedPricing.originalPrice)}</span>
                                            <span className={styles.discountBadge}>-{discount}%</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        {selectedPricing && (
                            <div className={styles.quantitySection}>
                                <h4 className={styles.selectorTitle}>{t('detail.quantity')}</h4>
                                <div className={styles.quantityControl}>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => setQuantity(q => Math.max(1, Number(q) - 1))}
                                        disabled={Number(quantity) <= 1}
                                    >
                                        <FiMinus />
                                    </button>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        className={styles.qtyInput}
                                        value={quantity}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/\D/g, '');
                                            if (raw === '') { setQuantity(''); return; }
                                            const val = Math.min(99, Math.max(1, parseInt(raw)));
                                            setQuantity(val);
                                        }}
                                        onBlur={() => {
                                            if (quantity === '' || quantity === 0) setQuantity(1);
                                        }}
                                    />
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => setQuantity(q => Math.min(selectedPricing?.availableStock ?? 99, Number(q) + 1))}
                                        disabled={Number(quantity) >= (selectedPricing?.availableStock ?? 99)}
                                    >
                                        <FiPlus />
                                    </button>
                                </div>
                                {Number(quantity) > 1 && (
                                    <div className={styles.totalPrice}>
                                        {t('detail.total_price')}: <strong>{formatVND(selectedPricing.price * Number(quantity))}</strong>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Warranty Policy */}
                        {selectedPricing && (
                            <div className={styles.warrantySection}>
                                <h4 className={styles.warrantyTitle}>
                                    <FiShield /> {t('detail.warranty_policy')}
                                </h4>
                                <div className={styles.warrantyContent}>
                                    {selectedPricing.warrantyPolicy}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className={styles.ctaSection}>
                            <button
                                className={styles.addToCartOutlineBtn}
                                disabled={!selectedPricing || !selectedVariant || selectedPricing.availableStock === 0}
                                onClick={async () => {
                                    if (!product || !selectedVariant || !selectedPricing) return;
                                    const primaryImage = resolveImgUrl(product.images.find(img => img.isPrimary)?.imageUrl
                                        || product.images[0]?.imageUrl) || null;
                                    try {
                                        await addItem({
                                            productId: product.id,
                                            variantId: selectedVariant.id,
                                            pricingId: selectedPricing.id,
                                            quantity: Number(quantity) || 1,
                                            productName: product.name,
                                            productSlug: product.slug,
                                            productImage: primaryImage,
                                            variantName: selectedVariant.name,
                                            durationLabel: selectedPricing.durationLabel,
                                            price: selectedPricing.price,
                                            originalPrice: selectedPricing.originalPrice,
                                        });
                                    } catch (err) {
                                        console.error('Add to cart failed:', err);
                                    }
                                }}
                            >
                                <FiShoppingCart /> {t('detail.add_to_cart')}
                            </button>
                            <button
                                className={styles.addToCartBtn}
                                disabled={!selectedPricing || !selectedVariant || selectedPricing.availableStock === 0}
                                onClick={() => {
                                    if (!product || !selectedVariant || !selectedPricing) return;
                                    const primaryImage = resolveImgUrl(product.images.find(img => img.isPrimary)?.imageUrl
                                        || product.images[0]?.imageUrl) || null;
                                    onClose();
                                    navigate('/checkout', {
                                        state: {
                                            items: [{
                                                productId: product.id,
                                                variantId: selectedVariant.id,
                                                pricingId: selectedPricing.id,
                                                quantity: Number(quantity) || 1,
                                                unitPrice: selectedPricing.price,
                                                productName: product.name,
                                                variantName: selectedVariant.name,
                                                durationLabel: selectedPricing.durationLabel,
                                                productImage: primaryImage,
                                                sellerId: product.sellerId,
                                                loginGuide: selectedVariant.loginGuide || undefined,
                                                twoFactorGuide: selectedVariant.twoFactorGuide || undefined,
                                                sellerContactUrl: selectedVariant.sellerContactUrl || undefined,
                                            }],
                                            source: 'buy-now',
                                        },
                                    });
                                }}
                            >
                                {t('detail.buy_now')} {selectedPricing ? formatVND(selectedPricing.price * Number(quantity)) : ''}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </Modal>
    );
};
