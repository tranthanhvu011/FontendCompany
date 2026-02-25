import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/common'
import styles from './NotFound.module.css'

export const NotFound = () => {
    const { t } = useTranslation('common')
    return (
        <div className={styles.notFound}>
            <div className={styles.content}>
                <h1 className={styles.title}>404</h1>
                <h2>{t('not_found.title')}</h2>
                <p>{t('not_found.desc')}</p>
                <Link to="/">
                    <Button size="lg">{t('not_found.go_home')}</Button>
                </Link>
            </div>
        </div>
    )
}
