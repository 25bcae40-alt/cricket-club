// =============================================
// 1. CUSTOM CURSOR GLOW — follows mouse
// =============================================
const glow = document.getElementById('cursorGlow');

document.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// =============================================
// 2. HERO BALL — reacts to mouse proximity
// =============================================
const ball = document.getElementById('heroBall');

document.addEventListener('mousemove', (e) => {
  const rect  = ball.getBoundingClientRect();
  const ballX = rect.left + rect.width  / 2;
  const ballY = rect.top  + rect.height / 2;
  const dx = e.clientX - ballX;
  const dy = e.clientY - ballY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 200) {
    // Push the ball away from the cursor
    const force = (200 - dist) / 200;
    ball.style.transform = `translate(${-dx * force * 0.4}px, ${-dy * force * 0.4}px) scale(${1 + force * 0.3})`;
  } else {
    ball.style.transform = '';
  }
});

// =============================================
// 3. TILT EFFECT — cards react to mouse
// =============================================
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const midX   = rect.width  / 2;
    const midY   = rect.height / 2;
    const rotateX = ((y - midY) / midY) * -10; // degrees
    const rotateY = ((x - midX) / midX) *  10;

    card.style.transform    = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    card.style.transition   = 'transform 0.1s';
    card.style.boxShadow    = `${-rotateY}px ${rotateX}px 30px rgba(0,200,83,0.18)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.boxShadow  = '';
    card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
  });
});

// =============================================
// 4. NAVBAR — highlight active link on scroll
// =============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--green)' : '';
  });
});

// =============================================
// 5. CONTACT FORM — sends data to backend
// =============================================
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = document.getElementById('formStatus');
  status.textContent = 'Sending...';

  const payload = {
    name:    document.getElementById('nameInput').value,
    email:   document.getElementById('emailInput').value,
    message: document.getElementById('messageInput').value,
  };

  try {
    // Replace this URL with your Render backend URL after deployment
    const res = await fetch('https://your-backend.onrender.com/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      status.textContent  = '✅ Message sent! We will get back to you.';
      status.style.color  = 'var(--green)';
      e.target.reset();
    } else {
      status.textContent = '❌ Error: ' + data.error;
      status.style.color = '#f44336';
    }
  } catch (err) {
    // If backend not connected yet, show friendly message
    status.textContent = '⚠️ Backend not connected. Message noted locally.';
    status.style.color = 'var(--accent)';
    console.error(err);
  }
});

// =============================================
// 6. SCROLL REVEAL — fade in sections
// =============================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.about-card, .player-card, .match-card, .dev-card').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(40px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});