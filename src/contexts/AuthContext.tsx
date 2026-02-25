import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import type { ReactNode } from 'react'
import type { AuthContextType, User } from '@/types'
import { authService } from '@/services/authService'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

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

    const scheduleRefresh = useCallback((accessToken: string) => {
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current)
        }

        const decoded = decodeJwt(accessToken)
        if (!decoded?.exp) return

        const expiresIn = decoded.exp * 1000 - Date.now()
        const refreshIn = Math.max(expiresIn - 30_000, 0)

        refreshTimerRef.current = setTimeout(async () => {
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) return

            try {
                const response = await axios.post(`${API_URL}/v1/auth/refresh-token`, {
                    refreshToken,
                })

                const authData = response.data.data

                localStorage.setItem('accessToken', authData.accessToken)
                if (authData.refreshToken) {
                    localStorage.setItem('refreshToken', authData.refreshToken)
                }

                const rawRoles: unknown = authData.roles
                const roles: string[] = Array.isArray(rawRoles)
                    ? rawRoles
                    : (typeof rawRoles === 'string' && rawRoles.trim() ? [rawRoles] : [])

                const userData = {
                    userId: authData.userId,
                    username: authData.username,
                    email: authData.email,
                    firstName: authData.firstName,
                    lastName: authData.lastName,
                    avatar: authData.avatar,
                    roles,
                }

                localStorage.setItem('user', JSON.stringify(userData))
                localStorage.setItem('username', authData.username)
                setUser(userData)

                scheduleRefresh(authData.accessToken)
            } catch {
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

    const logout = async () => {
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current)
            refreshTimerRef.current = null
        }

        await authService.logout()
        localStorage.removeItem('username')
        setUser(null)
    }

    const checkUsername = async (username: string): Promise<boolean> => {
        const response = await authService.checkUsername(username)
        return response.data
    }

    const checkEmail = async (email: string): Promise<boolean> => {
        const response = await authService.checkEmail(email)
        return response.data
    }

    const sendOtp = async (email: string) => {
        await authService.sendOtp(email)
    }

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password })
        const authData = response.data

        if (!authData?.accessToken) return

        const rawRoles: unknown = authData.roles
        const roles: string[] = Array.isArray(rawRoles)
            ? rawRoles
            : (typeof rawRoles === 'string' && rawRoles.trim() ? [rawRoles] : [])

        localStorage.setItem('accessToken', authData.accessToken)
        localStorage.setItem('refreshToken', authData.refreshToken)

        const userData = {
            userId: authData.userId,
            username: authData.username,
            email: authData.email,
            firstName: authData.firstName,
            lastName: authData.lastName,
            avatar: authData.avatar,
            roles,
        }

        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        scheduleRefresh(authData.accessToken)
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

    const updateUser = (userData: Partial<import('@/types').User>) => {
        setUser(prev => {
            if (!prev) return prev
            const updated = { ...prev, ...userData }
            localStorage.setItem('user', JSON.stringify(updated))
            return updated
        })
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
        updateUser,
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
