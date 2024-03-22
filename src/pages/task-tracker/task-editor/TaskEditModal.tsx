
import { Modal, Box, Stack, Typography, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material'
import { Formik, Form } from 'formik'
import { match } from 'ts-pattern'
import * as Yup from 'yup'
import { randomRgbColor } from '../../../common/RandomFunctions'
import { useCreateNewTaskMutation, useLazyGetTaskByNameQuery, useUpdateTaskMutation } from '../../../redux/services/apiSlice'
import GenericErrorText from '../common/GenericErrorText'
import NumericField from '../common/daily-task-card/NumericField'
import { Task } from '../../../redux/responseTypes/Task'

interface TaskEditModalProps {
    createTaskModalOpen: boolean
    setCreateTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    initialValues?: Task
}

export default function TaskEditModal(props: TaskEditModalProps) {
    const {
        createTaskModalOpen,
        setCreateTaskModalOpen,
        initialValues
    } = props

    const [postCreateTask, createTaskResult] = useCreateNewTaskMutation()
    const [patchEditTask, editTaskResult] = useUpdateTaskMutation()
    const [getTaskByName,] = useLazyGetTaskByNameQuery()

    const taskMode = !initialValues ? 'CREATE' : 'EDIT'

    const modalStyles = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    }

    return (
        <Modal open={createTaskModalOpen} onClose={() => setCreateTaskModalOpen(false)}>
            <Formik
                initialValues={{
                    taskName: initialValues?.taskName ?? '',
                    rgbTaskColor: initialValues?.rgbTaskColor ? `#${initialValues?.rgbTaskColor?.substring(0, 6)}` : randomRgbColor('hex'),
                    target: (initialValues?.weeklyTargetMinutes ?? 0) / 60,
                    goalLength: 'weekly' as 'weekly' | 'daily' | 'monthly',
                    minuteHour: 'hour' as 'minute' | 'hour',
                }}
                onSubmit={({ taskName, rgbTaskColor, target, goalLength, minuteHour }) => {
                    const sanitizedTaskColor = rgbTaskColor.substring(1).toUpperCase().padEnd(8, 'F')
                    const weeklyTargetMinutes = (target ?? 0) * match(goalLength)
                        .with('daily', () => 7)
                        .with('weekly', () => 1)
                        .with('monthly', () => 1 / 4)
                        .exhaustive() * match(minuteHour)
                            .with('minute', () => 1)
                            .with('hour', () => 60)
                            .exhaustive()
                    if (taskMode === 'CREATE') {
                        postCreateTask({ taskName, rgbTaskColor: sanitizedTaskColor, weeklyTargetMinutes }).unwrap()
                            .then((res) => {
                                if (res.success) {
                                    setCreateTaskModalOpen(false)
                                }
                            })
                    }
                    else {
                        patchEditTask({
                            id: initialValues!.id,
                            taskName,
                            rgbTaskColor: sanitizedTaskColor,
                            weeklyTargetMinutes,
                            isActive: initialValues!.isActive,
                            userId: initialValues!.userId
                        }).unwrap()
                            .then((res) => {
                                if (res.success) {
                                    setCreateTaskModalOpen(false)
                                }
                            })
                    }
                }}
                validationSchema={
                    Yup.object().shape({
                        'taskName': Yup.string().required('Please give the task a name').max(20),
                        'rgbTaskColor': Yup.string().required(),
                        'target': Yup.number().nullable(),
                        'goalLength': Yup.string().required(),
                        'minuteHour': Yup.string().required(),
                    })
                }
            >
                {
                    formikProps => (
                        <Form>
                            <Box sx={{ ...modalStyles, borderLeft: `10px solid ${formikProps.values.rgbTaskColor}` }}>
                                <Stack direction="column" spacing={2}>
                                    <Typography variant="h5">{taskMode === 'CREATE' ? 'Create New Task' : 'Edit Task'}</Typography>
                                    <Stack direction="column">
                                        <TextField
                                            label="Task Name"
                                            name="taskName"
                                            value={formikProps.values.taskName}
                                            onChange={formikProps.handleChange}
                                            onBlur={(e) => {
                                                if (formikProps.values.taskName) {
                                                    getTaskByName(formikProps.values.taskName, true).unwrap()
                                                        .then((res) => {
                                                            if (res.success && res.value) {
                                                                formikProps.handleBlur(e)
                                                                formikProps.setFieldError('taskName', 'You already have a task with this name')
                                                            }
                                                        })
                                                }
                                                else {
                                                    formikProps.handleBlur(e)
                                                }
                                            }}
                                            disabled={createTaskResult.isLoading}
                                            inputProps={{
                                                maxLength: 20
                                            }}
                                        />
                                        <GenericErrorText formik={formikProps} fieldName="taskName" />
                                    </Stack>
                                    <Stack direction="row" spacing={2} pl={2}>
                                        <Typography>Task Color</Typography>
                                        <input
                                            type="color"
                                            name="rgbTaskColor"
                                            value={formikProps.values.rgbTaskColor}
                                            onChange={formikProps.handleChange}
                                            onBlur={formikProps.handleBlur}
                                            disabled={createTaskResult.isLoading || editTaskResult.isLoading}
                                        />
                                        <GenericErrorText formik={formikProps} fieldName="rgbTaskColor" />
                                    </Stack>
                                    <Grid container direction="row" alignItems="center" pl={2}>
                                        <Grid item xs={2}>
                                            <Typography>
                                                I want to do
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={1.25}>
                                            <NumericField
                                                name="target"
                                                value={formikProps.values.target}
                                                onChange={formikProps.handleChange}
                                                onBlur={formikProps.handleBlur}
                                                numericmode="decimal"
                                                max={
                                                    match(formikProps.values.goalLength)
                                                        .with('daily', () => 24 * 60)
                                                        .with('weekly', () => 24 * 7 * 60)
                                                        .with('monthly', () => 24 * 31 * 60)
                                                        .exhaustive()
                                                }
                                                size="small"
                                                inputProps={{
                                                    style: { textAlign: 'center' }
                                                }}
                                                disabled={createTaskResult.isLoading || editTaskResult.isLoading}
                                            />
                                            <GenericErrorText formik={formikProps} fieldName="target" />
                                        </Grid>
                                        <Grid item xs={2.75}>
                                            <FormControl fullWidth>
                                                <InputLabel id="minute-hour-select"></InputLabel>
                                                <Select
                                                    labelId="minute-hour-select"
                                                    name="minuteHour"
                                                    value={formikProps.values.minuteHour}
                                                    label=""
                                                    onChange={(e) => {
                                                        if (e.target.value === 'hour') {
                                                            formikProps.setFieldValue('target', formikProps.values.target / 60)
                                                        }
                                                        if (e.target.value === 'minute') {
                                                            formikProps.setFieldValue('target', formikProps.values.target * 60)
                                                        }
                                                        formikProps.handleChange(e)
                                                    }}
                                                    onBlur={formikProps.handleBlur}
                                                    size="small"
                                                    disabled={createTaskResult.isLoading || editTaskResult.isLoading}
                                                >
                                                    <MenuItem value="minute">minutes</MenuItem>
                                                    <MenuItem value="hour">hours</MenuItem>
                                                </Select>
                                                <GenericErrorText formik={formikProps} fieldName="goalLength" />
                                            </FormControl>
                                            <GenericErrorText formik={formikProps} fieldName="minuteHour" />
                                        </Grid>
                                        <Grid item xs={formikProps.values.taskName?.length > 0 ? Math.min(Math.max(formikProps.values.taskName?.length / 3, 2), 3) : 2}>
                                            <Typography>
                                                of {formikProps.values.taskName || '______'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="goal-length-select">Goal Length</InputLabel>
                                                <Select
                                                    labelId="goal-length-select"
                                                    name="goalLength"
                                                    value={formikProps.values.goalLength}
                                                    label="Goal Length"
                                                    onChange={formikProps.handleChange}
                                                    onBlur={formikProps.handleBlur}
                                                    size="small"
                                                    disabled={createTaskResult.isLoading || editTaskResult.isLoading}
                                                >
                                                    <MenuItem value="daily">Daily</MenuItem>
                                                    <MenuItem value="weekly">Weekly</MenuItem>
                                                    <MenuItem value="monthly">Monthly</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <GenericErrorText formik={formikProps} fieldName="goalLength" />
                                        </Grid>
                                    </Grid>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: formikProps.values.rgbTaskColor,
                                            '&:hover': {
                                                backgroundColor: formikProps.values.rgbTaskColor,
                                            }
                                        }}
                                        disabled={createTaskResult.isLoading || editTaskResult.isLoading}
                                        type="submit"
                                    >
                                        {taskMode === 'CREATE' ? 'Create Task' : 'Save Changes'}
                                    </Button>
                                </Stack>
                            </Box>
                        </Form>
                    )
                }
            </Formik>
        </Modal>
    )
}