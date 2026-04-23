import { createListenerMiddleware } from '@reduxjs/toolkit'
import { logout, setCredentials } from '@/store/slices/authSlice'
import { clearAuthSession, saveAuthSession } from '@/utils/authSession'

export const authListenerMiddleware = createListenerMiddleware()

authListenerMiddleware.startListening({
  actionCreator: setCredentials,
  effect: (action) => {
    saveAuthSession(action.payload)
  },
})

authListenerMiddleware.startListening({
  actionCreator: logout,
  effect: () => {
    clearAuthSession()
  },
})
