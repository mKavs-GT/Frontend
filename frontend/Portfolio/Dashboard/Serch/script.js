document.addEventListener('DOMContentLoaded', () => {

    // Mobile Nav Toggle
    const toggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    if (toggle) {
        toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Accordion
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const wasActive = item.classList.contains('active');
            item.closest('.accordion').querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
            if (!wasActive) item.classList.add('active');
        });
    });

    // Animated Counters
    const counters = document.querySelectorAll('[data-target]');
    let counterStarted = false;
    const counterBar = document.querySelector('.counter-bar');

    function startCounters() {
        if (counterStarted) return;
        counterStarted = true;
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const step = Math.ceil(target / (duration / 16));
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                counter.textContent = current + (target === 99 ? '' : '+');
            }, 16);
        });
    }

    // Scroll Reveal
    const reveals = document.querySelectorAll('.service-card, .process-step, .initiative-card, .news-card, .team-card, .testimonial-card, .about-text, .about-images, .why-content, .why-media, .faq-left, .faq-right, .newsletter-inner');
    reveals.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target === counterBar) startCounters();
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
    if (counterBar) observer.observe(counterBar);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
