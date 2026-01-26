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
    'portfolio': ['../images/thumb1.png', '../images/thumb2.png', '../images/thumb3.png'],
    'company': ['../images/thumb4.png', '../images/thumb5.png', '../images/thumb6.png'],
    'ecommerce': ['../images/thumb7.png', '../images/thumb8.png', '../images/thumb9.png'],
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

    // Update thumbnail image sources
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
        viewportHeight + FLIP_SCROLL_HEIGHT, // Slide 3 (Fixed Height + Interaction Buffer)
        viewportHeight, // Slide 4 (Fixed)
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
            card3.classList.add('opacity-100', 'scale-100');
        }
    }, 800);

    // Bottom Curved Image Slide Up
    const bottomImage = document.getElementById('slide-4-bottom-image');
    setTimeout(() => {
        if (bottomImage) {
            bottomImage.classList.remove('opacity-0', 'translate-y-10');
            bottomImage.classList.add('opacity-100', 'translate-y-0');
        }
    }, 1000);

    slide4Animated = true;
}

let slide5Animated = false;
function triggerSlide5Animations() {
    if (slide5Animated) return;

    const topOverlay = document.getElementById('slide-5-top-overlay');
    const bottomOverlay = document.getElementById('slide-5-bottom-overlay');

    if (topOverlay) {
        topOverlay.classList.remove('-translate-y-full');
    }

    // Stagger bottom one slightly
    setTimeout(() => {
        if (bottomOverlay) {
            bottomOverlay.classList.remove('translate-y-full');
        }
    }, 200);

    slide5Animated = true;
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
        if (slide2) slide2.scrollTop = localScrollY;
    }
    else if (newSlideIndex === 2) { // Slide 3 (Flip)
        handleSlide3Flip(localScrollY);
    }
    else if (newSlideIndex === 3) { // Slide 4
        triggerSlide4Animations();
        if (slide4) slide4.scrollTop = localScrollY;
    }
    else if (newSlideIndex === 4) { // Slide 5 (Video)
        triggerSlide5Animations();
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
    const threshold = FLIP_SCROLL_HEIGHT / 4;
    const isFlipping = localY > threshold;

    const slide3Header = document.getElementById('slide-3-header');
    const slide3Thumbnails = document.getElementById('slide-3-thumbnails');

    if (isFlipping) {
        // --- FLIPPED STATE --- (Scroll Down)
        if (!zoomImageFlipper.classList.contains('flipped')) {
            zoomImageFlipper.classList.add('flipped');
            zoomImageContainer.style.transform = 'scale(1)';
            zoomImageFlipper.style.transform = 'rotateY(180deg)';
            if (loopingTextWrapper) loopingTextWrapper.style.opacity = '0';
            if (slide3Header) {
                slide3Header.classList.remove('opacity-0', 'translate-y-[-20px]', 'pointer-events-none');
                slide3Header.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
            }
            if (slide3Thumbnails) {
                slide3Thumbnails.classList.remove('opacity-0', 'translate-y-[20px]', 'pointer-events-none');
                slide3Thumbnails.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
            }
        }
    } else {
        // --- UNFLIPPED STATE --- (Scroll Up)
        if (zoomImageFlipper.classList.contains('flipped')) {
            zoomImageFlipper.classList.remove('flipped');
            zoomImageContainer.style.transform = 'scale(1)';
            zoomImageFlipper.style.transform = 'rotateY(0deg)';
            if (loopingTextWrapper) loopingTextWrapper.style.opacity = '1';
            if (slide3Header) {
                slide3Header.classList.add('opacity-0', 'translate-y-[-20px]', 'pointer-events-none');
                slide3Header.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
            }
            if (slide3Thumbnails) {
                slide3Thumbnails.classList.add('opacity-0', 'translate-y-[20px]', 'pointer-events-none');
                slide3Thumbnails.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
            }
        }
    }
}

// --- CLICK INTERACTION FOR SLIDE 3 ---
function setupSlide3Interaction() {
    if (!zoomImageFlipper) return;

    let isFlipped = false;
    // Default link for the first portfolio item
    let currentLink = "https://example.com";

    const slide3Header = document.getElementById('slide-3-header');
    const slide3Thumbnails = document.getElementById('slide-3-thumbnails');
    const zoomImageBack = document.getElementById('zoom-image-back');

    // 1. Category Buttons Logic
    const categoryBtns = document.querySelectorAll('.category-btn');
    const allThumbnails = document.querySelectorAll('.thumbnail-item');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent firing other clicks

            // Remove active class from all
            categoryBtns.forEach(b => {
                b.classList.remove('bg-white', 'text-black', 'ring-2', 'ring-[#c7f908]');
                b.classList.add('bg-white/10', 'text-white');
            });

            // Add active class to clicked
            btn.classList.remove('bg-white/10', 'text-white');
            btn.classList.add('bg-white', 'text-black', 'ring-2', 'ring-[#c7f908]');

            // Filter Thumbnails
            const selectedCategory = btn.getAttribute('data-category');
            let firstMatchFound = false;

            allThumbnails.forEach(thumb => {
                if (thumb.getAttribute('data-category') === selectedCategory) {
                    thumb.classList.remove('hidden');

                    // Update main image to the first thumbnail of this category
                    if (!firstMatchFound) {
                        const newImageSrc = thumb.getAttribute('data-image');
                        const newUrl = thumb.getAttribute('data-url');

                        if (zoomImageBack && newImageSrc) {
                            zoomImageBack.src = newImageSrc;
                        }
                        if (newUrl) {
                            currentLink = newUrl;
                        }
                        firstMatchFound = true;
                    }
                } else {
                    thumb.classList.add('hidden');
                }
            });
        });
    });

    // 2. Thumbnail Click Logic
    allThumbnails.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
            e.stopPropagation();

            // Get data
            const newImageSrc = thumb.getAttribute('data-image');
            const newUrl = thumb.getAttribute('data-url');

            // Update Back Face Image
            if (zoomImageBack && newImageSrc) {
                zoomImageBack.src = newImageSrc;
            }

            // Update Link
            if (newUrl) {
                currentLink = newUrl;
            }

            // Optional: Add active border style to clicked thumbnail if desired
            allThumbnails.forEach(t => t.classList.remove('border-[#c7f908]'));
            thumb.classList.add('border-[#c7f908]');
        });
    });

    // Ensure initial state is consistent
    if (slide3Header) slide3Header.classList.add('opacity-0', 'pointer-events-none', 'transform', 'translate-y-[-20px]');
    if (slide3Thumbnails) slide3Thumbnails.classList.add('opacity-0', 'pointer-events-none', 'transform', 'translate-y-[20px]');

    // 3. Main Image Flipper Logic
    zoomImageFlipper.addEventListener('click', (e) => {
        // Prevent double firing if clicking children
        e.stopPropagation();

        if (isFlipped) {
            // If already flipped, clicking opens the link
            window.open(currentLink, '_blank');
        } else {
            // If NOT flipped, clicking flips it
            isFlipped = true;
            updateFlipState(true);
        }
    });

    // Helper to sync state (used by scroll logic too potentially)
    function updateFlipState(flipped) {
        if (flipped) {
            zoomImageFlipper.classList.add('flipped');
            // --- FLIP STATE ---
            // 1. Zoom In Container
            zoomImageContainer.style.transform = 'scale(1)'; // No zoom

            // 2. Rotate Flipper
            zoomImageFlipper.style.transform = 'rotateY(180deg)';

            // 3. Hide Marquee
            if (loopingTextWrapper) loopingTextWrapper.style.opacity = '0';

            // 4. Show Header & Buttons
            if (slide3Header) {
                slide3Header.classList.remove('opacity-0', 'translate-y-[-20px]', 'pointer-events-none');
                slide3Header.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
            }

            // 5. Show Thumbnails
            if (slide3Thumbnails) {
                slide3Thumbnails.classList.remove('opacity-0', 'translate-y-[20px]', 'pointer-events-none');
                slide3Thumbnails.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
            }

        } else {
            zoomImageFlipper.classList.remove('flipped');
            // --- UNFLIP STATE ---
            // 1. Reset Zoom
            zoomImageContainer.style.transform = 'scale(1)';

            // 2. Reset Rotation
            zoomImageFlipper.style.transform = 'rotateY(0deg)';

            // 3. Show Marquee
            if (loopingTextWrapper) loopingTextWrapper.style.opacity = '1';

            // 4. Hide Header & Buttons
            if (slide3Header) {
                slide3Header.classList.add('opacity-0', 'translate-y-[-20px]', 'pointer-events-none');
                slide3Header.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
            }

            // 5. Hide Thumbnails
            if (slide3Thumbnails) {
                slide3Thumbnails.classList.add('opacity-0', 'translate-y-[20px]', 'pointer-events-none');
                slide3Thumbnails.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
            }
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
    // worksListColumn = document.getElementById('works-list-column'); // Removed/Renamed
    // thumbnailGallery = document.getElementById('thumbnail-gallery'); // Removed/Renamed
    zoomMainImage = document.getElementById('zoom-image-back');
    // thumbnailImages = thumbnailGallery ? thumbnailGallery.querySelectorAll('img') : [];

    endCapVideoSlide5 = document.getElementById('slide-5').querySelector('video');
    endCapVideoSlide6 = document.getElementById('slide-6').querySelector('video');

    scrollbarTrack = document.getElementById('custom-scrollbar-track');
    scrollbarThumb = document.getElementById('custom-scrollbar-thumb');

    // --- SETUP SCROLLING ---
    // --- SETUP SCROLLING ---
    calculateSlideHeights();
    setupSlide3Interaction(); // Init Click Handler
    setupNavigation(); // Init Nav Handler

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

    // --- NAVIGATION HANDLER ---
    function setupNavigation() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSlide = document.getElementById(targetId);

                if (targetSlide) {
                    // Find index of this slide
                    const index = allSlides.indexOf(targetSlide);
                    if (index !== -1) {
                        const boundaries = getSlideBoundaries();
                        const targetY = boundaries[index];

                        // Update Global Scroll
                        globalScrollY = targetY;
                        updateScrollState(globalScrollY);

                        // If there is a mobile menu, close it here if needed
                        const mobileMenu = document.getElementById('mobile-menu'); // Assuming ID
                        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                            // Logic to close menu would go here if we had reference to toggle function
                        }
                    }
                }
            });
        });
    }

    // Helper: Handle "Snap" Navigation
    // Returns the new Global Y
    function calculateSnapScroll(currentY, delta) {
        const boundaries = getSlideBoundaries();
        const currentIndex = currentSlideIndex;
        const currentSlideStart = boundaries[currentIndex];

        // Slide 3 (Index 2) Flip Logic
        if (currentIndex === 2) {
            // Threshold for flipping behavior
            const flipThreshold = FLIP_SCROLL_HEIGHT / 2;
            const currentLocalY = currentY - currentSlideStart;
            const isFlipped = currentLocalY >= flipThreshold;

            if (delta > 0) {
                // Scrolling DOWN
                if (!isFlipped) {
                    // Not flipped yet -> SNAP to Flipped State
                    return currentSlideStart + FLIP_SCROLL_HEIGHT;
                } else {
                    // Already flipped -> Go to Next Slide
                    return boundaries[currentIndex + 1];
                }
            }
            else {
                // Scrolling UP
                if (isFlipped) {
                    // Flipped -> SNAP back to Unflipped (Start of Slide 3)
                    return currentSlideStart;
                } else {
                    // Unflipped -> Go to Prev Slide (Bottom of Slide 2)
                    const prevIndex = currentIndex - 1;
                    return boundaries[prevIndex] + slideHeights[prevIndex] - window.innerHeight;
                }
            }
        }

        // Standard Scroll/Snap Logic for Other Slides...
        const currentSlideHeight = slideHeights[currentIndex];
        const isContentScrollable = (currentIndex === 1); // Only Slide 2 is scrollable now (and maybe 6 via getScrollHeight)

        if (isContentScrollable) {
            const slideEnd = currentSlideStart + currentSlideHeight - window.innerHeight;

            if (delta > 0) {
                // Scrolling Down
                if (currentY >= slideEnd - 5) { // At bottom
                    if (currentIndex < slideHeights.length - 1) return boundaries[currentIndex + 1];
                    return currentY;
                }
                const nextPotential = currentY + delta;
                if (nextPotential > slideEnd) return slideEnd;
                return nextPotential;
            } else {
                // Scrolling Up
                if (currentY <= currentSlideStart + 5) { // At top
                    if (currentIndex > 0) {
                        const prevIndex = currentIndex - 1;
                        return boundaries[prevIndex] + slideHeights[prevIndex] - window.innerHeight;
                    }
                    return 0;
                }
                const nextPotential = currentY + delta;
                if (nextPotential < currentSlideStart) return currentSlideStart;
                return nextPotential;
            }
        }
        else {
            // Fixed Slide (1, 5, 6)
            if (delta > 0) {
                if (currentIndex < slideHeights.length - 1) return boundaries[currentIndex + 1];
                return currentY;
            } else {
                if (currentIndex > 0) {
                    const prevIndex = currentIndex - 1;
                    return boundaries[prevIndex] + slideHeights[prevIndex] - window.innerHeight;
                }
                return currentY;
            }
        }
    }

    // Flag to prevent rapid-fire scrolling through slides
    let isScrollLocked = false;
    const SCROLL_COOLDOWN_MS = 500; // Lock for 0.5s (snappier)

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

    // --- TOUCH SCROLL SUPPORT (Simulated Wheel) ---
    // --- TOUCH SCROLL SUPPORT (Simulated Wheel with Inertia) ---
    let touchStartY = 0;
    let touchParams = {
        lastY: 0,
        isTouchActive: false,
        velocity: 0,
        lastTime: 0,
        inertiaID: null
    };

    function stopInertia() {
        if (touchParams.inertiaID) {
            cancelAnimationFrame(touchParams.inertiaID);
            touchParams.inertiaID = null;
        }
    }

    window.addEventListener('touchstart', (e) => {
        if (e.target.closest('.no-scroll-hijack')) return;

        stopInertia(); // Stop any running inertia

        touchStartY = e.touches[0].clientY;
        touchParams.lastY = touchStartY;
        touchParams.lastTime = performance.now();
        touchParams.velocity = 0;
        touchParams.isTouchActive = true;
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
        if (!touchParams.isTouchActive) return;
        if (e.target.closest('.no-scroll-hijack')) return;

        // Prevent default pull-to-refresh
        e.preventDefault();

        const currentY = e.touches[0].clientY;
        const currentTime = performance.now();
        const deltaTime = currentTime - touchParams.lastTime;

        // Calculate raw delta
        const deltaDist = (touchParams.lastY - currentY); // Positive = Scroll Down

        // Calculate Velocity (pixels per ms)
        if (deltaTime > 0) {
            // Weighted average for smoother velocity
            const newVel = deltaDist / deltaTime;
            touchParams.velocity = (touchParams.velocity * 0.5) + (newVel * 0.5);
        }

        const deltaY = deltaDist * 2; // Multiplier for speed in direct movement

        touchParams.lastY = currentY;
        touchParams.lastTime = currentTime;

        if (isScrollLocked) return;

        // Small threshold to ignore micro-movements
        if (Math.abs(deltaY) < 1) return;

        // Use same calculation as wheel
        let newY = calculateSnapScroll(globalScrollY, deltaY);

        const diff = Math.abs(newY - globalScrollY);
        const isSignificantJump = diff > 200;

        if (isSignificantJump) {
            updateScrollState(newY);
            isScrollLocked = true;
            setTimeout(() => isScrollLocked = false, SCROLL_COOLDOWN_MS);
            // Reset velocity on jumps to prevent post-jump momentum
            touchParams.velocity = 0;
        } else {
            updateScrollState(newY);
        }

    }, { passive: false });

    window.addEventListener('touchend', (e) => {
        touchParams.isTouchActive = false;

        // INERTIA LOGIC - Slide 2 ONLY
        if (currentSlideIndex === 1 && Math.abs(touchParams.velocity) > 0.1) {
            // Apply Momentum
            const friction = 0.95; // Decay factor
            let currentVel = touchParams.velocity * 16; // Convert per ms to per frame (approx 16ms)

            function stepInertia() {
                if (Math.abs(currentVel) < 0.5) {
                    stopInertia();
                    return;
                }

                // Decay
                currentVel *= friction;

                // Apply
                if (!isScrollLocked) {
                    // Check boundaries of Slide 2 logic explicitly or rely on calculateSnapScroll
                    // We rely on calculateSnapScroll to handle clamping but we need to pass a "delta"
                    const newY = calculateSnapScroll(globalScrollY, currentVel);

                    // Logic check: if we hit a boundary (newY == globalScrollY after calc), stop
                    if (Math.abs(newY - globalScrollY) < 0.1) {
                        stopInertia();
                        return;
                    }

                    updateScrollState(newY);
                }

                touchParams.inertiaID = requestAnimationFrame(stepInertia);
            }
            touchParams.inertiaID = requestAnimationFrame(stepInertia);
        }
    });


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

        // 3. Stars, Text, Metrics, Carousel, Button (All at 1000ms)
        setTimeout(() => {
            // Stars Pop
            starImages.forEach((star, index) => {
                setTimeout(() => {
                    star.style.opacity = '1';
                    star.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
                }, index * 50);
            });

            // Right Text Slide In
            if (textLeft) {
                textLeft.classList.remove('translate-x-full', 'opacity-0');
                textLeft.classList.add('translate-x-0', 'opacity-100');
            }

            // Metrics
            const metricNumbers = document.querySelectorAll('.metric-number');
            metricNumbers.forEach(numElement => {
                const t = parseInt(numElement.getAttribute('data-target'), 10);
                const s = numElement.getAttribute('data-plus') || '';
                countUp(numElement, t, s);
            });

            // Carousel Slide Up (Synced)
            const heroCarousel = document.getElementById('hero-carousel');
            if (heroCarousel) {
                heroCarousel.classList.remove('opacity-0', 'translate-y-full');
            }

            // Button Pop (Synced)
            if (getStartedButton) {
                getStartedButton.classList.remove('scale-0', 'opacity-0');
                getStartedButton.classList.add('scale-100', 'opacity-100');
            }
        }, 1000);
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
