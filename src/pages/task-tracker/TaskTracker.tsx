import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../redux/hooks'
import PersistentLeftDrawer from './common/PersistentLeftDrawer'


// main actual app route, subroutes would go under here
export default function TaskTracker() {
    const token = useAppSelector(state => state.auth.token)

    // if (!token) {
    //     return <Navigate replace to="/login" />
    // }
    return (
        <PersistentLeftDrawer>
            <Outlet />
        </PersistentLeftDrawer>
    )
}