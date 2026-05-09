import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import GoalsPage from './pages/GoalsPage'
import GoalDetailPage from './pages/GoalDetailPage'
import CreateGoalPage from './pages/CreateGoalPage'
import PetPage from './pages/PetPage'
import ChallengePage from './pages/ChallengePage'
import ArchivePage from './pages/ArchivePage'
import ProfilePage from './pages/ProfilePage'
import HabitsPage from './pages/HabitsPage'
import Layout from './components/ui/Layout'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="text-center animate-fade-in">
        <div className="text-6xl mb-4 animate-float">🫙</div>
        <p className="font-display text-2xl text-primary-500">DreamJar</p>
        <p className="text-gray-400 mt-2 text-sm">Loading your dreams...</p>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return children
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            style: { borderRadius: '16px', fontFamily: 'Nunito', fontWeight: 600 },
            success: { style: { background: '#D1FAE5', color: '#065F46' } },
            error: { style: { background: '#FEE2E2', color: '#991B1B' } },
          }}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/goals/new" element={<CreateGoalPage />} />
            <Route path="/goals/:id" element={<GoalDetailPage />} />
            <Route path="/pet" element={<PetPage />} />
            <Route path="/challenges" element={<ChallengePage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
