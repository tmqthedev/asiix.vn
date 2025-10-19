class LoadingManager {
  constructor() {
    this.overlay = null;
    this.spinner = null;
    this.isLoading = false;
    this.initializeLoadingElements();
  }

  initializeLoadingElements() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'loading';
    this.spinner = document.createElement('div');
    this.spinner.className = 'loading-spinner';
    this.overlay.appendChild(this.spinner);
    document.body.appendChild(this.overlay);
  }

  show() {
    this.isLoading = true;
    this.overlay.classList.remove('hide');
    this.overlay.style.opacity = '1';
    document.body.style.overflow = 'hidden';
    // Smooth fade in
    requestAnimationFrame(() => {
      this.spinner.style.animation = 'spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite';
      this.overlay.style.transition = 'opacity 0.2s ease-in-out';
    });
  }

  hide() {
    if (!this.isLoading) return;
    
    // Smooth fade out
    this.overlay.style.opacity = '0';
    this.isLoading = false;
    
    setTimeout(() => {
      if (!this.isLoading) {
        this.overlay.classList.add('hide');
        document.body.style.overflow = '';
        this.spinner.style.animation = 'none';
      }
    }, 200);
  }

  async waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        return;
      }

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  }

  async initializeComponents() {
    return Promise.all([
      this.initializeSidebar(),
      this.initializeDropdown(),
      this.initializeImages(),
      this.initializeVideos()
    ]);
  }

  async initializeSidebar() {
    await this.waitForElement('.sidebar');
    return new Promise(resolve => {
      window.addEventListener('sidebarReady', () => resolve(), { once: true });
      // Fallback if sidebar.js fails
      setTimeout(resolve, 1000);
    });
  }

  async initializeDropdown() {
    await this.waitForElement('.dropdown-btn');
    // Let dropdown.js handle the initialization, just wait for elements
    return new Promise(resolve => {
      window.addEventListener('dropdownReady', () => resolve(), { once: true });
      // Fallback if dropdown.js fails
      setTimeout(resolve, 1000);
    });
  }

  async initializeImages() {
    const images = document.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      
      return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => {
          console.warn(`Failed to load image: ${img.src}`);
          resolve(); // Don't block loading on error
        };
        
        // Set timeout for image loading
        setTimeout(resolve, 5000);
      });
    });

    return Promise.all(imagePromises);
  }

  async initializeVideos() {
    const videos = document.querySelectorAll('iframe[src*="youtube"]');
    return Promise.all(
      Array.from(videos).map(video => {
        return new Promise((resolve) => {
          video.onload = () => resolve();
          setTimeout(resolve, 3000); // Fallback timeout for videos
        });
      })
    );
  }

  handleNavigation() {
    document.querySelectorAll('a').forEach(link => {
      if (link.href.startsWith(window.location.origin)) {
        link.addEventListener('click', async (e) => {
          e.preventDefault();
          this.show();
          
          // Pre-fetch the next page
          try {
            await fetch(link.href);
            await new Promise(resolve => setTimeout(resolve, 200)); // Minimum loading time
            window.location = link.href;
          } catch (error) {
            console.error('Navigation error:', error);
            window.location = link.href; // Fallback direct navigation
          }
        });
      }
    });
  }
}

// Initialize loading manager
document.addEventListener('DOMContentLoaded', async () => {
  const loadingManager = new LoadingManager();
  
  // Show loading immediately
  loadingManager.show();

  try {
    // Wait for critical resources
    await Promise.all([
      loadingManager.initializeComponents(),
      new Promise(resolve => setTimeout(resolve, 300)) // Minimum loading time
    ]);

    // Setup navigation handling
    loadingManager.handleNavigation();

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      loadingManager.show();
      window.location.reload();
    });

  } catch (error) {
    console.error('Initialization error:', error);
  } finally {
    loadingManager.hide();
  }
});

// Add intersection observer for lazy loading
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
});
