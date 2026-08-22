import Image from "next/image"
import { Component } from "lucide-react"
import logger from "@/logger"
import { remark } from 'remark'
import html from 'remark-html'
import { Avatar } from "../../components/Avatar"
import styles from "./post.module.css"
import db from "@root/prisma/db"
import { redirect } from "next/navigation"

async function getPostBySlug ( slug ) {
    
    try {

        const post = await db.post.findFirst({
            where: {
                slug
            },
            include: {
                author: true
            }
        })

        if (!post) {
            throw new Error(`Post com slug ${slug} não foi encontrado`)
        }
    
        const processedContent = await remark()
            .use(html)
            .process(post.markdown)
        const contentHtml = processedContent.toString()
    
        post.markdown = contentHtml
    
        return post

    } catch (error) {
        logger.error('Falha ao obter o texto com o slug: ', {
            slug,
            error
        })
    }
    
    redirect('/not-found')
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