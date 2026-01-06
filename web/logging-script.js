document.addEventListener('DOMContentLoaded', function() {
  // Authentication functionality
  const loginModal = document.getElementById('loginModal');
  const loggingSystem = document.getElementById('loggingSystem');
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');

  // Check if user is already authenticated (optional - for session management)
  const isAuthenticated = sessionStorage.getItem('nibl_authenticated');
  if (isAuthenticated === 'true') {
    showLoggingSystem();
  }

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
    }
  });

  function showLoggingSystem() {
    loginModal.style.display = 'none';
    loggingSystem.style. display = 'block';
    initializeLoggingForm();
  }

  function initializeLoggingForm() {
    const webhookURL = "https://discordapp.com/api/webhooks/1400223474936447016/xI-JrG48H3Riln_Qgnh-NlK62sBzXXdzJcJfZ5Eom5wvzpLAjQ3_FTjprWVM4fEageoq";
    const sheetWebhookURL = "https://script.google.com/macros/s/AKfycbwmPW7B9fOzxotR3EquWrKugYXHR4xz-R1Gw0ZeJSUwJKxcSYlggGzv6pM4NQcagT3_5w/exec";

    function showLoading() {
      document.getElementById('loadingOverlay').style.display = 'flex';
    }

    function hideLoading() {
      document.getElementById('loadingOverlay').style.display = 'none';
    }

    // Beam form submission
    document. getElementById("beamForm").addEventListener("submit", function(e) {
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
        (supervisor ? `\n• 👨‍🏫 **Supervisor:** ${supervisor}` : '');

      const embed = {
        title: "📡 __Discord Log for **NIBL**__",
        description: description,
        color: 0xffff00,
        timestamp: new Date().toISOString(),
        footer: {
          text: "NIBL Logging System (`by Ritartha`)"
        }
      };

      // Send to Discord
      fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] })
      })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Error:  ${response.status} - ${text}`);
          });
        }
        
        // Send to Google Sheet
        return fetch(sheetWebhookURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
            supervisor
          })
        });
      })
      .then(res => res.text())
      .then(msg => {
        hideLoading();
        console.log("✅ Logged in Google Sheet:", msg);
        alert("✅ Data successfully sent to Discord and logged in Google Sheet!");
        
        // Reset form
        document. getElementById("beamForm").reset();
      })
      .catch(error => {
        hideLoading();
        console.error(error);
        alert("❌ Failed to send message.\n" + error.message);
      });
    });

    // Add smooth focus effects
    document.querySelectorAll('. custom-input, .custom-select').forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
      });
      
      input.addEventListener('blur', function() {
        this.parentElement. style.transform = 'scale(1)';
      });
    });
  }
});