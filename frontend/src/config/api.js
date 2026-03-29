// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || `${API_URL}/api`;

export { API_URL, API_ENDPOINT };
