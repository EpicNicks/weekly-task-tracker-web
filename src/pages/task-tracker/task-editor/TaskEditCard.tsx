import { useState } from 'react'
import { ModeEdit, Delete } from '@mui/icons-material'
import { Card, Stack, Typography, Box, Tooltip, IconButton, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from '@mui/material'
import { Task } from '../../../redux/responseTypes/Task'
import TaskEditModal from './TaskEditModal'
import { useDeactivateTaskByIdMutation, useGetTaskProgressQuery } from '../../../redux/services/apiSlice'


interface TaskEditCardProps {
    task: Task
}

export default function TaskEditCard({ task }: TaskEditCardProps) {
    const [editTaskModalOpen, setEditTaskModalOpen] = useState(false)
    const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false)
    const { data, error, isLoading } = useGetTaskProgressQuery(task.id)
    const [patchDeactivateTask,] = useDeactivateTaskByIdMutation()

    function TotalProgressComponent() {
        function timeString(minutesLogged: number) {
            const hours = Math.floor(minutesLogged / 60)
            const minutes = Math.floor(minutesLogged % 60)
            return `${hours > 0 ? `${hours} hours and` : ''} ${minutes} minutes`
        }
        if (isLoading) {
            return <CircularProgress />
        }
        if (!data || !data.success || error) {
            return <Typography>An Unexpected Error Has Occurred</Typography>
        }
        return <Typography variant="h6">{timeString(data.value)}</Typography>
    }

    return (
        <Card
            variant="elevation"
            sx={{
                borderLeft: `10px solid #${task.rgbTaskColor}`
            }}
        >
            <Stack direction="column">
                <Stack direction="row" alignItems="center" justifyContent="space-between" m={2}>
                    <Stack direction="column">
                        <Typography variant="h5">{task.taskName}</Typography>
                        <Typography variant="h6">Weekly Goal: {task.weeklyTargetMinutes / 60} hours</Typography>
                    </Stack>
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
                </Stack>
                <Divider />
                <Stack direction="row" ml={2} mt={1} mb={1} spacing={1}>
                    <Typography variant="h6">Total Progress:</Typography>
                    <TotalProgressComponent />
                </Stack>
            </Stack>
            <TaskEditModal
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
                            No
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                patchDeactivateTask(task.id)
                                setDeleteTaskDialogOpen(false)
                            }}
                        >
                            Yes
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
