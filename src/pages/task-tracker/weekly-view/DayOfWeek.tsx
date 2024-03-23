import { CircularProgress, Stack, Tooltip, Box, Typography, Divider, Card, Grid } from '@mui/material'
import { dateFormat } from '../../../common/DateFunctions'
import { DailyLog } from '../../../redux/responseTypes/DailyLog'
import { useGetActiveTasksQuery } from '../../../redux/services/apiSlice'
import TaskLogButton from '../common/daily-log-card/TaskLogButton'

export default function DayOfWeek(props: { date: Date, logs: DailyLog[] }) {
    const { date, logs } = props

    const { data, error, isLoading } = useGetActiveTasksQuery()

    function timeString(minutesLogged: number) {
        const hours = Math.floor(minutesLogged / 60)
        const minutes = Math.floor(minutesLogged % 60)
        if (hours > 0) {
            return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes > 0 ? `and ${minutes} minute${minutes !== 1 ? 's' : ''}` : ''}`
        }
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`
    }

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
            <Tooltip title={isToday ? 'Today' : ''}>
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
                    <Typography
                        textAlign="center"
                        color={isToday ? 'white' : 'black'}
                    >
                        {dateFormat(date, '-')}
                    </Typography>
                </Box>
            </Tooltip>
            <Divider />
            {/* body */}
            {
                logs.map((log) => {
                    const task = tasks.find((task) => task.id === log.taskId)
                    if (log.dailyTimeMinutes === 0) {
                        return <></>
                    }
                    if (!task) {
                        return <Typography color="error">Corresponding task not found for log with taskId {log.taskId}</Typography>
                    }
                    return (
                        <Box p={0.5}>
                            <Card
                                variant="outlined"
                                sx={{
                                    borderLeft: `10px solid #${task.rgbTaskColor.substring(0, 6)}`,
                                }}
                            >
                                <Grid container m={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="h5" noWrap>
                                            {task.taskName}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            {timeString(log.dailyTimeMinutes)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TaskLogButton
                                            addCircleProps={{
                                                sx: {
                                                    fontSize: '30px'
                                                }
                                            }}
                                            logButtonType="UPDATE"
                                            taskProps={{
                                                logDate: log.logDate,
                                                minutesLogged: log.dailyTimeMinutes,
                                                taskName: task.taskName,
                                                taskId: task.id
                                            }} />
                                    </Grid>
                                </Grid>
                            </Card>
                        </Box>
                    )
                })
            }
            <Box pt={2}>
                <Card variant="elevation">
                    <Stack direction="row" justifyContent="space-evenly" alignItems="center">
                        <Typography sx={{ color: '#555' }}>Log a Task</Typography>
                        <TaskLogButton addCircleProps={{ sx: { fontSize: '30px' } }} logButtonType="CREATE" />
                    </Stack>
                </Card>
            </Box>
        </Stack>
    )
}
