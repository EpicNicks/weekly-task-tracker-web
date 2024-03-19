import { Navigate, Outlet } from 'react-router-dom'
import PersistentLeftDrawer from './common/drawer/PersistentLeftDrawer'
import { getUserToken } from '../../redux/services/authSlice'

// main actual app route, subroutes would go under here
export default function TaskTracker() {
    const token = getUserToken()

    if (!token) {
        return <Navigate replace to="/login" />
    }
    return (
        <PersistentLeftDrawer>
            <Outlet />
        </PersistentLeftDrawer>
    )
}