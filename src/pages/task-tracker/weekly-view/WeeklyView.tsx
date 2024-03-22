import { Box, CircularProgress, Divider, Grid, Stack, Typography } from '@mui/material'
import { useGetActiveTasksQuery, useGetAllLogsInRangeQuery } from '../../../redux/services/apiSlice'
import { dateFormat } from '../../../common/DateFunctions'
import { DailyLog } from '../../../redux/responseTypes/DailyLog'


function DayOfWeek(props: { date: Date, logs: DailyLog[] }) {
    const { date, logs } = props

    const { data, error, isLoading } = useGetActiveTasksQuery()

    const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const isToday = date.getDay() === (new Date()).getDay()

    if (isLoading) {
        return <CircularProgress />
    }
    if (!data || !data.success || error) {
        return <>An Unexpected Error Has Occurred</>
    }

    const tasks = data.value

    return (
        <Stack 
            direction="column" 
            width="100%"
            minWidth="160px"
            height="100%"
        >
            {/* header */}
            <Box
                width="100%" height="100%"
                pt={4}
                pb={4}
                sx={{
                    backgroundColor: isToday ? '#00b3ff' : '#8cddff'
                }}
            >
                <Typography
                    variant="h5"
                    textAlign="center"
                    color={isToday ? 'white' : 'black'}
                >
                    {daysOfTheWeek[date.getDay()]}
                </Typography>
            </Box>
            <Divider />
            {/* body */}
            {
                logs.map((log) => {
                    const task = tasks.find((task) => task.id === log.taskId)
                    if (!task) {
                        return <Typography color="error">Corresponding task not found for log with taskId {log.taskId}</Typography>
                    }
                    return (
                        <Grid container>
                            <Grid item>
                                <Typography>
                                    {task?.taskName ?? ''}
                                </Typography>
                            </Grid>
                        </Grid>
                    )
                })
            }
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
        if (log.dailyTimeMinutes > 0) {
            logMap.get(log.logDate)?.push(log)
        }
    }
    console.log(logMap)

    return (
        <Box
            sx={{
                overflowX: 'auto'
            }}
        >
            <Stack
                direction="row"
                justifyContent="space-around"
                divider={<Divider orientation="vertical" flexItem />}
            >
                {
                    datesThisWeek().map((date) => {
                        return <DayOfWeek date={date} logs={logMap.get(dateFormat(date, '-')) ?? []} />
                    })
                }
            </Stack>
        </Box>
    )
}