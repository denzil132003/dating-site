/* ============================================================
   ❤️ ANIME ROMANTIC DATE INVITATION — script.js
   All interactivity: video/music, particles, No-button dodge,
   celebration confetti, geolocation, movie genres, custom idea,
   summary, EmailJS, and the shareable link system.
============================================================ */

/* ============================================================
   ⚙️ CONFIGURATION — EDIT THIS SECTION
============================================================ */

// Insert EmailJS or Resend credentials here.
// EmailJS steps:
//   1. Create a free account at https://www.emailjs.com
//   2. Create an Email Service, then an Email Template
//   3. Paste your Public Key / Service ID / Template ID below
// Template placeholders used:
//   {{option}}, {{genres}}, {{idea}}, {{location}}, {{time}}
const EMAILJS_CONFIG = {
  publicKey: '',   // <-- YOUR EMAILJS PUBLIC KEY
  serviceID: '',   // <-- YOUR EMAILJS SERVICE ID
  templateID: ''   // <-- YOUR EMAILJS TEMPLATE ID
};

// ✅ YOUR EMAIL (already set) — all date-invitation replies will
// be sent to this address so you can read them.
// If you want a different inbox, change it here.
const RECIPIENT_EMAIL = 'danzilbaraik@gmail.com';

// ✅ SHARE LINK FORMAT
// We use a query-parameter link (?id=abc123) because it works on
// GitHub Pages and EVERY static host with zero extra setup.
// Example:  https://your-username.github.io/repo-name/?id=abc1234
function makeShareUrl(id) {
  const base = window.location.href.split('?')[0].split('#')[0];
  return `${base}?id=${encodeURIComponent(id)}`;
}

/* ============================================================
   ELEMENT REFERENCES
============================================================ */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const bgVideo = $('#bgVideo');
const muteToggle = $('#muteToggle');
const bgMusic = $('#bgMusic');
const musicToggle = $('#musicToggle');

const heroScreen = $('#heroScreen');
const celebrationScreen = $('#celebrationScreen');
const dateScreen = $('#dateScreen');
const thankScreen = $('#thankScreen');

const yesBtn = $('#yesBtn');
const noBtn = $('#noBtn');
const btnGroup = $('#btnGroup');
const noMessage = $('#noMessage');
const startDateBtn = $('#startDateBtn');
const submitBtn = $('#submitBtn');
const editDateBtn = $('#editDateBtn');

const customIdea = $('#customIdea');
const charCount = $('#charCount');
const reactionBubble = $('#reactionBubble');
const confettiCanvas = $('#confetti-canvas');
const particlesLayer = $('#particles');

/* ============================================================
   HELPER FUNCTIONS
============================================================ */
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(randomBetween(min, max + 1));
}

function getRandomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ============================================================
   BACKGROUND VIDEO + MUSIC CONTROLS
============================================================ */
let musicStarted = false;

// Attempt to autoplay music when the user interacts with the page.
// Mobile browsers block autoplay until a user gesture, so we keep
// trying on EVERY tap until the audio successfully starts.
function tryPlayMusic() {
  if (musicStarted) return;
  // Pre-load the audio so play() starts quickly on the first tap.
  if (bgMusic.readyState < 2) bgMusic.load();
  bgMusic.play().then(() => {
    musicStarted = true;
    musicToggle.classList.add('playing');
    musicToggle.querySelector('.music-label').textContent = 'Playing';
  }).catch(() => {
    // Browser blocked autoplay — it will retry on the next tap.
  });
}

// Start music on any user interaction (this retries until it works)
['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'].forEach((evt) => {
  window.addEventListener(evt, tryPlayMusic);
});

// Music toggle button
musicToggle.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      musicToggle.classList.add('playing');
      musicToggle.querySelector('.music-label').textContent = 'Playing';
    }).catch(() => showReaction('🎵 Tap again to play music!'));
  } else {
    bgMusic.pause();
    musicToggle.classList.remove('playing');
    musicToggle.querySelector('.music-label').textContent = 'Music';
  }
});

// Video mute/unmute toggle
muteToggle.addEventListener('click', () => {
  bgVideo.muted = !bgVideo.muted;
  muteToggle.querySelector('.mute-icon').textContent = bgVideo.muted ? '🔇' : '🔊';
  muteToggle.querySelector('.mute-text').textContent = bgVideo.muted ? 'Sound Off' : 'Sound On';
});

// Start video and (if allowed) unmute — some browsers block muted autoplay flip
bgVideo.play().catch(() => {});

/* ============================================================
   FLOATING PARTICLES (Sakura, Hearts, Sparkles)
============================================================ */
const PETALS = [
  '🌸','🌸','🌸','🌸','🌸'
];

// Emoji-based petals look great and stay lightweight.
// For a more "hand-drawn" sakura you could swap to inline SVG,
// but emoji petals are the most reliable across devices.
const petalEmoji = ['🌸', '💮', '✨', '💖', '🩷', '⭐', '💫', '🦋'];

function createParticle() {
  const el = document.createElement('span');
  el.className = 'particle';
  el.textContent = getRandomFrom(petalEmoji);
  const size = randomBetween(14, 30);
  el.style.fontSize = size + 'px';
  el.style.left = randomBetween(0, 100) + 'vw';
  el.style.setProperty('--sway', randomBetween(-120, 120) + 'px');
  el.style.animationDuration = randomBetween(9, 20) + 's';
  el.style.animationDelay = randomBetween(-20, 0) + 's';
  el.style.opacity = randomBetween(0.5, 0.95);
  particlesLayer.appendChild(el);

  // Remove after animation completes to avoid DOM bloat
  setTimeout(() => el.remove(), 22000);
}

// Spawn a continuous gentle stream of particles
(function spawnParticles() {
  createParticle();
  setTimeout(spawnParticles, randomBetween(350, 900));
})();

// Initial warm-up batch so the scene is full immediately
for (let i = 0; i < 22; i++) {
  const el = document.createElement('span');
  el.className = 'particle';
  el.textContent = getRandomFrom(petalEmoji);
  el.style.fontSize = randomBetween(14, 30) + 'px';
  el.style.left = randomBetween(0, 100) + 'vw';
  el.style.top = randomBetween(0, 100) + 'vh';
  el.style.setProperty('--sway', randomBetween(-120, 120) + 'px');
  el.style.animationDuration = randomBetween(9, 20) + 's';
  el.style.animationDelay = randomBetween(-20, 0) + 's';
  el.style.opacity = randomBetween(0.5, 0.95);
  particlesLayer.appendChild(el);
}

/* ============================================================
   SCREEN NAVIGATION
============================================================ */
function showScreen(screen) {
  $$('.screen').forEach((s) => s.classList.remove('active'));
  screen.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================
   REACTION BUBBLE  (anime character reactions)
============================================================ */
let reactionTimeout = null;
function showReaction(message, duration = 2200) {
  reactionBubble.textContent = message;
  reactionBubble.classList.add('show');
  clearTimeout(reactionTimeout);
  reactionTimeout = setTimeout(() => {
    reactionBubble.classList.remove('show');
  }, duration);
}

/* ============================================================
   THE DODGY "NO" BUTTON 💔
============================================================ */
const NO_MESSAGES = [
  'Are you sure? 🥺',
  'Give it another thought ❤️',
  'Maybe yes? 🌸',
  'Come on, it\'ll be fun ✨',
  'Don\'t run away 😄',
  'Think about the flowers! 💐',
  'Your answer is wrong 😤💕',
  'The Yes button looks lonely... 🥹'
];

let noBtnPositioned = false;
let positionedNoBtn = null; // track when we use absolute positioning

// On large enough screens we allow the No button to wander around.
const WANDER_ENABLED = () => window.innerWidth >= 640;

noBtn.addEventListener('mouseenter', handleNoAttempt);
noBtn.addEventListener('touchstart', handleNoAttempt, { passive: false });
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  handleNoAttempt(e);
});

function handleNoAttempt(e) {
  if (e.cancelable) e.preventDefault();
  showRandomMessage();
  dodgeNoButton();
}

function showRandomMessage() {
  const msg = getRandomFrom(NO_MESSAGES);
  noMessage.textContent = msg;
  noMessage.classList.remove('show');
  void noMessage.offsetWidth; // restart animation
  noMessage.classList.add('show');
  showReaction(msg);
}

function dodgeNoButton() {
  if (!WANDER_ENABLED()) {
    // On small screens just nudge inside the group so it stays reachable
    nudgeNoInsideGroup();
    return;
  }

  if (!noBtnPositioned) {
    // First dodge: switch to fixed positioning within the button group
    const groupRect = btnGroup.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    noBtn.style.position = 'absolute';
    noBtn.style.left = (btnRect.left - groupRect.left + btnRect.width / 2) + 'px';
    noBtn.style.top = (btnRect.top - groupRect.top + btnRect.height / 2) + 'px';
    noBtn.style.transform = 'translate(-50%, -50%)';
    noBtnPositioned = true;
    positionedNoBtn = noBtn;
  }

  moveNoButton();
}

function nudgeNoInsideGroup() {
  // On small screens we keep the No button in normal flow (flex row),
  // so we simply swap flex order to make it "move" without overlap issues.
  const order = btnGroup.style.flexDirection;
  btnGroup.style.flexDirection = order === 'row' ? 'row-reverse' : 'row';
  noBtn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  noBtn.style.transform = 'translateY(-6px)';
  setTimeout(() => { noBtn.style.transform = 'translateY(0)'; }, 300);
}

let noMoveCountdown = 0;
function moveNoButton() {
  const groupRect = btnGroup.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();

  const padding = btnRect.width + 16;

  // Compute a random safe position that stays clear of the Yes button
  let attempts = 0;
  let nx, ny;
  do {
    nx = randomBetween(padding / 2, Math.max(padding / 2, groupRect.width - padding / 2));
    ny = randomBetween(padding / 2, Math.max(padding / 2, groupRect.height - padding / 2));
    attempts++;
    // Ensure spacing from Yes button (75px minimum from Yes center)
  } while (attempts < 40 && (Math.hypot(nx - (yesRect.left - groupRect.left + yesRect.width / 2), ny - (yesRect.top - groupRect.top + yesRect.height / 2)) < 90));

  noBtn.style.left = nx + 'px';
  noBtn.style.top = ny + 'px';

  // Gentle dodge animation
  noBtn.animate(
    [
      { offset: 0, transform: 'translate(-50%, -50%) scale(1)' },
      { offset: 0.5, transform: 'translate(-50%, -50%) scale(1.12)' },
      { offset: 1, transform: 'translate(-50%, -50%) scale(1)' }
    ],
    { duration: 400, easing: 'ease-out' }
  );
}

/* ============================================================
   YES BUTTON → CELEBRATION 🎉
============================================================ */
yesBtn.addEventListener('click', () => {
  launchConfetti(60);
  spawnHeartBurst();
  tryPlayMusic();
  setTimeout(() => {
    showScreen(celebrationScreen);
    showReaction('YES!! I\'m so happy! 🥰', 2600);
  }, 550);
});

startDateBtn.addEventListener('click', () => {
  showScreen(dateScreen);
  showReaction('Let\'s pick our adventure! 🌸');
});

/* ============================================================
   CONFETTI + HEART BURST
============================================================ */
const CONFETTI_COLORS = ['#ff9ecb', '#ff6fb0', '#c9b6ff', '#9f8bff', '#bfe3ff', '#7cc6ff', '#fff5ec', '#ffe9a8'];

function launchConfetti(count = 50) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'confetti-piece';
    const isHeart = Math.random() < 0.3;
    el.textContent = isHeart ? getRandomFrom(['💖', '💘', '💕']) : getRandomFrom(['🎊', '✨', '•']);
    el.style.left = randomBetween(0, 100) + 'vw';
    el.style.fontSize = randomBetween(12, 28) + 'px';
    el.style.color = getRandomFrom(CONFETTI_COLORS);
    el.style.background = isHeart ? 'transparent' : getRandomFrom(CONFETTI_COLORS);
    el.style.animationDuration = randomBetween(2.4, 4.5) + 's';
    el.style.animationDelay = randomBetween(0, 0.6) + 's';
    confettiCanvas.appendChild(el);
    setTimeout(() => el.remove(), 5200);
  }
}

function spawnHeartBurst() {
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('span');
    el.className = 'confetti-piece';
    el.textContent = getRandomFrom(['💖', '❤️', '💕', '🌸', '✨']);
    el.style.left = '50%';
    el.style.fontSize = randomBetween(18, 36) + 'px';
    el.style.animationDuration = randomBetween(1.6, 2.8) + 's';
    el.style.setProperty('--burst-x', randomBetween(-180, 180) + 'px');
    el.style.animation = `heart-burst-mask 2.2s ease-out forwards`;
    // Use a custom radial burst by reusing confetti but starting at center:
    el.style.transform = 'translateX(-50%)';
    el.style.background = 'transparent';
    confettiCanvas.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }
}

// Extra keyframes injected for the central heart burst
const burstStyle = document.createElement('style');
burstStyle.textContent = `
  @keyframes heart-burst-mask {
    0%   { transform: translate(-50%, 0) translate(0, 0) scale(0.4); opacity: 1; }
    60%  { opacity: 1; }
    100% { transform: translate(-50%, 0) translate(var(--burst-x), -40vh) scale(1.15); opacity: 0; }
  }
`;
document.head.appendChild(burstStyle);

/* ============================================================
   MOTORCYCLE — GEOLOCATION & PICKUP POINT
============================================================ */
const locationBtn = $('.location-btn');
const locationResult = $('[data-location-result]');
const locText = $('.loc-text');

let sharedLocation = null;

locationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    locText.textContent = 'Geolocation is not supported by your browser.';
    return;
  }

  locationBtn.textContent = '📍 Locating...';
  locationBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    onLocationSuccess,
    onLocationError,
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

function onLocationSuccess(pos) {
  const { latitude, longitude } = pos.coords;
  sharedLocation = { latitude, longitude };

  // Reverse geocode to nearest landmark / place name (OpenStreetMap Nominatim)
  fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
    .then((res) => res.json())
    .then((data) => {
      const name = data.display_name || 'your location';
      // Compact: take the most relevant short part
      const parts = name.split(',').slice(0, 2).join(',');
      locText.textContent = `Found! I'll pick you up near: ${parts}`;
      locationResult.classList.add('found');
      locationBtn.textContent = '📍 Location Shared ✓';
      showReaction('Got it! See you there 🏍️💨');
    })
    .catch(() => {
      locText.textContent = `Found! Pickup near: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      locationResult.classList.add('found');
      locationBtn.textContent = '📍 Location Shared ✓';
    });

  locationBtn.disabled = false;
}

function onLocationError(err) {
  locationBtn.textContent = '📍 Share My Location';
  locationBtn.disabled = false;
  let msg = 'Couldn\'t get your location.';
  if (err.code === err.PERMISSION_DENIED) {
    msg = 'Location permission was denied. You can still pick another option! 🥲';
  } else if (err.code === err.TIMEOUT) {
    msg = 'Location request timed out. Try again!';
  }
  locText.textContent = msg;
  showReaction(msg);
}

/* ============================================================
   MOVIE DATE — GENRE SELECTION
============================================================ */
const genreBtns = $$('.genre-btn');
const selectedGenres = new Set();

genreBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const genre = btn.dataset.genre;
    if (selectedGenres.has(genre)) {
      selectedGenres.delete(genre);
      btn.classList.remove('selected');
    } else {
      selectedGenres.add(genre);
      btn.classList.add('selected');
      btn.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.18)' },
          { transform: 'scale(1)' }
        ],
        { duration: 300, easing: 'ease-out' }
      );
    }
  });
});

/* ============================================================
   CUSTOM DATE IDEA — TEXTAREA, COUNTER, FLOATING HEARTS
============================================================ */
customIdea.addEventListener('input', () => {
  charCount.textContent = customIdea.value.length;

  // Spawn a floating heart while typing (throttled)
  if (Math.random() < 0.35) {
    const heart = document.createElement('span');
    heart.className = 'typing-heart';
    heart.textContent = getRandomFrom(['💖', '💗', '🌸', '💕']);
    heart.style.left = randomBetween(30, 70) + 'vw';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1900);
  }
});

/* ============================================================
   SUBMISSION — SUMMARY + EMAILJS
============================================================ */
let selectedOption = null;

// Determine the selected date card (highlight behavior)
function refreshSelectedOption() {
  const cards = $$('.date-card');
  cards.forEach((card) => {
    const isActive =
      (card.dataset.option === 'motorcycle' && sharedLocation) ||
      (card.dataset.option === 'movie' && selectedGenres.size > 0) ||
      (card.dataset.option === 'custom' && customIdea.value.trim().length > 0);
    card.classList.toggle('card-active', isActive);
  });
}

customIdea.addEventListener('input', refreshSelectedOption);
genreBtns.forEach((btn) => btn.addEventListener('click', refreshSelectedOption));
locationBtn.addEventListener('click', refreshSelectedOption);

submitBtn.addEventListener('click', () => {
  // Determine which option the user engaged with most
  const hasLocation = !!sharedLocation;
  const hasGenres = selectedGenres.size > 0;
  const hasIdea = customIdea.value.trim().length > 0;

  if (hasLocation) {
    selectedOption = 'Motorcycle Ride 🏍️';
  } else if (hasGenres) {
    selectedOption = 'Movie Date 🎬';
  } else if (hasIdea) {
    selectedOption = 'Your Choice 💌';
  } else {
    showReaction('Please choose a date option first! 🥺');
    submitBtn.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(0)' }
      ],
      { duration: 400, easing: 'ease-in-out' }
    );
    return;
  }

  // Build summary data
  const option = selectedOption;
  const genres = selectedGenres.size ? [...selectedGenres].join(', ') : '—';
  const idea = customIdea.value.trim() || '—';
  const location = sharedLocation
    ? `${sharedLocation.latitude.toFixed(5)}, ${sharedLocation.longitude.toFixed(5)}`
    : 'Not shared';

  // Display summary
  $('#summaryOption').textContent = option;
  $('#summaryGenres').textContent = genres;
  $('#summaryIdea').textContent = idea;
  $('#summaryLocation').textContent = location;

  const now = new Date();
  const timeStr = now.toLocaleString(undefined, {
    dateStyle: 'full',
    timeStyle: 'short'
  });
  $('#summaryTime').textContent = timeStr;

// Build unique share link (works on GitHub Pages & any static host)
  const uniqueId = Math.random().toString(36).slice(2, 10);
  const shareUrl = makeShareUrl(uniqueId);
  $('#shareLink').textContent = shareUrl;
  window.__inviteShareUrl = shareUrl;

  // Send email (if credentials configured)
  sendResponseEmail(option, genres, idea, location, timeStr);

  // Celebrate & move to thank-you screen
  launchConfetti(70);
  showScreen(thankScreen);
  showReaction('It\'s a date! 💘', 2800);
});

// "Edit my choice" returns to the date screen
editDateBtn.addEventListener('click', () => {
  showScreen(dateScreen);
});

/* ============================================================
   EMAILJS INTEGRATION
============================================================ */
function sendResponseEmail(option, genres, idea, location, timeStr) {
  const { publicKey, serviceID, templateID } = EMAILJS_CONFIG;

  // If the user hasn't added credentials yet, log a friendly hint
  if (!publicKey || !serviceID || !templateID) {
    console.log(
      '📧 EmailJS not configured yet.\n' +
      '👉 Add your Public Key, Service ID and Template ID at the top of script.js\n' +
      `📨 Response that would be sent to ${RECIPIENT_EMAIL}:\n` +
      `Option: ${option}\nGenres: ${genres}\nIdea: ${idea}\nLocation: ${location}\nTime: ${timeStr}`
);

    // Fallback (before EmailJS setup): open the visitor's email app
    // with the reply pre-filled and addressed to YOUR inbox,
    // so you can still see her reply at danzilbaraik@gmail.com.
    const subject = encodeURIComponent(`💌 Your Date Invitation Reply — ${timeStr}`);
    const body = encodeURIComponent(
      'She chose a date! 💘\n\n' +
      `📅 Selected Option: ${option}\n` +
      `🎬 Movie Genres: ${genres}\n` +
      `💌 Custom Date Idea: ${idea}\n` +
      `📍 Pickup Location: ${location}\n` +
      `🕒 Submitted At: ${timeStr}\n\n` +
      '— Sent from your date invitation website'
    );
    window.location.href = `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;
    return;
  }

  // Initialize EmailJS with your public key
  emailjs.init(publicKey);

  const templateParams = {
    to_email: RECIPIENT_EMAIL,
    option: option,
    genres: genres,
    idea: idea,
    location: location,
    time: timeStr,
    from_name: 'Date Invitation Website',
    reply_to: RECIPIENT_EMAIL
  };

  emailjs
    .send(serviceID, templateID, templateParams)
    .then((res) => {
      console.log('✅ Email sent successfully!', res.status, res.text);
    })
    .catch((err) => {
      console.error('❌ Email send failed:', err);
    });
}

/* ============================================================
   SHAREABLE LINK SYSTEM
============================================================ */
// Generate (or restore) the invitation ID on load.
// When a link like yourdomain.com/date/abc123 is opened, the
// browser loads this same page — the URL is parsed below.
function getInviteId() {
  const path = window.location.pathname;
  const match = path.match(/\/date\/([a-z0-9]+)\/?$/i);
  if (match) return match[1];
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id') || Math.random().toString(36).slice(2, 10);
}

const inviteId = getInviteId();
const shareUrl = makeShareUrl(inviteId);
$('#shareLink').textContent = shareUrl;
window.__inviteShareUrl = shareUrl;

const shareButtons = $$('.share-btn');
shareButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.share;
    const url = window.__inviteShareUrl;
    const encodedUrl = encodeURIComponent(url);
    const text = encodeURIComponent('I have something special to ask you... 💌 Will you go on a date with me?');

    switch (type) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${text}%20${encodedUrl}`, '_blank');
        break;
      case 'instagram':
        // Instagram doesn't allow direct post text, so we copy the link and open the app/DM
        copyToClipboard(url).then(() => {
          showReaction('📋 Link copied! Paste it in your Instagram DM 💌');
        });
        window.open('https://www.instagram.com/', '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent('A special invitation for you 💌')}&body=${text}%20${encodedUrl}`;
        break;
      case 'copy':
        copyToClipboard(url).then(() => {
          showReaction('🔗 Link copied to clipboard!');
        });
        break;
    }
  });
});

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
}

/* ============================================================
   GLOBAL CLICKABLE CONSTRAINTS — keep the layout elegant
============================================================ */
// Ensure the No button never overlaps other elements by re-checking
// on screen resize.
window.addEventListener('resize', () => {
  if (noBtnPositioned) {
    // Reposition within new group bounds
    const groupRect = btnGroup.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const nx = Math.min(groupRect.width - btnRect.width / 2 - 8, Math.max(btnRect.width / 2 + 8, parseFloat(noBtn.style.left) || btnRect.width / 2));
    const ny = Math.min(groupRect.height - btnRect.height / 2 - 8, Math.max(btnRect.height / 2 + 8, parseFloat(noBtn.style.top) || btnRect.height / 2));
    noBtn.style.left = nx + 'px';
    noBtn.style.top = ny + 'px';
  }
});

// Quiet console message for the invite
console.log('💌 Something special is waiting for you on this page...');

