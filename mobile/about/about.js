document.addEventListener('DOMContentLoaded', () => {
    console.log('MKAVS Website Loaded');

    // Star Mouse Repulsion Effect
    const stars = document.querySelectorAll('.star-placeholder');

    document.addEventListener('mousemove', (e) => {
        stars.forEach(star => {
            const rect = star.getBoundingClientRect();
            const starX = rect.left + rect.width / 2;
            const starY = rect.top + rect.height / 2;

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const diffX = mouseX - starX;
            const diffY = mouseY - starY;
            const distance = Math.sqrt(diffX * diffX + diffY * diffY);

            // Repulsion radius
            const maxDistance = 150;

            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                const moveX = -(diffX * force * 0.8); // Adjust multiplier for strength
                const moveY = -(diffY * force * 0.8);

                star.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                star.style.transform = `translate(0, 0)`;
            }
        });
    });

    // Scroll Reveal Animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Horizontal Scroll Logic
    const scrollContainer = document.querySelector('.team-scroll-container');
    const stickyViewport = document.querySelector('.team-sticky-viewport');
    const horizontalTrack = document.querySelector('.team-horizontal-track');

    if (scrollContainer && stickyViewport && horizontalTrack) {
        window.addEventListener('scroll', () => {
            const containerRect = scrollContainer.getBoundingClientRect();
            const containerTop = containerRect.top;
            const containerHeight = containerRect.height;
            const viewportHeight = window.innerHeight;

            const scrollDist = containerHeight - viewportHeight;
            if (scrollDist <= 0) return;

            let scrollY = -containerTop;
            if (scrollY < 0) scrollY = 0;
            if (scrollY > scrollDist) scrollY = scrollDist;

            const progress = scrollY / scrollDist;
            const maxTranslate = 75; // %
            const translateX = -(progress * maxTranslate);

            horizontalTrack.style.transform = `translateX(${translateX}%)`;
        });
    }

    // Our Process Horizontal Scroll Logic
    const processContainer = document.querySelector('.process-scroll-container');
    const processTrack = document.querySelector('.process-horizontal-track');

    if (processContainer && processTrack) {
        window.addEventListener('scroll', () => {
            const containerRect = processContainer.getBoundingClientRect();
            const containerTop = containerRect.top;
            const containerHeight = containerRect.height;
            const viewportHeight = window.innerHeight;

            const scrollDist = containerHeight - viewportHeight;
            if (scrollDist <= 0) return;

            let scrollY = -containerTop;
            if (scrollY < 0) scrollY = 0;
            if (scrollY > scrollDist) scrollY = scrollDist;

            const progress = scrollY / scrollDist;
            // 7 items, so we need to translate by 6/7 of the total width
            const maxTranslate = (6 / 7) * 100; // ~85.714%
            const translateX = -(progress * maxTranslate);

            processTrack.style.transform = `translateX(${translateX}%)`;
        });
    }

    // Image Carousel Horizontal Scroll Logic
    const imageContainer = document.querySelector('.image-scroll-container');
    const imageTrack = document.querySelector('.image-horizontal-track');

    if (imageContainer && imageTrack) {
        window.addEventListener('scroll', () => {
            const containerRect = imageContainer.getBoundingClientRect();
            const containerTop = containerRect.top;
            const containerHeight = containerRect.height;
            const viewportHeight = window.innerHeight;

            const scrollDist = containerHeight - viewportHeight;
            if (scrollDist <= 0) return;

            let scrollY = -containerTop;
            if (scrollY < 0) scrollY = 0;
            if (scrollY > scrollDist) scrollY = scrollDist;

            const progress = scrollY / scrollDist;
            // 5 items, track width 500%. Move to -80% to show the 5th item.
            const maxTranslate = 80;
            const translateX = -(progress * maxTranslate);

            imageTrack.style.transform = `translateX(${translateX}%)`;
        });
    }



    // Observe elements with the 'hidden' class
    document.querySelectorAll('.hidden').forEach(el => {
        observer.observe(el);
    });
});
