import type { ApiResponse, RegisterData, RegisterRequest, User } from '@/types'
import { apiClient } from './apiClient';
import type { LoginRequest, MessageResponse } from '@/types';
export const authService = {

    logout(): void {
        localStorage.removeItem('authToken')
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
        return !!localStorage.getItem('authToken')
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
        apiClient.post<ApiResponse<MessageResponse>>(`/v1/auth/login`, data)
}
