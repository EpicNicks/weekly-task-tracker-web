import { Navigate } from 'react-router-dom'
import { Button, Grid, TextField } from '@mui/material'
import styled from '@emotion/styled'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useAppSelector } from '../../redux/hooks'
import { usePostLoginMutation } from '../../redux/services/apiSlice'

const StyledTextField = styled(TextField)`
    margin: 0.25em;
    width: '300px';
`

const StyledSubmitButton = styled(Button)`
    margin-top: 0.5em;
    width: '300px';
`

// const useStyles = makeStyles((theme) => ({
//     form: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//     },
// }))

function Login() {
    const [postLogin,] = usePostLoginMutation()
    const token = useAppSelector(store => store.auth.token)

    if (token) {
        return <Navigate to="home" replace />
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
                <Grid 
                    container 
                    direction='column' 
                    alignItems='center' 
                    justifyContent='center' 
                    sx={{ minWidth: '0', minHeight: '97vh' }}
                    m='0 auto'
                >
                    <Grid item xs={12}>
                        <StyledTextField
                            required
                            id="username"
                            name='username'
                            label="Username"
                            type="username"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTextField
                            required
                            id="password"
                            name='password'
                            label="Password"
                            type="password"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container width="100%">
                            <Grid item xs={6}>
                                <StyledSubmitButton
                                    variant='contained'
                                    color='info'
                                >
                                    Register
                                </StyledSubmitButton>
                            </Grid>
                            <Grid item xs={6}>
                                <StyledSubmitButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Login
                                </StyledSubmitButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Formik >
        </>
    )
}

export default Login