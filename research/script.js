document.addEventListener('DOMContentLoaded', () => {
    
    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Add a slight delay to the outline for a smooth effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
    
    // Hover effects on links and buttons for custom cursor
    const hoverElements = document.querySelectorAll('a, button, .accordion-header, .b-card');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.borderColor = 'var(--accent-purple)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.borderColor = 'rgba(0, 240, 255, 0.5)';
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Accordion Logic
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Close other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // 3D Tilt Effect for Behavioral Cards
    const cards = document.querySelectorAll('.tilt-effect');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15; // Max rotation 15deg
            const rotateY = ((x - centerX) / centerX) * 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // Simple Particles for Hero Background
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
        for (let i = 0; i < 50; i++) {
            createParticle(particlesContainer);
        }
    }

    function createParticle(container) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = Math.random() > 0.5 ? 'var(--accent-blue)' : 'var(--accent-purple)';
        particle.style.borderRadius = '50%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.opacity = Math.random() * 0.5;
        particle.style.boxShadow = `0 0 ${Math.random() * 10}px ${particle.style.background}`;
        
        // Animation
        const duration = Math.random() * 10 + 10; // 10s to 20s
        
        particle.animate([
            { transform: 'translate(0, 0)', opacity: 0 },
            { opacity: particle.style.opacity, offset: 0.2 },
            { opacity: particle.style.opacity, offset: 0.8 },
            { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
        
        container.appendChild(particle);
    }
});
