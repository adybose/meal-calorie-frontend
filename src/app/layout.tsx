import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "next-themes"
import ThemeToggle from "@/components/ui/ThemeToggle" 
import { Toaster } from '@/components/ui/sonner' // shadcn toast


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Meal Calorie Count Generator',
  description: 'Track meal calories with USDA data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <nav className="border-b p-4 flex justify-between">
            <h1 className="text-xl font-bold">Calorie Tracker</h1>
            <ThemeToggle />
          </nav>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
