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
        const updateProcessScroll = () => {
            const containerRect = procScrollContainer.getBoundingClientRect();
            const containerTop = containerRect.top;
            const containerHeight = containerRect.height;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

            const scrollDist = containerHeight - viewportHeight;

            if (scrollDist <= 0) return;

            let scrollY = -containerTop;
            if (scrollY < 0) scrollY = 0;
            if (scrollY > scrollDist) scrollY = scrollDist;

            const progress = scrollY / scrollDist;

            const trackWidth = procHorizontalTrack.scrollWidth;
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

            const maxTranslate = Math.max(0, trackWidth - viewportWidth + 30);
            const translateX = -(progress * maxTranslate);

            procHorizontalTrack.style.transform = `translate3d(${translateX}px, 0, 0)`;
        };

        window.addEventListener('scroll', updateProcessScroll, { passive: true });
        window.addEventListener('resize', updateProcessScroll);
        document.addEventListener('touchmove', updateProcessScroll, { passive: true });
        updateProcessScroll();
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
