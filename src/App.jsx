import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

const TOKEN_KEY = 'expenseTrackerToken'
const EMAIL_KEY = 'expenseTrackerEmail'

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? '')
  const [userEmail, setUserEmail] = useState(
    () => localStorage.getItem(EMAIL_KEY) ?? ''
  )

  const handleLogin = (nextToken, email) => {
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(EMAIL_KEY, email)
    setToken(nextToken)
    setUserEmail(email)
  }

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMAIL_KEY)
    setToken('')
    setUserEmail('')
  }

  return (
    <div className="app-shell">
      <Navbar isAuthenticated={Boolean(token)} onLogout={handleLogout} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage isAuthenticated={Boolean(token)} />} />
          <Route
            path="/login"
            element={
              token ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginForm onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              token ? <Navigate to="/dashboard" replace /> : <RegisterForm />
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={Boolean(token)}>
                <DashboardPage
                  token={token}
                  userEmail={userEmail}
                  onSessionExpired={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
