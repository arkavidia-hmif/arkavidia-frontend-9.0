import { User } from '~/api/generated'

export interface basicLoginResponse {
  ok: boolean
  error: boolean
  message?: string
}

export interface AuthContextProps {
  basicLogin: (email: string, password: string) => Promise<basicLoginResponse>
  logout: () => Promise<void>
}
