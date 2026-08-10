import logger from "@/logger"
import { CardPost } from "./components/CardPost"
import { ChangePage } from "./components/ChangePage"
import styles from "./components/CardPost/cardpost.module.css"

async function getAllPosts ( page ) {
  const response = await fetch(`http://localhost:3042/posts?_page=${page}&_per_page=6`)
  if(!response.ok){
    logger.error("Ops, Alguma coisa correu mal")
    return []
  }
  logger.info("Posts obtidos com sucesso!")
  return response.json()
}

export default async function Home({ searchParams }) {
  const currentPage = Number(searchParams.page) || 1
  const { data: posts, prev, next } = await getAllPosts(currentPage)
  return (
    <main className={styles.container}>
      {posts.map(post => <CardPost key={post.id} post={ post }/>)}
      <ChangePage prev={prev} next={next} />
    </main>
  )
}
