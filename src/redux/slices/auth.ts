'use client'

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AuthReducerState {
  accessToken: string | null
  isAdmin: boolean
  isLoggedIn: boolean
  hasFilledInfo: boolean
  username: string
}

const initialState = {
  accessToken: null,
  isAdmin: false,
  isLoggedIn: false,
  hasFilledInfo: false,
  username: ''
} as AuthReducerState

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLogin(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
      state.isAdmin = false
      state.isLoggedIn = true
    },
    userLogout(state) {
      state.accessToken = null
      state.isAdmin = false
      state.isLoggedIn = false
    },
    setAdmin(state) {
      state.isAdmin = true
    },
    setNotAdmin(state) {
      state.isAdmin = false
    },
    setFilledInfo(state, action: PayloadAction<boolean>) {
      state.hasFilledInfo = action.payload
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload
    }
  }
})

export const {
  userLogin,
  userLogout,
  setAdmin,
  setNotAdmin,
  setFilledInfo,
  setUsername
} = authSlice.actions
export default authSlice.reducer
