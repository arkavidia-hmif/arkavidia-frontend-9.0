import { User } from '~/api/generated'

export interface basicLoginResponse {
  ok: boolean
  error: boolean
}

export interface AuthContextProps {
  isAuthenticated: boolean
  user: User | null
  getRefreshToken: () => string | null
  setRefreshToken: (token: string) => void
  clearRefreshToken: () => void
  basicLogin: (email: string, password: string) => Promise<basicLoginResponse>
  logout: () => void
}
