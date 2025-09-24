import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="grid grid-4">
            
            {/* Restaurant Info */}
            <div className="footer-section">
              <h3>Rahul Sir Da Dhaba</h3>
              <p>
                Authentic Indian cuisine served with passion and tradition since 1985. 
                Experience the taste of India in every bite.
              </p>
              <div className="social-links">
                <a href="#" className="social-link">📘</a>
                <a href="#" className="social-link">📷</a>
                <a href="#" className="social-link">🐦</a>
                <a href="#" className="social-link">⭐</a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/menu">Menu</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/reservations">Reservations</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h4>Contact Info</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="icon">📍</span>
                  <span>Chitkara University<br />Rajpura<br />Punjab</span>
                </div>
                <div className="contact-item">
                  <span className="icon">📞</span>
                  <span>(9877)-540-341</span>
                </div>
                <div className="contact-item">
                  <span className="icon">✉️</span>
                  <span>info@dhaba.com</span>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="footer-section">
              <h4>Opening Hours</h4>
              <div className="hours-info">
                <div className="hours-item">
                  <span className="day">Monday - Thursday</span>
                  <span className="time">5:00 PM - 10:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="day">Friday - Saturday</span>
                  <span className="time">5:00 PM - 11:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="day">Sunday</span>
                  <span className="time">4:00 PM - 9:00 PM</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} Rahul Sir Da Dhaba. All rights reserved.</p>
            </div>
            <div className="footer-links-bottom">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
