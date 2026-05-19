// Custom Cursor Logic
const CURSOR_DOT = document.querySelector('.cursor-dot');
const CURSOR_OUTLINE = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows instantly
    CURSOR_DOT.style.left = `${posX}px`;
    CURSOR_DOT.style.top = `${posY}px`;

    // Outline follows with delay (handled by CSS transition, just updating pos here)
    // Using simple animate for smoother lag effect if desired, but CSS transition is efficient for now
    CURSOR_OUTLINE.style.left = `${posX}px`;
    CURSOR_OUTLINE.style.top = `${posY}px`;
});

// Add hover effect to links to expand cursor
const LINKS = document.querySelectorAll('a, button, .gallery-item');

LINKS.forEach(link => {
    link.addEventListener('mouseenter', () => {
        CURSOR_OUTLINE.style.width = '60px';
        CURSOR_OUTLINE.style.height = '60px';
        CURSOR_OUTLINE.style.borderColor = 'var(--accent-pink)';
    });
    link.addEventListener('mouseleave', () => {
        CURSOR_OUTLINE.style.width = '40px';
        CURSOR_OUTLINE.style.height = '40px';
        CURSOR_OUTLINE.style.borderColor = 'var(--primary-color)';
    });
});

// Scroll Reveal Logic (Simple Intersection Observer)
const revealElements = document.querySelectorAll('.gallery-item, .about-text, .contact-form');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.6s ease-out';
    revealObserver.observe(el);
});
