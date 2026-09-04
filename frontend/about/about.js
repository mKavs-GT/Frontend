document.addEventListener('DOMContentLoaded', () => {
    console.log('MKAVS Website Loaded');

    // Star & Tools Mouse Repulsion Effect (Optimized with rAF & cached coordinates)
    const stars = document.querySelectorAll('.star-placeholder');
    const toolIcons = document.querySelectorAll('.tool-icon');

    let mouseX = -1000;
    let mouseY = -1000;
    let isRepelTicking = false;

    // Cache element positions on resize/scroll to avoid layout thrashing during mousemove
    let starCenters = [];
    let toolCenters = [];

    function updateElementCenters() {
        starCenters = Array.from(stars).map(star => {
            const rect = star.getBoundingClientRect();
            return {
                el: star,
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        });

        toolCenters = Array.from(toolIcons).map(icon => {
            const rect = icon.getBoundingClientRect();
            return {
                el: icon,
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        });
    }

    // Initial calculation and update on resize/scroll
    updateElementCenters();
    window.addEventListener('resize', updateElementCenters, { passive: true });
    window.addEventListener('scroll', updateElementCenters, { passive: true });

    function processRepel() {
        const maxDistance = 150;

        // Only process stars if in proximity
        for (let i = 0; i < starCenters.length; i++) {
            const item = starCenters[i];
            const diffX = mouseX - item.x;
            const diffY = mouseY - item.y;
            const distance = Math.sqrt(diffX * diffX + diffY * diffY);

            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                const moveX = -(diffX * force * 0.8);
                const moveY = -(diffY * force * 0.8);
                item.el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                item.el.style.transform = 'translate(0, 0)';
            }
        }

        // Only process tools if in proximity
        for (let i = 0; i < toolCenters.length; i++) {
            const item = toolCenters[i];
            const diffX = mouseX - item.x;
            const diffY = mouseY - item.y;
            const distance = Math.sqrt(diffX * diffX + diffY * diffY);

            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                const moveX = -(diffX * force * 0.7);
                const moveY = -(diffY * force * 0.7);
                item.el.style.setProperty('--repel-x', `${moveX}px`);
                item.el.style.setProperty('--repel-y', `${moveY}px`);
            } else {
                item.el.style.setProperty('--repel-x', '0px');
                item.el.style.setProperty('--repel-y', '0px');
            }
        }

        isRepelTicking = false;
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isRepelTicking) {
            isRepelTicking = true;
            requestAnimationFrame(processRepel);
        }
    }, { passive: true });

    // Scroll Reveal Animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Process Scroll Logic (Similar to Team)
    const procScrollContainer = document.querySelector('.process-scroll-wrapper');
    const procHorizontalTrack = document.querySelector('.process-horizontal-track');

    if (procScrollContainer && procHorizontalTrack) {
        let isScrollTicking = false;

        const updateProcessScroll = () => {
            const containerRect = procScrollContainer.getBoundingClientRect();
            const containerTop = containerRect.top;
            const containerHeight = containerRect.height;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

            const scrollDist = containerHeight - viewportHeight;
            if (scrollDist <= 0) {
                isScrollTicking = false;
                return;
            }

            let scrollY = -containerTop;
            if (scrollY < 0) scrollY = 0;
            if (scrollY > scrollDist) scrollY = scrollDist;

            const progress = scrollY / scrollDist;
            const trackWidth = procHorizontalTrack.scrollWidth;
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

            const maxTranslate = Math.max(0, trackWidth - viewportWidth + 30);
            const translateX = -(progress * maxTranslate);

            procHorizontalTrack.style.transform = `translate3d(${translateX}px, 0, 0)`;
            isScrollTicking = false;
        };

        const onScrollOrResize = () => {
            if (!isScrollTicking) {
                isScrollTicking = true;
                requestAnimationFrame(updateProcessScroll);
            }
        };

        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize, { passive: true });
        document.addEventListener('touchmove', onScrollOrResize, { passive: true });
        updateProcessScroll();
    }

    // Observe elements with the 'reveal-anim' class
    document.querySelectorAll('.reveal-anim').forEach(el => {
        observer.observe(el);
    });

    // Toolbar color shift logic (Optimized & cached)
    const toolbar = document.querySelector('.main-toolbar');
    const header = document.querySelector('.header');
    if (toolbar && header) {
        let headerHeight = header.offsetHeight;
        window.addEventListener('resize', () => {
            headerHeight = header.offsetHeight;
        }, { passive: true });

        window.addEventListener('scroll', () => {
            if (window.scrollY > headerHeight - 50) {
                toolbar.classList.add('scrolled');
            } else {
                toolbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }
});
