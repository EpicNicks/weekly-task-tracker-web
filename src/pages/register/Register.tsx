import { Button, Container, Grid, Paper, TextField, Typography } from '@mui/material'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useLazyGetIsUsernameAvailableQuery, usePostLoginMutation, usePostRegisterUserMutation } from '../../redux/services/apiSlice'
import { useNavigate } from 'react-router-dom'
import GenericErrorText from '../task-tracker/common/GenericErrorText'

const scrollAnimation = keyframes`
    0% {
        background-position: 0%;
    }
    50% {
        background-position: 100%;
    }
    100% {
        background-position: 0%;
    }
`

const StyledPaper = styled(Paper)`
  background-color: ${(props) => props.color};
  padding: 20px;
`

const StyledTextField = styled(TextField)`
    margin: 0.25em;
    /* width: 300px; */
`

const StyledSubmitButton = styled(Button)`
    margin: 0.25em;
    /* margin-top: 0.5em; */
    /* width: 300px; */
`

const StyledDiv = styled.div`
    background: linear-gradient(141deg, #579ed1 0%, #1fc8db 25%, #579ed1 50%);
    background-size: 400% 400%;
    margin: 0 0;
    width: 100%;
    height: 100%;
    animation: ${scrollAnimation} 15s linear infinite;
`

export default function Register() {
    const [postRegister, registerResult] = usePostRegisterUserMutation()
    const [postLogin,] = usePostLoginMutation()
    const [getUsernameTaken,] = useLazyGetIsUsernameAvailableQuery()
    const navigate = useNavigate()

    return (
        <>
            <StyledDiv>
                <Container
                    maxWidth="xs"
                >
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        minHeight="100vh"
                        spacing={1}
                    >
                        <Paper elevation={1}>
                            <Formik
                                initialValues={{
                                    username: '',
                                    password: '',
                                    reenteredPassword: '',
                                }}
                                onSubmit={({ username, password }, formikBag) => {
                                    getUsernameTaken(username, true).unwrap().then((res) => {
                                        if (res.success && !res.value) {
                                            postRegister({ username, password }).unwrap().then((res) => {
                                                if (res.success) {
                                                    postLogin({ username, password }).unwrap().then((res) => {
                                                        if (res.success) {
                                                            navigate('/task-tracker')
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                        else {
                                            formikBag.setFieldError('username', 'Username is already taken')
                                        }
                                    })
                                }}
                                validationSchema={Yup.object().shape({
                                    username: Yup.string().required('Please enter a username'),
                                    password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Please enter a password'),
                                    reenteredPassword: Yup.string()
                                        .required('Please enter your password and then re-enter your password here')
                                        .oneOf([Yup.ref('password')], 'Passwords do not match')
                                        .when('password', {
                                            is: (password: string) => !!password && password.length > 0,
                                            then: () => Yup.string()
                                                .required('Please re-enter your password')
                                                .oneOf([Yup.ref('password')], 'Passwords do not match')
                                        })
                                })}
                            >
                                {
                                    formikProps => (
                                        <Form>
                                            <Grid
                                                container
                                                direction="column"
                                                justifyContent="center"
                                                spacing={1}
                                                pt="50px"
                                                pb="50px"
                                            >
                                                <Grid item pb={4}>
                                                    <Container>
                                                        <StyledPaper color="#1f73ae">
                                                            <Typography variant="h3" color="white" textAlign="center">
                                                                FreeTime
                                                            </Typography>
                                                        </StyledPaper>
                                                    </Container>
                                                </Grid>
                                                <Grid item xs={12} pb={4}>
                                                    <Typography variant="h6" textAlign="center">
                                                        Create your account
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Container>
                                                        <StyledTextField
                                                            id="username"
                                                            name="username"
                                                            onChange={formikProps.handleChange}
                                                            onBlur={() => {
                                                                getUsernameTaken(formikProps.values.username, true).unwrap()
                                                                    .then((res) => {
                                                                        if (res.success && res.value) {
                                                                            formikProps.setFieldError('username', 'Username is already taken')
                                                                        }
                                                                    })
                                                            }}
                                                            label="Username"
                                                            type="username"
                                                            variant="outlined"
                                                            fullWidth
                                                            disabled={registerResult.isLoading}
                                                        />
                                                        <GenericErrorText fieldName="username" formik={formikProps} />
                                                    </Container>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Container>
                                                        <StyledTextField
                                                            id="password"
                                                            name="password"
                                                            onChange={formikProps.handleChange}
                                                            onBlur={formikProps.handleBlur}
                                                            label="Password"
                                                            type="password"
                                                            variant="outlined"
                                                            fullWidth
                                                            disabled={registerResult.isLoading}
                                                        />
                                                        <GenericErrorText fieldName="password" formik={formikProps} />
                                                    </Container>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Container>
                                                        <StyledTextField
                                                            id="reenteredPassword"
                                                            name="reenteredPassword"
                                                            onChange={formikProps.handleChange}
                                                            onBlur={formikProps.handleBlur}
                                                            label="Re-enter your password"
                                                            type="password"
                                                            variant="outlined"
                                                            fullWidth
                                                            disabled={registerResult.isLoading}
                                                        />
                                                        <GenericErrorText fieldName="reenteredPassword" formik={formikProps} />
                                                    </Container>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Container>
                                                        <StyledSubmitButton
                                                            type="submit"
                                                            variant="contained"
                                                            color="primary"
                                                            fullWidth
                                                            disabled={registerResult.isLoading}
                                                        >
                                                            Login
                                                        </StyledSubmitButton>
                                                    </Container>
                                                </Grid>
                                            </Grid>
                                        </Form>
                                    )
                                }
                            </Formik >
                        </Paper>
                    </Grid>
                </Container>
            </StyledDiv>
        </>
    )
}
