import Image from 'next/image'
import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFound() {
    return (
        <div className={styles.content}>
            <div className={styles.card}>
                <figure className={styles.cover}>
                    <Image
                        src="/404.png"
                        width={560}
                        height={315}
                        alt="Pequeno robô perdido em um pântano, representando página não encontrada"
                        priority
                    />
                </figure>

                <h2 className={styles.title}>Página não encontrada</h2>
                <p className={styles.body}>
                    O conteúdo que você está procurando não existe ou foi
                    removido. Confira se o endereço está certo ou volte
                    para o feed.
                </p>

                <div className={styles.actions}>
                    <Link href="/" className={styles.button}>
                        Voltar para o feed
                    </Link>
                </div>
            </div>
        </div>
    )
}
