'use client'

import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../slices/auth'

const rootReducer = combineReducers({
  auth: authReducer
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (state: any, action: any) => rootReducer(state, action)
