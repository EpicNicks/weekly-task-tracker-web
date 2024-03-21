import { Box, Button, Card, CircularProgress, Container, Stack, Typography } from '@mui/material'
import DailyTaskCard from '../common/daily-task-card/DailyTaskCard'
import { useAppSelector } from '../../../redux/hooks'
import { useGetActiveTasksQuery } from '../../../redux/services/apiSlice'
import { match } from 'ts-pattern'
import { useNavigate } from 'react-router-dom'

export default function TodayView() {
    const navigate = useNavigate()
    const cardStyle = useAppSelector(state => state.userPrefs.taskDisplayMode)

    const { data, error, isFetching } = useGetActiveTasksQuery()
    if (isFetching) {
        return <CircularProgress />
    }
    if (!data || !data.success || error) {
        return <>Loading...</>
    }
    if (data.value.length === 0) {
        // task list empty add a task behaviour
        // give a tutorial that redirects the user to task-list in tutorial mode or something
    }
    const taskList = data.value

    return (
        <Box>
            <Container maxWidth="lg">
                <Card variant="outlined" sx={{ minHeight: '91vh' }}>
                    <Container maxWidth="md">
                        <Box mt={2} mb={4}>
                            {
                                match(taskList.length)
                                    .with(0, () => (
                                        <Stack direction="column" alignItems="center" pt={8} spacing={4}>
                                            <Typography>
                                                It would appear you have no tasks
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                onClick={() => navigate('/task-tracker/task-editor')}
                                            >
                                                Click Here To Go Make One
                                            </Button>
                                        </Stack>
                                    ))
                                    .otherwise(() => (
                                        <Stack spacing={4}>
                                            {
                                                taskList.map((task) => (
                                                    <DailyTaskCard
                                                        taskId={task.id}
                                                        taskName={task.taskName}
                                                        taskColor={`#${task.rgbTaskColor}`}
                                                        cardStyle={cardStyle}
                                                    />
                                                ))
                                            }
                                        </Stack>
                                    ))
                            }
                        </Box>
                    </Container>
                </Card>
            </Container>
        </Box>
    )
}