import { useState } from 'react'
import { Box, Card, CircularProgress, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useGetActiveTasksQuery } from '../../../redux/services/apiSlice'
import { AddCircle, Delete, ModeEdit } from '@mui/icons-material'
import TaskEditCard from './TaskEditCard'

export default function TaskEditor() {
    const { data, error, isLoading } = useGetActiveTasksQuery()
    const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false)
    const [editTaskModalOpen, setEditTaskModalOpen] = useState(false)

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
                                <Container maxWidth="sm">
                                    <Stack direction="column" spacing={4}>
                                        {
                                            taskList.map((task) => (
                                                <Card 
                                                    variant="elevation"
                                                    sx={{
                                                        borderLeft: `10px solid #${task.rgbTaskColor}`
                                                    }}
                                                >
                                                    <Stack direction="row" alignItems="center" justifyContent="space-between" m={2}>
                                                        <Typography variant="h5">{task.taskName}</Typography>
                                                        <Box>
                                                            <Tooltip title="Edit Task">
                                                                <IconButton
                                                                    onClick={() => {
                                                                        setEditTaskModalOpen(true)
                                                                    }}>
                                                                    <ModeEdit />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete Task">
                                                                <IconButton
                                                                    onClick={() => {
                                                                        // TODO: Open MUI Dialog (are you sure)
                                                                        // if yes, call endpoint to set Task inactive
                                                                    }}
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                        <TaskEditCard
                                                            createTaskModalOpen={editTaskModalOpen}
                                                            setCreateTaskModalOpen={setEditTaskModalOpen}
                                                            initialValues={task}
                                                        />
                                                    </Stack>
                                                </Card>
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
                                                <TaskEditCard
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