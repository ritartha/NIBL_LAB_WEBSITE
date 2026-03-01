/**
 * NIBL API Helper
 * Centralized API calls to Django REST Backend
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const NIBL_API = {

  // ========================
  // BEAM TIME REQUESTS
  // ========================
  beamTime: {
    // Submit a new beam-time request
    create: async function(data) {
      const response = await fetch(`${API_BASE_URL}/beam-time-requests/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
      }
      return await response.json();
    },

    // Get all beam-time requests
    getAll: async function() {
      const response = await fetch(`${API_BASE_URL}/beam-time-requests/`);
      if (!response.ok) throw new Error('Failed to fetch beam-time requests');
      return await response.json();
    },

    // Get a single beam-time request by ID
    getById: async function(id) {
      const response = await fetch(`${API_BASE_URL}/beam-time-requests/${id}/`);
      if (!response.ok) throw new Error('Failed to fetch beam-time request');
      return await response.json();
    },
  },

  // ========================
  // LOG ENTRIES
  // ========================
  logEntries: {
    // Submit a new log entry
    create: async function(data) {
      const response = await fetch(`${API_BASE_URL}/log-entries/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
      }
      return await response.json();
    },

    // Get all log entries
    getAll: async function() {
      const response = await fetch(`${API_BASE_URL}/log-entries/`);
      if (!response.ok) throw new Error('Failed to fetch log entries');
      return await response.json();
    },
  },

  // ========================
  // MEMBERS
  // ========================
  members: {
    getAll: async function() {
      const response = await fetch(`${API_BASE_URL}/members/`);
      if (!response.ok) throw new Error('Failed to fetch members');
      return await response.json();
    },
  },

  // ========================
  // GALLERY
  // ========================
  gallery: {
    getAlbums: async function() {
      const response = await fetch(`${API_BASE_URL}/gallery-albums/`);
      if (!response.ok) throw new Error('Failed to fetch albums');
      return await response.json();
    },
  },

  // ========================
  // UPDATES (Home page)
  // ========================
  updates: {
    getAll: async function() {
      const response = await fetch(`${API_BASE_URL}/updates/`);
      if (!response.ok) throw new Error('Failed to fetch updates');
      return await response.json();
    },
  },
};