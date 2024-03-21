import { AddCircle } from '@mui/icons-material'
import { Tooltip, IconButton, Modal, Box, Typography, Grid, Button, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import NumericField from './NumericField'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { match } from 'ts-pattern'
import { useCreateLogMutation, useUpdateLogMinutesMutation } from '../../../../redux/services/apiSlice'

interface TaskLogButtonProps {
    addCircleProps?: typeof AddCircle
    taskProps: {
        taskId: number,
        taskName: string
        minutesLogged: number
    },
    logButtonType: 'CREATE' | 'UPDATE'
}

export default function TaskLogButton(props: TaskLogButtonProps) {
    const {
        addCircleProps = {},
        taskProps,
        logButtonType,
    } = props

    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [isStopwatchActive, setIsStopwatchActive] = useState(false)
    const [isStopwatchPaused, setIsStopwatchPaused] = useState(false)
    const [time, setTime] = useState(0)

    const [postCreateLog,] = useCreateLogMutation()
    const [patchUpdateLogMinutes,] = useUpdateLogMinutesMutation()

    useEffect(() => {
        let interval: number | undefined = undefined

        if (isStopwatchActive && isStopwatchPaused === false) {
            interval = setInterval(() => {
                setTime((time) => time + 10)
            }, 10)
        } else {
            clearInterval(interval)
        }
        return () => {
            clearInterval(interval)
        }
    }, [isStopwatchActive, isStopwatchPaused])

    const handleStart = () => {
        setIsStopwatchActive(true)
        setIsStopwatchPaused(false)
    }

    const handlePauseResume = () => {
        setIsStopwatchPaused(!isStopwatchPaused)
    }

    const handleReset = () => {
        setIsStopwatchPaused(false)
        setIsStopwatchActive(false)
        setTime(0)
    }

    const initialMinutesLogged = taskProps.minutesLogged

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
        <>
            <Tooltip title="Log Time Spent">
                <IconButton onClick={() => {
                    setModalOpen(true)
                }}>
                    <AddCircle sx={{ fontSize: '50px', color: 'black' }} {...addCircleProps} />
                </IconButton>
            </Tooltip>
            <Modal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false)
                }}
            >

                <Box sx={modalStyles} m={0}>
                    <Formik
                        initialValues={{
                            hours: Math.floor(initialMinutesLogged / 60).toString(),
                            minutes: Math.floor(initialMinutesLogged % 60).toString(),
                        }}
                        onSubmit={({ hours, minutes }) => {
                            // TODO submit
                            if (!hours && !minutes) {
                                // don't bother updating the time
                                setModalOpen(false)
                                return
                            }
                            if ((Number(hours) * 60 + Number(minutes)) === initialMinutesLogged) {
                                // numbers weren't updated
                                setModalOpen(false)
                                return
                            }
                            if (logButtonType === 'CREATE') {
                                postCreateLog({
                                    logDate: new Date(),
                                    dailyTimeMinutes: Number(hours) * 60 + Number(minutes),
                                    taskId: taskProps.taskId,
                                }).unwrap().then(() => {
                                    setModalOpen(false)
                                })
                            }
                            else if (logButtonType === 'UPDATE') {
                                patchUpdateLogMinutes({
                                    date: new Date(),
                                    dailyTimeMinutes: Number(hours) * 60 + Number(minutes),
                                    taskId: taskProps.taskId,
                                }).unwrap().then(() => {
                                    setModalOpen(false)
                                })
                            }
                        }}
                        validationSchema={Yup.object({
                            hours: Yup.string().nullable(),
                            minutes: Yup.string().nullable(),
                        })}
                    >
                        {
                            formikProps => (
                                <Form>
                                    <Grid container direction="column">
                                        <Grid item xs={12}>
                                            <Typography variant="h4" pb={2}>
                                                {taskProps.taskName}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container direction="row" spacing={2} alignItems="center">
                                                <Grid item xs={4}>
                                                    <Typography variant="h6">Time logged:</Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <NumericField
                                                        name="hours"
                                                        value={formikProps.values.hours}
                                                        onChange={formikProps.handleChange}
                                                        onBlur={formikProps.handleBlur}
                                                        numericmode="integer"
                                                        max={23}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        inputProps={{
                                                            style: {
                                                                fontSize: '22px'
                                                            }
                                                        }}
                                                        InputProps={{
                                                            endAdornment: <Typography>h</Typography>
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <NumericField
                                                        name="minutes"
                                                        value={formikProps.values.minutes}
                                                        onChange={formikProps.handleChange}
                                                        onBlur={(e) => {
                                                            if (Number(e.target.value) >= 60) {
                                                                const { minutes, hours } = formikProps.values
                                                                const minutesToSet = Math.floor(Number(minutes) % 60)
                                                                const hoursToSet = Math.min(24, Number(hours) + Math.floor(Number(minutes) / 60))
                                                                formikProps.setFieldValue('hours', hoursToSet.toString())
                                                                formikProps.setFieldValue('minutes', minutesToSet.toString())
                                                                e.target.value = minutesToSet.toString()
                                                                console.log(minutes, minutesToSet)
                                                                return
                                                            }
                                                            formikProps.setFieldValue('minutes', e.target.value)
                                                        }}
                                                        numericmode="integer"
                                                        max={60 * 24}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        inputProps={{
                                                            style: {
                                                                fontSize: '22px'
                                                            }
                                                        }}
                                                        InputProps={{
                                                            endAdornment: <Typography>m</Typography>
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} pt={4}>
                                            <Grid container id="task-stopwatch-container" direction="column">
                                                <Grid item>
                                                    <Typography variant="h5">Time your task with stopwatch</Typography>
                                                </Grid>
                                                <Grid item pl={1}>
                                                    <Box sx={{ outlineWidth: '2px', outlineColor: isStopwatchPaused ? 'black' : 'red' }}>
                                                        <Typography variant="h6" color={isStopwatchPaused ? 'blue' : 'black'}>
                                                            {/* hours, minutes, seconds, milliseconds */}
                                                            {('0' + Math.floor((time / 3_600_000) % 60)).slice(-2)}:
                                                            {('0' + Math.floor((time / 60_000) % 60)).slice(-2)}:
                                                            {('0' + Math.floor((time / 1000) % 60)).slice(-2)}:
                                                            {('0' + ((time / 10) % 100)).slice(-2)}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item>
                                                    <Stack direction="row" alignItems="center" spacing={5}>
                                                        {
                                                            match(isStopwatchPaused)
                                                                .with(false, () => (
                                                                    <>
                                                                        {!isStopwatchActive &&
                                                                            <Button onClick={handleStart}>
                                                                                Start
                                                                            </Button>
                                                                        }
                                                                        <Button onClick={handlePauseResume}>
                                                                            Pause
                                                                        </Button>
                                                                    </>
                                                                ))
                                                                .with(true, () => (
                                                                    <>
                                                                        <Button onClick={handlePauseResume}>
                                                                            Resume
                                                                        </Button>
                                                                        <Button onClick={handleReset}>
                                                                            Reset
                                                                        </Button>
                                                                        <Button
                                                                            disabled={Math.floor(time / 60_000) <= 0}
                                                                            onClick={() => {
                                                                                const hoursToAdd = Math.floor(time / 3_600_000)
                                                                                const minutesToAdd = Math.floor(time / 60_000)
                                                                                formikProps.setFieldValue('hours', (Number(formikProps.values.hours) + hoursToAdd).toString())
                                                                                formikProps.setFieldValue('minutes', (Number(formikProps.values.minutes) + minutesToAdd).toString())
                                                                                if (hoursToAdd !== 0 || minutesToAdd !== 0) {
                                                                                    handleReset()
                                                                                }
                                                                            }}>
                                                                            Add to Tracked Time
                                                                        </Button>
                                                                    </>
                                                                ))
                                                                .exhaustive()
                                                        }
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} alignSelf="end" pt={2}>
                                            <Button variant="contained" type="submit">
                                                Submit
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Form>
                            )
                        }
                    </Formik>
                </Box>
            </Modal >
        </>
    )
}