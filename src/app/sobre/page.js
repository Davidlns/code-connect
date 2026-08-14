import Link from "next/link"
import styles from "./sobre.module.css"

export default function Sobre() {
    return (
        <div className={styles.content}>
            <h1 className={styles.title}>Sobre o Code Connect</h1>

            <p className={styles.body}>
                O Code Connect é uma rede social de posts técnicos para desenvolvedores,
                construída como projeto de estudo em Next.js. O feed exibe artigos com
                capa, resumo e autor, e cada post tem sua página própria com conteúdo
                em Markdown.
            </p>

            <h2 className={styles.subtitle}>Tecnologias principais</h2>
            <ul className={styles.list}>
                <li>Next.js 14 (App Router)</li>
                <li>React 18</li>
                <li>CSS Modules</li>
            </ul>

            <Link href="/" className={styles.back}>← Voltar para o feed</Link>
        </div>
    )
}
