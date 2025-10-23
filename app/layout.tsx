import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  style: "normal",
  subsets: ["cyrillic-ext"],
  weight: ["100", "500", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Produtos de Qualidade | Compre Online com Segurança",
  description:
    "Encontre os melhores produtos com preços competitivos, compre online com segurança e receba sua compra rapidamente em qualquer lugar do Brasil.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`antialiased font-sans ${inter.variable}`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
