import { configureStore } from '@reduxjs/toolkit'
import { authListenerMiddleware } from '@/app/authListener'
import { baseApi } from '@/store/api/baseApi'
import '@/store/api/authApi'
import '@/store/api/employeesApi'
import authReducer from '@/store/slices/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(authListenerMiddleware.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
