import { AddCircle } from '@mui/icons-material'
import { Tooltip, IconButton, Modal, Box, Typography, Grid } from '@mui/material'
import { useState } from 'react'
import { DailyTaskCardProps } from './DailyTaskCard'
import NumericField from './NumericField'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'

interface TaskLogButtonProps {
    addCircleProps?: typeof AddCircle
    taskProps: DailyTaskCardProps
}

export default function TaskLogButton(props: TaskLogButtonProps) {
    const {
        addCircleProps = {},
        taskProps,
    } = props

    const [modalOpen, setModalOpen] = useState<boolean>(false)

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
                onClose={() => setModalOpen(false)}
            >
                <Formik
                    initialValues={{
                        hours: Math.floor(taskProps.minutesLogged / 60).toString(),
                        minutes: Math.floor(taskProps.minutesLogged % 60).toString(),
                    }}
                    onSubmit={(values) => {
                        // TODO submit
                        if (!values.hours && !values.minutes) {
                            // don't bother updating the time
                        }
                    }}
                    validationSchema={Yup.object().shape({
                        hours: Yup.string().nullable(),
                        minutes: Yup.string().nullable(),
                    })}
                >
                    {
                        formikProps => (
                            <Form>
                                <Box sx={modalStyles} m={0}>
                                    <Typography variant="h4" pb={2}>
                                        {taskProps.taskName}
                                    </Typography>
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
                                                onBlur={formikProps.handleBlur}
                                                numericmode="integer"
                                                max={60}
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
                                </Box>
                            </Form>
                        )
                    }
                </Formik>
            </Modal >
        </>
    )
}