import { createSlice } from '@reduxjs/toolkit'
import { weeklyTaskTrackerApi } from './apiSlice'

type State = {
    token: string | null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null
    } as State,
    reducers: {},
    extraReducers(builder){
        builder.addMatcher(weeklyTaskTrackerApi.endpoints.postLogin.matchFulfilled, (state, action) => {
            state.token = action.payload.success ? action.payload.value : null
        })
    }
})
