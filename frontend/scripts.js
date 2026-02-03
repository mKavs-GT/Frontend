// --- Tailwind Config (Included here to enable custom animations) ---
tailwind.config = {
    theme: {
        extend: {
            fontSize: {
                '4xl-plus': 'calc(2.25rem + 5px)',
                '6xl-plus': 'calc(3.75rem + 5px)',
            },
            fontFamily: {
                'marker': ['"Permanent Marker"', 'cursive'],
                'sans': ['"Outfit"', 'sans-serif'],
            },
            animation: {
                'scroll-left': 'scroll-left 40s linear infinite',
                'scroll-right': 'scroll-right 40s linear infinite',
            },
            keyframes: {
                'scroll-left': {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                'scroll-right': {
                    '0%': { transform: 'translateX(-50%)' },
                    '100%': { transform: 'translateX(0)' }
                }
            }
        }
    }
}

// --- Star Image Repulsion Logic (Slide 1) ---
const IMG_REPULSION_RADIUS = 150;
const IMG_MAX_PUSH = 50;
let starImages;

function updateImageStars(currentMouseX, currentMouseY) {
    starImages.forEach(star => {
        if (star.style.opacity !== '1') return;

        const rect = star.getBoundingClientRect();
        const starCenterX = rect.left + rect.width / 2;
        const starCenterY = rect.top + rect.height / 2;
        const dx = currentMouseX - starCenterX;
        const dy = currentMouseY - starCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        let translateX = 0, translateY = 0, scale = 1;

        if (distance < IMG_REPULSION_RADIUS) {
            const repulsionFactor = 1 - (distance / IMG_REPULSION_RADIUS);
            const angle = Math.atan2(dy, dx);
            translateX = -Math.cos(angle) * IMG_MAX_PUSH * repulsionFactor;
            translateY = -Math.sin(angle) * IMG_MAX_PUSH * repulsionFactor;
            scale = 1 + (0.2 * repulsionFactor);
        }
        star.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
    });
}

// --- Metric Counting Logic (Slide 1) ---
function countUp(element, finalValue, suffix) {
    const duration = 2000;
    const startTime = performance.now();
    element.textContent = '0' + suffix;

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easedProgress * finalValue);
        element.textContent = currentValue.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// --- GLOBAL SCROLL STATE & CONSTANTS ---
let currentSlideIndex = 0;
// Note: We use a unified 'globalScrollY' to track position across all slides.
let globalScrollY = 0;
let totalVirtualHeight = 0;
let slideHeights = [];
// Configuration
const FLIP_SCROLL_HEIGHT = 800; // Extra pixels of scrolling to trigger the flip
let isImageFlipping = false;

// --- ELEMENTS ---
let allSlides;
let slide2, slide4, slide1Image, slide1OverlayImage, mainToolbar, poppingLogo, textLeft, getStartedButton;
let scrollParallaxVideo;
let zoomImageFlipper, loopingTextWrapper, worksListColumn, zoomImageContainer, thumbnailGallery;
let worksListItems;
let zoomMainImage;
let thumbnailImages;
let endCapVideoSlide5;
let endCapVideoSlide6;
let mainFooter; // May not exist in DOM based on previous file, but we keep reference safety
let scrollbarTrack, scrollbarThumb;


// --- Data for Thumbnail Switching ---
const THUMBNAIL_DATA = {
    'portfolio': ['images/thumb1.png', 'images/thumb2.png', 'images/thumb3.png'],
    'company': ['images/thumb4.png', 'images/thumb5.png', 'images/thumb6.png'],
    'ecommerce': ['images/thumb7.png', 'images/thumb8.png', 'images/thumb9.png'],
};

// --- External URLs for specific portfolio items ---
const PORTFOLIO_EXTERNAL_URLS = {
    '2': 'https://pritamvfx.vercel.app/',
    '3': 'https://saracode-topaz.vercel.app/',
    '4': 'https://filmaura-theta.vercel.app/',
    '7': 'https://waypoint-three.vercel.app/'
};

// --- Thumbnail Setting Logic ---
function setThumbnails(category, skipMainImageUpdate = false) {
    const sources = THUMBNAIL_DATA[category];

    if (!sources || sources.length === 0 || thumbnailImages.length === 0) return;

    activeCategory = category;

    // Update list item styling
    worksListItems.forEach(item => {
        item.classList.remove('font-bold', 'text-white', 'text-4xl');
        item.classList.add('font-light', 'text-gray-400', 'text-3xl');
    });

    const activeItem = Array.from(worksListItems).find(item => item.dataset.category === category);
    if (activeItem) {
        activeItem.classList.add('font-bold', 'text-white', 'text-4xl');
        activeItem.classList.remove('font-light', 'text-gray-400', 'text-3xl');
    }

    // Update thumbnail image sources and parent links
    thumbnailImages.forEach((img, index) => {
        if (sources[index]) {
            img.src = sources[index];
            img.dataset.fullSrc = sources[index];
        }
    });

    if (zoomMainImage && sources[0] && !skipMainImageUpdate) {
        updateMainZoomImage(sources[0]);
    }
}

function updateMainZoomImage(newSrc) {
    if (!zoomMainImage) return;
    zoomMainImage.src = newSrc;

    const zoomLink = document.getElementById('zoom-image-link');
    if (zoomLink) {
        const match = newSrc.match(/thumb(\d+)\.png/);
        if (match && match[1]) {
            const portfolioNumber = match[1];
            // Check if this portfolio has an external URL
            if (PORTFOLIO_EXTERNAL_URLS[portfolioNumber]) {
                zoomLink.href = PORTFOLIO_EXTERNAL_URLS[portfolioNumber];
            } else {
                zoomLink.href = `./portfolio/${portfolioNumber}/index.html`;
            }
        }
    }
}


// --- UNIFIED VIRTUAL SCROLL LOGIC ---

function calculateSlideHeights() {
    const viewportHeight = window.innerHeight;

    // Define heights for each slide in the virtual timeline
    // Slide 1: Fixed
    // Slide 2: Scrollable content (Total Scroll Height)
    // Slide 3: Fixed + Flip Interaction Buffer
    // Slide 4: Scrollable content
    // Slide 5: Fixed
    // Slide 6: Fixed (or Scrollable if footer is long)

    // Helper to get scroll height, ensuring at least 1 viewport height
    const getScrollHeight = (el) => el ? Math.max(el.scrollHeight, viewportHeight) : viewportHeight;

    slideHeights = [
        viewportHeight, // Slide 1
        getScrollHeight(slide2), // Slide 2
        viewportHeight + FLIP_SCROLL_HEIGHT, // Slide 3 (Base + Flip Buffer)
        getScrollHeight(slide4), // Slide 4
        viewportHeight, // Slide 5
        getScrollHeight(document.getElementById('slide-6')) // Slide 6
    ];

    totalVirtualHeight = slideHeights.reduce((a, b) => a + b, 0);
}

// --- Slide 2 Animation Trigger (Global) ---
let slide2Animated = false;
let slide4Animated = false;
function triggerSlide2Animations() {
    if (slide2Animated) return; // Run once

    const text = document.getElementById('slide-2-text');
    const card1 = document.getElementById('slide-2-card-1');
    const card2 = document.getElementById('slide-2-card-2');
    const card3 = document.getElementById('slide-2-card-3');

    // Text Slide In
    if (text) {
        text.classList.remove('opacity-0', '-translate-x-full');
        text.classList.add('opacity-100', 'translate-x-0');
    }

    // Images Fan Out
    // Images Pop In (Staggered)
    if (card1) {
        card1.classList.remove('opacity-0', 'scale-0');
        card1.classList.add('opacity-100', 'scale-100');
    }

    setTimeout(() => {
        if (card2) {
            card2.classList.remove('opacity-0', 'scale-0');
            card2.classList.add('opacity-100', 'scale-100');
        }
    }, 300); // 300ms delay

    setTimeout(() => {
        if (card3) {
            card3.classList.remove('opacity-0', 'scale-0');
            card3.classList.add('opacity-100', 'scale-100');
        }
    }, 600); // 600ms delay

    slide2Animated = true;
}

function triggerSlide4Animations() {
    if (slide4Animated) return; // Run once

    const headerText = document.getElementById('slide-4-header-text');
    const imageCard = document.getElementById('slide-4-image-card');
    const card1 = document.getElementById('slide-4-card-1');
    const card2 = document.getElementById('slide-4-card-2');
    const card3 = document.getElementById('slide-4-card-3');

    // Header Slide In
    if (headerText) {
        headerText.classList.remove('opacity-0', '-translate-x-full');
        headerText.classList.add('opacity-100', 'translate-x-0');
    }

    // Image Pop In
    setTimeout(() => {
        if (imageCard) {
            imageCard.classList.remove('opacity-0', 'scale-0');
            imageCard.classList.add('opacity-100', 'scale-100');
        }
    }, 200);

    // Cards Pop In (Staggered)
    setTimeout(() => {
        if (card1) {
            card1.classList.remove('opacity-0', 'scale-0');
            card1.classList.add('opacity-100', 'scale-100');
        }
    }, 400);

    setTimeout(() => {
        if (card2) {
            card2.classList.remove('opacity-0', 'scale-0');
            card2.classList.add('opacity-100', 'scale-100');
        }
    }, 600);

    setTimeout(() => {
        if (card3) {
            card3.classList.remove('opacity-0', 'scale-0');
            card3.classList.add('opacity-100', 'scale-100');
        }
    }, 800);

    slide4Animated = true;
}

function updateScrollState(newGlobalY) {
    // 0. Sticky Toolbar Logic
    if (mainToolbar) {
        // Threshold to avoid jitter
        if (Math.abs(newGlobalY - globalScrollY) > 5) {
            // Logic:
            // 1. If near top (< 50px), ALWAYS show.
            // 2. If scrolling DOWN (new > old) -> Hide
            // 3. If scrolling UP (new < old) -> Show

            if (newGlobalY < 50) {
                mainToolbar.style.transform = 'translateY(0)';
            } else if (newGlobalY > globalScrollY) {
                // Scrolling Down
                mainToolbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling Up
                mainToolbar.style.transform = 'translateY(0)';
            }
        }
    }

    // 1. Clamp Scroll
    globalScrollY = Math.max(0, Math.min(newGlobalY, totalVirtualHeight - window.innerHeight));

    // 2. Determine Current Slide
    let accumulatedHeight = 0;
    let newSlideIndex = 0;
    let localScrollY = 0;

    for (let i = 0; i < slideHeights.length; i++) {
        const height = slideHeights[i];
        if (globalScrollY < accumulatedHeight + height) {
            newSlideIndex = i;
            localScrollY = globalScrollY - accumulatedHeight;
            break;
        }
        accumulatedHeight += height;
    }
    // Edge case: End of scroll
    if (globalScrollY >= totalVirtualHeight - window.innerHeight) {
        newSlideIndex = slideHeights.length - 1;
        localScrollY = slideHeights[newSlideIndex] - window.innerHeight; // Max scroll
    }

    // 3. Update Slides (Standard Transition)
    if (newSlideIndex !== currentSlideIndex) {
        // Handle transitions
        allSlides.forEach((slide, index) => {
            if (index <= newSlideIndex) {
                // Show slide (remove translate-y-full)
                // BUT: Slide 0 is always visible. Slide 1 covers Slide 0.
                if (index > 0) slide.classList.remove('translate-y-full');
            } else {
                // Hide slide (add translate-y-full)
                if (index > 0) slide.classList.add('translate-y-full');
            }
        });

        // Handle Video Playback Logic
        handleVideoPlayback(newSlideIndex);

        currentSlideIndex = newSlideIndex;
    }

    // 4. Handle Internal Logic per Slide
    if (newSlideIndex === 1) { // Slide 2
        triggerSlide2Animations();
        if (slide2) {
            slide2.scrollTop = localScrollY;
            // Scrub Video based on scroll progress within Slide 2
            if (scrollParallaxVideo && scrollParallaxVideo.duration) {
                const slide2ContentHeight = slideHeights[1];
                const scrollableDistance = slide2ContentHeight - window.innerHeight;
                const progress = Math.min(Math.max(localScrollY / scrollableDistance, 0), 1);

                // Map progress to video duration
                scrollParallaxVideo.currentTime = progress * scrollParallaxVideo.duration;

                // Parallax shift: Move video slightly as we scroll
                // Container height is md-500px, Video height is 120% (600px)
                // We have 100px range to move.
                const parallaxShift = (progress - 0.5) * 50; // shift by up to ±25px
                scrollParallaxVideo.style.transform = `translate(-50%, calc(-50% + ${parallaxShift}px))`;
            }
        }
    }
    else if (newSlideIndex === 2) { // Slide 3 (Flip)
        handleSlide3Flip(localScrollY);
    }
    else if (newSlideIndex === 3) { // Slide 4
        triggerSlide4Animations();
        if (slide4) slide4.scrollTop = localScrollY;
    }
    else if (newSlideIndex === 5) { // Slide 6 (Footer)
        const slide6 = document.getElementById('slide-6');
        if (slide6) slide6.scrollTop = localScrollY;
    }

    // 5. Update Scrollbar Thumb
    updateScrollbarVisuals();
}

function handleVideoPlayback(index) {
    // Pause all
    if (endCapVideoSlide5) { endCapVideoSlide5.pause(); endCapVideoSlide5.currentTime = 0; }
    if (endCapVideoSlide6) { endCapVideoSlide6.pause(); endCapVideoSlide6.currentTime = 0; }

    // Play active
    if (index === 4 && endCapVideoSlide5) endCapVideoSlide5.play().catch(e => { });
    if (index === 5 && endCapVideoSlide6) endCapVideoSlide6.play().catch(e => { });
}

// Global Timeout Variable for Flip Sequencing
let slide3FlipTimeout;

function handleSlide3Flip(localY) {
    // Trigger point: 50% through the buffer
    const progress = Math.min(Math.max(localY / FLIP_SCROLL_HEIGHT, 0), 1);

    if (progress > 0.5) {
        // Flipped State (Show List, Hide Cover Text)
        if (!zoomImageContainer.classList.contains('image-final-position')) {
            // SMOOTH ENTRY: Zoom In... overlap... Flip

            // 1. Start Zoom In Immediately
            zoomImageContainer.classList.add('image-final-position');

            // Clear any pending reverse logic
            clearTimeout(slide3FlipTimeout);

            // 2. Start Flip Midway (Overlap)
            slide3FlipTimeout = setTimeout(() => {
                zoomImageFlipper.style.transform = `rotateY(180deg)`;

                if (loopingTextWrapper) {
                    loopingTextWrapper.style.transition = 'opacity 1s ease-out';
                    loopingTextWrapper.style.opacity = 0;
                }

                worksListColumn.classList.add('works-slide-in');
                thumbnailGallery.classList.add('gallery-visible');

                // ENABLE POINTER EVENTS ON IMAGE CONTAINER SO LINK IS CLICKABLE
                zoomImageContainer.style.pointerEvents = 'auto';

                setThumbnails('portfolio', true);

                // Pop Animation
                const thumbs = thumbnailGallery.querySelectorAll('img');
                thumbs.forEach((img, idx) => {
                    setTimeout(() => {
                        img.classList.add('thumb-visible');
                    }, idx * 100 + 100);
                });
            }, 500); // 500ms Overlap (Zoom is 1.2s, so this happens during zoom)
        }
    } else {
        // Unflipped State (Hide List, Show Cover Text)
        if (zoomImageContainer.classList.contains('image-final-position')) {
            // SMOOTH EXIT: Flip Back... overlap... Zoom Out
            // (Reversing the order for smoothness: LIFO)

            // 1. Start Flip Back Immediately
            zoomImageFlipper.style.transform = `rotateY(0deg)`;

            // Clear any pending forward logic
            clearTimeout(slide3FlipTimeout);

            // Hide Content Immediately (Instant Exit)
            worksListColumn.style.transition = 'none';
            worksListColumn.classList.remove('works-slide-in');

            // Disable transition for instant Reset
            thumbnailGallery.style.transition = 'none';
            thumbnailGallery.classList.remove('gallery-visible');

            // DISABLE POINTER EVENTS IMMEDIATELY
            zoomImageContainer.style.pointerEvents = 'none';

            // Reset Scale Instantly
            const thumbs = thumbnailGallery.querySelectorAll('img');
            thumbs.forEach(img => {
                img.style.transition = 'none';
                img.classList.remove('thumb-visible');
            });

            // Show Text Slowly
            if (loopingTextWrapper) {
                loopingTextWrapper.style.transition = 'opacity 1s ease-in';
                loopingTextWrapper.style.opacity = 1;
            }

            // 2. Start Zoom Out Midway (Overlap)
            slide3FlipTimeout = setTimeout(() => {
                zoomImageContainer.classList.remove('image-final-position');

                setTimeout(() => {
                    worksListColumn.style.transition = '';
                    if (thumbnailGallery) thumbnailGallery.style.transition = '';
                    const thumbs = thumbnailGallery.querySelectorAll('img');
                    thumbs.forEach(img => img.style.transition = '');
                }, 50);
            }, 500); // 500ms Overlap
        }
    }
}

function updateScrollbarVisuals() {
    if (!scrollbarThumb) return;
    const progress = globalScrollY / (totalVirtualHeight - window.innerHeight);
    // Move thumb
    // Max top = 0, Max bottom = 100% - thumbHeight
    // Simple percentage top
    scrollbarThumb.style.top = `${progress * 90}%`; // 90% to keep it fast, or subtract thumb height logic
    // Refined: calc(progress * (100% - thumbHeight))
    // Let's assume thumb is fixed height in CSS or %?
    // In HTML it's h-full? No, let's look at HTML.
    // HTML: <div id="custom-scrollbar-thumb" class="w-full ... h-16?">
    // Actually I missed adding height to thumb in previous tool! I should fix that.
    // I'll assume standard height and set it here.
    scrollbarThumb.style.height = '80px';
    const availHeight = window.innerHeight - 80;
    scrollbarThumb.style.top = `${progress * availHeight}px`;
}


// --- INIT ---



document.addEventListener('DOMContentLoaded', () => {
    // Standard Elements
    allSlides = Array.from(document.querySelectorAll('.slide'));
    slide2 = document.getElementById('slide-2');
    scrollParallaxVideo = document.getElementById('scroll-parallax-video');
    slide4 = document.getElementById('slide-4');
    starImages = document.querySelectorAll('.star');
    slide1Image = document.getElementById('slide-1-image');
    slide1OverlayImage = document.getElementById('slide-1-overlay-image');
    mainToolbar = document.getElementById('main-toolbar');
    poppingLogo = document.getElementById('popping-logo');
    textLeft = document.getElementById('text-left');
    getStartedButton = document.getElementById('get-started-button');
    const metricNumbers = document.querySelectorAll('.metric-number');

    zoomImageContainer = document.getElementById('zoom-image-container');
    zoomImageFlipper = document.getElementById('zoom-image-flipper');
    loopingTextWrapper = document.getElementById('looping-text-wrapper');
    worksListColumn = document.getElementById('works-list-column');
    thumbnailGallery = document.getElementById('thumbnail-gallery');
    zoomMainImage = document.getElementById('zoom-image-back');
    thumbnailImages = thumbnailGallery ? thumbnailGallery.querySelectorAll('img') : [];

    endCapVideoSlide5 = document.getElementById('slide-5').querySelector('video');
    endCapVideoSlide6 = document.getElementById('slide-6').querySelector('video');

    scrollbarTrack = document.getElementById('custom-scrollbar-track');
    scrollbarThumb = document.getElementById('custom-scrollbar-thumb');

    // --- SETUP SCROLLING ---
    calculateSlideHeights();
    window.addEventListener('resize', () => {
        calculateSlideHeights();
        updateScrollState(globalScrollY);
    });

    // ResizeObserver to handle dynamic content changes (images loading, etc.)
    const resizeObserver = new ResizeObserver(() => {
        calculateSlideHeights();
        // We don't necessarily need to updateScrollState unless dimensions change drastically
        // causing boundaries to shift while we are viewing them.
        // But for safety, let's allow it to re-clamp if needed.
        updateScrollState(globalScrollY);
    });
    if (slide2) resizeObserver.observe(slide2); // Observe the container? Or children?
    // slide2 is the container with overflow hidden/auto. Its scrollHeight changes when children change.
    // ResizeObserver on the container usually implies its *viewport* changed.
    // To detect scrollHeight change, we might need to observe the content wrapper if it exists, or just body?
    // Actually, ResizeObserver does not fire on scrollHeight change directly.
    // But usually content changes size -> wrapper changes size.
    // Let's observe the *children* of slide 2 if possible, or just putting it on slide2 might catch layout shifts.
    // Better: observe `slide2.firstElementChild` if it exists.
    if (slide2 && slide2.firstElementChild) resizeObserver.observe(slide2.firstElementChild);
    if (slide4 && slide4.firstElementChild) resizeObserver.observe(slide4.firstElementChild);
    // Also Slide 6 footer
    const slide6 = document.getElementById('slide-6');
    if (slide6 && slide6.firstElementChild) resizeObserver.observe(slide6.firstElementChild);

    // --- Intersection Observer for Slide 2 Bottom Text ---
    // --- Intersection Observer for Slide 2 Bottom Text ---
    const slide2BottomText = document.getElementById('slide-2-bottom-text');
    const slide2Marquee = document.getElementById('slide-2-marquee');
    if (slide2BottomText && slide2Marquee) {
        // Observe marquee intersection to trigger text animation earlier
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    slide2BottomText.classList.remove('opacity-0', '-translate-x-full');
                    slide2BottomText.classList.add('opacity-100', 'translate-x-0');
                    observer.unobserve(slide2Marquee); // Run once
                }
            });
        }, {
            threshold: 0.1 // Trigger sooner
        });
        observer.observe(slide2Marquee);
    }

    // Helper: Determine boundaries
    function getSlideBoundaries() {
        let acc = 0;
        return slideHeights.map(h => {
            const val = acc;
            acc += h;
            return val;
        });
    }

    // Helper: Handle "Snap" Navigation
    // Returns the new Global Y
    function calculateSnapScroll(currentY, delta) {
        const boundaries = getSlideBoundaries();
        // Find which slide we are predominantly in
        // actually, rely on currentSlideIndex which is updated in updateScrollState

        const currentIndex = currentSlideIndex;
        const currentSlideHeight = slideHeights[currentIndex];
        const currentSlideStart = boundaries[currentIndex];

        // Check if current slide is "Long/Scrollable"
        // We consider it scrollable if it is significantly larger than viewport
        // OR if it is Slide 2 (Index 1) explicitly requested by user.
        // Slide 3 (Index 2) is Flip. We treat it as semi-scrollable (steps).

        const isContentScrollable = (currentIndex === 1) || (currentIndex === 3 && slide4.scrollHeight > window.innerHeight);

        // Flip Slide (Index 2) Special Case:
        // We want 1 scroll to Flip, 1 scroll to Leave.
        if (currentIndex === 2) {
            // If we are at start of slide 3
            if (Math.abs(currentY - currentSlideStart) < 10) {
                if (delta > 0) return currentSlideStart + FLIP_SCROLL_HEIGHT; // Snap to Flipped
                if (delta < 0) { // Go to Prev Slide (Bottom)
                    const prevIndex = currentIndex - 1;
                    return boundaries[prevIndex] + slideHeights[prevIndex] - window.innerHeight;
                }
            }
            // If we are at end of slide 3 (Flipped)
            else {
                if (delta > 0) return boundaries[currentIndex + 1]; // Go to Next Slide
                if (delta < 0) return currentSlideStart; // Snap back to Unflipped
            }
            // If in between (unlikely with snap, but possible via drag), complete the nearest state
            return delta > 0 ? boundaries[currentIndex + 1] : currentSlideStart;
        }

        if (isContentScrollable) {
            // Normal Scroll behavior
            // But we need to handle "Edge Splitting"
            // If at bottom and scrolling down -> Go to next slide (Snap)
            // If at top and scrolling up -> Go to prev slide (Snap)

            const slideEnd = currentSlideStart + currentSlideHeight - window.innerHeight;
            const buffer = 5; // pixel tolerance

            if (delta > 0) {
                // Scrolling Down
                // We enforce a strict check: You must be effectively AT the bottom.
                // AND we might want to check if the user is *trying* to scroll past.
                // The current logic `currentY >= slideEnd - buffer` says "If you are at the end, any scroll snaps".

                // Problem: If the user scrolls fast, they might hit the end and snap in one go?
                // Or if there is a fractional pixel issue.

                if (currentY >= slideEnd - 1) { // Tighter buffer (1px)
                    // At bottom, snap to next slide
                    if (currentIndex < slideHeights.length - 1) return boundaries[currentIndex + 1];
                    return currentY; // End of page
                } else {
                    // Normal scroll
                    // We CLAMP the result to the slideEnd so they don't overshoot blindly into the snap zone without seeing the end.
                    // But `updateScrollState` handles visuals. 
                    // Let's allow them to reach the end exactly.
                    const nextPotential = currentY + delta;
                    if (nextPotential > slideEnd) return slideEnd; // Stop at end first. Require ONE MORE scroll to snap.
                    return nextPotential;
                }
            } else {
                // Scrolling Up
                if (currentY <= currentSlideStart + 1) { // Tighter buffer
                    // At top, snap to prev slide
                    // when going back, we want to hit the BOTTOM of the previous slide
                    // so we can scroll up through it (if it's scrollable/flippable).

                    if (currentIndex > 0) {
                        const prevIndex = currentIndex - 1;
                        const prevHeight = slideHeights[prevIndex];
                        const prevStart = boundaries[prevIndex];
                        return prevStart + prevHeight - window.innerHeight;
                    }
                    return 0; // Top of page
                } else {
                    // Normal scroll up
                    const nextPotential = currentY + delta;
                    if (nextPotential < currentSlideStart) return currentSlideStart; // Stop at top first.
                    return nextPotential;
                }
            }
        }
        else {
            // FIXED SLIDE (Slide 1, Slide 5, Slide 6, etc)
            // Any Scroll triggers transition
            if (delta > 0) {
                if (currentIndex < slideHeights.length - 1) return boundaries[currentIndex + 1];
                // Special handling for Slide 6 footer reveal if needed
                // If Slide 6 is fixed height but footer is hidden... 
                // Current logic maps Slide 6 height to footer height.
                return currentY;
            } else {
                if (currentIndex > 0) {
                    // When going up to a previous slide:
                    // If prev slide was scrollable, do we go to its bottom?
                    // Yes, otherwise we lose context.
                    const prevIndex = currentIndex - 1;
                    const prevHeight = slideHeights[prevIndex];
                    const prevStart = boundaries[prevIndex];

                    // If prev slide is Fixed, Start = End (roughly).
                    // If prev slide is Scrollable, Bottom = Start + Height - Viewport.
                    return prevStart + prevHeight - window.innerHeight;
                }
                return currentY;
            }
        }
    }

    // Flag to prevent rapid-fire scrolling through slides
    let isScrollLocked = false;
    const SCROLL_COOLDOWN_MS = 1000; // Lock for 1s during slide transitions

    // 1. Wheel
    window.addEventListener('wheel', (e) => {
        if (e.target.closest('#kairon-panel') || e.target.closest('#kairon-button')) return;
        e.preventDefault();

        // If locked (transitioning), ignore new events
        if (isScrollLocked) return;

        const delta = e.deltaY;
        if (Math.abs(delta) < 2) return;

        const newY = calculateSnapScroll(globalScrollY, delta);

        // Detect if this is a "Jump" (Slide Transition or Flip) vs "Scroll"
        // A jump is typically large (viewport size) or specifically the Flip step.
        // We use a threshold relative to the viewport.
        const diff = Math.abs(newY - globalScrollY);
        const isSignificantJump = diff > 200; // Threshold: 200px (arbitrary but covers transitions)

        if (isSignificantJump) {
            updateScrollState(newY);
            isScrollLocked = true;
            setTimeout(() => {
                isScrollLocked = false;
            }, SCROLL_COOLDOWN_MS);
        } else {
            // Continuous scroll (Slide 2 internal) - no lock needed usually
            // However, we should be careful. If we scroll exactly to the edge, 
            // the NEXT scroll will be a jump.
            updateScrollState(newY);
        }

    }, { passive: false });

    // 2. Keyboard (Arrow Keys)
    window.addEventListener('keydown', (e) => {
        // Allow keyboard to override lock? faster navigation?
        // Let's enforce lock there too for consistency, or rely on key repeat rate.
        // Usually keys are slower. Let's adding lock check.

        if (isScrollLocked) {
            // Optional: allow keys to buffer? No, let's ignore.
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') e.preventDefault();
            return;
        }

        let delta = 0;
        if (e.key === 'ArrowDown') delta = 100;
        if (e.key === 'ArrowUp') delta = -100;

        if (delta !== 0) {
            e.preventDefault();
            const newY = calculateSnapScroll(globalScrollY, delta);

            // Apply same lock logic
            const diff = Math.abs(newY - globalScrollY);
            if (diff > 200) {
                isScrollLocked = true;
                setTimeout(() => isScrollLocked = false, SCROLL_COOLDOWN_MS);
            }
            updateScrollState(newY);


        }
    });



    // 3. Scrollbar Drag (Keep existing continuous logic)
    let isDragging = false;
    let startY = 0;
    let startScrollY = 0;

    if (scrollbarTrack && scrollbarThumb) {
        scrollbarThumb.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.clientY;
            startScrollY = globalScrollY;
            scrollbarThumb.classList.add('cursor-grabbing');
            document.body.classList.add('select-none');
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const delta = e.clientY - startY;
            const trackHeight = window.innerHeight - 80;
            const ratio = totalVirtualHeight / trackHeight;
            // Dragging overrides snap
            updateScrollState(startScrollY + (delta * ratio));
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            scrollbarThumb.classList.remove('cursor-grabbing');
            document.body.classList.remove('select-none');
        });

        scrollbarTrack.addEventListener('click', (e) => {
            if (e.target === scrollbarThumb) return;
            // Click to jump - keeping continuous for precision
            const ratio = e.clientY / window.innerHeight;
            updateScrollState(ratio * totalVirtualHeight);
        });
    }

    // --- INITIAL ANIMATIONS (Slide 1) ---
    const activateInitialSlide = () => {
        // 1. Logo Pop + Toolbar Slide Down
        if (poppingLogo) {
            poppingLogo.classList.remove('opacity-0', 'scale-0');
            poppingLogo.classList.add('opacity-100', 'scale-100');
        }
        if (mainToolbar) {
            mainToolbar.classList.remove('-translate-y-full');
        }

        // 2. Hero Image Slide Up (After 500ms)
        setTimeout(() => {
            if (slide1Image) {
                // Base image fade/scale
                slide1Image.classList.remove('opacity-0', 'scale-50');
                slide1Image.classList.add('scale-100', 'opacity-100');
            }
            if (slide1OverlayImage) {
                // Hero Overlay slides up
                slide1OverlayImage.classList.remove('opacity-0', 'translate-y-full');
            }
        }, 500);

        // 3. Stars, Text, Button (After another 500ms -> 1000ms total)
        setTimeout(() => {
            // Stars Pop
            starImages.forEach((star, index) => {
                setTimeout(() => {
                    star.style.opacity = '1';
                    star.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
                }, index * 50);
            });

            // Left Text Slide In
            if (textLeft) {
                textLeft.classList.remove('-translate-x-full', 'opacity-0');
                textLeft.classList.add('translate-x-0', 'opacity-100');
            }

            // Right Button Slide In
            if (getStartedButton) {
                getStartedButton.classList.remove('translate-x-full', 'opacity-0');
                getStartedButton.classList.add('translate-x-0', 'opacity-100');
            }

            // Metrics
            metricNumbers.forEach(numElement => {
                const t = parseInt(numElement.getAttribute('data-target'), 10);
                const s = numElement.getAttribute('data-plus') || '';
                countUp(numElement, t, s);
            });
        }, 500); // SYNCED with Hero Image (was 1000)
    };

    // --- PRELOADER (Triggers Animation) ---
    const initPreloader = () => {
        const preloader = document.getElementById('preloader');
        const progressFill = document.getElementById('loader-progress');
        const progressText = document.getElementById('loader-text');

        if (!preloader || !progressFill || !progressText) {
            // If no preloader, trigger immediately
            activateInitialSlide();
            return;
        }

        let progress = 0;
        let isLoaded = false;
        window.addEventListener('load', () => { isLoaded = true; });

        const updateLoader = () => {
            if (isLoaded) progress += Math.random() * 5 + 2;
            else if (progress < 90) progress += Math.random() * 2;

            if (progress > 100) progress = 100;
            progressFill.style.width = `${progress}%`;
            progressText.innerText = `${Math.floor(progress)}%`;

            if (progress < 100) {
                requestAnimationFrame(updateLoader);
            } else {
                // Loaded! Remove preloader then trigger animations.
                setTimeout(() => {
                    preloader.classList.add('opacity-0', 'pointer-events-none');
                    // Start Entrance Animations simulataneously with fade out or just after?
                    // User said "happen simmulataneowulsy after the pre loading scrren".
                    // Let's trigger it as the preloader fades out.
                    activateInitialSlide();

                    // --- Hash Navigation Support (Revised) ---
                    const handleHashNavigation = () => {
                        const hash = window.location.hash;
                        if (hash === '#slide-3' || hash === '#our-works') {
                            // Prevent native scroll interference
                            if ('scrollRestoration' in history) {
                                history.scrollRestoration = 'manual';
                            }
                            window.scrollTo(0, 0);

                            // Ensure heights are calculated
                            calculateSlideHeights();
                            const boundaries = getSlideBoundaries();

                            // slide-3 is Index 2 (0: Hero, 1: What We Do, 2: Our Works)
                            if (boundaries.length > 2) {
                                // Add a significant delay to ensure layout is fully stable and preloader is gone
                                setTimeout(() => {
                                    // Re-calculate in case of lateloading images
                                    calculateSlideHeights();
                                    const currentBoundaries = getSlideBoundaries();

                                    let targetY = currentBoundaries[2];
                                    if (window.location.hash === '#our-works') {
                                        // Add flip height to trigger the "Flipped" state (Works List) immediately
                                        // Adding a small buffer (+10) to reliably trigger the flip logic
                                        targetY += FLIP_SCROLL_HEIGHT + 10;
                                    }

                                    // Update internal state directly
                                    updateScrollState(targetY);
                                    updateScrollbarVisuals();
                                }, 300);
                            }
                        }
                    };

                    // 1. Handle Initial Load
                    handleHashNavigation();

                    // 2. Handle Hash Change (Back/Forward buttons)
                    window.addEventListener('hashchange', handleHashNavigation);

                    // 3. Intercept Clicks (Prevent footer jump)
                    document.querySelectorAll('a[href="#slide-3"], a[href*="#slide-3"], a[href="#our-works"], a[href*="#our-works"]').forEach(link => {
                        link.addEventListener('click', (e) => {
                            // Only intercept if we are on index.html
                            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                                e.preventDefault();
                                history.pushState(null, null, '#our-works');
                                handleHashNavigation();
                            }
                        });
                    });

                    setTimeout(() => preloader.remove(), 500);
                }, 500);
            }
        };
        requestAnimationFrame(updateLoader);
    };
    initPreloader();

    // --- Mousemove/Star Repulsion ---
    window.addEventListener('mousemove', (e) => {
        if (currentSlideIndex === 0) updateImageStars(e.clientX, e.clientY);
    });

    // --- Slide 3 Works List Logic ---
    worksListItems = worksListColumn ? worksListColumn.querySelectorAll('ul > li') : [];
    if (worksListItems.length >= 3) {
        worksListItems[0].dataset.category = 'portfolio';
        worksListItems[1].dataset.category = 'company';
        worksListItems[2].dataset.category = 'ecommerce';

        worksListItems.forEach(item => {
            item.addEventListener('click', function (e) {
                e.stopPropagation();
                const category = this.dataset.category;
                if (category) setThumbnails(category, false);
            });
        });
        // Init active state
        worksListItems[0].classList.add('font-bold', 'text-white', 'text-4xl');
    }

    // Thumbnails click
    thumbnailImages.forEach(img => {
        img.addEventListener('click', function (e) {
            e.stopPropagation();
            updateMainZoomImage(this.src);
        });
    });
});