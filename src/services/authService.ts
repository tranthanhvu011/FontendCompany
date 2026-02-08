import type { ApiResponse, AuthResponse, RegisterRequest, ResetPasswordRequest, User, LoginRequest } from '@/types'
import { apiClient } from './apiClient';

export const authService = {

    logout(): void {
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
        apiClient.get<ApiResponse<boolean>>(`/v1/auth/check-username?username=${username}`, { _silent: true }),
    checkEmail: (email: string) =>
        apiClient.get<ApiResponse<boolean>>(`/v1/auth/check-email?email=${email}`, { _silent: true }),
    sendOtp: (email: string) =>
        apiClient.post<ApiResponse<{ success: boolean; message: string }>>(`/v1/auth/send-otp`, { email }),
    register: (data: RegisterRequest) =>
        apiClient.post<ApiResponse<{ success: boolean; message: string }>>(`/v1/auth/register`, data),
    login: (data: LoginRequest) =>
        apiClient.post<ApiResponse<AuthResponse>>(`/v1/auth/login`, data),
    forgotPassword: (email: string) =>
        apiClient.post<ApiResponse<void>>(`/v1/auth/forgot-password?email=${encodeURIComponent(email)}`),
    resetPassword: (data: ResetPasswordRequest) =>
        apiClient.post<ApiResponse<void>>(`/v1/auth/reset-password`, data),
}
