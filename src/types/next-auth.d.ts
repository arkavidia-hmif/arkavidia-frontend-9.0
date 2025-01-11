import NextAuth from 'next-auth'
import { type User } from '~/api/generated'

declare module 'next-auth' {
  interface Session {
    user: User & {
      accessToken: string
      refreshToken: string
    }
  }
}
