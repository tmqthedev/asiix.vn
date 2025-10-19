// Prevent XSS
const sanitizeHTML = (str) => {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
};

// Enhanced input validation
const validateInput = (input, type = 'text') => {
  const patterns = {
    text: /^[a-zA-Z0-9\s\-_.]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    url: /^https?:\/\/[^\s/$.?#].[^\s]*$/
  };
  return patterns[type]?.test(input) || false;
};

// CSRF Protection
const csrfToken = Math.random().toString(36).substring(2);
document.cookie = `XSRF-TOKEN=${csrfToken}; SameSite=Strict; Secure`;

// Clickjacking Protection
if (window.self !== window.top) {
  window.top.location = window.self.location;
}

// Disable right click and inspect element (optional)
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && (e.key === 'i' || e.key === 'u')) {
    e.preventDefault();
  }
});

// Add rate limiting for API calls
class RateLimiter {
  constructor(limit = 60, interval = 60000) {
    this.limit = limit;
    this.interval = interval;
    this.requests = [];
  }

  checkLimit() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.interval);
    if (this.requests.length >= this.limit) return false;
    this.requests.push(now);
    return true;
  }
}

const apiRateLimiter = new RateLimiter();

// Add SRI hash checking
function verifySRI(element, expectedHash) {
  const hash = element.integrity;
  return hash === expectedHash;
}
