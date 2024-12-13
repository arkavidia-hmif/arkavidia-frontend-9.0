import type { Metadata } from 'next'
import { Belanosima, Teachers, DM_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './providers/ThemeProvider'
import '~/api/axiosClient'
import { ApiProvider } from './contexts/ApiContext'
import { AuthProvider } from './contexts/AuthContext'

const BelanosimaFont = Belanosima({
  weight: '400',
  subsets: ['latin'],
  fallback: ['sans-serif'],
  variable: '--font-belanosima',
  display: 'swap'
})

const TeachersFont = Teachers({
  subsets: ['latin'],
  fallback: ['sans-serif'],
  variable: '--font-teachers',
  display: 'swap'
})

const DM_SansFont = DM_Sans({
  subsets: ['latin'],
  fallback: ['sans-serif'],
  variable: '--font-dmsans',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Arkavidia 9.0',
  description: 'Arkavidia 9.0 Website'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${BelanosimaFont.variable} ${TeachersFont.variable} ${DM_SansFont.variable} antialiased`}>
        <ApiProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </ApiProvider>
      </body>
    </html>
  )
}
