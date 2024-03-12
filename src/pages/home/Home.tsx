import { AppBar, Toolbar, Typography, Button, CircularProgress, Container, CssBaseline, Stack, Paper, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { useGetUserInfoQuery } from '../../redux/services/apiSlice'

const StyledRegisterButton = styled(Button)({
    color: 'white',
    border: '2px solid white',
    '&:hover': {
        backgroundColor: 'white',
        border: '2px solid #579ed1',
        color: 'black',
    },
})

// app landing and description and login button go here
function Home() {
    const { data, error, isFetching } = useGetUserInfoQuery()
    const navigate = useNavigate()

    const LoginView = () => {
        if (isFetching) {
            return (
                <>
                    <CircularProgress />
                </>
            )
        }
        else if (!data || !data.success || !!error) {
            return (
                <Stack direction="row" spacing={2}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            navigate('/login')
                        }}>
                        Login
                    </Button>
                    <StyledRegisterButton
                        color="primary"
                        variant="outlined"
                        onClick={() => {
                            navigate('/register')
                        }}
                    >
                        Register
                    </StyledRegisterButton>
                </Stack>
            )
        }
        else {
            return (
                <Stack direction="row" spacing={2}>
                    <Typography variant="subtitle1" sx={{ mr: 2 }}>
                        Welcome, {data.value.username}
                    </Typography>
                    <StyledRegisterButton
                        color="primary"
                        variant="outlined"
                        onClick={() => {

                        }}
                    >
                        Logout
                    </StyledRegisterButton>
                </Stack>
            )
        }
    }

    return (
        <>
            <CssBaseline />
            <AppBar sx={{ bgcolor: '#1f73ae' }} position="static">
                <Container maxWidth="lg">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            FreeTime (working title)
                        </Typography>
                        <LoginView />
                    </Toolbar>
                </Container>
            </AppBar>
            {/* Your main content goes here */}
            <Container maxWidth="lg">
                <Paper square>
                    <Grid container pt={10}>
                        <Grid item xs={12}>
                            <Typography variant="h4" textAlign="center">
                                A personal <span style={{ color: '#1f73ae' }}>weekly time tracker</span>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} pt={5}>
                            <Container maxWidth="sm">
                                <Typography variant="h6">
                                    For keeping track of all of those goals that take time to see results.<br /><br />
                                    For staying on top of those long-term goals that need consistency.<br /><br />
                                    With the flexibility of weekly goals instead of daily ones for days that you can give
                                    a lot more and for days that you need a break.
                                </Typography>
                            </Container>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </>
    )
}

export default Home