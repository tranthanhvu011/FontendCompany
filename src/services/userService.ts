import { apiClient } from './apiClient'

interface ProfileResponse {
    id: number
    username: string
    email: string
    firstName: string | null
    lastName: string | null
    phone: string | null
    avatar: string | null
    enabled: boolean
    emailVerified: boolean
    roles: string[]
    createdAt: string
    lastLoginAt: string | null
}

interface UpdateProfileData {
    firstName?: string
    lastName?: string
    phone?: string
}

interface ChangePasswordData {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

export const userService = {
    async getProfile(): Promise<ProfileResponse> {
        const res = await apiClient.get<{ data: ProfileResponse }>('/v1/users/me')
        return res.data
    },

    async updateProfile(data: UpdateProfileData): Promise<ProfileResponse> {
        const res = await apiClient.put<{ data: ProfileResponse }>('/v1/users/me', data)
        return res.data
    },

    async changePassword(data: ChangePasswordData): Promise<void> {
        await apiClient.put('/v1/users/me/password', data)
    },

    async uploadAvatar(file: File): Promise<ProfileResponse> {
        const formData = new FormData()
        formData.append('file', file)
        const res = await apiClient.post<{ data: ProfileResponse }>('/v1/users/me/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return res.data
    },
}
