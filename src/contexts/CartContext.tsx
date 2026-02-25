import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { cartApi } from '@/services/cartService'
import type { AddToCartRequest } from '@/services/cartService'

// ===========================
// Types
// ===========================

/** Unified cart item for both guest and authenticated modes */
export interface CartItemUI {
    productId: number
    variantId: number
    pricingId: number
    quantity: number
    // Display info
    productName: string
    productSlug: string
    productImage: string | null
    variantName: string
    durationLabel: string
    price: number
    originalPrice?: number | null
    subtotal?: number | null
    available?: boolean
}

interface CartContextType {
    items: CartItemUI[]
    totalItems: number
    totalQuantity: number
    totalPrice: number
    loading: boolean
    addItem: (item: CartItemUI) => Promise<void>
    updateQuantity: (pricingId: number, quantity: number) => Promise<void>
    removeItem: (pricingId: number) => Promise<void>
    clearCart: () => Promise<void>
    refreshCart: () => Promise<void>
}

const GUEST_CART_KEY = 'guest_cart'

// ===========================
// Helper: Guest Cart (localStorage)
// ===========================

const getGuestCart = (): CartItemUI[] => {
    try {
        const saved = localStorage.getItem(GUEST_CART_KEY)
        return saved ? JSON.parse(saved) : []
    } catch {
        return []
    }
}

const saveGuestCart = (items: CartItemUI[]) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
}

const clearGuestCart = () => {
    localStorage.removeItem(GUEST_CART_KEY)
}

// ===========================
// Context
// ===========================

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, loading: authLoading } = useAuth()
    const [items, setItems] = useState<CartItemUI[]>([])
    const [loading, setLoading] = useState(false)
    const prevAuthRef = useRef<boolean>(false)
    const initializedRef = useRef(false)

    // ===========================
    // Computed
    // ===========================

    const totalItems = items.length
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => {
        const subtotal = item.subtotal ?? item.price * item.quantity
        return sum + subtotal
    }, 0)

    // ===========================
    // Fetch cart from API (authenticated)
    // ===========================

    const fetchAuthCart = useCallback(async () => {
        try {
            setLoading(true)
            const cart = await cartApi.getCart()
            const uiItems: CartItemUI[] = cart.items.map(item => ({
                productId: item.productId,
                variantId: item.variantId,
                pricingId: item.pricingId,
                quantity: item.quantity,
                productName: item.productName ?? 'Sản phẩm không khả dụng',
                productSlug: item.productSlug ?? '',
                productImage: item.productImage,
                variantName: item.variantName ?? '',
                durationLabel: item.durationLabel ?? '',
                price: item.price ?? 0,
                originalPrice: item.originalPrice,
                subtotal: item.subtotal,
                available: item.available,
            }))
            setItems(uiItems)
        } catch (err) {
            console.error('[Cart] Failed to fetch cart:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    // ===========================
    // Merge guest cart → server (on login)
    // ===========================

    const mergeGuestCartToServer = useCallback(async () => {
        const guestItems = getGuestCart()
        if (guestItems.length === 0) return

        console.log(`[Cart] Merging ${guestItems.length} guest items to server...`)

        for (const item of guestItems) {
            try {
                await cartApi.addItem({
                    productId: item.productId,
                    variantId: item.variantId,
                    pricingId: item.pricingId,
                    quantity: item.quantity,
                })
            } catch (err) {
                console.warn(`[Cart] Failed to merge item pricingId=${item.pricingId}:`, err)
            }
        }

        clearGuestCart()
        console.log('[Cart] Guest cart merged and cleared')
    }, [])

    // ===========================
    // Init + Auth transition detection
    // ===========================

    useEffect(() => {
        if (authLoading) return

        // Lần đầu init
        if (!initializedRef.current) {
            initializedRef.current = true
            prevAuthRef.current = isAuthenticated

            if (isAuthenticated) {
                // Đã login sẵn → fetch from server
                fetchAuthCart()
            } else {
                // Guest → load from localStorage
                setItems(getGuestCart())
            }
            return
        }

        // Detect login transition: false → true
        if (!prevAuthRef.current && isAuthenticated) {
            console.log('[Cart] Login detected → merging guest cart')
            const doMerge = async () => {
                setLoading(true)
                await mergeGuestCartToServer()
                await fetchAuthCart()
                setLoading(false)
            }
            doMerge()
        }

        // Detect logout transition: true → false
        if (prevAuthRef.current && !isAuthenticated) {
            console.log('[Cart] Logout detected → clearing cart state')
            setItems([])
            // Không xóa guest_cart — giữ nguyên nếu user có cart cũ
        }

        prevAuthRef.current = isAuthenticated
    }, [isAuthenticated, authLoading, fetchAuthCart, mergeGuestCartToServer])

    // ===========================
    // CRUD Operations
    // ===========================

    const addItem = useCallback(async (item: CartItemUI) => {
        if (isAuthenticated) {
            // Authenticated: gọi API
            const request: AddToCartRequest = {
                productId: item.productId,
                variantId: item.variantId,
                pricingId: item.pricingId,
                quantity: item.quantity,
            }
            await cartApi.addItem(request)
            await fetchAuthCart()
        } else {
            // Guest: localStorage
            setItems(prev => {
                const exists = prev.find(i => i.pricingId === item.pricingId)
                let updated: CartItemUI[]
                if (exists) {
                    updated = prev.map(i =>
                        i.pricingId === item.pricingId
                            ? { ...i, quantity: Math.min(i.quantity + item.quantity, 99) }
                            : i
                    )
                } else {
                    if (prev.length >= 50) {
                        throw new Error('Giỏ hàng đã đạt tối đa 50 sản phẩm')
                    }
                    updated = [...prev, { ...item, subtotal: item.price * item.quantity, available: true }]
                }
                saveGuestCart(updated)
                return updated
            })
        }
    }, [isAuthenticated, fetchAuthCart])

    const updateQuantity = useCallback(async (pricingId: number, quantity: number) => {
        if (isAuthenticated) {
            await cartApi.updateQuantity(pricingId, quantity)
            await fetchAuthCart()
        } else {
            setItems(prev => {
                const updated = prev.map(i =>
                    i.pricingId === pricingId
                        ? { ...i, quantity, subtotal: i.price * quantity }
                        : i
                )
                saveGuestCart(updated)
                return updated
            })
        }
    }, [isAuthenticated, fetchAuthCart])

    const removeItem = useCallback(async (pricingId: number) => {
        if (isAuthenticated) {
            await cartApi.removeItem(pricingId)
            await fetchAuthCart()
        } else {
            setItems(prev => {
                const updated = prev.filter(i => i.pricingId !== pricingId)
                saveGuestCart(updated)
                return updated
            })
        }
    }, [isAuthenticated, fetchAuthCart])

    const clearCart = useCallback(async () => {
        if (isAuthenticated) {
            await cartApi.clearCart()
            setItems([])
        } else {
            clearGuestCart()
            setItems([])
        }
    }, [isAuthenticated])

    const refreshCart = useCallback(async () => {
        if (isAuthenticated) {
            await fetchAuthCart()
        } else {
            setItems(getGuestCart())
        }
    }, [isAuthenticated, fetchAuthCart])

    return (
        <CartContext.Provider value={{
            items,
            totalItems,
            totalQuantity,
            totalPrice,
            loading,
            addItem,
            updateQuantity,
            removeItem,
            clearCart,
            refreshCart,
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
