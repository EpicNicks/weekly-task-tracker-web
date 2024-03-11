export type Success<T> = {
    success: true
    value: T
}

export type Failure = {
    success: false
    error: string
}

export type Result<T> = Success<T> | Failure