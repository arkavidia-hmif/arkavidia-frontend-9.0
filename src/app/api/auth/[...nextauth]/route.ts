import { createClient, createConfig } from '@hey-api/client-axios'
import NextAuth, { Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { basicLogin, client, self } from '~/api/generated'

const apiAxiosClient = createClient(
  createConfig({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
    headers: { 'Content-Type': 'application/json' }
  })
)

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'mail@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(
        credentials: Record<'email' | 'password', string> | undefined,
        req
      ) {
        if (!credentials) {
          return null
        }

        const res = await basicLogin({
          client: apiAxiosClient,
          body: { email: credentials?.email, password: credentials?.password }
        })

        if (res.data) {
          apiAxiosClient.setConfig({
            headers: {
              Authorization: `Bearer ${res.data.accessToken}`
            }
          })
          const selfRes = await self({ client: apiAxiosClient })
          if (selfRes.data) {
            return { ...selfRes.data, ...res.data }
          }

          return null
        } else {
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      return { ...token, ...user }
    },
    async session({ session, token }: { session: Session; token: any }) {
      session.user = token
      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
