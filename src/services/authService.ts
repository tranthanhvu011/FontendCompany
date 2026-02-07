import type { ApiResponse, LoginCredentials, RegisterData, RegisterRequest, User } from '@/types'
import { apiClient } from './apiClient';

export const authService = {
    async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
        try {
            // Simulate API call - Replace with: apiClient.post('/auth/login', credentials)
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock response
            if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
                const mockUser: User = {
                    id: '1',
                    email: credentials.email,
                    name: 'Demo User',
                    avatar: 'https://ui-avatars.com/api/?name=Demo+User',
                    role: 'user',
                }
                const mockToken = 'mock-jwt-token-' + Date.now()

                localStorage.setItem('authToken', mockToken)
                localStorage.setItem('user', JSON.stringify(mockUser))

                return {
                    success: true,
                    data: { user: mockUser, token: mockToken },
                    message: 'Login successful',
                }
            }

            throw new Error('Invalid credentials')
        } catch (error: any) {
            throw new Error(error.message || 'Login failed')
        }
    },

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
        apiClient.get<ApiResponse<boolean>>(`/v1/auth/check-username?username=${username}`),
    checkEmail: (email: string) =>
        apiClient.get<ApiResponse<boolean>>(`/v1/auth/check-email?email=${email}`),
    sendOtp: (email: string) =>
        apiClient.post<ApiResponse<{ success: boolean; message: string }>>(`/v1/auth/send-otp`, { email }),
    register: (data: RegisterRequest) =>
        apiClient.post<ApiResponse<{ success: boolean; message: string }>>(`/v1/auth/register`, data),
}
