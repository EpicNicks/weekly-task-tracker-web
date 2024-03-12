import { BrowserRouter, Routes, Route, Navigate, Outlet, } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import WeeklyView from './pages/task-tracker/weekly-view/WeeklyView'
import PersistentLeftDrawer from './pages/task-tracker/common/PersistentLeftDrawer'
import TaskEditor from './pages/task-tracker/task-editor/TaskEditor'
// import { ErrorBoundary } from './pages/ErrorBoundary'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/task-tracker" element={<PersistentLeftDrawer><Outlet /></PersistentLeftDrawer>}>
          <Route index element={<Navigate to="/task-tracker/weekly-view" replace />} />
          <Route path="/task-tracker/weekly-view" element={<WeeklyView />} />
          <Route path="/task-tracker/task-editor" element={<TaskEditor />} />
        </Route>
        <Route path="*" element={<Navigate replace to="/home" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
