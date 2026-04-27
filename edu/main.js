document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.text-reveal').forEach(el => {
        observer.observe(el);
    });

    // Simple parallax/movement for gallery cards on mouse move
    const container = document.querySelector('.gallery-container');
    const cards = document.querySelectorAll('.gallery-card');

    if (container) {
        container.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            cards.forEach((card, index) => {
                const factor = (index - 3) * 2;
                // We preserve the base rotation and add a slight offset
                // This is a simplified version of the perspective effect
            });
        });
    }

    // Auto-trigger reveal for hero
    setTimeout(() => {
        document.querySelectorAll('.hero .text-reveal').forEach(el => {
            el.classList.add('active');
        });
    }, 100);
});
