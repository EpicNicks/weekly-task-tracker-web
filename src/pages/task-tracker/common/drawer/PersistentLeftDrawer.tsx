import * as React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Typography from '@mui/material/Typography'
import { Container, Divider, List, ListItemButton, Stack } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { P, match } from 'ts-pattern'
import DailyViewAppbar from './DailyViewAppbar'
import { invalidateToken } from '../../../../redux/services/authSlice'

const drawerWidth = 200

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(0),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}))

interface AppBarProps extends MuiAppBarProps {
    open?: boolean
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}))

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}))

interface PersistentDrawerProps {
    children: React.ReactNode
}

export default function PersistentDrawer({ children }: PersistentDrawerProps) {
    const theme = useTheme()
    const location = useLocation()
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(false)

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    type ViewLocation = 'home' | 'today-view' | 'weekly-view' | 'task-editor' | 'account' | 'none'

    const currentView = match<typeof location, ViewLocation>(location)
        .with({ pathname: P.when(path => path.includes('today-view')) }, () => 'today-view' as const)
        .with({ pathname: P.when(path => path.includes('weekly-view')) }, () => 'weekly-view' as const)
        .with({ pathname: P.when(path => path.includes('task-editor')) }, () => 'task-editor' as const)
        .with({ pathname: P.when(path => path.includes('account')) }, () => 'account' as const)
        .with({ pathname: P.when(path => path.includes('home')) }, () => 'home' as const)
        .otherwise(() => 'none' as const)

    const drawerTitle =
        match(currentView)
            .with('today-view', () => 'Today\'s Tasks')
            .with('weekly-view', () => 'Weekly View')
            .with('task-editor', () => 'Task Editor')
            .with('account', () => 'Account Management')
            .with('home', () => 'Going Home...')
            .with('none', () => '')
            .exhaustive()

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Container maxWidth="lg">
                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                            <Typography variant="h5" noWrap component="div">
                                {drawerTitle}
                            </Typography>
                            {
                                match(currentView)
                                    .with('today-view', () => <DailyViewAppbar />)
                                    .otherwise(() => <></>)
                            }
                        </Stack>
                    </Container>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItemButton
                        selected={false}
                        onClick={() => {
                            handleDrawerClose()
                            navigate('/home')
                        }}
                    >
                        <Typography textAlign="center" width="100%">
                            Home
                        </Typography>
                    </ListItemButton>
                    <ListItemButton
                        selected={currentView === 'today-view'}
                        onClick={() => {
                            handleDrawerClose()
                            navigate('/task-tracker/today-view')
                        }}
                    >
                        <Typography textAlign="center" width="100%">
                            Today's Tasks
                        </Typography>
                    </ListItemButton>
                    <ListItemButton
                        selected={currentView === 'weekly-view'}
                        onClick={() => {
                            handleDrawerClose()
                            navigate('/task-tracker/weekly-view')
                        }}
                    >
                        <Typography textAlign="center" width="100%">
                            Weekly View
                        </Typography>
                    </ListItemButton>
                    <ListItemButton
                        selected={currentView === 'task-editor'}
                        onClick={() => {
                            handleDrawerClose()
                            navigate('/task-tracker/task-editor')
                        }}
                    >
                        <Typography textAlign="center" width="100%">
                            Task Editor
                        </Typography>
                    </ListItemButton>
                    <ListItemButton
                        selected={currentView === 'account'}
                        onClick={() => {
                            handleDrawerClose()
                            navigate('/task-tracker/account')
                        }}
                    >
                        <Typography textAlign="center" width="100%">
                            Account Management
                        </Typography>
                    </ListItemButton>
                    <ListItemButton
                        sx={{
                            backgroundColor: 'pink',
                            '&:hover': {
                                backgroundColor: 'red',
                                color: 'white'
                            }
                        }}
                        selected={currentView === 'account'}
                        onClick={() => {
                            navigate('/home')
                            invalidateToken()
                        }}
                    >
                        <Typography textAlign="center" width="100%">
                            Logout
                        </Typography>
                    </ListItemButton>
                </List>
            </Drawer>
            <Main open={open}>
                {/* Probably only uses the header here for exact top padding */}
                <DrawerHeader />
                {children}
            </Main>
        </Box>
    )
}
