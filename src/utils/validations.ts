import { z } from 'zod'

// ========== Login Schema ==========
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Vui lòng nhập email')
        .email('Email không hợp lệ'),
    password: z
        .string()
        .min(1, 'Vui lòng nhập mật khẩu'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// ========== Register Schema ==========
export const registerSchema = z.object({
    username: z
        .string()
        .min(3, 'Username tối thiểu 3 ký tự')
        .max(20, 'Username tối đa 20 ký tự')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username chỉ chứa chữ, số và _'),
    email: z
        .string()
        .min(1, 'Vui lòng nhập email')
        .email('Email không hợp lệ'),
    password: z
        .string()
        .min(6, 'Mật khẩu tối thiểu 6 ký tự')
        .max(50, 'Mật khẩu tối đa 50 ký tự'),
    otp: z
        .string()
        .length(6, 'Mã OTP phải đúng 6 số')
        .regex(/^\d{6}$/, 'OTP chỉ chứa số'),
})

export type RegisterFormData = z.infer<typeof registerSchema>

// ========== Forgot Password Schema ==========
export const forgotSchema = z.object({
    email: z
        .string()
        .min(1, 'Vui lòng nhập email')
        .email('Email không hợp lệ'),
})

export type ForgotFormData = z.infer<typeof forgotSchema>
