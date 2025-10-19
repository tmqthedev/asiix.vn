document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('[data-total-pages]');
    const pages = document.querySelectorAll('.album-page');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const pageNumber = document.querySelector('.page-number');
    let currentPage = 1;
    const totalPages = parseInt(container?.dataset.totalPages || '1');

    function updatePage() {
        pages.forEach(page => {
            const pageNum = parseInt(page.dataset.page);
            if (pageNum === currentPage) {
                page.style.opacity = '1';
                page.style.visibility = 'visible';
                page.style.transform = 'translateX(0)';
            } else {
                page.style.opacity = '0';
                page.style.visibility = 'hidden';
                page.style.transform = pageNum < currentPage 
                    ? 'translateX(-100%)'
                    : 'translateX(100%)';
            }
        });

        // Update page number and button states
        if (pageNumber) pageNumber.textContent = `${currentPage} / ${totalPages}`;
        if (prevButton) prevButton.disabled = currentPage === 1;
        if (nextButton) nextButton.disabled = currentPage === totalPages;
    }

    // Add click handlers with animation protection
    let isAnimating = false;

    prevButton?.addEventListener('click', () => {
        if (isAnimating || currentPage === 1) return;
        isAnimating = true;
        currentPage--;
        updatePage();
        setTimeout(() => isAnimating = false, 500); // Match transition duration
    });

    nextButton?.addEventListener('click', () => {
        if (isAnimating || currentPage === totalPages) return;
        isAnimating = true;
        currentPage++;
        updatePage();
        setTimeout(() => isAnimating = false, 500); // Match transition duration
    });

    // Initialize page
    updatePage();
});