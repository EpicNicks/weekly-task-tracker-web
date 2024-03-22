import { Box, Divider, Stack, Typography } from '@mui/material'


function DayOfWeek(props: { date: Date }) {
    const { date } = props

    const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    return (
        <Stack direction="column" width="100%" height="100%">
            <Box
                width="100%" height="100%"
                pt={4}
                pb={4}
                sx={{
                    backgroundColor: date.getDay() === (new Date()).getDay() ? '#00b3ff' : '#8cddff'
                }}
            >
                <Typography
                    variant="h5"
                    textAlign="center"
                >
                    {daysOfTheWeek[date.getDay()]}
                </Typography>
            </Box>
            <Divider />
        </Stack>
    )
}

export default function WeeklyView() {

    function datesThisWeek() {
        const today = new Date()
        today.setDate(today.getDate() - today.getDay() + 1)
        const thisWeekDates = []
        for (let i = 0; i < 7; ++i) {
            thisWeekDates.push(new Date(today))
            today.setDate(today.getDate() + 1)
        }
        return thisWeekDates
    }

    return (
        <Stack
            direction="row"
            justifyContent="space-around"
            divider={<Divider orientation="vertical" flexItem />}
        >
            {
                datesThisWeek().map((date) => {
                    return <DayOfWeek date={date} />
                })
            }
        </Stack>
    )
}