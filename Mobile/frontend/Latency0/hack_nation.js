document.addEventListener('DOMContentLoaded', () => {
    // --- Particle Repulsion Effect ---
    const canvas = document.getElementById('repulsion-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('resize', resizeCanvas);
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.baseX = x;
            this.baseY = y;
            this.size = 1.5;
            this.density = (Math.random() * 30) + 1;
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 242, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }
        }
    }

    function initParticles() {
        particles = [];
        let gap = 30;
        for (let y = 0; y < canvas.height; y += gap) {
            for (let x = 0; x < canvas.width; x += gap) {
                particles.push(new Particle(x, y));
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
            particles[i].update();
        }
        requestAnimationFrame(animate);
    }

    resizeCanvas();
    animate();

    // --- Scroll Animations (Updated) ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // --- FAQ Accordion ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;

            // Optional: Close others
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            item.classList.toggle('active');
        });
    });


    // --- Registration Modal ---
    const modal = document.getElementById('join-modal');
    const joinBtns = document.querySelectorAll('a[href="#apply"]');
    const closeBtn = document.querySelector('.close-btn');

    joinBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Disable scroll
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scroll
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scroll
        }
    });

    const form = document.getElementById('registration-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for registering! We will get back to you soon.');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scroll
        form.reset();
    });

});


