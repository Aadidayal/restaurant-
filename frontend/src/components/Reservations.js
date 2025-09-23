import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Reservations.css';

const Reservations = ({ user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitType, setSubmitType] = useState(''); // 'success' or 'error'

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="reservations">
        <div className="container">
          <div className="login-prompt">
            <h2>Please Login to Make a Reservation</h2>
            <p>You need to be logged in to make a table reservation at Rahul Sir Da Dhaba.</p>
            <div className="auth-buttons">
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/signup" className="btn-secondary">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/reservation', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setSubmitType('success');
        setSubmitMessage(response.data.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          guests: '2',
          message: ''
        });
      }
    } catch (error) {
      setSubmitType('error');
      if (error.response?.status === 401) {
        setSubmitMessage('Your session has expired. Please login again.');
      } else {
        setSubmitMessage('Sorry, there was an error processing your reservation. Please try again or call us directly.');
      }
      console.error('Reservation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date for minimum date selection
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="reservations">
      <div className="reservations-hero">
        <div className="container">
          <h1>Make a Reservation</h1>
          <p>Reserve your table for an unforgettable dining experience</p>
        </div>
      </div>

      <div className="reservations-content">
        <div className="container">
          
          <div className="grid grid-2">
            
            {/* Reservation Form */}
            <div className="reservation-form-section">
              <div className="form-container">
                <h2>Book Your Table</h2>
                
                {submitMessage && (
                  <div className={`alert alert-${submitType}`}>
                    {submitMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="reservation-form">
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="grid grid-3">
                    <div className="form-group">
                      <label htmlFor="date">Date *</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="form-control"
                        min={today}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="time">Time *</label>
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      >
                        <option value="">Select Time</option>
                        <option value="5:00 PM">5:00 PM</option>
                        <option value="5:30 PM">5:30 PM</option>
                        <option value="6:00 PM">6:00 PM</option>
                        <option value="6:30 PM">6:30 PM</option>
                        <option value="7:00 PM">7:00 PM</option>
                        <option value="7:30 PM">7:30 PM</option>
                        <option value="8:00 PM">8:00 PM</option>
                        <option value="8:30 PM">8:30 PM</option>
                        <option value="9:00 PM">9:00 PM</option>
                        <option value="9:30 PM">9:30 PM</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="guests">Number of Guests *</label>
                      <select
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Special Requests</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Any special dietary requirements, celebrations, or seating preferences..."
                      rows="4"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className={`btn btn-submit ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Reserve Table'}
                  </button>
                </form>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="restaurant-info-section">
              <div className="info-container">
                <h2>Restaurant Information</h2>
                
                <div className="info-item">
                  <h3>📍 Location</h3>
                  <p>Chitkara University<br />Rajpura<br />Punjab</p>
                </div>

                <div className="info-item">
                  <h3>📞 Contact</h3>
                  <p>Phone: (9877)-540-341<br />Email: info@dhaba.com</p>
                </div>

                <div className="info-item">
                  <h3>🕐 Hours</h3>
                  <div className="hours-list">
                    <div className="hours-row">
                      <span>Monday - Thursday</span>
                      <span>5:00 PM - 10:00 PM</span>
                    </div>
                    <div className="hours-row">
                      <span>Friday - Saturday</span>
                      <span>5:00 PM - 11:00 PM</span>
                    </div>
                    <div className="hours-row">
                      <span>Sunday</span>
                      <span>4:00 PM - 9:00 PM</span>
                    </div>
                  </div>
                </div>

                <div className="info-item">
                  <h3>ℹ️ Reservation Policy</h3>
                  <ul>
                    <li>Reservations are recommended, especially on weekends</li>
                    <li>Parties of 8 or more require a phone confirmation</li>
                    <li>Please arrive within 15 minutes of your reservation time</li>
                    <li>Cancellations appreciated with 2 hours notice</li>
                  </ul>
                </div>

                <div className="info-item">
                  <h3>🎉 Special Events</h3>
                  <p>We accommodate private parties, corporate events, and special celebrations. Contact us for custom arrangements.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
