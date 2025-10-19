window.onload = function() {
  const dropdownBtn = document.querySelector('.dropdown-btn');
  const dropdownContent = document.querySelector('.dropdown-content');
  const menuIcon = document.querySelector('.menu-icon');
  const closeIcon = document.querySelector('.close-icon');
  const sidebar = document.querySelector('.sidebar');
  const exitBtn = document.querySelector('.exit-btn');

  if (!dropdownBtn || !dropdownContent) return;

  function toggleMenu() {
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
    dropdownContent.classList.toggle('show');
    
    if (dropdownContent.classList.contains('show')) {
      document.body.style.overflow = 'hidden';
      if (sidebar) sidebar.classList.add('hide');
    } else {
      document.body.style.overflow = '';
      if (sidebar) sidebar.classList.remove('hide');
    }
  }

  dropdownBtn.onclick = toggleMenu;
  if (exitBtn) exitBtn.onclick = toggleMenu;
}
