import Link from "next/link"
import styles from "./changepage.module.css"

export function ChangePage({ prev, next, searchTerm }) {
    const queryString = searchTerm ? `&q=${searchTerm}` : ''

    return (
        <div className={styles.pagination}>
            {prev !== null && (
                <Link className={styles.link} href={`/?page=${prev}${queryString}`}>Voltar</Link>
            )}
            {next !== null && (
                <Link className={styles.link} href={`/?page=${next}${queryString}`}>Próximo</Link>
            )}
        </div>
    )
}