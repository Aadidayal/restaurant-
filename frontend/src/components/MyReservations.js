import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyReservations.css';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyReservations();
  }, []);

  const fetchMyReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view your reservations');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/api/admin/my-reservations', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setReservations(response.data.reservations);
      } else {
        setError('Failed to fetch reservations');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching reservations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  if (loading) return <div className="loading">Loading your reservations...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="my-reservations">
      <div className="container">
        <h1>My Reservations</h1>
        
        {reservations.length === 0 ? (
          <div className="no-reservations">
            <h3>No reservations found</h3>
            <p>You haven't made any reservations yet.</p>
            <a href="/reservations" className="btn-primary">Make a Reservation</a>
          </div>
        ) : (
          <div className="reservations-grid">
            {reservations.map((reservation) => (
              <div key={reservation._id} className="reservation-card">
                <div className="reservation-header">
                  <div className="reservation-id">
                    Reservation #{reservation._id.slice(-6)}
                  </div>
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(reservation.status) }}
                  >
                    {getStatusIcon(reservation.status)} {reservation.status.toUpperCase()}
                  </div>
                </div>
                
                <div className="reservation-details">
                  <div className="detail-row">
                    <span className="label">Date:</span>
                    <span className="value">{reservation.date}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Time:</span>
                    <span className="value">{reservation.time}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Guests:</span>
                    <span className="value">{reservation.guests}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Name:</span>
                    <span className="value">{reservation.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Phone:</span>
                    <span className="value">{reservation.phone}</span>
                  </div>
                  {reservation.message && (
                    <div className="detail-row">
                      <span className="label">Message:</span>
                      <span className="value">{reservation.message}</span>
                    </div>
                  )}
                  {reservation.adminResponse && (
                    <div className="admin-response">
                      <span className="label">Admin Response:</span>
                      <span className="value">{reservation.adminResponse}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="label">Submitted:</span>
                    <span className="value">
                      {new Date(reservation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {reservation.reviewedAt && (
                    <div className="detail-row">
                      <span className="label">Reviewed:</span>
                      <span className="value">
                        {new Date(reservation.reviewedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;