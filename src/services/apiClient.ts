import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from '@/utils/toastManager'

// Custom config với option silent để tắt toast
export interface SilentAxiosRequestConfig extends AxiosRequestConfig {
    _silent?: boolean
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

class ApiClient {
    private client: AxiosInstance
    private isRefreshing = false
    private failedQueue: Array<{
        resolve: (token: string) => void
        reject: (error: Error) => void
    }> = []

    // Xử lý tất cả request đang đợi trong queue
    private processQueue(error: Error | null, token: string | null) {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error)
            } else {
                resolve(token!)
            }
        })
        this.failedQueue = []
    }

    // Force logout — xóa token + redirect
    private forceLogout() {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('username')
        localStorage.removeItem('user')
        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại')
        window.location.href = '/'
    }

    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        // Request interceptor
        this.client.interceptors.request.use(
            config => {
                const token = localStorage.getItem('accessToken')
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            error => {
                return Promise.reject(error)
            }
        )

        // Response interceptor - auto toast + auto refresh token
        this.client.interceptors.response.use(
            response => {
                const config = response.config as SilentAxiosRequestConfig
                if (config._silent) return response

                const data = response.data
                if (data?.message && data?.success === true) {
                    toast.success(data.message)
                }
                return response
            },
            async error => {
                const originalRequest = error.config as SilentAxiosRequestConfig & { _retry?: boolean }

                // === Auto Refresh Token ===
                const isAuthRequest = originalRequest.url?.includes('/v1/auth/')
                if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
                    console.log('🔄 [Auth] AccessToken hết hạn — bắt đầu refresh...')
                    originalRequest._retry = true

                    // Nếu đang refresh → đợi trong queue
                    if (this.isRefreshing) {
                        console.log('🔄 [Auth] Đang refresh rồi — thêm request vào queue')
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject })
                        }).then(token => {
                            originalRequest.headers!.Authorization = `Bearer ${token}`
                            return this.client(originalRequest)
                        })
                    }

                    this.isRefreshing = true
                    const refreshToken = localStorage.getItem('refreshToken')

                    if (!refreshToken) {
                        console.log('🔄 [Auth] Không có refreshToken — logout')
                        this.forceLogout()
                        return Promise.reject(error)
                    }

                    try {
                        console.log('🔄 [Auth] Gọi /refresh-token...')
                        const response = await axios.post(`${API_URL}/v1/auth/refresh-token`, {
                            refreshToken,
                        })

                        const authData = response.data.data
                        console.log('🔄 [Auth] ✅ Refresh thành công! Token mới:', authData.accessToken.substring(0, 20) + '...')

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

                        this.processQueue(null, authData.accessToken)

                        originalRequest.headers!.Authorization = `Bearer ${authData.accessToken}`
                        console.log('🔄 [Auth] Retry request gốc:', originalRequest.url)
                        return this.client(originalRequest)
                    } catch (refreshError) {
                        console.log('🔄 [Auth] ❌ Refresh thất bại — logout')
                        this.processQueue(refreshError as Error, null)
                        this.forceLogout()
                        return Promise.reject(refreshError)
                    } finally {
                        this.isRefreshing = false
                    }
                }

                // === Toast error (cho các lỗi không phải 401 hoặc 401 đã retry) ===
                if (!originalRequest._silent) {
                    const message = error.response?.data?.message
                        || error.response?.data?.error
                        || 'Có lỗi xảy ra, vui lòng thử lại'
                    toast.error(message)
                }

                return Promise.reject(error)
            }
        )
    }

    async get<T>(url: string, config?: SilentAxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.get(url, config)
        return response.data
    }

    async post<T>(url: string, data?: any, config?: SilentAxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.post(url, data, config)
        return response.data
    }

    async put<T>(url: string, data?: any, config?: SilentAxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.put(url, data, config)
        return response.data
    }

    async delete<T>(url: string, config?: SilentAxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.delete(url, config)
        return response.data
    }
}

export const apiClient = new ApiClient()
