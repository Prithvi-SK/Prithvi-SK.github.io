// js/app.js

// Key under which we store everything
const STORAGE_KEY = 'formResponses';

// EmailJS config – replace with your EmailJS service ID, template ID, and public key
const EMAILJS_CONFIG = {
  serviceID: 'service_vtlqxzu',
  templateID: 'template_y0bftuf',
  publicKey: '5K4aN7idXdgX2q_c3'
};

// Load existing data or start fresh
function getResponses() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

// Save updated responses
function saveResponses(responses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
}

// Clear everything (we'll call this after successful send later)
function clearResponses() {
  localStorage.removeItem(STORAGE_KEY);
}

// On page load – we can add pre-filling later if needed
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('question-form');
  const status = document.getElementById('status');

  if (!form) return; // safety if not a form page

  // js/app.js (replace the submit handler part)

form.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const formData = new FormData(form);
    const currentResponses = {};
  
    for (const [key, value] of formData.entries()) {
      currentResponses[key] = value.trim();
    }
  
    // Merge with existing
    const allResponses = getResponses();
    Object.assign(allResponses, currentResponses);
  
    // Special: email was already saved on first page
    saveResponses(allResponses);

    const currentPath = window.location.pathname.split('/').pop();

    // On final (attire) page: send email via EmailJS, then redirect to thank-you
    if (currentPath === 'final.html') {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      status.textContent = 'Sending...';
      status.style.color = '#2563eb';

      if (typeof emailjs === 'undefined') {
        status.textContent = 'Email service not loaded. Please refresh.';
        status.style.color = '#d32f2f';
        if (submitBtn) submitBtn.disabled = false;
        return;
      }

      emailjs.init(EMAILJS_CONFIG.publicKey);
      emailjs
        .send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, allResponses)
        .then(() => {
          clearResponses();
          window.location.href = 'thank-you.html';
        })
        .catch(() => {
          status.textContent = 'Failed to send. Please try again.';
          status.style.color = '#d32f2f';
          if (submitBtn) submitBtn.disabled = false;
        });
      return;
    }

    status.textContent = 'Saved! Moving on...';
    status.style.color = '#2563eb';

    setTimeout(() => {
      if (currentPath === 'index.html' || currentPath === '') {
        window.location.href = 'page2.html';
      } else if (currentPath === 'page2.html') {
        window.location.href = 'page3.html';
      } else if (currentPath === 'page3.html') {
        window.location.href = 'page4.html';
      } else if (currentPath === 'page4.html') {
        window.location.href = 'page5.html';
      } else if (currentPath === 'page5.html') {
        window.location.href = 'final.html';
      }
    }, 800);
  });
});