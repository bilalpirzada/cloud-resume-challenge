/* =============================================
   MUHAMMAD BILAL — Cloud Resume Challenge JS
   
   Cloud Resume Challenge requirements:
   - Visitor counter via API (AWS Lambda + DynamoDB)
   - JavaScript fetches the count and updates DOM
   
   Replace API_URL below with your actual
   AWS API Gateway endpoint once deployed.
   ============================================= */

// ── CONFIG ──────────────────────────────────────
// Replace this with your real API Gateway URL after
// deploying your Lambda + DynamoDB infrastructure.
const API_URL = 'https://YOUR_API_GATEWAY_ID.execute-api.YOUR_REGION.amazonaws.com/prod/visitor-count';

// ── VISITOR COUNTER ──────────────────────────────
async function updateVisitorCount() {
  const countEl = document.getElementById('visitor-count');

  try {
    // POST increments the count; GET returns without incrementing.
    // Using POST here to count each unique page load.
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Your Lambda should return { "count": <number> }
    if (data && typeof data.count === 'number') {
      animateCount(countEl, data.count);
    } else {
      countEl.textContent = data.count ?? '—';
    }
  } catch (err) {
    console.warn('Visitor counter unavailable:', err.message);
    // Fail silently — show a placeholder so the badge still looks good
    countEl.textContent = '—';
  }
}

// Animate the number counting up (cosmetic touch)
function animateCount(el, target) {
  const duration = 800;   // ms
  const steps = 30;
  const stepTime = duration / steps;
  let current = 0;
  const increment = Math.ceil(target / steps);

  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = current.toLocaleString();
    if (current >= target) clearInterval(timer);
  }, stepTime);
}

// ── SCROLL-BASED SECTION REVEAL ──────────────────
function initReveal() {
  const sections = document.querySelectorAll('.resume-section');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.08 }
  );

  sections.forEach((section) => {
    section.classList.add('hidden-init');
    observer.observe(section);
  });
}

// ── ACTIVE NAV HIGHLIGHT (for future nav bar use) ─
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.querySelectorAll('[data-nav]').forEach((link) => {
            link.classList.toggle(
              'active',
              link.dataset.nav === entry.target.id
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}

// ── CSS for reveal animation (injected via JS) ────
// This keeps the reveal logic self-contained in script.js
function injectRevealStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .hidden-init {
      opacity: 0;
      transform: translateY(18px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .hidden-init.visible {
      opacity: 1;
      transform: translateY(0);
    }
    @media (prefers-reduced-motion: reduce) {
      .hidden-init { transform: none; transition: opacity 0.3s ease; }
    }
  `;
  document.head.appendChild(style);
}

// ── INIT ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectRevealStyles();
  initReveal();
  initScrollSpy();
  updateVisitorCount();
});

async function loadVisitorCount() {
  try {
    const response = await fetch(
      "https://inhh7q02r0.execute-api.ap-south-1.amazonaws.com/visitors"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch visitor count");
    }

    const data = await response.json();

    document.getElementById("visitor-count").textContent = data.visitors;
  } catch (error) {
    console.error(error);
    document.getElementById("visitor-count").textContent = "Error";
  }
}

loadVisitorCount();