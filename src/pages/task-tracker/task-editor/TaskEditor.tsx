import { useState } from 'react'
import { Box, Button, Card, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useDeactivateTaskByIdMutation, useGetActiveTasksQuery } from '../../../redux/services/apiSlice'
import { AddCircle, Delete, ModeEdit } from '@mui/icons-material'
import TaskEditCard from './TaskEditCard'

export default function TaskEditor() {
    const { data, error, isLoading } = useGetActiveTasksQuery()
    const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false)
    const [editTaskModalOpen, setEditTaskModalOpen] = useState(false)
    const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false)

    const [patchDeactivateTask,] = useDeactivateTaskByIdMutation()

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
                                                                        setDeleteTaskDialogOpen(true)
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
                                                        <Dialog open={deleteTaskDialogOpen} onClose={() => setDeleteTaskDialogOpen(false)}>
                                                            <DialogTitle>Delete this Task?</DialogTitle>
                                                            <DialogContent>
                                                                <DialogContentText>
                                                                    This action may not be reversible
                                                                </DialogContentText>
                                                                <DialogActions>
                                                                    <Button onClick={() => {
                                                                        setDeleteTaskDialogOpen(false)
                                                                    }}>
                                                                        Disagree
                                                                    </Button>
                                                                    <Button onClick={() => {
                                                                        patchDeactivateTask(task.id)
                                                                        setDeleteTaskDialogOpen(false)
                                                                    }}>
                                                                        Agree
                                                                    </Button>
                                                                </DialogActions>
                                                            </DialogContent>
                                                        </Dialog>
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