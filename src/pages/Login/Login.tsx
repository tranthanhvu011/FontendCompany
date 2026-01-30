import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Input, Card } from '@/components/common'
import styles from './Login.module.css'

export const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(email, password)
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginContainer}>
                <Card>
                    <div className={styles.loginContent}>
                        <div className={styles.header}>
                            <h1>Welcome Back</h1>
                            <p>Sign in to your account to continue</p>
                        </div>

                        {error && <div className={styles.error}>{error}</div>}

                        <div className={styles.demoInfo}>
                            <strong>Demo Credentials:</strong>
                            <p>Email: demo@example.com</p>
                            <p>Password: demo123</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <Input
                                type="email"
                                label="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="demo@example.com"
                                required
                            />

                            <Input
                                type="password"
                                label="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />

                            <Button type="submit" fullWidth disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className={styles.footer}>
                            <p>
                                Don't have an account? <Link to="/register">Sign up</Link>
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
