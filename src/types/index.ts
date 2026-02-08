export interface User {
    userId: string
    username: string
    email: string
    firstName?: string
    lastName?: string
    avatar?: string
    roles?: string
}

// Khớp với backend AuthResponse
export interface AuthResponse {
    accessToken: string
    refreshToken: string
    userId: string
    email: string
    username: string
    firstName: string
    lastName: string
    roles: string
    avatar: string
}

export interface AuthContextType {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
    checkUsername: (username: string) => Promise<boolean>
    checkEmail: (email: string) => Promise<boolean>
    sendOtp: (email: string) => Promise<void>
    register: (username: string, email: string, otp: string, password: string) => Promise<void>
    forgotPassword: (email: string) => Promise<void>
    resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<void>
}

export interface ApiResponse<T> {
    data: T
    message?: string
    success: boolean
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    username: string
    email: string
    password: string
    otp: string
}

export interface ResetPasswordRequest {
    token: string
    newPassword: string
    confirmPassword: string
}
