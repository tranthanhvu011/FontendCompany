import { useState, useEffect, useCallback } from 'react'

const getOtpCooldownKey = (email: string) =>
    `otp_cooldown_end_${email.toLowerCase().trim()}`

interface UseOtpCooldownReturn {
    otpCooldown: number
    isOtpSending: boolean
    otpSent: boolean
    sendOtpToEmail: (email: string, sendOtpFn: (email: string) => Promise<void>) => Promise<void>
    initializeCooldown: (email: string) => void
}

/**
 * Custom hook quản lý OTP cooldown
 * - Đếm ngược 60s sau khi gửi OTP
 * - Persist countdown vào localStorage (reload không mất)
 * - Tự khôi phục countdown khi mount
 */
export const useOtpCooldown = (): UseOtpCooldownReturn => {
    const [otpCooldown, setOtpCooldown] = useState(0)
    const [isOtpSending, setIsOtpSending] = useState(false)
    const [otpSent, setOtpSent] = useState(false)

    // Khôi phục cooldown từ localStorage
    const initializeCooldown = useCallback((email: string) => {
        if (!email) return
        const key = getOtpCooldownKey(email)
        const savedEndTime = localStorage.getItem(key)
        if (savedEndTime) {
            const remainingSeconds = Math.ceil((parseInt(savedEndTime, 10) - Date.now()) / 1000)
            if (remainingSeconds > 0) {
                setOtpCooldown(remainingSeconds)
                setOtpSent(true)
            } else {
                localStorage.removeItem(key)
                setOtpCooldown(0)
            }
        }
    }, [])

    // Gửi OTP + bắt đầu countdown
    const sendOtpToEmail = useCallback(async (
        email: string,
        sendOtpFn: (email: string) => Promise<void>,
    ) => {
        if (!email || otpCooldown > 0 || isOtpSending) return
        setIsOtpSending(true)
        try {
            await sendOtpFn(email)
            const cooldownDuration = 60
            const endTime = Date.now() + cooldownDuration * 1000
            localStorage.setItem(getOtpCooldownKey(email), endTime.toString())
            setOtpCooldown(cooldownDuration)
            setOtpSent(true)
        } catch {
            // interceptor hiện toast error
        } finally {
            setIsOtpSending(false)
        }
    }, [otpCooldown, isOtpSending])

    // Countdown timer
    useEffect(() => {
        if (otpCooldown <= 0) return
        const timer = setInterval(() => {
            setOtpCooldown(prev => {
                if (prev <= 1) { clearInterval(timer); return 0 }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [otpCooldown])

    // Reset
    const reset = useCallback(() => {
        setOtpCooldown(0)
        setIsOtpSending(false)
        setOtpSent(false)
    }, [])

    return { otpCooldown, isOtpSending, otpSent, sendOtpToEmail, initializeCooldown }
}
