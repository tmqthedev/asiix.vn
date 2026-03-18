document.addEventListener('DOMContentLoaded', () => {
  const initializeSidebar = () => {
    const currentPath = window.location.pathname;
    const sidebarPageNumber = document.querySelector('.sidebar .page-number');
    const sidebarPageTitle = document.querySelector('.sidebar .page-title');
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');

    if (!sidebarPageNumber || !sidebarPageTitle) {
      return;
    }

    // Set page number and title without animation
    if (currentPath === '/' || currentPath === '/index.html') {
      sidebarPageNumber.textContent = '00';
      sidebarPageTitle.textContent = document.title.toUpperCase();
    } else {
      dropdownLinks.forEach((link, index) => {
        if (link.href.includes(currentPath)) {
          const pageNum = (index + 1).toString().padStart(2, '0');
          sidebarPageNumber.textContent = pageNum;
          sidebarPageTitle.textContent = link.textContent.toUpperCase();
          link.classList.add('active');
        }
      });
    }

    window.dispatchEvent(new Event('sidebarReady'));
  };

  initializeSidebar();
});