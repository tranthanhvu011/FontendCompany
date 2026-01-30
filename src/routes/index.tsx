import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import { ProtectedRoute } from './ProtectedRoute'

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <MainLayout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />

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
                        path="/product/:id"
                        element={
                                <ProductDetail />
                        }
                    />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </MainLayout>
        </BrowserRouter>
    )
}
