import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Result } from '../responseTypes/Result'
import { User } from '../responseTypes/User'
import { RootState } from '../store'

export const weeklyTaskTrackerApi = createApi({
    reducerPath: 'weeklyTaskTrackerApi',
    // todo, setup backend base url
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        prepareHeaders(headers, { getState }) {
            headers.set('Authorization', `Bearer ${getState() as RootState}`)
            return headers
        }
    }),
    endpoints: (builder) => ({
        // account routes
        getIsUsernameAvailable: builder.query<Result<boolean>, string>({
            query: (username) => `/account/available/${username}`,
        }),
        getUserInfo: builder.query<User, void>({
            query: () => '/userInfo',
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
    useGetUserInfoQuery,
    usePostRegisterUserMutation,
    usePostLoginMutation
} = weeklyTaskTrackerApi