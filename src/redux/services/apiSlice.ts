import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Result } from '../responseTypes/Result'
import { User } from '../responseTypes/User'
import { Task } from '../responseTypes/Task'
import { getUserToken } from './authSlice'
import { DailyLog } from '../responseTypes/DailyLog'
import { dateFormat } from '../../common/DateFunctions'

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
    tagTypes: ['Tasks', 'Logs'],
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
        getTaskByName: builder.query<Result<Task>, string>({
            query: (taskName) => `/tasks?taskName=${taskName}`,
            providesTags: ['Tasks'],
        }),
        getTaskById: builder.query<Result<Task>, number>({
            query: (id) => `/tasks/${id}`,
            providesTags: ['Tasks']
        }),
        getTaskProgress: builder.query<Result<number>, number>({
            query: (taskId) => `/tasks/total-progress/${taskId}`,
            providesTags: ['Tasks']
        }),
        createNewTask: builder.mutation<Result<Task>, { taskName: Task['taskName'], rgbTaskColor: Task['rgbTaskColor'], weeklyTargetMinutes: Task['weeklyTargetMinutes'] }>({
            query: (body) => ({
                url: '/tasks/create',
                body,
                method: 'POST'
            }),
            invalidatesTags: ['Tasks']
        }),
        updateTask: builder.mutation<Result<Task>, Task>({
            query: (body) => ({
                url: `/tasks/update-task/${body.id}`,
                body,
                method: 'PATCH',
            }),
            invalidatesTags: ['Tasks']
        }),
        deactivateTaskById: builder.mutation<Result<Task>, Task['id']>({
            query: (taskId) => ({
                url: `/tasks/deactivate/${taskId}`,
                method: 'PATCH'
            }),
            invalidatesTags: ['Tasks']
        }),

        //daily log routes
        getAllLogsInRange: builder.query<Result<DailyLog[]>, { startDate: string, endDate: string }>({
            query: ({ startDate, endDate }) => `/logs/all?startDate=${startDate}&endDate=${endDate}`,
            providesTags: ['Logs'],
        }),
        getLogsForDate: builder.query<Result<DailyLog>, { logDate: string, taskId: Task['id'] }>({
            query: ({ logDate, taskId }) => `/logs/${logDate}/${taskId}`,
            providesTags: ['Logs']
        }),
        createLog: builder.mutation<Result<DailyLog>, { logDate: Date, dailyTimeMinutes: number, taskId: number }>({
            query: (body) => ({
                url: `/logs/create`,
                body: {
                    logDate: dateFormat(body.logDate),
                    dailyTimeMinutes: body.dailyTimeMinutes,
                    taskId: body.taskId,
                },
                method: 'POST'
            }),
            invalidatesTags: ['Logs']
        }),
        updateLogMinutes: builder.mutation<Result<DailyLog>, { date: Date | string, dailyTimeMinutes: number, taskId: number }>({
            query: (body) => ({
                url: `/logs/change-daily-minutes/${dateFormat(body.date)}`,
                body: {
                    dailyTimeMinutes: body.dailyTimeMinutes,
                    taskId: body.taskId,
                },
                method: 'PATCH'
            }),
            invalidatesTags: ['Logs']
        }),
    }),
})

export const {
    // account
    useGetIsUsernameAvailableQuery,
    useLazyGetIsUsernameAvailableQuery,
    useGetUserInfoQuery,
    usePostRegisterUserMutation,
    usePostLoginMutation,
    // tasks
    useGetAllTasksQuery,
    useGetActiveTasksQuery,
    useLazyGetActiveTasksQuery,
    useGetTaskByIdQuery,
    useGetTaskByNameQuery,
    useGetTaskProgressQuery,
    useLazyGetTaskByNameQuery,
    useCreateNewTaskMutation,
    useUpdateTaskMutation,
    useDeactivateTaskByIdMutation,
    // daily logs
    useGetAllLogsInRangeQuery,
    useGetLogsForDateQuery,
    useCreateLogMutation,
    useUpdateLogMinutesMutation,
} = weeklyTaskTrackerApi