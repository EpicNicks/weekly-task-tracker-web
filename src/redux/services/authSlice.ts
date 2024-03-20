import { createSlice } from '@reduxjs/toolkit'
import { weeklyTaskTrackerApi } from './apiSlice'

const USER_TOKEN_KEY = 'userToken'
export const getUserToken = () => sessionStorage.getItem(USER_TOKEN_KEY)
export const invalidateToken = () => {
    sessionStorage.removeItem(USER_TOKEN_KEY)
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: {},
    reducers: {},
    extraReducers(builder) {
        builder.addMatcher(weeklyTaskTrackerApi.endpoints.postLogin.matchFulfilled, (_state, action) => {
            if (action.payload.success) {
                sessionStorage.setItem(USER_TOKEN_KEY, action.payload.value)
            }
        })
    }
})
