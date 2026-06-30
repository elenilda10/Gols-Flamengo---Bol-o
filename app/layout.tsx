import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Flamengo Gols — Bolão Aberto da Nação",
  description: "Crave o placar exato do próximo jogo do Mengão direto pelo Telegram, ganhe pontos e dispute o topo da tabela de classificação geral!",
  metadataBase: new URL("https://flamengogolsbotbr.vercel.app"),
  openGraph: {
    title: "Flamengo Gols — Bolão Aberto da Nação",
    description: "Crave o placar exato do próximo jogo do Mengão direto pelo Telegram, ganhe pontos e dispute o topo da tabela de classificação geral!",
    url: "https://flamengogolsbotbr.vercel.app",
    siteName: "Flamengo Gols",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Painel Oficial Flamengo Gols" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flamengo Gols — Bolão Aberto da Nação",
    description: "Participe do bolão aberto oficial rubro-negro, acumule pontos e mostre quem é o melhor palpiteiro!",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* 🚀 IMPORTAÇÃO DA POPPINS (TEXTOS) + BARLOW CONDENSED (NÚMEROS ESPORTIVOS) */}
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Poppins:wght@400;600;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
