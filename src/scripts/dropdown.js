document.addEventListener('DOMContentLoaded', () => {
  const dropdownBtn = document.querySelector('.dropdown-btn');
  const dropdownContent = document.querySelector('.dropdown-content');
  const sidebar = document.querySelector('.sidebar');
  let isOpen = false;
  let isAnimating = false;

  if (!dropdownBtn || !dropdownContent) {
    return;
  }

  const toggleMenu = () => {
    if (isAnimating) return;
    isAnimating = true;
    
    isOpen = !isOpen;
    dropdownBtn.classList.toggle('active');
    
    if (isOpen) {
      dropdownContent.style.display = 'flex';
      requestAnimationFrame(() => {
        dropdownContent.classList.add('show');
        document.body.style.overflow = 'hidden';
        sidebar?.classList.add('hide');
      });
    } else {
      dropdownContent.classList.remove('show');
      document.body.style.overflow = '';
      sidebar?.classList.remove('hide');
      setTimeout(() => {
        dropdownContent.style.display = 'none';
      }, 300);
    }

    setTimeout(() => {
      isAnimating = false;
    }, 500);
  };

  dropdownBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking links
  document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) {
        toggleMenu();
      }
    });
  });

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) toggleMenu();
  });

  // Prevent closing when clicking inside dropdown content
  dropdownContent.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Close when clicking outside
  document.addEventListener('click', () => {
    if (isOpen) toggleMenu();
  });

  // Dispatch event when dropdown is ready
  window.dispatchEvent(new Event('dropdownReady'));
});