import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { UsersProvider } from "@/hooks/use-users"
import { SwapRequestsProvider } from "@/hooks/use-swap-requests"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Skill Swap Platform",
  description: "Connect with others to exchange skills and knowledge",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <UsersProvider>
            <SwapRequestsProvider>{children}</SwapRequestsProvider>
          </UsersProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
