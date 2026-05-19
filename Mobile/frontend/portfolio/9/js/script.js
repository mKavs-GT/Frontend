document.addEventListener('DOMContentLoaded', () => {
    console.log('Celebrate Love script loaded');

    // Confetti Effect
    const hero = document.getElementById('creative-hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            createConfetti(e.clientX, e.clientY);
        });
    }

    function createConfetti(x, y) {
        const colors = ['#FCE4EC', '#F3E5F5', '#D4AF37', '#e1b1ee', '#b2dfdb'];
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // Randomize
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 4 + 'px'; // 4px to 12px
        const spreadX = (Math.random() - 0.5) * 200 + 'px'; // Spread horizontally

        confetti.style.backgroundColor = color;
        confetti.style.width = size;
        confetti.style.height = size;
        confetti.style.left = `${x}px`;
        confetti.style.top = `${y}px`;
        confetti.style.setProperty('--tx', spreadX);
        // Use custom property for random fall direction if needed, but simple is fine

        document.body.appendChild(confetti);

        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 1000);
    }

    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    // Toggle Nav
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });
});
