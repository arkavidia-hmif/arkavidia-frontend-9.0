import type { Metadata } from 'next'
import { Belanosima, Teachers, DM_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './providers/ThemeProvider'

const BelanosimaFont = Belanosima({
  weight: '400',
  subsets: ['latin'],
  fallback: ['sans-serif'],
  variable: '--font-belanosima'
})

const TeachersFont = Teachers({
  subsets: ['latin'],
  fallback: ['sans-serif'],
  variable: '--font-teachers'
})

const DM_SansFont = DM_Sans({
  subsets: ['latin'],
  fallback: ['sans-serif'],
  variable: '--font-dmsans'
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
