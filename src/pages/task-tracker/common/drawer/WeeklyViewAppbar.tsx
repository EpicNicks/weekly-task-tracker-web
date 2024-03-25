import { Box, Stack } from '@mui/material'

export default function WeeklyViewAppbar() {
    return (
        <Stack direction="row">
            <Box sx={{ backgroundColor: 'white' }}>
                <div id="weekly-view-appbar-header-slot" />
            </Box>
        </Stack>
    )
}