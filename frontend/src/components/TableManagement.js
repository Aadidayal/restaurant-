import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINT } from '../config/api';
import './TableManagement.css';

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availability, setAvailability] = useState({});

  const [formData, setFormData] = useState({
    tableNumber: '',
    section: 'Main Dining',
    capacity: 4,
    minGuests: 1,
    maxGuests: 4,
    tableType: 'Single',
    description: ''
  });

  const fetchAvailability = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_ENDPOINT}/admin/availability?date=${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setAvailability(response.data.availabilityReport || {});
      }
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchTables();
    fetchAvailability();
  }, [selectedDate, fetchAvailability]);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_ENDPOINT}/tables`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setTables(response.data.tables || []);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching tables');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'capacity' || name === 'minGuests' || name === 'maxGuests' 
        ? parseInt(value) 
        : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      if (editingTable) {
        // Update existing table
        const response = await axios.put(
          `${API_ENDPOINT}/tables/${editingTable._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setTables(tables.map(t => t._id === editingTable._id ? response.data.table : t));
          alert('Table updated successfully!');
        }
      } else {
        // Create new table
        const response = await axios.post(
          `${API_ENDPOINT}/tables`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setTables([...tables, response.data.table]);
          alert('Table created successfully!');
        }
      }

      resetForm();
      fetchAvailability();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving table');
    }
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      section: table.section,
      capacity: table.capacity,
      minGuests: table.minGuests,
      maxGuests: table.maxGuests,
      tableType: table.tableType,
      description: table.description
    });
    setShowForm(true);
  };

  const handleDelete = async (tableId) => {
    if (window.confirm('Are you sure you want to deactivate this table?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
          `${API_ENDPOINT}/tables/${tableId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setTables(tables.filter(t => t._id !== tableId));
          alert('Table deactivated successfully!');
          fetchAvailability();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting table');
      }
    }
  };

  // Seed default tables
  const handleSeedTables = async () => {
    if (window.confirm('This will create 15 default tables. Continue?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${API_ENDPOINT}/tables/seed`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setTables(response.data.tables || []);
          alert(`✅ ${response.data.message}`);
          fetchTables();
          fetchAvailability();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Error seeding tables');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      tableNumber: '',
      section: 'Main Dining',
      capacity: 4,
      minGuests: 1,
      maxGuests: 4,
      tableType: 'Single',
      description: ''
    });
    setEditingTable(null);
    setShowForm(false);
  };

  const getTotalCapacity = () => {
    return tables.reduce((sum, table) => sum + table.capacity, 0);
  };

  const sections = ['Main Dining', 'Patio', 'Private Room', 'Bar', 'Lounge'];
  const tableTypes = ['Single', 'Double', 'Group', 'Bar'];

  if (loading) return <div className="loading">Loading tables...</div>;

  return (
    <div className="table-management">
      <div className="container">
        <h1>🍽️ Table Management</h1>

        <div className="management-header">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{tables.length}</span>
              <span className="stat-label">Total Tables</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{getTotalCapacity()}</span>
              <span className="stat-label">Total Capacity</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{tables.reduce((sum, t) => sum + (t.capacity >= 4 ? 1 : 0), 0)}</span>
              <span className="stat-label">4+ Seater Tables</span>
            </div>
          </div>

          <button className="btn-add-table" onClick={() => setShowForm(true)}>
            ➕ Add New Table
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="modal-overlay" onClick={() => !editingTable && resetForm()}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingTable ? 'Edit Table' : 'Add New Table'}</h3>
                <button className="close-btn" onClick={resetForm}>×</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Table Number *</label>
                      <input
                        type="text"
                        name="tableNumber"
                        value={formData.tableNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., T1, T2, Table-01"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Section *</label>
                      <select
                        name="section"
                        value={formData.section}
                        onChange={handleInputChange}
                        required
                      >
                        {sections.map(sec => (
                          <option key={sec} value={sec}>{sec}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Capacity (Total Seats) *</label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        min="1"
                        max="20"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Min Guests</label>
                      <input
                        type="number"
                        name="minGuests"
                        value={formData.minGuests}
                        onChange={handleInputChange}
                        min="1"
                      />
                    </div>

                    <div className="form-group">
                      <label>Max Guests *</label>
                      <input
                        type="number"
                        name="maxGuests"
                        value={formData.maxGuests}
                        onChange={handleInputChange}
                        min="1"
                        max="20"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Table Type</label>
                      <select
                        name="tableType"
                        value={formData.tableType}
                        onChange={handleInputChange}
                      >
                        {tableTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="e.g., Window seat, near kitchen, wheelchair accessible"
                      rows="2"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-submit">
                      {editingTable ? 'Update Table' : 'Create Table'}
                    </button>
                    <button type="button" className="btn-cancel" onClick={resetForm}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Availability Overview */}
        <div className="availability-overview">
          <div className="date-picker">
            <label>View Availability for:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="time-slots">
            {Object.entries(availability).map(([time, data]) => (
              <div key={time} className="time-slot">
                <div className="time-slot-header">
                  <span className="time">{time}</span>
                  <span className="occupancy" style={{
                    backgroundColor: parseFloat(data.occupancyRate) > 75 ? '#dc3545' : 
                                    parseFloat(data.occupancyRate) > 50 ? '#ffc107' : '#28a745'
                  }}>
                    {data.occupancyRate}
                  </span>
                </div>
                <div className="slot-details">
                  <span>{data.totalTables - data.availableTables}/{data.totalTables} tables booked</span>
                  <span>{data.bookedCapacity}/{data.totalCapacity} seats booked</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tables List */}
        <div className="tables-section">
          <h2>All Tables</h2>
          {tables.length > 0 ? (
            <div className="tables-grid">
              {tables.map((table) => (
                <div key={table._id} className="table-card">
                  <div className="table-card-header">
                    <h3>{table.tableNumber}</h3>
                    <span className={`status-badge ${table.isActive ? 'active' : 'inactive'}`}>
                      {table.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="table-card-details">
                    <div className="detail-row">
                      <span className="label">Section:</span>
                      <span className="value">{table.section}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Capacity:</span>
                      <span className="value">{table.capacity} seats</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Guest Range:</span>
                      <span className="value">{table.minGuests} - {table.maxGuests} guests</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Type:</span>
                      <span className="value">{table.tableType}</span>
                    </div>
                    {table.description && (
                      <div className="detail-row">
                        <span className="label">Notes:</span>
                        <span className="value">{table.description}</span>
                      </div>
                    )}
                  </div>

                  <div className="table-card-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(table)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(table._id)}
                    >
                      Deactivate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🍽️</div>
              <h3>No Tables Found</h3>
              <p>Get started by creating tables or seeding default tables.</p>
              <div className="empty-state-actions">
                <button className="btn-seed" onClick={handleSeedTables}>
                  🌱 Seed Default Tables (15 tables)
                </button>
                <button className="btn-add-table" onClick={() => setShowForm(true)}>
                  ➕ Create Custom Table
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableManagement;
