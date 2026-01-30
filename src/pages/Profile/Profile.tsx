import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, Button, Input } from '@/components/common'
import { userService } from '@/services/userService'
import styles from './Profile.module.css'

export const Profile = () => {
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            await userService.updateProfile({ name, email })
            setMessage('Profile updated successfully!')
            setIsEditing(false)
        } catch (error: any) {
            setMessage(error.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setName(user?.name || '')
        setEmail(user?.email || '')
        setIsEditing(false)
    }

    return (
        <div className={styles.profilePage}>
            <div className={styles.profileContainer}>
                <h1>Profile</h1>

                <Card>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatar}>
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <h2>{user?.name}</h2>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className={styles.profileContent}>
                        <div className={styles.profileSection}>
                            <h3>Account Information</h3>

                            {message && (
                                <div
                                    className={
                                        message.includes('success') ? styles.success : styles.error
                                    }
                                >
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <Input
                                    label="Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    disabled={!isEditing}
                                    required
                                />

                                <Input
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    disabled={!isEditing}
                                    required
                                />

                                <div className={styles.actions}>
                                    {isEditing ? (
                                        <>
                                            <Button type="submit" disabled={loading}>
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={handleCancel}
                                                disabled={loading}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Button type="button" onClick={() => setIsEditing(true)}>
                                            Edit Profile
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
