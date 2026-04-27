import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gols Flamengo | Bolão",
  description: "Ranking oficial do bolão do FlamengoGolsBot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
