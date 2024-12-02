import type { Metadata } from 'next'
import { Belanosima, Teachers, DM_Sans } from 'next/font/google'
import './globals.css'

const BelanosimaFont = Belanosima({
  weight: '400',
  subsets: ['latin'],
  fallback: ['sans-serif']
})

const TeachersFont = Teachers({
  subsets: ['latin'],
  fallback: ['sans-serif']
})

const DM_SansFont = DM_Sans({
  subsets: ['latin'],
  fallback: ['sans-serif']
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
    <html lang="en">
      <body
        className={`${BelanosimaFont.className} ${TeachersFont.className} ${DM_SansFont.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
