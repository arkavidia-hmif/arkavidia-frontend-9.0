'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '~/redux/store'
import Loading from '../components/Loading'
import { ReactNode } from 'react'

const ReduxLoading = () => {
  return (
    <div className="h-screen w-screen bg-gradient-to-r from-[#1F0246] to-[#2E046A]">
      <Loading />
    </div>
  )
}

const ReduxProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<ReduxLoading />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export default ReduxProvider
