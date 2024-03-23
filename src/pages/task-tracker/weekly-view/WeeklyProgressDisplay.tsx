import { Box, CircularProgress, Container, Stack, Typography } from '@mui/material'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { useGetActiveTasksQuery } from '../../../redux/services/apiSlice'
import { DailyLog } from '../../../redux/responseTypes/DailyLog'
import { styled } from '@mui/material/styles'

interface WeeklyProgressDisplayProps {
    weekLogs: Map<string, DailyLog[]>
}

export function WeeklyProgressDisplay(props: WeeklyProgressDisplayProps) {
    const { weekLogs } = props

    const { data, error, isLoading } = useGetActiveTasksQuery()

    if (isLoading) {
        return <CircularProgress />
    }
    if (!data || !data.success || error) {
        return <>An Unexpected Error Has Occurred</>
    }
    const tasks = data.value
    const taskLogsMap = new Map<number, DailyLog[]>()
    for (const task of tasks) {
        taskLogsMap.set(task.id, [])
    }
    for (const key of weekLogs.keys()) {
        for (const log of weekLogs.get(key)!) {
            taskLogsMap.get(log.taskId)?.push(log)
        }
    }

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            // borderRadius: 5,
            // backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
        },
    }))

    return (
        <Box pt={4}>
            <Container maxWidth="md">
                <Stack direction="column" pb={4}>
                    <Typography variant="h5">
                        Total Weekly Progress
                    </Typography>
                    {
                        tasks.map((task) => {
                            const totalWeeklyProgress = taskLogsMap.get(task.id)?.map((log) => log.dailyTimeMinutes).reduce((prev, cur) => prev + cur, 0) ?? 0
                            const progressPercent = Math.min(totalWeeklyProgress / task.weeklyTargetMinutes, 1) * 100
                            return (
                                <Box>
                                    <Typography>{task.taskName}</Typography>
                                    <Box display="flex" alignItems="center" maxWidth="80vw">
                                        <Box width="100%" mr={1}>
                                            <BorderLinearProgress
                                                color="primary"
                                                sx={{
                                                    height: '30px',
                                                    borderRadius: '10px',
                                                    '.MuiLinearProgress-bar': {
                                                        backgroundColor: `#${task.rgbTaskColor.substring(0, 6)}`,
                                                        color: 'yellow'
                                                    },
                                                }}
                                                variant="determinate"
                                                value={progressPercent}
                                            />
                                        </Box>
                                        <Box minWidth="50px">
                                            <Typography>{parseFloat(progressPercent.toFixed(1))}%</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )
                        })
                    }
                </Stack>
            </Container>
        </Box>
    )
}