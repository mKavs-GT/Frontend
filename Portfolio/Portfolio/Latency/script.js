document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const progressFill = document.getElementById('progress-fill');
    const loadingDuration = 3000;
    let startTime = null;

    const animatePreloader = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(100, Math.round((elapsed / loadingDuration) * 100));

        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }

        if (elapsed < loadingDuration) {
            window.requestAnimationFrame(animatePreloader);
        } else {
            if (preloader) {
                preloader.classList.add('loaded');
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.classList.remove('preloading');
                }, 600);
            }
        }
    };

    document.body.classList.add('preloading');
    window.requestAnimationFrame(animatePreloader);

    // --- Hero Parallax Scroll Effect ---
    const layers = {
        left: document.getElementById('para-left'),
        right: document.getElementById('para-right'),
        bottom: document.getElementById('para-bottom')
    };

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        // Entry trigger (Stays visible once triggered)
        if (scrolled > 15) {
            layers.left.classList.add('visible');
            layers.right.classList.add('visible');
            layers.bottom.classList.add('visible');
        }

        // Granular Parallax (Only if within top hero section)
        if (scrolled > 50 && scrolled < 500) {
            const speed = 0.05;
            layers.left.style.transform = `translate(15vw, calc(-50% + ${(scrolled - 50) * speed}px))`;
            layers.right.style.transform = `translate(-15vw, calc(-50% - ${(scrolled - 50) * speed}px))`;
            layers.bottom.style.transform = `translate(-50%, ${- (scrolled - 50) * speed}px)`;
        }

        // Navbar Visibility Logic (Hidden on scroll down, revealed on scroll up)
        const nav = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            nav.classList.remove('nav-hidden');
            nav.style.background = 'rgba(5, 5, 5, 0.4)';
            return;
        }

        if (currentScroll > lastScroll && !nav.classList.contains('nav-hidden') && currentScroll > 100) {
            // Scrolling Down
            nav.classList.add('nav-hidden');
        } else if (currentScroll < lastScroll && nav.classList.contains('nav-hidden')) {
            // Scrolling Up
            nav.classList.remove('nav-hidden');
            nav.style.background = 'rgba(5, 5, 5, 0.8)';
        }

        lastScroll = currentScroll;
    });

    let lastScroll = 0;

    // --- Countdown Timer ---
    const countdownEl = document.getElementById('countdown');
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14); // Next Hackathon in 14 days

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownEl.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- Member Counter Animation ---
    const memberCountEl = document.getElementById('member-count');
    let count = 0;
    const targetCount = 1248;
    const duration = 2000; // 2 seconds
    const interval = 20;
    const increment = targetCount / (duration / interval);

    const counter = setInterval(() => {
        count += increment;
        if (count >= targetCount) {
            memberCountEl.innerText = targetCount.toLocaleString();
            clearInterval(counter);
        } else {
            memberCountEl.innerText = Math.floor(count).toLocaleString();
        }
    }, interval);

    // --- Mobile Navigation ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links a');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });

    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('open');
        });
    });

    // --- Theme Toggle ---
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    function updateThemeButton() {
        if (body.classList.contains('light-mode')) {
            themeToggle.innerText = 'Dark Mode';
        } else {
            themeToggle.innerText = 'Light Mode';
        }
    }

    if (savedTheme === 'light') {
        body.classList.add('light-mode');
    }
    updateThemeButton();

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
        updateThemeButton();
    });

    // --- Join Form Submission ---
    const joinForm = document.getElementById('join-form');
    const formMessage = document.getElementById('form-message');

    if (joinForm) {
        joinForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const emailInput = document.getElementById('join-email');
            const emailValue = emailInput.value.trim();
            if (emailValue) {
                formMessage.innerText = `Thanks, ${emailValue}! You are on the invite list.`;
                emailInput.value = '';
                emailInput.blur();
            } else {
                formMessage.innerText = 'Please enter a valid email address.';
            }
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // --- Interactive Intersection Observer ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .checkpoint, .impact-card, .terminal-card').forEach(el => {
        // Ensure legacy elements also work with the new .reveal logic
        if (!el.classList.contains('reveal')) el.classList.add('reveal');
        revealObserver.observe(el);
    });
});
