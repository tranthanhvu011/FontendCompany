import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { AuthContextType, User } from '@/types'
import { authService } from '@/services/authService'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is logged in on mount
        const currentUser = authService.getCurrentUser()
        if (currentUser) {
            setUser(currentUser)
        }
        setLoading(false)
    }, [])



    const logout = () => {
        authService.logout()
        setUser(null)
    }

    const checkUsername = async (username: string): Promise<boolean> => {
        const response = await authService.checkUsername(username)
        return response.data  // ApiResponse.data = boolean (apiClient đã unwrap Axios)
    }
    const checkEmail = async (email: string): Promise<boolean> => {
        const response = await authService.checkEmail(email)
        return response.data  // ApiResponse.data = boolean (apiClient đã unwrap Axios)
    }
    const sendOtp = async (email: string) => {
        await authService.sendOtp(email)
    }
    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password })
        const tokens = response.data?.data
        if (tokens?.accessToken) {
            localStorage.setItem('accessToken', tokens.accessToken)
            localStorage.setItem('refreshToken', tokens.refreshToken)
        }
    }

    const value: AuthContextType = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        checkUsername,
        checkEmail,
        sendOtp,
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

