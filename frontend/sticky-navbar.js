document.addEventListener('DOMContentLoaded', () => {
    let lastScrollY = window.scrollY;
    // Attempt to find the main toolbar by ID first, then by class if not found
    const toolbar = document.getElementById('main-toolbar') || document.querySelector('.main-toolbar');

    if (!toolbar) {
        console.warn('Sticky Navbar: Matching toolbar not found.');
        return;
    }

    // Ensure the toolbar has the transition property for smooth animation
    // We append this style if it's not already usually there, 
    // but best to rely on CSS. We'll enforce a minimal transition here just in case.
    if (!toolbar.style.transition) {
        toolbar.style.transition = 'transform 0.3s ease-in-out';
    }

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Threshold to avoid jitter on small scrolls
        if (Math.abs(currentScrollY - lastScrollY) < 5) return;

        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            // Scrolling DOWN -> Hide Toolbar
            // Move it up by its own height or 100%
            toolbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling UP -> Show Toolbar
            toolbar.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
});
