import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import type { ReactNode } from 'react'
import type { AuthContextType, User } from '@/types'
import { authService } from '@/services/authService'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Decode JWT payload (không cần thư viện)
const decodeJwt = (token: string) => {
    try {
        const payload = token.split('.')[1]
        return JSON.parse(atob(payload))
    } catch {
        return null
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Hàm gọi refresh token proactively
    const scheduleRefresh = useCallback((accessToken: string) => {
        // Xóa timer cũ
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current)
        }

        const decoded = decodeJwt(accessToken)
        if (!decoded?.exp) return

        // Refresh trước 30s khi hết hạn (hoặc ngay nếu gần hết)
        const expiresIn = decoded.exp * 1000 - Date.now()
        const refreshIn = Math.max(expiresIn - 30_000, 0)

        console.log(`⏰ [Auth] Token hết hạn sau ${Math.round(expiresIn / 1000)}s → refresh sau ${Math.round(refreshIn / 1000)}s`)

        refreshTimerRef.current = setTimeout(async () => {
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) return

            try {
                console.log('⏰ [Auth] Proactive refresh — gọi /refresh-token...')
                const response = await axios.post(`${API_URL}/v1/auth/refresh-token`, {
                    refreshToken,
                })

                const authData = response.data.data
                console.log('⏰ [Auth] ✅ Refresh thành công!')

                localStorage.setItem('accessToken', authData.accessToken)
                if (authData.refreshToken) {
                    localStorage.setItem('refreshToken', authData.refreshToken)
                }
                const userData = {
                    userId: authData.userId,
                    username: authData.username,
                    email: authData.email,
                    firstName: authData.firstName,
                    lastName: authData.lastName,
                    avatar: authData.avatar,
                    roles: authData.roles,
                }
                localStorage.setItem('user', JSON.stringify(userData))
                localStorage.setItem('username', authData.username)
                setUser(userData)

                // Lập lịch refresh tiếp cho token mới
                scheduleRefresh(authData.accessToken)
            } catch {
                console.log('⏰ [Auth] ❌ Proactive refresh thất bại — logout')
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('username')
                localStorage.removeItem('user')
                setUser(null)
            }
        }, refreshIn)
    }, [])

    useEffect(() => {
        const currentUser = authService.getCurrentUser()
        if (currentUser) {
            setUser(currentUser)
            // Nếu đã login → lập lịch refresh cho token hiện tại
            const accessToken = localStorage.getItem('accessToken')
            if (accessToken) {
                scheduleRefresh(accessToken)
            }
        }
        setLoading(false)

        return () => {
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current)
            }
        }
    }, [scheduleRefresh])



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
        const authData = response.data
        if (authData?.accessToken) {
            // Lưu tokens
            localStorage.setItem('accessToken', authData.accessToken)
            localStorage.setItem('refreshToken', authData.refreshToken)
            // Lưu user info
            const userData = {
                userId: authData.userId,
                username: authData.username,
                email: authData.email,
                firstName: authData.firstName,
                lastName: authData.lastName,
                avatar: authData.avatar,
                roles: authData.roles,
            }
            localStorage.setItem('user', JSON.stringify(userData))
            setUser(userData)
            // Lập lịch refresh cho token mới
            scheduleRefresh(authData.accessToken)
        }
    }
    const register = async (username: string, email: string, otp: string, password: string) => {
        await authService.register({ username, email, otp, password })
    }
    const forgotPassword = async (email: string) => {
        await authService.forgotPassword(email)
    }
    const resetPassword = async (token: string, newPassword: string, confirmPassword: string) => {
        await authService.resetPassword({ token, newPassword, confirmPassword })
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
        register,
        forgotPassword,
        resetPassword,
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

