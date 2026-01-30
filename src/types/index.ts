export interface User {
    id: string
    email: string
    name: string
    avatar?: string
    role?: string
}

export interface AuthContextType {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
    checkUsername: (username: string) => Promise<boolean>
}

export interface ApiResponse<T> {
    data: T
    message?: string
    success: boolean
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    name: string
    email: string
    password: string
}
export interface RegisterRequest {
    username: string
    email: string
    password: string
    otp: string
}