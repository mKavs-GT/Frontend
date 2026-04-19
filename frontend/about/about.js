document.addEventListener('DOMContentLoaded', () => {
    console.log('MKAVS Website Loaded');

    // Star & Tools Mouse Repulsion Effect
    const stars = document.querySelectorAll('.star-placeholder');
    const toolIcons = document.querySelectorAll('.tool-icon');

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        stars.forEach(star => {
            const rect = star.getBoundingClientRect();
            const starX = rect.left + rect.width / 2;
            const starY = rect.top + rect.height / 2;

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

        toolIcons.forEach(icon => {
            const rect = icon.getBoundingClientRect();
            const iconX = rect.left + rect.width / 2;
            const iconY = rect.top + rect.height / 2;

            const diffX = mouseX - iconX;
            const diffY = mouseY - iconY;
            const distance = Math.sqrt(diffX * diffX + diffY * diffY);

            // Repulsion radius for tools
            const maxDistance = 150;

            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                const moveX = -(diffX * force * 0.7); 
                const moveY = -(diffY * force * 0.7);

                icon.style.setProperty('--repel-x', `${moveX}px`);
                icon.style.setProperty('--repel-y', `${moveY}px`);
            } else {
                icon.style.setProperty('--repel-x', `0px`);
                icon.style.setProperty('--repel-y', `0px`);
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

 // Toolbar color shift logic
document.addEventListener('scroll', () => {
    const toolbar = document.querySelector('.main-toolbar');
    const header = document.querySelector('.header');
    if (toolbar && header) {
        if (window.scrollY > header.offsetHeight - 50) {
            toolbar.classList.add('scrolled');
        } else {
            toolbar.classList.remove('scrolled');
        }
    }
});
