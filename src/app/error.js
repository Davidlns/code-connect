'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './error.module.css'

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className={styles.content}>
            <div className={styles.card}>
                <figure className={styles.cover}>
                    <Image
                        src="/500.png"
                        width={560}
                        height={315}
                        alt="Robô pensativo, representando um erro inesperado"
                        priority
                    />
                </figure>

                <h2 className={styles.title}>Algo deu errado</h2>
                <p className={styles.body}>
                    Encontramos um problema inesperado ao carregar essa página.
                    Você pode tentar novamente ou voltar para o feed enquanto
                    investigamos o que aconteceu.
                </p>

                <div className={styles.actions}>
                    <button className={styles.button} onClick={() => reset()}>
                        Tentar novamente
                    </button>
                    <Link href="/" className={styles.button}>
                        Voltar para o feed
                    </Link>
                </div>
            </div>
        </div>
    )
}
