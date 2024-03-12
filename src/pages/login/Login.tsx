import { Navigate } from 'react-router-dom'
import { Button, Container, Grid, Paper, TextField, Typography } from '@mui/material'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useAppSelector } from '../../redux/hooks'
import { usePostLoginMutation } from '../../redux/services/apiSlice'

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

function Login() {
    const [postLogin, loginResult] = usePostLoginMutation()
    const token = useAppSelector(store => store.auth.token)

    if (token) {
        return <Navigate to="task-tracker" replace />
    }
    return (
        <>
            <Formik
                initialValues={{
                    username: '',
                    password: ''
                }}
                onSubmit={({ username, password }) => {
                    postLogin({ username, password })
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string().required(),
                    password: Yup.string().required(),
                })}
            >
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
                                            Log in to continue
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Container>
                                            <StyledTextField
                                                required
                                                id="username"
                                                name="username"
                                                label="Username"
                                                type="username"
                                                variant="outlined"
                                                fullWidth
                                                disabled={loginResult.isLoading}
                                            />
                                        </Container>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Container>
                                            <StyledTextField
                                                required
                                                id="password"
                                                name="password"
                                                label="Password"
                                                type="password"
                                                variant="outlined"
                                                fullWidth
                                                disabled={loginResult.isLoading}
                                            />
                                        </Container>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Container>
                                            <StyledSubmitButton
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                disabled={loginResult.isLoading}
                                            >
                                                Login
                                            </StyledSubmitButton>
                                        </Container>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Container>
                </StyledDiv>
            </Formik >
        </>
    )
}

export default Login