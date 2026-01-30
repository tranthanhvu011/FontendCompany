import { Link } from 'react-router-dom'
import { Button } from '@/components/common'
import styles from './NotFound.module.css'

export const NotFound = () => {
    return (
        <div className={styles.notFound}>
            <div className={styles.content}>
                <h1 className={styles.title}>404</h1>
                <h2>Page Not Found</h2>
                <p>The page you are looking for doesn't exist or has been moved.</p>
                <Link to="/">
                    <Button size="lg">Go Back Home</Button>
                </Link>
            </div>
        </div>
    )
}
