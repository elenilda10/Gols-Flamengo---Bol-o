import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Gols Flamengo | Bolão",
  description: "Ranking oficial do bolão Flamengo Gols.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Gols Flamengo | Bolão",
    description: "Ranking oficial do bolão Flamengo Gols.",
    siteName: "Gols Flamengo",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Gols Flamengo | Bolão",
    description: "Ranking oficial do bolão Flamengo Gols.",
  },
}

export const viewport: Viewport = {
  themeColor: "#090909",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
