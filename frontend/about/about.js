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

            // Calculate how far we've scrolled into the container
            // We start scrolling when container hits top of viewport (containerTop <= 0)
            // We stop when the bottom of container hits bottom of viewport approx

            // The effective scrollable distance is containerHeight - viewportHeight
            const scrollDist = containerHeight - viewportHeight;

            if (scrollDist <= 0) return;

            // How much have we scrolled down from the top of the container?
            // containerTop is typically negative when we are scrolling through it
            let scrollY = -containerTop;

            // Clamp between 0 and scrollDist
            if (scrollY < 0) scrollY = 0;
            if (scrollY > scrollDist) scrollY = scrollDist;

            // Percentage scrolled (0 to 1)
            const progress = scrollY / scrollDist;

            // We want to move the track horizontally.
            // Track width is 400% (4 items). We want to show the last one at the end.
            // So we translate from 0% to -75% (showing 4th item which starts at 75%)
            const maxTranslate = 75; // %
            const translateX = -(progress * maxTranslate);

            horizontalTrack.style.transform = `translateX(${translateX}%)`;
        });
    }

    // Process Scroll Logic (Similar to Team)
    const procScrollContainer = document.querySelector('.process-scroll-wrapper');
    const procHorizontalTrack = document.querySelector('.process-horizontal-track');

    if (procScrollContainer && procHorizontalTrack) {
        window.addEventListener('scroll', () => {
            const containerRect = procScrollContainer.getBoundingClientRect();
            const containerTop = containerRect.top;
            const containerHeight = containerRect.height;
            const viewportHeight = window.innerHeight;

            const scrollDist = containerHeight - viewportHeight;

            if (scrollDist <= 0) return;

            let scrollY = -containerTop;
            if (scrollY < 0) scrollY = 0;
            if (scrollY > scrollDist) scrollY = scrollDist;

            const progress = scrollY / scrollDist;

            // We have 7 cards. Suppose we want to show ~2 at a time.
            // Width of track? 
            // In CSS I put width as auto (flex).
            // We need to calculate how much to translate.
            // Let's translate until the last card is fully visible aligned to right or left.
            // Better: Translate from 0 to (trackWidth - viewportWidth + padding)

            const trackWidth = procHorizontalTrack.scrollWidth;
            const viewportWidth = window.innerWidth;

            // Maximum translation to show the end of the track
            // We adding some padding-right in CSS for mobile, but for desktop?
            // Let's assume we want to scroll the whole width minus the view.

            // If on mobile, we might have disabled the transform in CSS, check computed style
            if (window.getComputedStyle(procHorizontalTrack).flexDirection === 'column') {
                return; // Mobile layout handled by CSS flow
            }

            const maxTranslate = trackWidth - viewportWidth + (viewportWidth * 0.05); // +5vw margin

            const translateX = -(progress * maxTranslate);

            procHorizontalTrack.style.transform = `translateX(${translateX}px)`;
        });
    }

    // Observe elements with the 'hidden' class
    document.querySelectorAll('.hidden').forEach(el => {
        observer.observe(el);
    });
});
