import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <>
      <nav className="navbar">
        <h1 className="navbar-title">Expense Tracker</h1>
        <ul className="navbar-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#login">Login</a></li>
          <li><a href="#register">Register</a></li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
