/**
 * NIBL Lab Website - Main Script
 * Connects to Django REST API at /api/
 */

const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', function () {
  // ── Mobile menu toggle ──────────────────────────────────
  const navbarBurger = document.getElementById('navbarBurger');
  const navbarMenu = document.getElementById('navbarMenu');

  if (navbarBurger && navbarMenu) {
    navbarBurger.addEventListener('click', function () {
      navbarBurger.classList.toggle('is-active');
      navbarMenu.classList.toggle('is-active');
    });
  }

  // ── Active nav highlighting ─────────────────────────────
  setActiveNavigation();

  // ── Load dynamic data based on page ─────────────────────
  const currentPage = getCurrentPage();

  if (currentPage === 'index.html' || currentPage === '') {
    loadUpdates();
  }

  if (currentPage === 'members.html') {
    loadMembers();
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Utility
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Navigation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function setActiveNavigation() {
  const currentPage = getCurrentPage();
  const navItems = document.querySelectorAll('.navbar-item');

  navItems.forEach(function (item) {
    item.classList.remove('active');
    const href = item.getAttribute('href');
    if (href && href.includes(currentPage)) {
      item.classList.add('active');
    }
  });

  // Home page special case
  if (currentPage === 'index.html' || currentPage === '') {
    const homeLink = document.querySelector('.navbar-item[href="index.html"]');
    if (homeLink) homeLink.classList.add('active');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Load Updates (Home Page)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function loadUpdates() {
  const container = document.querySelector('.updates-section');
  if (!container) return;

  try {
    const res = await fetch(API_BASE + '/updates/');
    if (!res.ok) throw new Error('API returned ' + res.status);

    const data = await res.json();
    const updates = data.results || data;
    if (!updates.length) return;

    // Keep section title, replace cards
    const title = container.querySelector('.section-title');
    container.innerHTML = '';
    if (title) container.appendChild(title);

    updates.forEach(function (u) {
      var card = document.createElement('div');
      card.className = 'update-card';
      card.innerHTML =
        '<div class="update-date">' + u.date_label + '</div>' +
        '<h4>' + u.title + '</h4>' +
        '<p>' + u.description + '</p>';
      container.appendChild(card);
    });

    console.log('✓ Updates loaded from API');
  } catch (err) {
    console.log('ℹ Using static updates (API unavailable):', err.message);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Load Members
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function loadMembers() {
  var grid = document.querySelector('.team-grid');
  if (!grid) return;

  try {
    var res = await fetch(API_BASE + '/members/');
    if (!res.ok) throw new Error('API returned ' + res.status);

    var data = await res.json();
    var members = data.results || data;
    if (!members.length) return;

    grid.innerHTML = '';

    members.forEach(function (m) {
      var photoSrc = m.photo || 'img/default-avatar.png';

      var contacts = '';
      if (m.email) {
        contacts +=
          '<a href="mailto:' + m.email + '" class="contact-link">' +
          '<i class="fas fa-envelope"></i><span>Email</span></a>';
      }
      if (m.linkedin_url) {
        contacts +=
          '<a href="' + m.linkedin_url + '" class="contact-link" target="_blank">' +
          '<i class="fab fa-linkedin"></i><span>LinkedIn</span></a>';
      }
      if (m.github_url) {
        contacts +=
          '<a href="' + m.github_url + '" class="contact-link" target="_blank">' +
          '<i class="fab fa-github"></i><span>GitHub</span></a>';
      }
      if (m.researchgate_url) {
        contacts +=
          '<a href="' + m.researchgate_url + '" class="contact-link" target="_blank">' +
          '<i class="fab fa-researchgate"></i><span>Research</span></a>';
      }

      var card = document.createElement('div');
      card.className = 'member-card';
      card.innerHTML =
        '<div class="member-photo-container">' +
          '<div class="member-photo">' +
            '<img src="' + photoSrc + '" alt="' + m.name + '" ' +
              'class="member-image" style="display:block;" ' +
              'onerror="this.style.display=\'none\'">' +
          '</div>' +
          '<div class="member-status">' +
            '<span class="status-indicator online"></span>' +
            '<span class="status-text">Active</span>' +
          '</div>' +
        '</div>' +
        '<div class="member-info">' +
          '<h3 class="member-name">' + m.name + '</h3>' +
          '<p class="member-role">' + m.designation + '</p>' +
          '<div class="member-details">' +
            '<div class="detail-item">' +
              '<i class="fas fa-graduation-cap"></i>' +
              '<span>' + m.designation + '</span>' +
            '</div>' +
            '<div class="detail-item">' +
              '<i class="fas fa-calendar"></i>' +
              '<span>' + m.experience_years + '+ Years Experience</span>' +
            '</div>' +
          '</div>' +
          '<p class="member-description">' + m.description + '</p>' +
          '<div class="member-contact">' + contacts + '</div>' +
        '</div>';

      grid.appendChild(card);
    });

    console.log('✓ Members loaded from API');
  } catch (err) {
    console.log('ℹ Using static members (API unavailable):', err.message);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Smooth Scrolling for anchor links
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});