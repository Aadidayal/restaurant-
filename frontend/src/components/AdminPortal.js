import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINT } from '../config/api';
import TableManagement from './TableManagement';
import './AdminPortal.css';

const AdminPortal = () => {
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('reservations');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [tableAvailability, setTableAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [seatingHistory, setSeatingHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [tablesConfigured, setTablesConfigured] = useState(true);

  useEffect(() => {
    fetchData();
    fetchSeatingHistory();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login as admin');
        setLoading(false);
        return;
      }

      const [reservationsRes, usersRes, tablesRes] = await Promise.all([
        axios.get(`${API_ENDPOINT}/admin/reservations`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_ENDPOINT}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_ENDPOINT}/tables`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (reservationsRes.data.success) {
        setReservations(reservationsRes.data.reservations || []);
      }
      if (usersRes.data.success) {
        setUsers(usersRes.data.users || []);
      }
      if (tablesRes.data.success) {
        setTablesConfigured(tablesRes.data.count > 0);
      } else {
        setTablesConfigured(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching data');
      setTablesConfigured(false);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_ENDPOINT}/admin/reservations/${reservationId}/status`,
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
        setTableAvailability(null);
        alert(`✅ ${response.data.message}`);
      }
    } catch (err) {
      alert(`❌ ${err.response?.data?.message || 'Error updating reservation'}`);
    }
  };

  // Check availability for a pending reservation
  const checkReservationAvailability = async (reservation) => {
    try {
      setCheckingAvailability(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_ENDPOINT}/tables/availability/check`,
        {
          params: {
            date: reservation.date,
            time: reservation.time,
            guestCount: reservation.guests
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setTableAvailability(response.data);
      }
    } catch (err) {
      console.error('Error checking availability:', err);
      setTableAvailability(null);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Fetch seating history
  const fetchSeatingHistory = async () => {
    try {
      setHistoryLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_ENDPOINT}/admin/seating-history?limit=100`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSeatingHistory(response.data.seatingHistory || []);
      }
    } catch (err) {
      console.error('Error fetching seating history:', err);
      setSeatingHistory([]);
    } finally {
      setHistoryLoading(false);
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

        {!tablesConfigured && (
          <div className="warning-banner">
            <span className="warning-icon">⚠️</span>
            <div className="warning-content">
              <strong>No Tables Configured!</strong>
              <p>You need to set up tables before approving reservations. Click below to add tables.</p>
            </div>
            <button 
              className="warning-action-btn"
              onClick={() => setActiveTab('tables')}
            >
              Go to Table Management →
            </button>
          </div>
        )}
        
        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            📅 Reservations ({reservations.length})
          </button>
          <button 
            className={`tab ${activeTab === 'tables' ? 'active' : ''}`}
            onClick={() => setActiveTab('tables')}
          >
            🍽️ Table Management
          </button>
          <button 
            className={`tab ${activeTab === 'seating-history' ? 'active' : ''}`}
            onClick={() => setActiveTab('seating-history')}
          >
            📋 Seating History ({seatingHistory.length})
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
                <span className="stat-number">{reservations.filter(r => r && r.status === 'pending').length}</span>
                <span className="stat-label">Pending</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{reservations.filter(r => r && r.status === 'approved').length}</span>
                <span className="stat-label">Approved</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{reservations.filter(r => r && r.status === 'rejected').length}</span>
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

        {activeTab === 'tables' && (
          <div className="tables-section">
            <h2>🍽️ Table Management</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
              Manage your restaurant tables and seating capacity
            </p>
            <TableManagement />
          </div>
        )}

        {activeTab === 'seating-history' && (
          <div className="seating-history-section">
            <h2>📋 Seating History & Trail</h2>
            <p className="section-subtitle">Track all approved reservations and their assigned tables</p>
            
            {historyLoading ? (
              <div className="loading">Loading seating history...</div>
            ) : seatingHistory.length > 0 ? (
              <div className="history-table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Customer</th>
                      <th>Guests</th>
                      <th>Assigned Tables</th>
                      <th>Total Seats</th>
                      <th>Approved By</th>
                      <th>Approval Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seatingHistory.map((record) => (
                      <tr key={record._id}>
                        <td>
                          <div><strong>{record.reservationDate}</strong></div>
                          <div className="time">⏰ {record.reservationTime}</div>
                        </td>
                        <td>
                          <div className="customer-info">
                            <strong>{record.customerName}</strong>
                            <div style={{fontSize: '0.85em'}}>{record.customerEmail}</div>
                          </div>
                        </td>
                        <td><strong>{record.guestCount}</strong> guests</td>
                        <td>
                          <div className="tables-assigned">
                            {record.assignedTables.map((table, idx) => (
                              <span key={idx} className="table-badge">
                                {table.tableNumber} ({table.capacity}s)
                              </span>
                            ))}
                          </div>
                        </td>
                        <td><strong>{record.totalSeatsAssigned}</strong></td>
                        <td>{record.approvedBy}</td>
                        <td>
                          <div style={{fontSize: '0.9em'}}>{formatDate(record.approvalDate)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3>No Seating History Yet</h3>
                <p>Approved reservations will appear here with their assigned table information.</p>
              </div>
            )}
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
                          {reservations.filter(r => r.user && r.user._id === user._id).length}
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
          <div className="modal-overlay" onClick={() => {
            setSelectedReservation(null);
            setTableAvailability(null);
          }}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Reservation Details</h3>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setSelectedReservation(null);
                    setTableAvailability(null);
                  }}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-grid">
                  <div><strong>Customer:</strong> {selectedReservation.name}</div>
                  <div><strong>Email:</strong> {selectedReservation.email}</div>
                  <div><strong>Phone:</strong> {selectedReservation.phone}</div>
                  <div><strong>📅 Reservation Date:</strong> <strong style={{color: '#2563eb'}}>{selectedReservation.date}</strong></div>
                  <div><strong>⏰ Reservation Time:</strong> <strong style={{color: '#2563eb'}}>{selectedReservation.time}</strong></div>
                  <div><strong>👥 Guests:</strong> <strong>{selectedReservation.guests}</strong></div>
                  <div><strong>Status:</strong> 
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedReservation.status), marginLeft: '10px' }}
                    >
                      {selectedReservation.status.toUpperCase()}
                    </span>
                  </div>
                  <div><strong>📨 Submitted:</strong> {formatDate(selectedReservation.createdAt)}</div>
                  {selectedReservation.reviewedAt && (
                    <div><strong>✅ Approved:</strong> {formatDate(selectedReservation.reviewedAt)}</div>
                  )}
                  {selectedReservation.message && (
                    <div className="full-width">
                      <strong>Special Requests:</strong>
                      <p>{selectedReservation.message}</p>
                    </div>
                  )}
                </div>

                {/* 🆕 TABLE AVAILABILITY SECTION */}
                {selectedReservation.status === 'pending' && (
                  <div className="availability-check-section">
                    <h4>📊 Table Availability Check</h4>
                    {!tableAvailability && !checkingAvailability && (
                      <button 
                        className="btn-check-availability"
                        onClick={() => checkReservationAvailability(selectedReservation)}
                      >
                        🔍 Check Available Tables
                      </button>
                    )}
                    
                    {checkingAvailability && (
                      <div className="availability-loading">Checking table availability...</div>
                    )}

                    {tableAvailability && (
                      <div className="availability-info">
                        {tableAvailability.availableTables && tableAvailability.availableTables.length > 0 ? (
                          <>
                            <div className="availability-status success">
                              ✅ {tableAvailability.availableTables.length} table(s) available for {selectedReservation.guests} guests
                            </div>
                            
                            {tableAvailability.recommendedCombinations && tableAvailability.recommendedCombinations.length > 0 && (
                              <div className="recommended-tables">
                                <p><strong>Recommended Table Combination:</strong></p>
                                {tableAvailability.recommendedCombinations[0] && (
                                  <div className="table-combo">
                                    <span className="combo-tables">
                                      Tables: {tableAvailability.recommendedCombinations[0].tables
                                        .map(t => t.tableNumber)
                                        .join(' + ')}
                                    </span>
                                    <span className="combo-capacity">
                                      Total Capacity: {tableAvailability.recommendedCombinations[0].totalCapacity} seats
                                    </span>
                                    <span className="combo-efficiency">
                                      Efficiency: {tableAvailability.recommendedCombinations[0].efficiency}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="available-tables-list">
                              <p><strong>All Available Tables:</strong></p>
                              <div className="tables-grid-small">
                                {tableAvailability.availableTables.map((table, idx) => (
                                  <div key={idx} className="table-item">
                                    <div className="table-number">{table.tableNumber}</div>
                                    <div className="table-info">
                                      <span className="section">{table.section}</span>
                                      <span className="capacity">{table.capacity} seats</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="availability-status error">
                            ❌ No tables available for {selectedReservation.guests} guests on {selectedReservation.date} at {selectedReservation.time}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
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