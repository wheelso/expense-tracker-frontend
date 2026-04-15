import { NavLink } from 'react-router-dom'
import './Navbar.css'

const Navbar = ({ isAuthenticated, onLogout }) => {
  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-brand">
        Penny Pilot
      </NavLink>
      <nav className="navbar-links" aria-label="Main navigation">
        <NavLink to="/" className="navbar-link">
          Home
        </NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard" className="navbar-link">
              Dashboard
            </NavLink>
            <button type="button" className="navbar-button" onClick={onLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="navbar-link">
              Login
            </NavLink>
            <NavLink to="/register" className="navbar-cta">
              Create account
            </NavLink>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar
