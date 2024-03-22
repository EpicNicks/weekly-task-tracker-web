import { useState } from 'react'
import { Box, Card, CircularProgress, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useGetActiveTasksQuery } from '../../../redux/services/apiSlice'
import { AddCircle } from '@mui/icons-material'
import TaskEditModal from './TaskEditModal'
import TaskEditCard from './TaskEditCard'

export default function TaskEditor() {
    const { data, error, isLoading } = useGetActiveTasksQuery()
    const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false)

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
                            <Box alignItems="center">
                                <Container maxWidth="md">
                                    <Stack direction="column" spacing={4}>
                                        {
                                            taskList.map((task) => (
                                                <TaskEditCard task={task} />
                                            ))
                                        }
                                        <Card variant="outlined">
                                            <Stack direction="row" alignItems="center" justifyContent="space-between" ml={2} mr={2}>
                                                <Typography variant="h5" textAlign="center">
                                                    Create a New Task
                                                </Typography>
                                                <Tooltip title="Create Task">
                                                    <IconButton
                                                        onClick={() => {
                                                            setCreateTaskModalOpen(true)
                                                        }}
                                                    >
                                                        <AddCircle fontSize="large" color="primary" />
                                                    </IconButton>
                                                </Tooltip>
                                                <TaskEditModal
                                                    createTaskModalOpen={createTaskModalOpen}
                                                    setCreateTaskModalOpen={setCreateTaskModalOpen}
                                                />
                                            </Stack>
                                        </Card>
                                    </Stack>
                                </Container>
                            </Box>
                        </Box>
                    </Container>
                </Card>
            </Container>
        </Box>
    )
}