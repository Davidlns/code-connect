import logger from "@/logger"
import { CardPost } from "./components/CardPost"
import { ChangePage } from "./components/ChangePage"
import styles from "./components/CardPost/cardpost.module.css"
import db from "@root/prisma/db"

async function getAllPosts ( page, searchTerm ) {
  try {

    const where = {}

    if (searchTerm) {
      where.title = {
        contains: searchTerm,
        mode: 'insensitive'
      }
    }

    const perPage = 6
    const skip = (page - 1) * perPage
    const totalItens = await db.post.count({ where })
    const totalPages = Math.ceil(totalItens / perPage)
    const prev = page > 1 ? page - 1 : null
    const next = page < totalPages ? page + 1 : null

    const posts = await db.post.findMany({
      take: perPage,
      skip,
      where,
      orderBy: { createdAt: 'desc'},
      include: {
        author: true
      }
    })

    return{ data: posts, prev: prev, next: next }
    
  } catch (error) {
    logger.error('Falha ao obter posts', { error })
    return { data: [], prev: null, next: null }
  }
}

export default async function Home({ searchParams }) {
  const currentPage = Number(searchParams?.page) || 1
  const searchTerm = searchParams?.q
  const { data: posts, prev, next } = await getAllPosts(currentPage, searchTerm)

  return (
    <main className={styles.container}>
      {posts.map(post => <CardPost key={post.id} post={ post }/>)}
      <ChangePage prev={prev} next={next} searchTerm={searchTerm} />
    </main>
  )
}
