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
                const token = localStorage.getItem('authToken')
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            error => {
                return Promise.reject(error)
            }
        )

        // Response interceptor - auto toast
        this.client.interceptors.response.use(
            response => {
                const config = response.config as SilentAxiosRequestConfig
                // Bỏ qua toast nếu silent
                if (config._silent) return response

                const data = response.data
                if (data?.message && data?.success === true) {
                    toast.success(data.message)
                }
                return response
            },
            error => {
                const config = error.config as SilentAxiosRequestConfig
                // Bỏ qua toast nếu silent
                if (!config._silent) {
                    const message = error.response?.data?.message
                        || error.response?.data?.error
                        || 'Có lỗi xảy ra, vui lòng thử lại'
                    toast.error(message)
                }

                // Xóa token nếu 401 Unauthorized
                if (error.response?.status === 401) {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
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
