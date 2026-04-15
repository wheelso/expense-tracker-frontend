import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginUser } from '../lib/api'

const LoginForm = ({ onLogin }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const successMessage = location.state?.message ?? ''

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await loginUser(formData)
      onLogin(response.token, formData.email)
      navigate('/dashboard', { replace: true })
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Log in to manage your spending.</h1>
        <p className="auth-copy">
          Sign in to review your recent activity, update categories, and stay in
          control of your budget from one dashboard.
        </p>

        {successMessage ? (
          <div className="status-banner status-success">{successMessage}</div>
        ) : null}
        {error ? <div className="status-banner status-error">{error}</div> : null}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </label>

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          Need an account? <Link to="/register">Create one here.</Link>
        </p>
      </div>
    </section>
  )
}

export default LoginForm
