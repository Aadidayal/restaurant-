import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPortal.css';

const AdminPortal = () => {
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('reservations');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login as admin');
        setLoading(false);
        return;
      }

      const [reservationsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:3000/api/admin/reservations', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:3000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (reservationsRes.data.success) {
        setReservations(reservationsRes.data.reservations);
      }
      if (usersRes.data.success) {
        setUsers(usersRes.data.users);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:3000/api/admin/reservations/${reservationId}/status`,
        { status, adminResponse },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update local state
        setReservations(reservations.map(r => 
          r._id === reservationId ? response.data.reservation : r
        ));
        setSelectedReservation(null);
        setAdminResponse('');
        alert(`Reservation ${status} successfully!`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating reservation');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading admin dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-portal">
      <div className="container">
        <h1>🍽️ Admin Portal</h1>
        
        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            📅 Reservations ({reservations.length})
          </button>
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users ({users.length})
          </button>
        </div>

        {activeTab === 'reservations' && (
          <div className="reservations-section">
            <h2>Reservation Management</h2>
            <div className="stats">
              <div className="stat-card">
                <span className="stat-number">{reservations.filter(r => r.status === 'pending').length}</span>
                <span className="stat-label">Pending</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{reservations.filter(r => r.status === 'approved').length}</span>
                <span className="stat-label">Approved</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{reservations.filter(r => r.status === 'rejected').length}</span>
                <span className="stat-label">Rejected</span>
              </div>
            </div>
            
            <div className="reservations-table">
              {reservations.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Customer</th>
                      <th>Guests</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation._id}>
                        <td>
                          <div>{reservation.date}</div>
                          <div className="time">{reservation.time}</div>
                        </td>
                        <td>
                          <div className="customer-info">
                            <strong>{reservation.name}</strong>
                            <div>{reservation.email}</div>
                            <div>{reservation.phone}</div>
                          </div>
                        </td>
                        <td>{reservation.guests}</td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(reservation.status) }}
                          >
                            {reservation.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-details"
                              onClick={() => setSelectedReservation(reservation)}
                            >
                              Details
                            </button>
                            {reservation.status === 'pending' && (
                              <>
                                <button 
                                  className="btn-approve"
                                  onClick={() => updateReservationStatus(reservation._id, 'approved')}
                                >
                                  Approve
                                </button>
                                <button 
                                  className="btn-reject"
                                  onClick={() => updateReservationStatus(reservation._id, 'rejected')}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📅</div>
                  <h3>No Reservations Yet</h3>
                  <p>Reservations will appear here once customers start booking tables.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <h2>User Management</h2>
            <div className="users-table">
              {users.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Reservations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role === 'admin' ? '👑' : '👤'} {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          {reservations.filter(r => r.user._id === user._id).length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">👥</div>
                  <h3>No Users Yet</h3>
                  <p>Registered users will appear here once they sign up.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reservation Details Modal */}
        {selectedReservation && (
          <div className="modal-overlay" onClick={() => setSelectedReservation(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Reservation Details</h3>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedReservation(null)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-grid">
                  <div><strong>Customer:</strong> {selectedReservation.name}</div>
                  <div><strong>Email:</strong> {selectedReservation.email}</div>
                  <div><strong>Phone:</strong> {selectedReservation.phone}</div>
                  <div><strong>Date:</strong> {selectedReservation.date}</div>
                  <div><strong>Time:</strong> {selectedReservation.time}</div>
                  <div><strong>Guests:</strong> {selectedReservation.guests}</div>
                  <div><strong>Status:</strong> 
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedReservation.status), marginLeft: '10px' }}
                    >
                      {selectedReservation.status.toUpperCase()}
                    </span>
                  </div>
                  <div><strong>Submitted:</strong> {formatDate(selectedReservation.createdAt)}</div>
                  {selectedReservation.message && (
                    <div className="full-width">
                      <strong>Special Requests:</strong>
                      <p>{selectedReservation.message}</p>
                    </div>
                  )}
                </div>
                
                {selectedReservation.status === 'pending' && (
                  <div className="admin-actions">
                    <h4>Admin Actions</h4>
                    <textarea
                      placeholder="Add a response message (optional)"
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      rows="3"
                    ></textarea>
                    <div className="action-buttons">
                      <button 
                        className="btn-approve"
                        onClick={() => updateReservationStatus(selectedReservation._id, 'approved')}
                      >
                        ✅ Approve
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => updateReservationStatus(selectedReservation._id, 'rejected')}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;