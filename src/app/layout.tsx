import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "Joanderson Silva",
  description: "Pai presente. Reconstrução diária, sem sermão.",
  openGraph: {
    title: "Joanderson Silva",
    description: "Pai presente. Reconstrução diária, sem sermão.",
    url: "https://joandersonsilva.com.br",
    siteName: "Joanderson Silva",
    locale: "pt_BR",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
