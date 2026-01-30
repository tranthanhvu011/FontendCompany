import { useCart } from '@/contexts/CartContext';
import { useUI } from '@/contexts/UIContext';
import { FiX, FiTrash2, FiShoppingBag } from 'react-icons/fi';

export const CartSidebar = () => {
    const { items, removeItem, total } = useCart();
    const { isCartOpen, toggleCart } = useUI();

    return (
        <>
            <div className={`cart-sidebar ${isCartOpen ? 'active' : ''}`}>
                <div className="cart-header">
                    <h2>Shopping Cart</h2>
                    <div className="close-cart" onClick={toggleCart} style={{ cursor: 'pointer' }}>
                        <FiX />
                    </div>
                </div>

                <div className="cart-body">
                    {items.length === 0 ? (
                        <div className="empty-cart-view" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div className="empty-cart-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                                <FiShoppingBag />
                            </div>
                            <h3 className="font-bold mb-2">Your cart is empty</h3>
                            <p className="text-light text-sm">Please add product to your cart list</p>
                        </div>
                    ) : (
                        <div className="cart-list" style={{ width: '100%' }}>
                            {items.map(item => (
                                <div key={item.id} className="cart-item" style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                    <div className="cart-item-img-wrapper" style={{ width: '60px', height: '60px' }}>
                                        <img src={item.image} alt={item.title} className="cart-item-img" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                    </div>
                                    <div className="cart-item-info" style={{ flex: 1 }}>
                                        <div className="cart-item-title" style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</div>
                                        <div className="cart-item-price" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                                            ${item.price} x {item.quantity}
                                        </div>
                                    </div>
                                    <div className="cart-item-remove" onClick={() => removeItem(item.id)} style={{ cursor: 'pointer', color: 'var(--danger)' }}>
                                        <FiTrash2 />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="cart-footer">
                    <div className="cart-total">
                        <span>Subtotal:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn btn btn-primary w-full">Proceed to checkout</button>
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
