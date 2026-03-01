/**
 * NIBL Logging System - logging-script.js
 * Integrated with Django REST API Backend + Discord + Google Sheets
 */

// ============================================================
// API Configuration
// ============================================================
const API_BASE_URL = 'http://127.0.0.1:8000/api';
const DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1400223474936447016/xI-JrG48H3Riln_Qgnh-NlK62sBzXXdzJcJfZ5Eom5wvzpLAjQ3_FTjprWVM4fEageoq";
const SHEET_WEBHOOK_URL = "https://script.google.com/a/macros/niser.ac.in/s/AKfycbxDe-o_3nvQkOMAi67mmxxcW9LBnoozaXgBKUISTX_JdGPeHKxap-7L5GcXkJXWftF1/exec";

// ============================================================
// API Helper Functions
// ============================================================
const NIBL_API = {
  logEntries: {
    create: async function (data) {
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

    getAll: async function () {
      const response = await fetch(`${API_BASE_URL}/log-entries/`);
      if (!response.ok) throw new Error('Failed to fetch log entries');
      return await response.json();
    },
  },
};

// ============================================================
// Main Application
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

  // --------------------------------------------------------
  // Authentication Elements
  // --------------------------------------------------------
  const loginModal = document.getElementById('loginModal');
  const loggingSystem = document.getElementById('loggingSystem');
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  const closeModalBtn = document.getElementById('closeModalBtn');

  // Check existing session
  const isAuthenticated = sessionStorage.getItem('nibl_authenticated');
  if (isAuthenticated === 'true') {
    showLoggingSystem();
  }

  // --------------------------------------------------------
  // Modal Close Handlers
  // --------------------------------------------------------
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function () {
      window.location.href = 'index.html';
    });
  }

  if (loginModal) {
    loginModal.addEventListener('click', function (e) {
      if (e.target === loginModal) {
        window.location.href = 'index.html';
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && loginModal && loginModal.style.display !== 'none') {
      window.location.href = 'index.html';
    }
  });

  // --------------------------------------------------------
  // Login Form Submission
  // --------------------------------------------------------
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Authentication credentials
      const validCredentials = {
        'admin': 'nibl2024',
        'operator': 'beam400kev',
        'researcher': 'nuclear123',
        'ritartha': 'chaki2024',
      };

      if (validCredentials[username] && validCredentials[username] === password) {
        sessionStorage.setItem('nibl_authenticated', 'true');
        sessionStorage.setItem('nibl_user', username);
        showLoggingSystem();
      } else {
        errorMessage.textContent = 'Invalid username or password';
        errorMessage.style.display = 'block';
        document.getElementById('password').value = '';

        setTimeout(() => {
          errorMessage.style.display = 'none';
          errorMessage.textContent = '';
        }, 3000);
      }
    });
  }

  // --------------------------------------------------------
  // Show Logging System
  // --------------------------------------------------------
  function showLoggingSystem() {
    if (loginModal) loginModal.style.display = 'none';
    if (loggingSystem) loggingSystem.style.display = 'block';
    initializeLoggingForm();
  }

  // --------------------------------------------------------
  // Initialize Logging Form
  // --------------------------------------------------------
  function initializeLoggingForm() {
    addLogoutFunctionality();
    setupBeamFormSubmission();
    addFocusEffects();
    addFormValidation();
    enableAutoSave();
    loadLogHistory();
  }

  // --------------------------------------------------------
  // Beam Form Submission → Django API + Discord + Google Sheets
  // --------------------------------------------------------
  function setupBeamFormSubmission() {
    const beamForm = document.getElementById('beamForm');
    if (!beamForm) return;

    beamForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      showLoading();

      // Collect form values
      const operator = document.getElementById('operator').value;
      const energy = document.getElementById('energy').value;
      const current = document.getElementById('current').value;
      const source = document.getElementById('source').value;
      const target = document.getElementById('target').value;
      const anode = document.getElementById('anode').value;
      const filament = document.getElementById('filament').value;
      const oven = document.getElementById('oven').value;
      const gas = document.getElementById('gas').value;
      const username = document.getElementById('username_form').value;
      const institute = document.getElementById('institute').value;
      const supervisor = document.getElementById('supervisor').value;

      // Current date and time
      const now = new Date();
      const date = now.toLocaleDateString('en-GB');
      const time = now.toLocaleTimeString();

      // Logged-in user
      const loggedInUser = sessionStorage.getItem('nibl_user') || 'Unknown';

      // Track which services succeeded/failed
      const results = {
        django: false,
        discord: false,
        googleSheet: false,
      };

      // ============================
      // 1. Save to Django REST API
      // ============================
      const djangoPayload = {
        operator: operator,
        energy: parseFloat(energy) || 0,
        beam_current: parseFloat(current) || 0,
        source_element: source,
        target_sample: target,
        anode_current: parseFloat(anode) || 0,
        filament_current: parseFloat(filament) || 0,
        oven_current: parseFloat(oven) || 0,
        gas_control: parseFloat(gas) || 0,
        user_name: username,
        institute: institute,
        supervisor: supervisor || '',
        logged_by: loggedInUser,
        notes: '',
      };

      try {
        const apiResult = await NIBL_API.logEntries.create(djangoPayload);
        console.log('✅ Saved to Django DB:', apiResult);
        results.django = true;
      } catch (error) {
        console.error('❌ Django API error:', error);
      }

      // ============================
      // 2. Send to Discord
      // ============================
      const description =
        `• 📅 **Date:** ${date}\n` +
        `• ⏲️ **Time:** ${time}\n` +
        `• 👤 **Operator Name:** ${operator}\n` +
        `• 🎯 **Target Sample:** ${target}\n` +
        `• 💡 **Energy:** ${energy} KeV\n` +
        `• ⚡ **Beam Current:** ${current} µA\n\n __**Source Parameters:**__\n` +
        `• 🟠 **Source Element:** ${source}\n` +
        `• 🔌 **Anode Current:** ${anode} A\n` +
        `• 🔥 **Filament Current:** ${filament} A\n` +
        `• ⭐ **Oven Current:** ${oven} A\n` +
        `• 💨 **Gas Control:** ${gas} %\n\n __**User Details:**__\n` +
        `• 👨‍🎓 **User:** ${username}\n` +
        `• 🏛️ **Institute:** ${institute}` +
        (supervisor ? `\n• 👨‍🏫 **Supervisor:** ${supervisor}` : '') +
        `\n\n __**System Info:**__\n` +
        `• 🔑 **Logged by:** ${loggedInUser}`;

      const discordEmbed = {
        title: "📡 __Discord Log for **NIBL**__",
        description: description,
        color: 0xffff00,
        timestamp: new Date().toISOString(),
        footer: {
          text: "NIBL Logging System (`by Ritartha`)"
        }
      };

      try {
        const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ embeds: [discordEmbed] }),
        });
        if (discordResponse.ok) {
          console.log('✅ Sent to Discord');
          results.discord = true;
        } else {
          const text = await discordResponse.text();
          throw new Error(`Discord ${discordResponse.status}: ${text}`);
        }
      } catch (error) {
        console.error('❌ Discord error:', error);
      }

      // ============================
      // 3. Send to Google Sheets
      // ============================
      try {
        const sheetResponse = await fetch(SHEET_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date,
            time,
            operator,
            energy,
            current,
            source,
            target,
            anode,
            filament,
            oven,
            gas,
            username,
            institute,
            supervisor,
            loggedBy: loggedInUser,
          }),
        });
        const sheetMsg = await sheetResponse.text();
        console.log('✅ Logged in Google Sheet:', sheetMsg);
        results.googleSheet = true;
      } catch (error) {
        console.error('❌ Google Sheet error:', error);
      }

      // ============================
      // 4. Show Results
      // ============================
      hideLoading();

      // Build status message
      const successServices = [];
      const failedServices = [];

      if (results.django) successServices.push('Database');
      else failedServices.push('Database');

      if (results.discord) successServices.push('Discord');
      else failedServices.push('Discord');

      if (results.googleSheet) successServices.push('Google Sheet');
      else failedServices.push('Google Sheet');

      if (successServices.length > 0) {
        showSuccessMessage(`✅ Data logged to: ${successServices.join(', ')}`);
      }

      if (failedServices.length > 0) {
        showErrorMessage(`⚠️ Failed to log to: ${failedServices.join(', ')}. System may be under development.`);
      }

      // At least one succeeded → reset form
      if (successServices.length > 0) {
        beamForm.reset();
        clearSavedFormData();
        loadLogHistory(); // Refresh the log table
      }
    });
  }

  // --------------------------------------------------------
  // Load Log History from Django API
  // --------------------------------------------------------
  async function loadLogHistory() {
    const tableBody = document.getElementById('logTableBody');
    if (!tableBody) return;

    try {
      const entries = await NIBL_API.logEntries.getAll();

      // Sort by newest first
      entries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      tableBody.innerHTML = '';

      if (entries.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="14" style="text-align: center; color: rgba(255,255,255,0.5); padding: 2rem;">
              No log entries yet. Submit a log above to get started.
            </td>
          </tr>
        `;
        return;
      }

      entries.forEach(entry => {
        const row = document.createElement('tr');
        const createdAt = new Date(entry.created_at);
        const dateStr = createdAt.toLocaleDateString('en-GB');
        const timeStr = createdAt.toLocaleTimeString('en-GB');

        row.innerHTML = `
          <td>${dateStr}</td>
          <td>${timeStr}</td>
          <td>${escapeHtml(entry.operator || '-')}</td>
          <td>${entry.energy || 0} KeV</td>
          <td>${entry.beam_current || 0} µA</td>
          <td>${escapeHtml(entry.source_element || '-')}</td>
          <td>${escapeHtml(entry.target_sample || '-')}</td>
          <td>${entry.anode_current || 0} A</td>
          <td>${entry.filament_current || 0} A</td>
          <td>${entry.oven_current || 0} A</td>
          <td>${entry.gas_control || 0} %</td>
          <td>${escapeHtml(entry.user_name || '-')}</td>
          <td>${escapeHtml(entry.institute || '-')}</td>
          <td>${escapeHtml(entry.logged_by || '-')}</td>
        `;
        tableBody.appendChild(row);
      });

      console.log(`✅ Loaded ${entries.length} log entries from database`);
    } catch (error) {
      console.error('❌ Error loading log history:', error);
      tableBody.innerHTML = `
        <tr>
          <td colspan="14" style="text-align: center; color: rgba(255,107,107,0.8); padding: 2rem;">
            ⚠️ Could not load log history. Backend server may be offline.
          </td>
        </tr>
      `;
    }
  }

  // --------------------------------------------------------
  // Loading Overlay
  // --------------------------------------------------------
  function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'flex';
  }

  function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none';
  }

  // --------------------------------------------------------
  // Logout Functionality
  // --------------------------------------------------------
  function addLogoutFunctionality() {
    let logoutBtn = document.getElementById('logoutBtn');

    if (!logoutBtn) {
      logoutBtn = document.createElement('button');
      logoutBtn.id = 'logoutBtn';
      logoutBtn.className = 'logout-btn';
      logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
      logoutBtn.type = 'button';

      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        heroSection.appendChild(logoutBtn);
      }
    }

    logoutBtn.addEventListener('click', function () {
      if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('nibl_authenticated');
        sessionStorage.removeItem('nibl_user');
        clearSavedFormData();
        window.location.href = 'index.html';
      }
    });
  }

  // --------------------------------------------------------
  // Focus Effects
  // --------------------------------------------------------
  function addFocusEffects() {
    document.querySelectorAll('.custom-input, .custom-select').forEach(input => {
      input.addEventListener('focus', function () {
        if (this.parentElement) {
          this.parentElement.style.transform = 'scale(1.02)';
        }
      });

      input.addEventListener('blur', function () {
        if (this.parentElement) {
          this.parentElement.style.transform = 'scale(1)';
        }
      });
    });
  }

  // --------------------------------------------------------
  // Form Validation
  // --------------------------------------------------------
  function addFormValidation() {
    const requiredFields = document.querySelectorAll('.custom-input[required], .custom-select[required]');

    requiredFields.forEach(field => {
      field.addEventListener('blur', function () {
        validateField(this);
      });

      field.addEventListener('input', function () {
        if (this.classList.contains('error')) {
          validateField(this);
        }
      });
    });
  }

  function validateField(field) {
    const value = field.value.trim();
    const isValid = value !== '';

    if (isValid) {
      field.classList.remove('error');
      field.classList.add('valid');
    } else {
      field.classList.remove('valid');
      field.classList.add('error');
    }

    return isValid;
  }

  // --------------------------------------------------------
  // Auto-Save Form Data (localStorage)
  // --------------------------------------------------------
  function enableAutoSave() {
    const formFields = document.querySelectorAll('.custom-input, .custom-select');

    formFields.forEach(field => {
      // Save on input
      field.addEventListener('input', function () {
        const fieldId = this.id;
        if (fieldId) {
          localStorage.setItem(`nibl_form_${fieldId}`, this.value);
        }
      });

      // Restore saved values
      const fieldId = field.id;
      if (fieldId) {
        const savedValue = localStorage.getItem(`nibl_form_${fieldId}`);
        if (savedValue) {
          field.value = savedValue;
        }
      }
    });
  }

  function clearSavedFormData() {
    const formFields = document.querySelectorAll('.custom-input, .custom-select');

    formFields.forEach(field => {
      const fieldId = field.id;
      if (fieldId) {
        localStorage.removeItem(`nibl_form_${fieldId}`);
      }
    });
  }

  // --------------------------------------------------------
  // Notification Functions
  // --------------------------------------------------------
  function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-notification';
    successDiv.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(successDiv);

    setTimeout(() => {
      successDiv.classList.add('show');
    }, 100);

    setTimeout(() => {
      successDiv.classList.remove('show');
      setTimeout(() => {
        if (successDiv.parentElement) {
          successDiv.parentElement.removeChild(successDiv);
        }
      }, 300);
    }, 4000);
  }

  function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.classList.add('show');
    }, 100);

    setTimeout(() => {
      errorDiv.classList.remove('show');
      setTimeout(() => {
        if (errorDiv.parentElement) {
          errorDiv.parentElement.removeChild(errorDiv);
        }
      }, 300);
    }, 5000);
  }

  // --------------------------------------------------------
  // Utility: Escape HTML to prevent XSS
  // --------------------------------------------------------
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

}); // end DOMContentLoaded


// ============================================================
// Injected Styles for Notifications, Logout, Validation
// ============================================================
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
  /* Logout Button */
  .logout-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: var(--accent-gradient);
    border: none;
    border-radius: 25px;
    color: var(--text-primary);
    padding: 0.8rem 1.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .logout-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(238, 90, 36, 0.4);
  }

  /* Form Validation Styles */
  .custom-input.error,
  .custom-select.error {
    border-color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
  }

  .custom-input.valid,
  .custom-select.valid {
    border-color: var(--accent-cyan);
    background: rgba(29, 209, 161, 0.1);
  }

  /* Notification Styles */
  .success-notification,
  .error-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    color: var(--text-primary, #fff);
    font-weight: 600;
    z-index: 1001;
    transform: translateX(400px);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    min-width: 300px;
    max-width: 500px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .success-notification {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }

  .error-notification {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  }

  .success-notification.show,
  .error-notification.show {
    transform: translateX(0);
  }

  .success-notification i,
  .error-notification i {
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  /* Log History Table Styles */
  #logTableBody tr {
    transition: background 0.2s ease;
  }

  #logTableBody tr:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  #logTableBody td {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.85);
    white-space: nowrap;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .logout-btn {
      position: relative;
      top: auto;
      right: auto;
      margin: 1rem auto;
      display: block;
      width: fit-content;
    }

    .success-notification,
    .error-notification {
      right: 10px;
      left: 10px;
      min-width: auto;
      max-width: none;
      transform: translateY(-100px);
    }

    .success-notification.show,
    .error-notification.show {
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(additionalStyles);