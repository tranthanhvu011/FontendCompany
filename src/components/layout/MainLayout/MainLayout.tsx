import type { ReactNode } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import styles from './MainLayout.module.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { CartSidebar } from '@/components/layout/CartSidebar'
import { AuthModal } from '@/components/auth'

import { useUI } from '@/contexts/UIContext'

interface MainLayoutProps {
    children: ReactNode
}
export const MainLayout = ({ children }: MainLayoutProps) => {
    const { isSidebarOpen, toggleSidebar } = useUI()

    return (
        <div className="app-container">
            <Sidebar />
            <div className={`overlay ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
            <div className="main-content">
                <Header />
                <main className={styles.main}>
                    {children}
                    <Footer />
                </main>
            </div>
            <CartSidebar />
            <AuthModal />
        </div>
    )
}
