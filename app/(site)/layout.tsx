import type React from "react";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";

const inter = Inter({
  style: "normal",
  subsets: ["cyrillic-ext"],
  weight: ["100", "500", "700", "800"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={cn("antialiased font-sans", inter.variable)}>
        <Header />
        {children}
      </body>
    </html>
  );
}
