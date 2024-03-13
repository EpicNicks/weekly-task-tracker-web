import styled from '@emotion/styled'
import { Button, Stack } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { toggleDisplayMode } from '../../../../redux/services/userPrefs'


export default function DailyViewAppbar() {
    const dispatch = useAppDispatch()
    const taskDisplayMode = useAppSelector(state => state.userPrefs.taskDisplayMode)

    const StyledButton = styled(Button)({
        color: 'white',
        border: '2px solid white',
        '&:hover': {
            backgroundColor: 'white',
            border: '2px solid #579ed1',
            color: 'black',
        },
    })

    return (
        <Stack direction="row">
            <StyledButton 
                variant="contained"
                onClick={() => {
                    dispatch(toggleDisplayMode())
                }}
            >
                Task Style: {taskDisplayMode}
            </StyledButton>
        </Stack>
    )
}