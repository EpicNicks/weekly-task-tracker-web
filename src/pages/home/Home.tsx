import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../redux/hooks'

function Home(){
    const token = useAppSelector(store => store.auth.token)
    if (!token){
        return <Navigate to='/login' replace/>
    }
    return (
        <>
            <div>
                hello
            </div>
        </>
    )
}

export default Home