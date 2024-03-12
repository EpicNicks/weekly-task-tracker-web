import { Result } from './Result'

export type User = Result<{
    id: number
    username: string
    points: number
}>