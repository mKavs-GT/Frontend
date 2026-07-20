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

    const careerForm = document.getElementById('career-form');
    const careerResult = document.getElementById('career-result');
    const careerDescriptions = {
        'Artificial Intelligence (AI) & Machine Learning Engineer': 'Building smart systems and algorithms is one of the highest-paying and most sought-after tech fields. This path suits analytical thinkers who enjoy coding, math, and innovation.',
        'Data Scientist': 'Organizing and analyzing big data helps organizations make strategic decisions. This is ideal for curious problem-solvers who love statistics and storytelling with data.',
        'Healthcare Professional (Doctor/Registered Nurse)': 'Providing essential patient care in a stable, impactful field. This path is best for empathetic learners who want to support others and work in medicine.',
        'Cybersecurity Specialist': 'Protecting digital infrastructure from cyber threats and data breaches. This is a strong match for detail-oriented minds who enjoy security and constant learning.',
        'Content Creator / Digital Influencer': 'Building personal brands, streaming, and multimedia content for platforms like YouTube and TikTok. This works well for creative communicators who love storytelling and audience growth.',
        'Digital Marketing Specialist': 'Managing online campaigns, social media, and e-commerce growth. Choose this if you enjoy a mix of creativity, strategy, and measurable digital impact.',
        'Software Engineer': 'Developing applications and operating systems that drive daily life. This career fits people who like building products, solving problems, and writing clean code.',
        'Renewable Energy Engineer': 'Designing sustainable, green energy solutions. This is a great choice for those passionate about environmental impact and engineering innovation.',
        'Financial Technologist / Investment Banker': 'Merging finance and technology to build modern monetary systems. This path suits analytical thinkers who enjoy markets, business, and fintech tools.',
        'UI/UX Designer': 'Creating engaging and intuitive interfaces for digital products and websites. This career matches creative thinkers who care about user experience and polished visuals.'
    };

    if (careerForm && careerResult) {
        careerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('You will be contacted shortly.');
            careerResult.innerHTML = `
                <div class="career-result-summary">
                    <p>Thank you! You will be contacted shortly with your career report details.</p>
                </div>
            `;
        });
    }

    const slides = document.querySelectorAll('.report-carousel .carousel-slide');
    const indicator = document.getElementById('carousel-indicator');
    let currentSlide = 0;

    if (slides.length && indicator) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
            indicator.textContent = `${currentSlide + 1} / ${slides.length}`;
        }, 3000);
    }

    const preloader = document.getElementById('preloader');
    const progressEl = document.getElementById('preloader-progress');
    const minimumLoadTime = 3000;
    const startTime = Date.now();

    const animateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (progress > 100) progress = 100;
            progressEl.style.width = `${progress}%`;
            if (progress === 100) {
                clearInterval(interval);
            }
        }, minimumLoadTime / 20);
    };

    animateProgress();

    window.addEventListener('load', () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minimumLoadTime - elapsed);
        setTimeout(() => {
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 300);
            }
        }, remaining);
    });
});
