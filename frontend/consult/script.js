document.addEventListener('DOMContentLoaded', () => {
    // Simple entry animation
    const elements = document.querySelectorAll('.headline, .info-content, .form-group');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const fadeIn = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(fadeIn, observerOptions);

    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
        observer.observe(el);
    });

    // Form interactions handled in consult.html inline script
    // Input focus effects for parent containers (optional enhancement)
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
    // Conditional display of "Where do you prefer to connect?"
    const discordRadios = document.querySelectorAll('input[name="discord"]');
    const connectGroup = document.getElementById('connect-preference-group');

    if (discordRadios.length > 0 && connectGroup) {
        discordRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'yes') {
                    connectGroup.style.display = 'flex';
                    // Simple fade in effect
                    connectGroup.style.opacity = '0';
                    requestAnimationFrame(() => {
                        connectGroup.style.transition = 'opacity 0.3s ease';
                        connectGroup.style.opacity = '1';
                    });
                } else {
                    connectGroup.style.display = 'none';
                    // clear selection when hidden
                    const connectRadios = connectGroup.querySelectorAll('input[name="connect"]');
                    connectRadios.forEach(r => r.checked = false);
                }
            });
        });
    }
});
