import type { ApiResponse, User } from '@/types'

export const userService = {
    async getProfile(): Promise<ApiResponse<User>> {
        try {
            // Simulate API call - Replace with: apiClient.get('/users/profile')
            await new Promise(resolve => setTimeout(resolve, 800))

            const userStr = localStorage.getItem('user')
            if (userStr) {
                const user = JSON.parse(userStr)
                return {
                    success: true,
                    data: user,
                }
            }

            throw new Error('User not found')
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch profile')
        }
    },

    async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
        try {
            // Simulate API call - Replace with: apiClient.put('/users/profile', data)
            await new Promise(resolve => setTimeout(resolve, 800))

            const userStr = localStorage.getItem('user')
            if (userStr) {
                const user = JSON.parse(userStr)
                const updatedUser = { ...user, ...data }
                localStorage.setItem('user', JSON.stringify(updatedUser))

                return {
                    success: true,
                    data: updatedUser,
                    message: 'Profile updated successfully',
                }
            }

            throw new Error('User not found')
        } catch (error: any) {
            throw new Error(error.message || 'Failed to update profile')
        }
    },
}
