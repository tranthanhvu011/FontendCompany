import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './ProductDetail.module.css';
import {
    FiChevronLeft,
    FiChevronRight,
    FiHeart,
    FiLink,
    FiShoppingCart,
    FiShield,
    FiMinus,
    FiPlus,
    FiStar,
    FiThumbsUp,
    FiThumbsDown,
    FiChevronDown,
    FiSearch,
    FiMessageCircle,
    FiPackage,
    FiAlertCircle,
    FiUser,
    FiClock,
    FiShare2
} from 'react-icons/fi';
import { StarRating } from '@/components/common';
import { formatVND } from '@/data/productData';
import { productApi } from '@/services/productService';
import type {
    ProductDetailResponse,
    Page,
    ProductReviewStatsResponse,
    QuestionResponse,
    ReviewResponse
} from '@/services/productService';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { useChat } from '@/contexts/ChatContext';
import { resolveImgUrl } from '@/utils/imageUrl';

// ===========================
// Component
// ===========================


export const ProductDetail = () => {
    const { t, i18n } = useTranslation('product');
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { openChatWith } = useChat();

    // Product data state
    const [product, setProduct] = useState<ProductDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Gallery state
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    // Variant/Pricing selection
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
    const [selectedPricingId, setSelectedPricingId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number | string>(1);

    // Reviews state
    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [reviewPage, setReviewPage] = useState(0);
    const [reviewTotalPages, setReviewTotalPages] = useState(0);
    const [reviewTotalElements, setReviewTotalElements] = useState(0);
    const [reviewSort, setReviewSort] = useState<'createdAt,desc' | 'createdAt,asc'>('createdAt,desc');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [reviewStats, setReviewStats] = useState<ProductReviewStatsResponse | null>(null);

    // Q&A state
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [questionsTotalElements, setQuestionsTotalElements] = useState(0);
    const [qaSearchQuery, setQaSearchQuery] = useState('');
    const [showAskForm, setShowAskForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [askingQuestion, setAskingQuestion] = useState(false);

    // Wishlist state
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const { addItem: addToCart } = useCart();
    const toast = useToast();

    const dateLocale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

    // ===========================
    // Data Fetching
    // ===========================

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        setError(null);
        productApi.getProductBySlug(slug)
            .then(data => {
                setProduct(data);
                // Auto-select first variant + first pricing
                if (data.variants.length > 0) {
                    setSelectedVariantId(data.variants[0].id);
                    if (data.variants[0].pricing.length > 0) {
                        setSelectedPricingId(data.variants[0].pricing[0].id);
                    }
                }
                setCurrentImgIndex(0);
            })
            .catch(() => setError(t('detail.error_load')))
            .finally(() => setLoading(false));
    }, [slug]);

    // Fetch reviews
    const fetchReviews = useCallback(async (page: number, sort: string) => {
        if (!product) return;
        setReviewLoading(true);
        try {
            const data: Page<ReviewResponse> = await productApi.getReviews(product.id, page, 5, sort);
            setReviews(data.content);
            setReviewTotalPages(data.totalPages);
            setReviewTotalElements(data.totalElements);
            setReviewPage(data.page);
        } catch {
            // silent fail — reviews optional
        } finally {
            setReviewLoading(false);
        }
    }, [product]);

    useEffect(() => {
        if (product) {
            fetchReviews(reviewPage, reviewSort);
        }
    }, [product, reviewPage, reviewSort, fetchReviews]);

    useEffect(() => {
        if (!product) return;
        productApi.getReviewStats(product.id)
            .then(setReviewStats)
            .catch(() => setReviewStats(null));
    }, [product]);

    // Fetch Q&A
    useEffect(() => {
        if (!product) return;
        setQuestionsLoading(true);
        productApi.getQuestions(product.id, 0, 50)
            .then(data => {
                setQuestions(data.content);
                setQuestionsTotalElements(data.totalElements);
            })
            .catch(() => { /* silent */ })
            .finally(() => setQuestionsLoading(false));
    }, [product]);

    // ===========================
    // Computed Values
    // ===========================

    const selectedVariant = useMemo(
        () => product?.variants.find(v => v.id === selectedVariantId) ?? null,
        [product, selectedVariantId]
    );

    const selectedPricing = useMemo(
        () => selectedVariant?.pricing.find(p => p.id === selectedPricingId) ?? null,
        [selectedVariant, selectedPricingId]
    );

    const discount = selectedPricing?.originalPrice
        ? Math.round((1 - selectedPricing.price / selectedPricing.originalPrice) * 100)
        : 0;

    const images = useMemo(
        () => product?.images.sort((a, b) => a.displayOrder - b.displayOrder) ?? [],
        [product]
    );

    // Q&A filtered
    const filteredQuestions = useMemo(
        () => qaSearchQuery
            ? questions.filter(q =>
                q.question.toLowerCase().includes(qaSearchQuery.toLowerCase()) ||
                (q.answer && q.answer.toLowerCase().includes(qaSearchQuery.toLowerCase()))
            )
            : questions,
        [qaSearchQuery, questions]
    );

    const ratingAvgDisplay = reviewStats?.ratingAvg ?? product?.ratingAvg ?? 0;
    const ratingCountDisplay = reviewStats?.ratingCount ?? product?.ratingCount ?? 0;

    // Rating distribution from backend stats
    const ratingDistribution = useMemo(() => {
        if (!reviewStats) return [0, 0, 0, 0, 0];
        return [
            reviewStats.oneStar,
            reviewStats.twoStar,
            reviewStats.threeStar,
            reviewStats.fourStar,
            reviewStats.fiveStar
        ];
    }, [reviewStats]);

    // ===========================
    // Handlers
    // ===========================

    const handleVariantChange = (variantId: number) => {
        setSelectedVariantId(variantId);
        const variant = product?.variants.find(v => v.id === variantId);
        setSelectedPricingId(variant?.pricing[0]?.id ?? null);
    };

    const handleNext = () => setCurrentImgIndex((prev) => (prev + 1) % images.length);
    const handlePrev = () => setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);

    const handleReviewSort = (sort: 'createdAt,desc' | 'createdAt,asc') => {
        setReviewSort(sort);
        setReviewPage(0);
        setSortDropdownOpen(false);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const handleAskQuestion = async () => {
        if (!newQuestion.trim() || !product) return;

        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast.error(t('detail.login_to_ask'));
            return;
        }

        setAskingQuestion(true);
        try {
            const res = await productApi.askQuestion(product.id, newQuestion.trim());
            setQuestions(prev => [res, ...prev]);
            setQuestionsTotalElements(prev => prev + 1);
            setNewQuestion('');
            setShowAskForm(false);
            toast.success(t('detail.question_success'));
        } catch {
            // Error handled by interceptor toast
        } finally {
            setAskingQuestion(false);
        }
    };

    const handleAddToCart = async () => {
        if (!product || !selectedVariant || !selectedPricing) return;
        const primaryImage = resolveImgUrl(product.images.find(img => img.isPrimary)?.imageUrl
            || product.images[0]?.imageUrl)
            || null;
        try {
            await addToCart({
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
    };

    // ===========================
    // Loading / Error States
    // ===========================

    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>{t('detail.loading')}</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.errorState}>
                    <FiAlertCircle className={styles.errorIcon} />
                    <h2>{t('detail.not_found')}</h2>
                    <p>{error || t('detail.not_found_desc')}</p>
                    <Link to="/" className={styles.backLink}>{t('detail.back_home')}</Link>
                </div>
            </div>
        );
    }

    // ===========================
    // Render
    // ===========================

    return (
        <div className={styles.pageWrapper}>
            {/* Breadcrumbs */}
            <nav className={styles.breadcrumbs}>
                <Link to="/">{t('detail.breadcrumb_products')}</Link>
                <span className={styles.separator}>/</span>
                <span className={styles.breadcrumbCategory}>{product.categoryName}</span>
                <span className={styles.separator}>/</span>
                <span>{product.name}</span>
            </nav>

            <div className={styles.mainLayout}>
                {/* Hero Section (gallery + title) */}
                <div className={styles.heroSection}>
                    <div className={styles.headerRow}>
                        <h1 className={styles.productTitle}>{product.name}</h1>
                        <div className={styles.headerActions}>
                            <div className={styles.authorBadge}>
                                <img
                                    src={product.sellerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.sellerName)}&background=10b981&color=fff&size=64`}
                                    alt={product.sellerName}
                                    className={styles.authorAvatarImg}
                                />
                                <span>{product.sellerName}</span>
                            </div>
                            <button
                                className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ''}`}
                                onClick={() => setIsWishlisted(!isWishlisted)}
                            >
                                <FiHeart />
                            </button>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className={styles.statsRow}>
                        <StarRating rating={product.ratingAvg} count={product.ratingCount} size="md" />
                        <span className={styles.statDivider}>•</span>
                        <span className={styles.statItem}>
                            <FiShoppingCart /> {product.totalSold.toLocaleString()} {t('detail.sold')}
                        </span>
                    </div>

                    {/* Seller Info Strip */}
                    <div className={styles.sellerStrip}>
                        <div className={styles.sellerStripLeft}>
                            <img
                                src={product.sellerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.sellerName)}&background=10b981&color=fff&size=64`}
                                alt={product.sellerName}
                                className={styles.sellerStripAvatar}
                            />
                            <div className={styles.sellerStripInfo}>
                                <span className={styles.sellerStripName}>{product.sellerName}</span>
                                <span className={styles.sellerStripMeta}>
                                    <FiShoppingCart /> {product.totalSold.toLocaleString()} {t('detail.sold')}
                                    <span className={styles.sellerStripDot}>•</span>
                                    <FiStar /> {product.ratingAvg.toFixed(1)} ({product.ratingCount})
                                </span>
                            </div>
                        </div>
                        <div className={styles.sellerStripActions}>
                            <button
                                className={styles.sellerStripChat}
                                onClick={() => {
                                    openChatWith({
                                        sellerId: product.sellerId,
                                        sellerName: product.sellerName,
                                        sellerAvatar: product.sellerAvatar ?? undefined,
                                    });
                                }}
                            >
                                <FiMessageCircle /> {t('detail.message_seller')}
                            </button>
                            <Link
                                to={`/shop/${product.sellerId}`}
                                className={styles.sellerStripShop}
                            >
                                <FiUser /> {t('detail.visit_shop')}
                            </Link>
                        </div>
                    </div>

                    {/* Gallery */}
                    <div className={styles.galleryContainer}>
                        <div className={styles.mainImageWrapper}>
                            {images.length > 0 ? (
                                <img src={resolveImgUrl(images[currentImgIndex]?.imageUrl)} alt={product.name} loading="lazy" />
                            ) : (
                                <div className={styles.noImage}>
                                    <FiPackage />
                                    <span>{t('detail.no_image')}</span>
                                </div>
                            )}
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
                            <div className={styles.thumbnailStrip}>
                                {images.map((img, idx) => (
                                    <div
                                        key={img.id}
                                        className={`${styles.thumbnailItem} ${currentImgIndex === idx ? styles.active : ''}`}
                                        onClick={() => setCurrentImgIndex(idx)}
                                    >
                                        <img src={resolveImgUrl(img.imageUrl)} alt={`thumb-${idx}`} loading="lazy" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Content (description, reviews, Q&A) */}
                <div className={styles.bottomContent}>
                    <div className={styles.descriptionSection}>
                        <h3 className={styles.sectionTitle}>{t('detail.description')}</h3>
                        <div className={styles.descriptionContent}>
                            <p>{product.detailDescription || product.shortDescription || t('detail.no_description')}</p>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className={styles.reviewsSection}>
                        <div className={styles.ratingSummary}>
                            <div className={styles.ratingLeft}>
                                <div className={styles.mainRating}>
                                    <span>{Number(ratingAvgDisplay).toFixed(1)}</span>
                                    <FiStar fill="currentColor" />
                                </div>
                                <span className={styles.reviewCount}>{t('detail.total_reviews', { count: ratingCountDisplay })}</span>
                            </div>
                            <div className={styles.ratingRight}>
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <div key={star} className={styles.ratingBarRow}>
                                        <span className={styles.starLabel}>{star} <FiStar /></span>
                                        <div className={styles.barContainer}>
                                            <div
                                                className={styles.barFill}
                                                style={{ width: ratingCountDisplay > 0 ? `${(ratingDistribution[star - 1] / ratingCountDisplay) * 100}%` : '0%' }}
                                            ></div>
                                        </div>
                                        <span className={styles.barValue}>{ratingDistribution[star - 1]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.reviewsHeader}>
                            <h3 className={styles.sectionTitle}>
                                {t('detail.reviews_count', { count: reviewTotalElements })}
                            </h3>
                            <div className={styles.sortDropdownWrapper}>
                                <button
                                    className={styles.sortDropdown}
                                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                                >
                                    <span>{reviewSort === 'createdAt,desc' ? t('detail.newest') : t('detail.oldest')}</span>
                                    <FiChevronDown />
                                </button>
                                {sortDropdownOpen && (
                                    <div className={styles.sortDropdownMenu}>
                                        <button
                                            className={reviewSort === 'createdAt,desc' ? styles.sortActive : ''}
                                            onClick={() => handleReviewSort('createdAt,desc')}
                                        >
                                            {t('detail.newest')}
                                        </button>
                                        <button
                                            className={reviewSort === 'createdAt,asc' ? styles.sortActive : ''}
                                            onClick={() => handleReviewSort('createdAt,asc')}
                                        >
                                            {t('detail.oldest')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Review List */}
                        {reviewLoading ? (
                            <div className={styles.reviewLoadingState}>{t('detail.loading_reviews')}</div>
                        ) : reviews.length === 0 ? (
                            <div className={styles.emptyReviews}>
                                <FiStar />
                                <p>{t('detail.no_reviews')}</p>
                            </div>
                        ) : (
                            <div className={styles.reviewList}>
                                {reviews.map((review) => (
                                    <div key={review.id} className={styles.reviewCard}>
                                        <div className={styles.reviewerInfo}>
                                            <div className={styles.reviewerAvatar}>
                                                {review.buyerAvatar ? (
                                                    <img src={resolveImgUrl(review.buyerAvatar)} alt={review.buyerName} className={styles.reviewerAvatarImg} />
                                                ) : (
                                                    (review.buyerName || String(review.buyerId)).charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <div className={styles.reviewerNameRow}>
                                                    <span className={styles.reviewerName}>
                                                        {review.buyerName || t('detail.user_fallback', { id: review.buyerId })}
                                                    </span>
                                                    <span className={styles.ratingBadge}>
                                                        {review.rating} <FiStar fill="currentColor" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <p className={styles.reviewText}>{review.comment}</p>
                                        )}
                                        <div className={styles.reviewMeta}>
                                            <span>
                                                <FiClock /> {new Date(review.createdAt).toLocaleDateString(dateLocale)}
                                            </span>
                                            <span className={styles.metaDot}>•</span>
                                            <button className={styles.reportBtn}>{t('detail.report')}</button>
                                            <span className={styles.metaDot}>•</span>
                                            <div className={styles.reviewActions}>
                                                <button><FiThumbsUp /> 0</button>
                                                <button><FiThumbsDown /> 0</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {reviewTotalPages > 1 && (
                            <div className={styles.pagination}>
                                <span className={styles.pageInfo}>
                                    {t('detail.page_info', { current: reviewPage + 1, total: reviewTotalPages })}
                                </span>
                                <div className={styles.pageNav}>
                                    <button
                                        className={styles.navLink}
                                        disabled={reviewPage === 0}
                                        onClick={() => setReviewPage(prev => Math.max(0, prev - 1))}
                                    >
                                        {t('detail.prev')}
                                    </button>
                                    {Array.from({ length: reviewTotalPages }, (_, i) => (
                                        <button
                                            key={i}
                                            className={`${styles.navLink} ${reviewPage === i ? styles.activePage : ''}`}
                                            onClick={() => setReviewPage(i)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        className={styles.navLink}
                                        disabled={reviewPage >= reviewTotalPages - 1}
                                        onClick={() => setReviewPage(prev => Math.min(reviewTotalPages - 1, prev + 1))}
                                    >
                                        {t('detail.next')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Question & Answers Section */}
                    <div className={styles.questionSection}>
                        <div className={styles.questionHeader}>
                            <div className={styles.questionTitleGroup}>
                                <div className={styles.questionIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                </div>
                                <h3 className={styles.sectionTitle}>{t('detail.questions')}</h3>
                                <span className={styles.questionCount}>{t('detail.questions_count', { count: questionsTotalElements })}</span>
                            </div>
                            <div className={styles.questionActions}>
                                <div className={styles.searchWrapper}>
                                    <FiSearch />
                                    <input
                                        type="text"
                                        placeholder={t('detail.search_questions')}
                                        value={qaSearchQuery}
                                        onChange={(e) => setQaSearchQuery(e.target.value)}
                                    />
                                </div>
                                <button
                                    className={styles.askBtn}
                                    onClick={() => setShowAskForm(!showAskForm)}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    {t('detail.ask_question')}
                                </button>
                            </div>
                        </div>

                        {/* Ask Form */}
                        {showAskForm && (
                            <div className={styles.askForm}>
                                <div className={styles.askFormHeader}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
                                    </svg>
                                    <span>{t('detail.ask_seller')}</span>
                                </div>
                                <textarea
                                    placeholder={t('detail.question_placeholder')}
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    rows={3}
                                    maxLength={500}
                                />
                                <div className={styles.askFormFooter}>
                                    <span className={styles.charCount}>{newQuestion.length}/500</span>
                                    <div className={styles.askFormActions}>
                                        <button className={styles.askCancelBtn} onClick={() => setShowAskForm(false)}>
                                            {t('detail.cancel')}
                                        </button>
                                        <button className={styles.askSubmitBtn} onClick={handleAskQuestion} disabled={askingQuestion || !newQuestion.trim()}>
                                            {askingQuestion ? (
                                                <>
                                                    <span className={styles.btnSpinner}></span>
                                                    {t('detail.sending')}
                                                </>
                                            ) : (
                                                <>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                                                        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                                                    </svg>
                                                    {t('detail.submit_question')}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Q&A List */}
                        {questionsLoading ? (
                            <div className={styles.qaLoading}>
                                <div className={styles.qaLoadingSpinner}></div>
                                <p>{t('detail.loading_questions')}</p>
                            </div>
                        ) : filteredQuestions.length === 0 ? (
                            <div className={styles.noQuestions}>
                                <div className={styles.noQuestionsIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                </div>
                                <h3>{t('detail.no_questions')}</h3>
                                <p>{t('detail.no_questions_desc')}</p>
                            </div>
                        ) : (
                            <div className={styles.qaList}>
                                {filteredQuestions.map((q) => (
                                    <div key={q.id} className={styles.qaItem}>
                                        {/* Question */}
                                        <div className={styles.questionContent}>
                                            <div className={styles.qaLabel}>{t('detail.q_label')}</div>
                                            <div className={styles.qaAvatar}>
                                                {q.askerAvatar ? (
                                                    <img src={resolveImgUrl(q.askerAvatar)} alt={q.askerName} className={styles.qaAvatarImg} />
                                                ) : (
                                                    <FiUser />
                                                )}
                                            </div>
                                            <div className={styles.qaBody}>
                                                <div className={styles.qaUserRow}>
                                                    <span className={styles.qaUserName}>{q.askerName}</span>
                                                    <div className={styles.qaMetaRight}>
                                                        <span className={styles.qaDate}>
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                                                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                                            </svg>
                                                            {new Date(q.createdAt).toLocaleDateString(dateLocale)}
                                                        </span>
                                                        {q.answer ? (
                                                            <span className={styles.qaStatusAnswered}>
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
                                                                    <polyline points="20 6 9 17 4 12" />
                                                                </svg>
                                                                {t('detail.answered')}
                                                            </span>
                                                        ) : (
                                                            <span className={styles.qaStatusPending}>{t('detail.pending_answer')}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className={styles.qaText}>{q.question}</p>
                                            </div>
                                        </div>

                                        {/* Answer */}
                                        {q.answer && (
                                            <div className={styles.answerContent}>
                                                <div className={styles.qaLabelAnswer}>{t('detail.a_label')}</div>
                                                <div className={`${styles.qaAvatar} ${styles.sellerAvatar}`}>
                                                    <FiPackage />
                                                </div>
                                                <div className={styles.qaBody}>
                                                    <div className={styles.qaUserRow}>
                                                        <span className={styles.qaUserName}>
                                                            {q.answeredByName || t('detail.seller_badge')}
                                                            <span className={styles.sellerBadge}>
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
                                                                    <polyline points="20 6 9 17 4 12" />
                                                                </svg>
                                                                {t('detail.seller_badge')}
                                                            </span>
                                                        </span>
                                                        {q.answeredAt && (
                                                            <span className={styles.qaDate}>
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                                                                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                                                </svg>
                                                                {new Date(q.answeredAt).toLocaleDateString(dateLocale)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className={styles.qaText}>{q.answer}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarSticky}>
                        {/* Price Card */}
                        <div className={styles.priceCard}>
                            {/* Variant Selector */}
                            {product.variants.length > 0 && (
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
                                                {variant.description && (
                                                    <span className={styles.variantDesc}>{variant.description}</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Duration Selector */}
                            {selectedVariant && selectedVariant.pricing.length > 0 && (
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

                            {/* Warranty */}
                            {selectedPricing && (
                                <div className={styles.warrantySection}>
                                    <h4 className={styles.warrantyTitle}>
                                        <FiShield /> {t('detail.warranty')}
                                    </h4>
                                    <p className={styles.warrantyContent}>{selectedPricing.warrantyPolicy}</p>
                                </div>
                            )}

                            {/* CTA */}
                            <div className={styles.ctaButtons}>
                                <button
                                    className={styles.addToCartBtn}
                                    disabled={!selectedPricing || !selectedVariant || selectedPricing.availableStock === 0}
                                    onClick={handleAddToCart}
                                >
                                    <FiShoppingCart /> {t('detail.add_to_cart')}
                                </button>
                                <button
                                    className={styles.primaryBtn}
                                    disabled={!selectedPricing || !selectedVariant || selectedPricing.availableStock === 0}
                                    onClick={() => {
                                        if (!product || !selectedVariant || !selectedPricing) return;
                                        const primaryImage = resolveImgUrl(product.images.find(img => img.isPrimary)?.imageUrl
                                            || product.images[0]?.imageUrl) || null;
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

                            {/* Share */}
                            <div className={styles.sidebarActions}>
                                <span>{t('detail.share')}</span>
                                <div className={styles.socialIcons}>
                                    <button className={styles.socialIcon}><FiShare2 /></button>
                                    <button className={styles.socialIcon}><FiLink /></button>
                                    <button className={styles.copyLinkBtn} onClick={handleCopyLink}>
                                        <FiLink /> {linkCopied ? t('detail.link_copied') : t('detail.copy_link')}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </aside>
            </div>
        </div>
    );
};
