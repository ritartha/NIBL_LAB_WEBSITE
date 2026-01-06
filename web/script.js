document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const navbarBurger = document. getElementById('navbarBurger');
  const navbarMenu = document.getElementById('navbarMenu');
  
  if (navbarBurger && navbarMenu) {
    navbarBurger.addEventListener('click', function() {
      navbarBurger.classList. toggle('is-active');
      navbarMenu.classList.toggle('is-active');
    });
  }

  // Set active navigation item based on current page
  setActiveNavigation();
});

function setActiveNavigation() {
  const currentPage = window.location.pathname. split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.navbar-item');
  
  navItems.forEach(item => {
    item.classList.remove('active');
    const href = item.getAttribute('href');
    if (href && href.includes(currentPage)) {
      item.classList.add('active');
    }
  });

  // Special case for index.html (home page)
  if (currentPage === 'index.html' || currentPage === '') {
    const homeLink = document.querySelector('.navbar-item[href="index.html"]');
    if (homeLink) {
      homeLink.classList. add('active');
    }
  }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor. addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});