import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRoutes } from '@/routes'
import '@/i18n'
import '@/styles/globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { UIProvider } from '@/contexts/UIContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ChatProvider } from '@/contexts/ChatContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <UIProvider>
          <ChatProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </ChatProvider>
        </UIProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
)
