document.addEventListener('DOMContentLoaded', () => {
    // Icons
    lucide.createIcons();

    // Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

});

// --- PAYMENT MODAL LOGIC (Existing) ---
const modal = document.getElementById('payment-modal');
const modalBtn = document.getElementById('modal-ok-btn');

if (modal && modalBtn) {
    // Show modal after a short delay on page load
    setTimeout(() => {
        modal.classList.add('active');
    }, 500);

    // Close modal on button click
    modalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}
