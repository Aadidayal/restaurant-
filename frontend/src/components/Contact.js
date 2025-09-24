import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitType, setSubmitType] = useState(''); // 'success' or 'error'

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
      const response = await axios.post('http://localhost:3000/api/contact', formData);
      
      if (response.data.success) {
        setSubmitType('success');
        setSubmitMessage(response.data.message);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      setSubmitType('error');
      setSubmitMessage('Sorry, there was an error sending your message. Please try again or contact us directly.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact">
      <div className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with us!</p>
        </div>
      </div>

      <div className="contact-content">
        <div className="container">
          
          <div className="grid grid-2">
            
            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="form-container">
                <h2>Send us a Message</h2>
                
                {submitMessage && (
                  <div className={`alert alert-${submitType}`}>
                    {submitMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label htmlFor="name">Your Name *</label>
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
                    <label htmlFor="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Reservation Question">Reservation Question</option>
                      <option value="Event Planning">Event Planning</option>
                      <option value="Catering">Catering</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Complaint">Complaint</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Please tell us how we can help you..."
                      rows="6"
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className={`btn btn-submit ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="contact-info-section">
              <div className="info-container">
                <h2>Get in Touch</h2>
                
                <div className="contact-methods">
                  <div className="contact-item">
                    <div className="contact-icon">📍</div>
                    <div className="contact-details">
                      <h3>Visit Us</h3>
                      <p>Chitkara University<br />Rajpura<br />Punjab</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">📞</div>
                    <div className="contact-details">
                      <h3>Call Us</h3>
                      <p>Main: (9877)-540-341<br />Reservations: (555)-547-222</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">✉️</div>
                    <div className="contact-details">
                      <h3>Email Us</h3>
                      <p>General: info@dhaba.com<br />Events: events@rahulsirdadhaba.com</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">🕐</div>
                    <div className="contact-details">
                      <h3>Business Hours</h3>
                      <div className="hours-list">
                        <div className="hours-row">
                          <span>Mon - Thu</span>
                          <span>5:00 PM - 10:00 PM</span>
                        </div>
                        <div className="hours-row">
                          <span>Fri - Sat</span>
                          <span>5:00 PM - 11:00 PM</span>
                        </div>
                        <div className="hours-row">
                          <span>Sunday</span>
                          <span>4:00 PM - 9:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="social-section">
                  <h3>Follow Us</h3>
                  <div className="social-links">
                    <a href="#" className="social-link">📘</a>
                    <a href="#" className="social-link">📷</a>
                    <a href="#" className="social-link">🐦</a>
                    <a href="#" className="social-link">⭐</a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Map Section */}
          <div className="map-section">
            <h2 className="text-center mb-4">Find Us</h2>
            <div className="map-container">
              <div className="map-placeholder">
                <div className="map-content">
                  <h3>🗺️ Interactive Map</h3>
                  <p>Chitkara University, Rajpura (Punjab)</p>
                  <p>Located in the heart of the city's dining district</p>
                  <div className="map-features">
                    <span>🚗 Valet Parking Available</span>
                    <span>🚇 Metro Accessible</span>
                    <span>♿ Wheelchair Accessible</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
