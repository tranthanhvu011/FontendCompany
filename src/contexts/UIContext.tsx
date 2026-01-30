import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface UIContextType {
    isCartOpen: boolean;
    toggleCart: () => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeAll: () => void;
    isDarkMode: boolean;
    toggleTheme: () => void;
    isLoginOpen: boolean;
    openLogin: () => void;
    closeLogin: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true; // Default to dark if no setting
    });
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    const toggleCart = () => setIsCartOpen(prev => !prev);
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    const closeAll = () => {
        setIsCartOpen(false);
        setIsSidebarOpen(false);
    };

    const toggleTheme = () => {
        setIsDarkMode(prev => {
            const newMode = !prev;
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            if (newMode) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            return newMode;
        });
    };

    // Initialize theme on mount
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, []);

    return (
        <UIContext.Provider value={{
            isCartOpen, toggleCart,
            isSidebarOpen, toggleSidebar, closeAll,
            isDarkMode, toggleTheme,
            isLoginOpen, openLogin, closeLogin
        }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
