import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Result } from '../responseTypes/Result'

export const weeklyTaskTrackerApi = createApi({
    reducerPath: 'weeklyTaskTrackerApi',
    // todo, setup backend base url
    baseQuery: fetchBaseQuery({ baseUrl: '' }),
    endpoints: (builder) => ({
        // account routes
        getIsUsernameAvailable: builder.query<Result<boolean>, string>({
            query: (username) => `/account/available/${username}`,
        }),
        postRegisterUser: builder.mutation<Result<void>, { username: string, password: string }>({
            query: (body) => ({
                url: '/account/register',
                body,
                method: 'POST'
            })
        }),
        postLogin: builder.mutation<Result<string>, { username: string, password: string }>({
            query: (body) => ({
                url: '/account/login',
                body,
                method: 'POST'
            }),
        }),
    }),
})

export const {
    useGetIsUsernameAvailableQuery,
    usePostRegisterUserMutation,
    usePostLoginMutation
} = weeklyTaskTrackerApi