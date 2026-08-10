import Image from "next/image"
import { Component } from "lucide-react"
import logger from "@/logger"
import { remark } from 'remark'
import html from 'remark-html'
import { Avatar } from "../../components/Avatar"
import styles from "./post.module.css"

async function getPostBySlug ( slug ) {
    const url = `http://localhost:3042/posts?slug=${slug}`
    const response = await fetch(url)
    if(!response.ok){
        logger.error('Problemas para obter o post!')
        return {}
    }

    logger.info('Post obtido com sucesso')
    const data  = await response.json()
    if(data.length == 0){
        return{}
    }

    const post = data[0]

    const processedContent = await remark()
        .use(html)
        .process(post.markdown)
    const contentHtml = processedContent.toString()

    post.markdown = contentHtml

    return post
}

const PagePost = async ({ params }) => {
    const slug = params.slug
    const post = await getPostBySlug(slug)
    return(
        <div className={styles.content}>
            <div className={styles.postCard}>
                <figure className={styles.cover}>
                    <Image src={post.cover} width={686} height={230} alt={`Capa do post de titulo: ${post.title}`} />
                </figure>

                <h1 className={styles.title}>{post.title}</h1>
                <p className={styles.body}>{post.body}</p>

                <div className={styles.author}>
                    <Avatar imageSrc={post.author.avatar} name={post.author.username} />
                </div>
            </div>

            <div className={styles.badge}>
                <Component size={16} />
                <span>card_code_editor</span>
            </div>

            <span className={styles.codeLabel}>Código:</span>
            <div className={styles.markdown} dangerouslySetInnerHTML={{ __html: post.markdown }}></div>
        </div>
    )
}

export default PagePost