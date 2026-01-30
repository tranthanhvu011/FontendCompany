import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRoutes } from '@/routes'
import '@/styles/globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { UIProvider } from '@/contexts/UIContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <UIProvider>
          <AppRoutes />
        </UIProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
)
