import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import WeeklyView from './pages/task-tracker/weekly-view/WeeklyView'
import TaskEditor from './pages/task-tracker/task-editor/TaskEditor'
import TaskTracker from './pages/task-tracker/TaskTracker'
import TodayView from './pages/task-tracker/today-view/TodayView'
import AccountManagement from './pages/account-management/AccountManagement'
// import { ErrorBoundary } from './pages/ErrorBoundary'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/task-tracker" element={<TaskTracker />}>
          <Route index element={<Navigate to="/task-tracker/today-view" replace />} />
          <Route path="/task-tracker/today-view" element={<TodayView />} />
          <Route path="/task-tracker/weekly-view" element={<WeeklyView />} />
          <Route path="/task-tracker/task-editor" element={<TaskEditor />} />
          <Route path="/task-tracker/account" element={<AccountManagement />} />
          <Route path="/task-tracker/*" element={<Navigate replace to="/task-tracker" />} />
        </Route>
        <Route path="*" element={<Navigate replace to="/home" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
