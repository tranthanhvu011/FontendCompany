import styles from './Loading.module.css'

export const Loading = () => {
    return (
        <div className={styles.loadingWrapper}>
            <div className={styles.spinner}></div>
        </div>
    )
}
