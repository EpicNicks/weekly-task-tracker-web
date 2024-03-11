import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { weeklyTaskTrackerApi } from './services/apiSlice'
import { authSlice } from './services/authSlice'


export const store = configureStore({
    reducer: {
        [weeklyTaskTrackerApi.reducerPath]: weeklyTaskTrackerApi.reducer,
        [authSlice.reducerPath]: authSlice.reducer
    },
    middleware(getDefaultMiddleware) {
        return getDefaultMiddleware().concat(weeklyTaskTrackerApi.middleware)
    }
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch