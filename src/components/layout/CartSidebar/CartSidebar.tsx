import { useTranslation } from 'react-i18next'
import { useCart } from '@/contexts/CartContext';
import { useUI } from '@/contexts/UIContext';
import { FiX, FiTrash2, FiShoppingBag, FiMinus, FiPlus, FiLoader } from 'react-icons/fi';
import { formatVND } from '@/data/productData';
import { Link } from 'react-router-dom';

export const CartSidebar = () => {
    const { t } = useTranslation('common')
    const { items, totalPrice, totalQuantity, loading, updateQuantity, removeItem, clearCart } = useCart();
    const { isCartOpen, toggleCart } = useUI();

    return (
        <>
            <div className={`cart-sidebar ${isCartOpen ? 'active' : ''}`}>
                <div className="cart-header">
                    <h2>{t('cart.title')} ({totalQuantity})</h2>
                    <div className="close-cart" onClick={toggleCart} style={{ cursor: 'pointer' }}>
                        <FiX />
                    </div>
                </div>

                <div className="cart-body">
                    {loading ? (
                        <div className="empty-cart-view" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 1s linear infinite' }}>
                                <FiLoader />
                            </div>
                            <p className="text-light text-sm">{t('cart.loading')}</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="empty-cart-view" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div className="empty-cart-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                                <FiShoppingBag />
                            </div>
                            <h3 className="font-bold mb-2">{t('cart.empty')}</h3>
                            <p className="text-light text-sm">{t('cart.empty_desc')}</p>
                        </div>
                    ) : (
                        <div className="cart-list" style={{ width: '100%' }}>
                            {items.map(item => (
                                <div
                                    key={item.pricingId}
                                    className="cart-item"
                                    style={{
                                        display: 'flex',
                                        gap: '0.75rem',
                                        padding: '1rem',
                                        borderBottom: '1px solid var(--border-color)',
                                        opacity: item.available === false ? 0.5 : 1,
                                    }}
                                >
                                    {/* Image */}
                                    <Link
                                        to={`/product/${item.productSlug}`}
                                        onClick={toggleCart}
                                        style={{ width: '64px', height: '64px', flexShrink: 0 }}
                                    >
                                        <img
                                            src={item.productImage || 'https://placehold.co/64x64?text=No+Image'}
                                            alt={item.productName}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </Link>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Link
                                            to={`/product/${item.productSlug}`}
                                            onClick={toggleCart}
                                            style={{
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                                color: 'var(--text-color)',
                                                textDecoration: 'none',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {item.productName}
                                        </Link>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            {item.variantName} · {item.durationLabel}
                                        </div>

                                        {item.available === false && (
                                            <div style={{
                                                fontSize: '0.7rem',
                                                color: '#ef4444',
                                                fontWeight: 600,
                                                marginTop: '2px',
                                            }}>
                                                {t('cart.unavailable')}
                                            </div>
                                        )}

                                        {/* Price + Quantity row */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginTop: '8px',
                                        }}>
                                            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                                                {formatVND(item.price)}
                                            </div>

                                            {/* Quantity controls */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0,
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '6px',
                                                overflow: 'hidden',
                                            }}>
                                                <button
                                                    onClick={() => {
                                                        if (item.quantity <= 1) {
                                                            removeItem(item.pricingId);
                                                        } else {
                                                            updateQuantity(item.pricingId, item.quantity - 1);
                                                        }
                                                    }}
                                                    style={{
                                                        width: '28px',
                                                        height: '28px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: 'var(--bg-darker)',
                                                        border: 'none',
                                                        color: 'var(--text-color)',
                                                        cursor: 'pointer',
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    <FiMinus />
                                                </button>
                                                <span style={{
                                                    width: '32px',
                                                    textAlign: 'center',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 700,
                                                    color: 'var(--text-color)',
                                                    borderLeft: '1px solid var(--border-color)',
                                                    borderRight: '1px solid var(--border-color)',
                                                    lineHeight: '28px',
                                                }}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.pricingId, Math.min(99, item.quantity + 1))}
                                                    disabled={item.quantity >= 99}
                                                    style={{
                                                        width: '28px',
                                                        height: '28px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: 'var(--bg-darker)',
                                                        border: 'none',
                                                        color: 'var(--text-color)',
                                                        cursor: 'pointer',
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    <FiPlus />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remove */}
                                    <div
                                        onClick={() => removeItem(item.pricingId)}
                                        style={{
                                            cursor: 'pointer',
                                            color: 'var(--text-muted)',
                                            fontSize: '0.9rem',
                                            flexShrink: 0,
                                            paddingTop: '2px',
                                            transition: 'color 0.2s',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                                    >
                                        <FiTrash2 />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="cart-footer">
                    {items.length > 0 && (
                        <button
                            onClick={() => clearCart()}
                            style={{
                                width: '100%',
                                padding: '8px',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                marginBottom: '8px',
                                textDecoration: 'underline',
                            }}
                        >
                            {t('cart.clear_all')}
                        </button>
                    )}
                    <div className="cart-total">
                        <span>{t('cart.subtotal')}</span>
                        <span style={{ fontWeight: 700, color: '#10b981' }}>{formatVND(totalPrice)}</span>
                    </div>
                    <button className="checkout-btn btn btn-primary w-full" disabled={items.length === 0}>
                        {t('cart.checkout')}
                    </button>
                </div>
            </div>

            {/* Overlay */}
            <div
                className={`overlay ${isCartOpen ? 'active' : ''}`}
                onClick={toggleCart}
            />
        </>
    );
};
