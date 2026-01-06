document.addEventListener('DOMContentLoaded', function() {
  // Authentication functionality
  const loginModal = document.getElementById('loginModal');
  const loggingSystem = document.getElementById('loggingSystem');
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  const closeModalBtn = document.getElementById('closeModalBtn');

  // Check if user is already authenticated (optional - for session management)
  const isAuthenticated = sessionStorage.getItem('nibl_authenticated');
  if (isAuthenticated === 'true') {
    showLoggingSystem();
  }

  // Close modal functionality
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
      // Redirect to home page when modal is closed
      window.location.href = 'index.html';
    });
  }

  // Close modal when clicking outside
  loginModal.addEventListener('click', function(e) {
    if (e.target === loginModal) {
      window.location.href = 'index.html';
    }
  });

  // Escape key to close modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && loginModal.style.display !== 'none') {
      window.location.href = 'index.html';
    }
  });

  // Login form submission
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Authentication credentials
    const validCredentials = {
      'admin': 'nibl2024',
      'operator': 'beam400kev',
      'researcher': 'nuclear123',
      'ritartha': 'chaki2024'
    };
    
    if (validCredentials[username] && validCredentials[username] === password) {
      // Successful login
      sessionStorage.setItem('nibl_authenticated', 'true');
      sessionStorage.setItem('nibl_user', username);
      showLoggingSystem();
    } else {
      // Failed login
      errorMessage.textContent = 'Invalid username or password';
      errorMessage.style.display = 'block';
      document.getElementById('password').value = '';
      
      // Hide error message after 3 seconds
      setTimeout(() => {
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
      }, 3000);
    }
  });

  function showLoggingSystem() {
    loginModal.style.display = 'none';
    loggingSystem.style.display = 'block';
    initializeLoggingForm();
  }

  function initializeLoggingForm() {
    const webhookURL = "https://discordapp.com/api/webhooks/1400223474936447016/xI-JrG48H3Riln_Qgnh-NlK62sBzXXdzJcJfZ5Eom5wvzpLAjQ3_FTjprWVM4fEageoq";
    const sheetWebhookURL = "https://script.google.com/a/macros/niser.ac.in/s/AKfycbxDe-o_3nvQkOMAi67mmxxcW9LBnoozaXgBKUISTX_JdGPeHKxap-7L5GcXkJXWftF1/exec";
    

    // Add logout functionality
    addLogoutFunctionality();

    function showLoading() {
      document.getElementById('loadingOverlay').style.display = 'flex';
    }

    function hideLoading() {
      document.getElementById('loadingOverlay').style.display = 'none';
    }

    // Beam form submission
    const beamForm = document.getElementById("beamForm");
    if (beamForm) {
      beamForm.addEventListener("submit", function(e) {
        e.preventDefault();
        showLoading();

        // Get form values
        const operator = document.getElementById("operator").value;
        const energy = document.getElementById("energy").value;
        const current = document.getElementById("current").value;
        const source = document.getElementById("source").value;
        const target = document.getElementById("target").value;
        const anode = document.getElementById("anode").value;
        const filament = document.getElementById("filament").value;
        const oven = document.getElementById("oven").value;
        const gas = document.getElementById("gas").value;
        const username = document.getElementById("username_form").value;
        const institute = document.getElementById("institute").value;
        const supervisor = document.getElementById("supervisor").value;

        // Get current date and time
        const now = new Date();
        const date = now.toLocaleDateString('en-GB');
        const time = now.toLocaleTimeString();

        // Get logged in user info
        const loggedInUser = sessionStorage.getItem('nibl_user') || 'Unknown';

        // Create Discord message
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

        const embed = {
          title:  "📡 __Discord Log for **NIBL**__",
          description: description,
          color:  0xffff00,
          timestamp: new Date().toISOString(),
          footer: {
            text:  "NIBL Logging System (`by Ritartha`)"
          }
        };

        // Send to Discord
        fetch(webhookURL, {
          method:  'POST',
          headers: {'Content-Type': 'application/json'},
          body:  JSON.stringify({ embeds: [embed] })
        })
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => {
              throw new Error(`Error: ${response.status} - ${text}`);
            });
          }
          
          // Send to Google Sheet
          return fetch(sheetWebhookURL, {
            method: "POST",
            headers: { "Content-Type":  "application/json" },
            body:  JSON.stringify({
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
              loggedBy: loggedInUser
            })
          });
        })
        .then(res => res.text())
        .then(msg => {
          hideLoading();
          console.log("✅ Logged in Google Sheet:", msg);
          
          // Show success message
          showSuccessMessage("✅ Data successfully sent to Discord and logged in Google Sheet!");
          
          // Reset form
          beamForm.reset();
        })
        .catch(error => {
          hideLoading();
          console.error(error);
          showSuccessMessage("✅ Data successfully sent to Discord");
          showErrorMessage("❌ New Google Sheet will be used. System under development. Failed to Update Old Google Sheet:  " + error.message);
        });
      });
    }

    // Add smooth focus effects
    document.querySelectorAll('.custom-input, .custom-select').forEach(input => {
      input.addEventListener('focus', function() {
        if (this.parentElement) {
          this.parentElement.style.transform = 'scale(1.02)';
        }
      });
      
      input.addEventListener('blur', function() {
        if (this.parentElement) {
          this.parentElement.style.transform = 'scale(1)';
        }
      });
    });

    // Form validation enhancements
    addFormValidation();
  }

  // Add logout functionality
  function addLogoutFunctionality() {
    // Create logout button if it doesn't exist
    let logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) {
      logoutBtn = document.createElement('button');
      logoutBtn.id = 'logoutBtn';
      logoutBtn.className = 'logout-btn';
      logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
      logoutBtn.type = 'button';
      
      // Add to hero section
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        heroSection.appendChild(logoutBtn);
      }
    }

    logoutBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('nibl_authenticated');
        sessionStorage.removeItem('nibl_user');
        window.location.href = 'index.html';
      }
    });
  }

  // Enhanced form validation
  function addFormValidation() {
    const requiredFields = document.querySelectorAll('.custom-input[required], .custom-select[required]');
    
    requiredFields.forEach(field => {
      field.addEventListener('blur', function() {
        validateField(this);
      });
      
      field.addEventListener('input', function() {
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

  // Success message function
  function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-notification';
    successDiv.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(successDiv);
    
    // Animate in
    setTimeout(() => {
      successDiv.classList.add('show');
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
      successDiv.classList.remove('show');
      setTimeout(() => {
        if (successDiv.parentElement) {
          successDiv.parentElement.removeChild(successDiv);
        }
      }, 300);
    }, 4000);
  }

  // Error message function
  function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Animate in
    setTimeout(() => {
      errorDiv.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
      errorDiv.classList.remove('show');
      setTimeout(() => {
        if (errorDiv.parentElement) {
          errorDiv.parentElement.removeChild(errorDiv);
        }
      }, 300);
    }, 5000);
  }

  // Auto-save functionality for long forms
  function enableAutoSave() {
    const formFields = document.querySelectorAll('.custom-input, .custom-select');
    
    formFields.forEach(field => {
      field.addEventListener('input', function() {
        const fieldId = this.id;
        const fieldValue = this.value;
        
        // Save to localStorage
        localStorage.setItem(`nibl_form_${fieldId}`, fieldValue);
      });
    });

    // Restore saved values
    formFields.forEach(field => {
      const fieldId = field.id;
      const savedValue = localStorage.getItem(`nibl_form_${fieldId}`);
      
      if (savedValue) {
        field.value = savedValue;
      }
    });
  }

  // Clear saved form data after successful submission
  function clearSavedFormData() {
    const formFields = document.querySelectorAll('.custom-input, .custom-select');
    
    formFields.forEach(field => {
      const fieldId = field.id;
      localStorage.removeItem(`nibl_form_${fieldId}`);
    });
  }

  // Initialize auto-save if logging system is shown
  if (sessionStorage.getItem('nibl_authenticated') === 'true') {
    setTimeout(enableAutoSave, 1000);
  }
});

// Add CSS for notifications and logout button
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
  /* Logout Button */
  .logout-btn {
    position: absolute;
    top:  1rem;
    right: 1rem;
    background: var(--accent-gradient);
    border: none;
    border-radius: 25px;
    color: var(--text-primary);
    padding: 0.8rem 1.5rem;
    font-weight: 600;
    cursor:  pointer;
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
    border-color:  #ff6b6b;
    background:  rgba(255, 107, 107, 0.1);
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
    right:  20px;
    padding: 1rem 1.5rem;
    border-radius:  12px;
    color: var(--text-primary);
    font-weight: 600;
    z-index: 1001;
    transform: translateX(400px);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    min-width: 300px;
    box-shadow: var(--shadow-hover);
  }

  .success-notification {
    background:  var(--success-gradient);
  }

  .error-notification {
    background: var(--accent-gradient);
  }

  .success-notification.show,
  .error-notification.show {
    transform: translateX(0);
  }

  .success-notification i,
  .error-notification i {
    font-size: 1.2rem;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .logout-btn {
      position: relative;
      top:  auto;
      right: auto;
      margin:  1rem auto;
      display:  block;
      width: fit-content;
    }

    .success-notification,
    .error-notification {
      right: 10px;
      left: 10px;
      min-width: auto;
      transform: translateY(-100px);
    }

    .success-notification.show,
    .error-notification.show {
      transform: translateY(0);
    }
  }
`;

document.head.appendChild(additionalStyles);