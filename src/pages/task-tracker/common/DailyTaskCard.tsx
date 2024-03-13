import { Card, Divider, Grid, IconButton, Stack, Typography } from '@mui/material'
import { UserPrefs } from '../../../redux/services/userPrefs'
import { match } from 'ts-pattern'
import { AddCircle } from '@mui/icons-material'

export interface DailyTaskCardProps {
    taskColor: string
    taskName: string
    minutesLogged: number
    cardStyle: UserPrefs['taskDisplayMode']
}

export default function DailyTaskCard(props: DailyTaskCardProps) {
    const {
        taskColor,
        taskName,
        minutesLogged,
        cardStyle
    } = props

    function timeString() {
        const hours = Math.floor(minutesLogged / 60)
        const minutes = Math.floor(minutesLogged % 60)
        if (cardStyle === 'cozy') {
            return `${hours > 0 ? `${hours} hours and` : ''} ${minutes} minutes`
        }
        else return `${hours}:${minutes}`
    }

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
                                    <Typography pt={2} variant="h4">Time spent today: {timeString()}</Typography>
                                </Stack>
                            </Grid>
                            <Grid item ml={1} xs={1}>
                                <IconButton>
                                    <AddCircle sx={{ fontSize: '50px', color: taskColor }} />
                                </IconButton>
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
                                    <Typography variant="h4">{timeString()}</Typography>
                                    <IconButton>
                                        <AddCircle sx={{ fontSize: '50px', color: taskColor }} />
                                    </IconButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    ))
                    .exhaustive()
            }
        </Card>
    )
}