'use client'

import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import styles from "./searchbar.module.css"

export function SearchBar() {
    const router = useRouter()

    function handleSubmit(event) {
        event.preventDefault()
        const termo = event.target.q.value
        router.push(`/?q=${termo}`)
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
                <Search size={18} color="#7A8688" />
                <input className={styles.input} name="q" placeholder="Digite o que você procura" />
            </div>
            <button className={styles.button} type="submit">Buscar</button>
        </form>
    )
}
