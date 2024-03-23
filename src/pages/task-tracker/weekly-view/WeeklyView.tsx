import { Box, CircularProgress, Divider, Stack } from '@mui/material'
import { useGetAllLogsInRangeQuery } from '../../../redux/services/apiSlice'
import { dateFormat } from '../../../common/DateFunctions'
import { DailyLog } from '../../../redux/responseTypes/DailyLog'
import DayOfWeek from './DayOfWeek'
import { WeeklyProgressDisplay } from './WeeklyProgressDisplay'

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
    const thisWeekDates = datesThisWeek()
    const { data, error, isLoading } = useGetAllLogsInRangeQuery({ startDate: dateFormat(thisWeekDates[0]), endDate: dateFormat(thisWeekDates[thisWeekDates.length - 1]) })

    if (isLoading) {
        return <CircularProgress />
    }
    if (!data || !data.success || error) {
        return <>An Error Has Occurred</>
    }

    const logs = data.value
    const logMap = new Map<string, DailyLog[]>()
    for (const date of thisWeekDates) {
        logMap.set(dateFormat(date, '-'), [])
    }
    for (const log of logs) {
        logMap.get(log.logDate)?.push(log)
    }

    return (
        <Box
            sx={{
                overflowX: 'auto'
            }}
        >
            <Stack direction="column">
                <Stack
                    direction="row"
                    justifyContent="space-around"
                    divider={<Divider orientation="vertical" flexItem />}
                    minHeight="50vh"
                    sx={{ backgroundColor: 'white' }}
                >
                    {
                        datesThisWeek().map((date) => {
                            return <DayOfWeek key={dateFormat(date)} date={date} logs={logMap.get(dateFormat(date, '-')) ?? []} />
                        })
                    }
                </Stack>
                <Divider />
                <Box
                    minHeight="44.5vh"
                    sx={{ backgroundColor: 'white' }}
                >
                    <WeeklyProgressDisplay weekLogs={logMap} />
                </Box>
            </Stack>
        </Box>
    )
}