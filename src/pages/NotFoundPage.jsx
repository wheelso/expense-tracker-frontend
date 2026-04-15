import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Page not found</p>
        <h1>That page does not exist.</h1>
        <p className="auth-copy">
          The link may be broken, or the page may have been moved. Head back to
          the home page or jump into your dashboard.
        </p>
        <div className="hero-actions">
          <Link to="/" className="primary-button">
            Go home
          </Link>
          <Link to="/dashboard" className="secondary-button">
            Open dashboard
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NotFoundPage
