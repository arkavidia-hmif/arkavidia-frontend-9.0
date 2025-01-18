import type { Metadata } from 'next'
import { Belanosima, Teachers, DM_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './providers/ThemeProvider'
import { Provider } from 'react-redux'
import { Provider } from 'react-redux'
import { Toaster } from './components/ui/toaster'
import { AuthProvider } from './contexts/AuthContext'
import { store, persistor } from '~/redux/store'
import Loading from './components/Loading'
import { PersistGate } from 'redux-persist/integration/react'
import ReduxProvider from './providers/ReduxProvider'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { store, persistor } from '~/redux/store'
import Loading from './components/Loading'
import { PersistGate } from 'redux-persist/integration/react'
import ReduxProvider from './providers/ReduxProvider'
import { GoogleOAuthProvider } from '@react-oauth/google'

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
        className={`${BelanosimaFont.variable} ${TeachersFont.variable} ${DM_SansFont.variable} min-h-screen w-full antialiased`}>
        <GoogleOAuthProvider clientId="109603163015-vf1p5anv3t8ugsm7u08370q3d4ubhhao.apps.googleusercontent.com">
          <ReduxProvider>
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange>
                {children}
              </ThemeProvider>
            </AuthProvider>
            <Toaster />
          </ReduxProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
