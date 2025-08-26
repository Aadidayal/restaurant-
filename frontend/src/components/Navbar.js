import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" onClick={closeMenu}>
            <h2>Bella Vista</h2>
          </Link>
        </div>
        
        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/menu" 
                className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Menu
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/about" 
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/reservations" 
                className={`nav-link ${location.pathname === '/reservations' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Reservations
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/contact" 
                className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Contact
              </Link>
            </li>
            {user ? (
              <>
                <li className="nav-item user-info">
                  <span>Welcome, {user.name}</span>
                </li>
                <li className="nav-item">
                  <button className="nav-link logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link 
                    to="/login" 
                    className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/signup" 
                    className={`nav-link ${location.pathname === '/signup' ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
