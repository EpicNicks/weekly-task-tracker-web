import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Result } from '../responseTypes/Result'
import { User } from '../responseTypes/User'
import { Task } from '../responseTypes/Task'
import { getUserToken } from './authSlice'
import { DailyLog } from '../responseTypes/DailyLog'
import { DateFormat } from '../../common/components/DateFunctions'

export const weeklyTaskTrackerApi = createApi({
    reducerPath: 'weeklyTaskTrackerApi',
    // todo, setup backend base url
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders(headers) {
            headers.set('Authorization', `Bearer ${getUserToken()}`)
            return headers
        }
    }),
    tagTypes: ['Tasks'],
    endpoints: (builder) => ({
        // account routes
        getIsUsernameAvailable: builder.query<Result<boolean>, string>({
            query: (username) => `/account/available/${username}`,
        }),
        getUserInfo: builder.query<Result<User>, void>({
            query: () => '/account/userInfo',
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
        // task routes
        getAllTasks: builder.query<Result<Task[]>, void>({
            query: () => '/tasks/all',
            providesTags: ['Tasks']
        }),
        getActiveTasks: builder.query<Result<Task[]>, void>({
            query: () => '/tasks/active',
            providesTags: ['Tasks']
        }),
        getTaskById: builder.query<Result<Task>, number>({
            query: (id) => `/tasks/${id}`,
            providesTags: ['Tasks']
        }),

        //daily log routes
        getLogsForDate: builder.query<Result<DailyLog[]>, Date>({
            query: (date) => `/logs/${DateFormat(date)}`
        }),
        createLog: builder.mutation<Result<DailyLog>, {logDate: Date, dailyTimeMinutes: number, taskId: number}>({
            query: (body) => ({
                url: `/logs/create`,
                body: {
                    logDate: DateFormat(body.logDate),
                    dailyTimeMinutes: body.dailyTimeMinutes,
                    taskId: body.taskId,
                },
                method: 'POST'
            })
        }),
        updateLogMinutes: builder.mutation<Result<DailyLog>, { date: Date, dailyTimeMinutes: number, taskId: number }>({
            query: (body) => ({
                url: `/logs/change-daily-minutes/${DateFormat(body.date)}`,
                body: {
                    dailyTimeMinutes: body.dailyTimeMinutes,
                    taskId: body.taskId,
                },
                method: 'PATCH'
            })
        }),
    }),
})

export const {
    // account
    useGetIsUsernameAvailableQuery,
    useGetUserInfoQuery,
    usePostRegisterUserMutation,
    usePostLoginMutation,
    // tasks
    useGetAllTasksQuery,
    useGetActiveTasksQuery,
    useGetTaskByIdQuery,
    // daily logs
    useGetLogsForDateQuery,
    useCreateLogMutation,
    useUpdateLogMinutesMutation,
} = weeklyTaskTrackerApi