import type { ApiResponse, AuthResponse, RegisterRequest, ResetPasswordRequest, User, LoginRequest } from '@/types'
import { apiClient } from './apiClient';

export const authService = {

    async logout(): Promise<void> {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
            try {
                await apiClient.post<ApiResponse<void>>('/v1/auth/logout', { refreshToken })
            } catch {
                // Token có thể đã hết hạn — vẫn clear localStorage
                console.warn('[Auth] Logout API failed — clearing local data anyway')
            }
        }
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
    },

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user')
        if (userStr) {
            try {
                return JSON.parse(userStr)
            } catch {
                return null
            }
        }
        return null
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('accessToken')
    },
    checkUsername: (username: string) =>
        apiClient.get<ApiResponse<boolean>>(`/v1/auth/check-username?username=${username}`),
    checkEmail: (email: string) =>
        apiClient.get<ApiResponse<boolean>>(`/v1/auth/check-email?email=${email}`),
    sendOtp: (email: string) =>
        apiClient.post<ApiResponse<{ success: boolean; message: string }>>(`/v1/auth/send-otp`, { email }),
    register: (data: RegisterRequest) =>
        apiClient.post<ApiResponse<{ success: boolean; message: string }>>(`/v1/auth/register`, data),
    login: (data: LoginRequest) =>
        apiClient.post<ApiResponse<AuthResponse>>(`/v1/auth/login?portal=user`, data),
    forgotPassword: (email: string) =>
        apiClient.post<ApiResponse<void>>(`/v1/auth/forgot-password?email=${encodeURIComponent(email)}`),
    resetPassword: (data: ResetPasswordRequest) =>
        apiClient.post<ApiResponse<void>>(`/v1/auth/reset-password`, data),
}
