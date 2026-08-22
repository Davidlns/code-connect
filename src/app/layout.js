import { Prompt } from 'next/font/google'
import "./globals.css"
import { Aside } from "@/app/components/Aside"
import { SearchBar } from "@/app/components/SearchBar"

export const metadata = {
  title: "Code Connect",
  description: "Uma rede social para Devs",
};

const prompt = Prompt({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap'
})

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className={prompt.className}>
      <body>
        <div className="app-container">
          <Aside />
          <div className="content-column">
            <SearchBar />
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
