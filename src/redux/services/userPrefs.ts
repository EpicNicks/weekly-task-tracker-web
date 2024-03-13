import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { match } from 'ts-pattern'

export type UserPrefs = {
    taskDisplayMode: 'cozy' | 'compact'
}

export const userPrefsSlice = createSlice({
    name: 'userPrefs',
    initialState: {
        taskDisplayMode: 'cozy'
    } as UserPrefs,
    reducers: {
        updateDisplayMode(state, action: PayloadAction<UserPrefs['taskDisplayMode']>) {
            state.taskDisplayMode = action.payload
        },
        toggleDisplayMode(state) {
            state.taskDisplayMode = match<typeof state.taskDisplayMode, typeof state.taskDisplayMode>(state.taskDisplayMode)
                .with('compact', () => 'cozy')
                .with('cozy', () => 'compact')
                .exhaustive()
        }
    }
})

export const {
    updateDisplayMode,
    toggleDisplayMode
} = userPrefsSlice.actions
