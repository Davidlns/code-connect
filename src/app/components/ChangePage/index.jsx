import Link from "next/link"
import styles from "./changepage.module.css"

export function ChangePage({ prev, next }) {
    return (
        <div className={styles.pagination}>
            {prev !== null && (
                <Link className={styles.link} href={`/?page=${prev}`}>Voltar</Link>
            )}
            {next !== null && (
                <Link className={styles.link} href={`/?page=${next}`}>Próximo</Link>
            )}
        </div>
    )
}