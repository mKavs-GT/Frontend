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

    // Form interactions - DISABLED (Using fetch logic in consult.html)
    /*
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.submit-btn');
            const originalText = btn.innerText;

            // Capture Data
            const formData = {
                name: form.querySelector('input[type="text"]').value,
                email: form.querySelector('input[type="email"]').value,
                phone: form.querySelector('input[type="tel"]').value,
                projectInfo: form.querySelector('textarea').value
            };

            // Log to DataService
            if (window.mkavsDataService) {
                window.mkavsDataService.logConsultation(formData);
            }

            btn.innerText = 'Sent!';
            btn.style.background = '#CCFF00'; // Neon accent
            btn.style.color = '#000';

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = '';
                btn.style.color = '';
                form.reset();
            }, 3000);
        });
    }
    */

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
