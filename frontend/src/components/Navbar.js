import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
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
