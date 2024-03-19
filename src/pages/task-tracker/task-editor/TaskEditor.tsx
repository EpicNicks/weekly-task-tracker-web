import { Box, Button, Card, CircularProgress, Container, Stack, Typography } from '@mui/material'
import { useGetActiveTasksQuery } from '../../../redux/services/apiSlice'
import { useNavigate } from 'react-router-dom'
import { match } from 'ts-pattern'

export default function TaskEditor() {
    const { data, error, isLoading } = useGetActiveTasksQuery()
    const navigate = useNavigate()

    if (isLoading) {
        return <CircularProgress />
    }
    if (!data || error || !data.success) {
        return <>Error or no data</>
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
                                        <Box alignItems="center">
                                            <Typography textAlign="center">
                                                Empty Task card that says "Create a Task" goes here
                                            </Typography>
                                        </Box>
                                    ))
                                    .otherwise(() => (
                                        <Stack spacing={4}>
                                            {
                                                taskList.map((task) => (
                                                    <>Task Editor Card Goes here for task with name {task.taskName}</>
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