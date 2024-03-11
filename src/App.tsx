import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import { ErrorBoundary } from './pages/ErrorBoundary'

function App() {

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Navigate replace to='/home' />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
