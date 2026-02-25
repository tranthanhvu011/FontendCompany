import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ChatWidget } from '@/components/ChatWidget/ChatWidget'
import { BackToTop } from '@/components/common/BackToTop'
import { MainLayout } from '@/components/layout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Profile } from '@/pages/Profile'
import { ProductDetail } from '@/pages/ProductDetail'
import { Explore } from '@/pages/Explore/Explore'
import { PopularProducts } from '@/pages/PopularProducts/PopularProducts'
import { Authors } from '@/pages/Authors/Authors'
import { BecomeSeller } from '@/pages/BecomeSeller/BecomeSeller'
import { ContactUs } from '@/pages/ContactUs/ContactUs'
import { Help } from '@/pages/Help/Help'
import { NotFound } from '@/pages/NotFound'
import { SellerRegister } from '@/pages/SellerRegister'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { CheckoutPage } from '@/pages/Checkout/CheckoutPage'
import { OrdersPage } from '@/pages/Orders/OrdersPage'
import { OrderDetailPage } from '@/pages/Orders/OrderDetailPage'
import { MessagesPage } from '@/pages/Messages'
import { ShopPage } from '@/pages/ShopPage'
import { ProtectedRoute } from './ProtectedRoute'

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <MainLayout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    {/* Reset password — AuthModal tự mở khi có ?token= */}
                    <Route path="/reset-password" element={<Dashboard />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/popular-products" element={<PopularProducts />} />
                    <Route path="/authors" element={<Authors />} />
                    <Route path="/become-seller" element={<BecomeSeller />} />
                    <Route path="/contact-us" element={<ContactUs />} />
                    <Route path="/help" element={<Help />} />

                    <Route
                        path="/product/:slug"
                        element={
                            <ProductDetail />
                        }
                    />

                    {/* Shop Page (Public) */}
                    <Route path="/shop/:sellerId" element={<ShopPage />} />

                    {/* Checkout (Protected) */}
                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <CheckoutPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Orders (Protected) */}
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <OrdersPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders/:orderNumber"
                        element={
                            <ProtectedRoute>
                                <OrderDetailPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Seller Registration */}
                    <Route path="/seller/register" element={<SellerRegister />} />

                    {/* Messages (Protected) */}
                    <Route
                        path="/messages"
                        element={
                            <ProtectedRoute>
                                <MessagesPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Dashboard */}
                    <Route path="/admin" element={<AdminDashboard />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </MainLayout>
            <ChatWidget />
            <BackToTop />
        </BrowserRouter>
    )
}

