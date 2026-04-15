import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import Card from '../components/Card'

const HomePage = ({ isAuthenticated }) => {
  return (
    <div>
      <section className="hero">
        <div>
          <p className="eyebrow">Personal finance, simplified</p>
          <h1>Track every dollar with a calmer workflow.</h1>
          <p>
            Keep your budget organized with one clean place to record spending,
            group purchases by category, and stay on top of your day-to-day
            money habits.
          </p>
          <div className="hero-actions">
            <Link to={isAuthenticated ? '/dashboard' : '/register'} className="primary-button">
              {isAuthenticated ? 'Open dashboard' : 'Start with an account'}
            </Link>
            <Link to="/login" className="secondary-button">
              Sign in
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <img src={heroImage} alt="Illustration of an expense tracking dashboard" />
        </div>
      </section>

      <section className="section-block">
        <p className="eyebrow">Everything in one place</p>
        <div className="features-grid">
          <Card
            title="Secure account access"
            description="Create your account, sign in securely, and keep your personal expense data tied to your profile."
          />
          <Card
            title="Smart organization"
            description="Create custom categories, sort purchases clearly, and keep your spending history easy to manage."
          />
          <Card
            title="Live expense tracking"
            description="Add, edit, search, and remove expenses from a focused dashboard built for everyday use."
          />
        </div>
      </section>
    </div>
  )
}

export default HomePage
