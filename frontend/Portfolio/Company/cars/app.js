document.addEventListener('DOMContentLoaded', () => {
    // 1. Color circles handling for the hero product card
    const colorCircles = document.querySelectorAll('.color-circle');
    const cardImgContainer = document.querySelector('.card-img-container');
    let currentImg = document.getElementById('product-card-img');

    colorCircles.forEach(circle => {
        circle.addEventListener('click', () => {
            // Update active state on the circles
            colorCircles.forEach(c => c.classList.remove('active'));
            circle.classList.add('active');

            const newImageSrc = circle.getAttribute('data-color');
            if (currentImg && currentImg.getAttribute('src') !== newImageSrc && cardImgContainer) {
                // Create new image for a smooth blend transition
                const newImg = document.createElement('img');
                newImg.src = newImageSrc;
                newImg.alt = 'Car Color';
                newImg.className = 'product-card-img';
                newImg.style.opacity = '0';
                newImg.style.position = 'absolute';
                newImg.style.transition = 'opacity 0.4s ease-in-out';
                
                cardImgContainer.appendChild(newImg);
                
                // Force reflow
                void newImg.offsetHeight;
                
                // Fade in the new image over the old one
                newImg.style.opacity = '1';
                
                const oldImg = currentImg;
                currentImg = newImg;
                
                // Remove old image after transition completes
                setTimeout(() => {
                    if (oldImg && oldImg.parentNode) {
                        oldImg.parentNode.removeChild(oldImg);
                    }
                }, 450);
            }
        });
    });

    // 2. Brand badges toggle
    const brandBadges = document.querySelectorAll('#brand-filters .brand-badge');
    brandBadges.forEach(badge => {
        badge.addEventListener('click', () => {
            brandBadges.forEach(b => b.classList.remove('active'));
            badge.classList.add('active');
        });
    });

    // 3. Service buttons auto-selection in booking form
    const serviceButtons = document.querySelectorAll('[data-service]');
    const serviceSelect = document.getElementById('service-select');
    serviceButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const serviceType = btn.getAttribute('data-service');
            if (serviceSelect && serviceType) {
                serviceSelect.value = serviceType;
            }
        });
    });

    // 4. Rent car buttons auto-selection in rental form
    const rentButtons = document.querySelectorAll('[data-rent]');
    const rentSelect = document.getElementById('rent-select');
    rentButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rentType = btn.getAttribute('data-rent');
            if (rentSelect && rentType) {
                rentSelect.value = rentType;
            }
        });
    });

    // 5. Parts category filter tabs
    const partsTabs = document.querySelectorAll('#parts-tabs a');
    const productCards = document.querySelectorAll('.d3-product-card');

    partsTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            partsTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const selectedTab = tab.getAttribute('data-tab');
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (selectedTab === 'all' || selectedTab === category) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.3s ease';
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 6. Booking forms submission handlers with live feedback
    const serviceForm = document.getElementById('service-form');
    const serviceFeedback = document.getElementById('service-feedback');
    if (serviceForm && serviceFeedback) {
        serviceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = serviceForm.querySelector('.booking-submit');
            const originalText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = 'Processing...';

            setTimeout(() => {
                serviceFeedback.innerText = '✓ Service booking request received! We will contact you shortly.';
                serviceFeedback.style.display = 'block';
                serviceForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;

                setTimeout(() => {
                    serviceFeedback.style.display = 'none';
                }, 5000);
            }, 800);
        });
    }

    const rentForm = document.getElementById('rent-form');
    const rentFeedback = document.getElementById('rent-feedback');
    if (rentForm && rentFeedback) {
        rentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = rentForm.querySelector('.booking-submit');
            const originalText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = 'Processing...';

            setTimeout(() => {
                rentFeedback.innerText = '✓ Vehicle reservation confirmed! Our concierge will reach out to you.';
                rentFeedback.style.display = 'block';
                rentForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;

                setTimeout(() => {
                    rentFeedback.style.display = 'none';
                }, 5000);
            }, 800);
        });
    }

    // 7. Active Nav Link update on scroll
    const navLinks = document.querySelectorAll('.buylix-navbar .nav-links a');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});
