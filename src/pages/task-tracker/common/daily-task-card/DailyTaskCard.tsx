import { Card, CircularProgress, Divider, Grid, Stack, Typography } from '@mui/material'
import { UserPrefs } from '../../../../redux/services/userPrefs'
import { match } from 'ts-pattern'
import TaskLogButton from './TaskLogButton'
import { useGetLogsForDateQuery } from '../../../../redux/services/apiSlice'

export interface DailyTaskCardProps {
    taskId: number
    taskName: string
    taskColor: string
    cardStyle: UserPrefs['taskDisplayMode']
}

export default function DailyTaskCard(props: DailyTaskCardProps) {
    const {
        taskId,
        taskName,
        taskColor,
        cardStyle
    } = props

    function timeString(minutesLogged: number) {
        const hours = Math.floor(minutesLogged / 60)
        const minutes = Math.floor(minutesLogged % 60)
        return match(cardStyle)
            .with('cozy', () => `${hours > 0 ? `${hours} hours and` : ''} ${minutes} minutes`)
            .with('compact', () => `${hours}:${minutes.toString().padStart(2, '0')}`)
            .exhaustive()
    }

    const { data, error, isLoading } = useGetLogsForDateQuery(new Date())

    if (!data || error || !data.success) {
        return <></>
    }
    if (isLoading) {
        return <CircularProgress />
    }
    const dailyLogList = data.value

    const log = dailyLogList.find(log => log.taskId === taskId)
    const minutesLogged = log?.dailyTimeMinutes ?? 0
    const logButtonType = match(log)
        .with(undefined, () => ('CREATE' as const))
        .otherwise(() => 'UPDATE' as const)

    return (
        <Card variant="outlined" color={taskColor} sx={{ border: `1px solid ${taskColor}`, borderLeft: `20px solid ${taskColor}` }}>
            {
                match(cardStyle)
                    .with('cozy', () => (
                        <Grid container direction="row" m={4} mr={0} alignItems="center">
                            <Grid item xs={10}>
                                <Stack direction="column" spacing={1}>
                                    <Typography variant="h3">{taskName}</Typography>
                                    <Divider color={taskColor.substring(0, 6)} />
                                    <Typography pt={2} variant="h5">Time spent today: {timeString(minutesLogged)}</Typography>
                                </Stack>
                            </Grid>
                            <Grid item ml={1} xs={1}>
                                <TaskLogButton logButtonType={logButtonType} taskProps={{ taskId, minutesLogged, taskName: taskName }} />
                            </Grid>
                        </Grid>
                    ))
                    .with('compact', () => (
                        <Grid direction="row" container m={2} mt={0} spacing={2} alignItems="center">
                            <Grid item xs={8}>
                                <Typography variant="h4">{taskName}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="h4">{timeString(minutesLogged)}</Typography>
                                    <TaskLogButton logButtonType={logButtonType} taskProps={{ taskId, minutesLogged, taskName: taskName }} />
                                </Stack>
                            </Grid>
                        </Grid>
                    ))
                    .exhaustive()
            }
        </Card>
    )
}