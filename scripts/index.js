// Smooth scrolling for internal navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
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

// Theme toggle functionality
const toggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const toggleSound = document.getElementById('toggle-sound');

function switchIcon(newSrc, newAlt) {
  themeIcon.classList.add('fade-out');
  setTimeout(() => {
    themeIcon.src = newSrc;
    themeIcon.alt = newAlt;
    themeIcon.classList.remove('fade-out');
  }, 300); // matches the CSS transition duration
}
// Set initial icon based on theme
function setTheme(mode) {
  if (mode === 'dark') {
    document.body.classList.add('dark');
    switchIcon('./assets/image/Property1sun.png', 'Light Mode');
  } else {
    document.body.classList.remove('dark');
    switchIcon('./assets/image/dark-mode.png', 'Dark Mode');
  }
  localStorage.setItem('theme', mode);
}

toggleBtn.addEventListener('click', () => {
  toggleSound.currentTime = 1;
  toggleSound.play();

  const isDark = document.body.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
});

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
});

// Toggle projects visibility
function toggleProjects() {
  const projectsList = document.getElementById('projects-list');
  const toggleBtn = document.querySelector('.toggle-projects');
  
  projectsList.classList.toggle('visible');
  
  const isExpanded = projectsList.classList.contains('visible');
  toggleBtn.textContent = isExpanded ? 'Hide ▲' : 'Show ▼';
  toggleBtn.setAttribute('aria-expanded', isExpanded);
}

// Project Filter Functionality
function setupProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  // Show all projects by default
  document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
  projectCards.forEach(card => card.style.display = 'block');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      // Filter projects
      projectCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'block';
        } else {
          card.style.display = card.dataset.category === filter ? 'block' : 'none';
        }
      });
    });
  });
}

async function generateResumePDF() {
  try {
    // Create container
    const pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-resume-container';
    document.body.appendChild(pdfContainer);
    
    // Clone content
    const resumeContent = document.getElementById('resume-section').cloneNode(true);
    
    // Clean up for PDF - only modify text colors, not backgrounds
    resumeContent.querySelectorAll('*').forEach(el => {
      // Only force black text for regular content (not headings or special elements)
      if (!el.classList.contains('resume-header') && 
          !el.classList.contains('section-title') &&
          el.tagName !== 'H1' && 
          el.tagName !== 'H2' && 
          el.tagName !== 'H3') {
        el.style.color = '#000000';
      }
      el.style.visibility = 'visible';
      el.style.opacity = '1';
      el.style.display = ''; // Reset display
    });
    
    // Force show all projects
    const projectsList = resumeContent.querySelector('#projects-list');
    if (projectsList) {
      projectsList.style.display = 'block';
      projectsList.style.maxHeight = 'none';
      projectsList.style.overflow = 'visible';
    }
    
    // Remove interactive elements
    const elementsToRemove = [
      '.toggle-projects',
      '.filter-buttons',
      'button',
      'a[href^="#"]'
    ];
    
    elementsToRemove.forEach(selector => {
      resumeContent.querySelectorAll(selector).forEach(el => el.remove());
    });
    
    // Add to container
    pdfContainer.appendChild(resumeContent);
    
    // PDF options - enable background rendering
    const options = {
      margin: 10,
      filename: 'Your_Resume.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2,
        logging: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        letterRendering: true,
        backgroundColor: '#FFFFFF',
        allowTaint: true,  // Important for backgrounds
        useCORS: false     // Might help with background rendering
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };
    
    // Generate PDF
    await html2pdf().set(options).from(pdfContainer).save();
    
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('PDF generation failed: ' + error.message);
  } finally {
    // Clean up
    const container = document.getElementById('pdf-resume-container');
    if (container) container.remove();
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Start with projects hidden
  const projectsList = document.getElementById('projects-list');
  const toggleBtn = document.querySelector('.toggle-projects');
  
  if (projectsList && toggleBtn) {
    projectsList.classList.remove('visible');
    toggleBtn.setAttribute('aria-controls', 'projects-list');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.textContent = 'Show ▼';
  }
  
  // Setup project filters
  setupProjectFilters();
});

// Popup logic
const popup = document.getElementById('project-popup');
const popupTitle = document.getElementById('popup-title');
const popupDescription = document.getElementById('popup-description');
const closePopup = document.querySelector('.popup .close');

document.querySelectorAll('.view-project').forEach(btn => {
  btn.addEventListener('click', () => {
    const projectId = btn.getAttribute('data-project');
    // Example content mapping
    const projectData = {
      1: { title: "Portfolio Website", description: "A fully responsive portfolio built with HTML, CSS, JavaScript." },
      2: { title: "UI Redesign", description: "A UI/UX revamp project using Figma and CSS animations." },
      3: { title: "An Otter Essay", description: "A modern frame with clean UI and smooth responsiveness." },
      4: { title: "Weather App", description: "An app that fetches weather data from an API and displays it in real-time." },
      5: { title: "Todo List App", description: "A simple Vue.js todo list application to manage tasks efficiently." },
      6: { title: "Huckleberry", description: "A web application for avant-garde agency focused on connecting Passion with Logistics." },
      7: { title: "Scissors", description: "A web application for Optimizing an online Experience with Advanced URL Shortening Solution." },
      8: { title: "Slide Gallery", description: "A responsive image gallery with smooth transitions and animations." },
      9: { title: "WP Pusher Checkout", description: "A web application for managing WordPress plugin installations and updates." },
      10: { title: "Signup Toggle", description: "It allows users to update their details, change passwords securely, and toggle between account and password sections." },
    };

    const data = projectData[projectId];
    if (data) {
      popupTitle.textContent = data.title;
      popupDescription.textContent = data.description;
      popup.classList.remove('hidden');
    }
  });
});

closePopup.addEventListener('click', () => {
  popup.classList.add('hidden');
});

// Dynamically update footer year
const footer = document.querySelector('footer p');
const year = new Date().getFullYear();
footer.innerHTML = `&copy; ${year} Efekomwan Anthony Oriakhi. All rights reserved.`;
