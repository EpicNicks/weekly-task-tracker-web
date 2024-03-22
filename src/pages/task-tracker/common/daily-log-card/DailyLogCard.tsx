import { Card, CircularProgress, Divider, Grid, Stack, Typography } from '@mui/material'
import { UserPrefs } from '../../../../redux/services/userPrefs'
import { match } from 'ts-pattern'
import TaskLogButton from './TaskLogButton'
import { useGetLogsForDateQuery } from '../../../../redux/services/apiSlice'
import { dateFormat } from '../../../../common/DateFunctions'

export interface DailyLogCardProps {
    taskId: number
    taskName: string
    taskColor: string
    cardStyle: UserPrefs['taskDisplayMode']
}

export default function DailyLogCard(props: DailyLogCardProps) {
    const {
        taskId,
        taskName,
        taskColor,
        cardStyle,
    } = props

    function timeString(minutesLogged: number) {
        const hours = Math.floor(minutesLogged / 60)
        const minutes = Math.floor(minutesLogged % 60)
        return match(cardStyle)
            .with('cozy', () => `${hours > 0 ? `${hours} hours and` : ''} ${minutes} minutes`)
            .with('compact', () => `${hours}:${minutes.toString().padStart(2, '0')}`)
            .exhaustive()
    }

    const { data, error, isLoading } = useGetLogsForDateQuery({ logDate: dateFormat(new Date()), taskId })

    if (isLoading) {
        return <CircularProgress />
    }

    const log = data && data.success
        ? data.value
        : undefined

    if (!data || !data.success) {
        if (error && 'status' in error && error.status === 404){
            // log is undefined, create new 
        } else {
            return <Typography>An Unexpected Error Has Occurred</Typography>
        }
    }

    console.log(log)
    const minutesLogged = log?.dailyTimeMinutes ?? 0
    const logButtonType = match(log)
        .with(undefined, () => ('CREATE' as const))
        .otherwise(() => 'UPDATE' as const)

    return (
        <Card variant="outlined" color={taskColor} sx={{ border: `1px solid ${taskColor}`, borderLeft: `20px solid ${taskColor}` }}>
            {
                match(cardStyle)
                    .with('cozy', () => (
                        <Grid container m={4} mr={0} alignItems="center">
                            <Grid item md={10} xs={12}>
                                <Stack direction="column" spacing={1}>
                                    <Typography variant="h4">{taskName}</Typography>
                                    <Divider color={taskColor.substring(0, 6)} />
                                    <Typography pt={2} variant="h6">Time spent today: {timeString(minutesLogged)}</Typography>
                                </Stack>
                            </Grid>
                            <Grid item ml={1} md={1} xs={12}>
                                <TaskLogButton logButtonType={logButtonType} taskProps={{ taskId, minutesLogged, taskName: taskName }} />
                            </Grid>
                        </Grid>
                    ))
                    .with('compact', () => (
                        <Grid container m={2} mt={0} spacing={0} pt={1} alignItems="center" justifyContent="space-evenly">
                            <Grid item md={9} sm={8} xs={12}>
                                <Typography variant="h4">{taskName}</Typography>
                            </Grid>
                            <Grid item md={3} sm={4} xs={12}>
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