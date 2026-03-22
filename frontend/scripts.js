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
const FLIP_SCROLL_HEIGHT = 100; // Extra pixels of scrolling to trigger the flip
const SLIDE_3_PARALLAX_BUFFER = 1200; // Extra scrolling pixels dedicated to the grid scaling
const SLIDE_3_COLLAPSE_BUFFER = 1000; // Extra scrolling pixels for rows to slide behind center
const SLIDE_3_DROP_BUFFER = 800; // Extra scrolling pixels to drop the carousel down
let isImageFlipping = false;

// --- ELEMENTS ---
let allSlides;
let slide2, slide1Image, slide1OverlayImage, mainToolbar, poppingLogo, textLeft, getStartedButton;
let zoomImageFlipper, loopingTextWrapper, worksListColumn, zoomImageContainer, thumbnailGallery, slide3BgGrid;
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

const CATEGORY_ORDER = ['portfolio', 'company', 'ecommerce'];
let activeCategory = 'portfolio';

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

    if (!sources) return;

    activeCategory = category;

    // Update Nav Buttons styling
    const navButtons = document.querySelectorAll('#slide-3-nav .carousel-btn');
    if (navButtons.length > 0) {
        navButtons.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('text-[#c7f908]');
                btn.classList.remove('text-gray-500', 'text-white');
            } else {
                btn.classList.remove('text-[#c7f908]', 'text-white');
                btn.classList.add('text-gray-500');
            }
        });
    }

    // Smooth Animation Execution
    let leftImg = null, rightImg = null;
    if (slide3BgGrid && slide3BgGrid.children.length === 9) {
        leftImg = slide3BgGrid.children[3].querySelector('img');
        rightImg = slide3BgGrid.children[5].querySelector('img');
    }

    const imgs = [leftImg, rightImg, zoomMainImage].filter(Boolean);

    // Apply strict fade-out overriding scroll listener inline opacities
    imgs.forEach(img => {
        img.style.setProperty('transition', 'opacity 0.3s ease-in-out', 'important');
        img.style.setProperty('opacity', '0', 'important');
    });

    setTimeout(() => {
        // Swap Sources
        if (leftImg) leftImg.src = sources[0];
        if (rightImg) rightImg.src = sources[2];
        if (zoomMainImage && sources[1] && !skipMainImageUpdate) {
            updateMainZoomImage(sources[1]);
        }

        // Trigger fade-in
        imgs.forEach(img => {
            img.style.removeProperty('opacity');
            // Remove transition override after it finishes fading in so scroll listener resumes control cleanly
            setTimeout(() => {
                img.style.removeProperty('transition');
            }, 300);
        });
    }, 300);
}

let isCarouselAnimating = false;

// --- Cycle Carousel (Sliding Animation) ---
function cycleCarousel(direction) {
    if (isCarouselAnimating) return;
    const sources = THUMBNAIL_DATA[activeCategory];
    if (!sources || !slide3BgGrid || slide3BgGrid.children.length !== 9) return;

    const leftContainer = slide3BgGrid.children[3];
    const rightContainer = slide3BgGrid.children[5];
    const leftImg = leftContainer.querySelector('img');
    const rightImg = rightContainer.querySelector('img');
    const centerImg = zoomMainImage;
    if (!leftImg || !rightImg || !centerImg || !zoomImageContainer) return;

    isCarouselAnimating = true;

    // Shift Native Application Data
    if (direction === 'right') {
        sources.unshift(sources.pop());
    } else {
        sources.push(sources.shift());
    }

    // Prepare Physical Tracking array
    const nodes = [leftImg, centerImg, rightImg];
    const containers = [leftContainer, zoomImageContainer, rightContainer];
    
    // Snapshot strictly absolute bounding coordinates globally!
    const rects = containers.map(c => c.getBoundingClientRect());
    const starts = nodes.map(n => window.getComputedStyle(n));
    const slide3 = document.getElementById('slide-3');
    const slide3Rect = slide3.getBoundingClientRect();

    // Determine target index mapping (0=L, 1=C, 2=R)
    // If Right Arrow: Left -> Center (0->1), Center -> Right (1->2), Right -> Left (2->0)
    const targetIndices = direction === 'right' ? [1, 2, 0] : [2, 0, 1];

    // Generate physical clones traveling to target geometric bounds
    const clones = nodes.map((node, i) => {
        const clone = document.createElement('img');
        clone.src = node.src; // Keep original state visually traveling
        clone.style.position = 'absolute'; // Lock cleanly to slide container explicitly over fixed
        clone.style.top = (rects[i].top - slide3Rect.top) + 'px';
        clone.style.left = (rects[i].left - slide3Rect.left) + 'px';
        clone.style.width = rects[i].width + 'px';
        clone.style.height = rects[i].height + 'px';
        clone.style.objectFit = starts[i].objectFit;
        clone.style.borderRadius = '0.75rem';
        clone.style.pointerEvents = 'none';

        // Elevate the element transitioning into the center space above others, safely under arrows (z-index 50)
        const tIdx = targetIndices[i];
        if (tIdx === 1) clone.style.zIndex = '42';
        else if (i === 1) clone.style.zIndex = '41'; 
        else clone.style.zIndex = '40'; 

        slide3.appendChild(clone);

        const targetRect = rects[tIdx];
        const targetStyle = starts[tIdx]; 

        // Leverage Web Animations execution API to smoothly fly layout
        const anim = clone.animate([
            {
                top: (rects[i].top - slide3Rect.top) + 'px', left: (rects[i].left - slide3Rect.left) + 'px',
                width: rects[i].width + 'px', height: rects[i].height + 'px',
                opacity: starts[i].opacity, filter: starts[i].filter
            },
            {
                top: (targetRect.top - slide3Rect.top) + 'px', left: (targetRect.left - slide3Rect.left) + 'px',
                width: targetRect.width + 'px', height: targetRect.height + 'px',
                opacity: targetStyle.opacity, filter: targetStyle.filter
            }
        ], { duration: 500, easing: 'cubic-bezier(0.25, 1, 0.5, 1)', fill: 'forwards' });

        return { clone, anim };
    });

    // Obscure original DOM nodes seamlessly underneath and lock their native transitions
    nodes.forEach(n => {
        n.style.setProperty('transition', 'none', 'important');
        n.style.setProperty('visibility', 'hidden', 'important');
    });

    // Resolve instantly after animations conclude
    Promise.all(clones.map(c => c.anim.finished)).then(() => {
        leftImg.src = sources[0];
        updateMainZoomImage(sources[1]);
        rightImg.src = sources[2];

        nodes.forEach(n => n.style.removeProperty('visibility'));
        
        // Wait 1 extra frame to guarantee the browser repaints the new images before deleting clones
        requestAnimationFrame(() => {
            clones.forEach(c => c.clone.remove());
            
            requestAnimationFrame(() => {
                nodes.forEach(n => n.style.removeProperty('transition'));
                isCarouselAnimating = false;
            });
        });
    });
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

    const slide3BaseVirtualHeight = viewportHeight + FLIP_SCROLL_HEIGHT + SLIDE_3_PARALLAX_BUFFER + SLIDE_3_COLLAPSE_BUFFER + SLIDE_3_DROP_BUFFER;
    const slide3El = document.getElementById('slide-3');
    const slide3RealHeight = slide3El ? slide3El.scrollHeight : viewportHeight;
    const slide3TotalHeight = slide3BaseVirtualHeight + Math.max(0, slide3RealHeight - viewportHeight);

    slideHeights = [
        viewportHeight, // Slide 1
        getScrollHeight(slide2), // Slide 2
        slide3TotalHeight, // Slide 3 (Animation + Scrolling)
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

// Removed slide 4 animations

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
        }
    }
    else if (newSlideIndex === 2) { // Slide 3 (Flip logic + Scroll Appended Content)
        handleSlide3Flip(localScrollY);
        
        const slide3 = document.getElementById('slide-3');
        const slide3AnimLimit = FLIP_SCROLL_HEIGHT + SLIDE_3_PARALLAX_BUFFER + SLIDE_3_COLLAPSE_BUFFER + SLIDE_3_DROP_BUFFER;
        if (localScrollY > slide3AnimLimit) {
            if (slide3) slide3.scrollTop = localScrollY - slide3AnimLimit;
        } else {
            if (slide3) slide3.scrollTop = 0;
        }
    }
    else if (newSlideIndex === 3) { // Slide 6 (Footer)
        const slide6 = document.getElementById('slide-6');
        if (slide6) slide6.scrollTop = localScrollY;
    }

    // 5. Update Scrollbar Thumb
    updateScrollbarVisuals();
}

function handleVideoPlayback(index) {
    // Pause all explicitly indexed ones
    if (endCapVideoSlide6) { endCapVideoSlide6.pause(); endCapVideoSlide6.currentTime = 0; }

    if (index === 3 && endCapVideoSlide6) endCapVideoSlide6.play().catch(e => { });
}

// Global Timeout Variable for Flip Sequencing
let slide3FlipTimeout;

function handleSlide3Flip(localY) {
    // Trigger point: 50% through the buffer
    const progress = Math.min(Math.max(localY / FLIP_SCROLL_HEIGHT, 0), 1);

    // Continuous Parallax for Grid Background (scaling down to fit)
    if (slide3BgGrid) {
        let bgScaleVal = 1;
        let gapVal = 6; // 6rem corresponds to Tailwind gap-24
        const flipPoint = FLIP_SCROLL_HEIGHT / 2;

        const scaleEndLocalY = FLIP_SCROLL_HEIGHT + SLIDE_3_PARALLAX_BUFFER;
        const collapseEndLocalY = scaleEndLocalY + SLIDE_3_COLLAPSE_BUFFER;

        let scaleProgress = 0;
        let collapseProgress = 0;
        let dropProgress = 0;

        // Phase 1: Grid scaling
        if (localY > flipPoint && localY <= scaleEndLocalY) {
            scaleProgress = Math.min((localY - flipPoint) / (scaleEndLocalY - flipPoint), 1);
        } else if (localY > scaleEndLocalY) {
            scaleProgress = 1;
            // Phase 2: Row collapse
            if (localY <= collapseEndLocalY) {
                collapseProgress = Math.min((localY - scaleEndLocalY) / SLIDE_3_COLLAPSE_BUFFER, 1);
            } else {
                collapseProgress = 1;
                // Phase 3: Drop down
                dropProgress = Math.min((localY - collapseEndLocalY) / SLIDE_3_DROP_BUFFER, 1);
            }
        }

        const marginTotalPx = 16;
        const targetScaleW = (window.innerWidth - marginTotalPx) / (window.innerWidth * 1.5);
        const targetScaleH = (window.innerHeight - marginTotalPx) / (window.innerHeight * 1.5);
        const targetScale = Math.min(targetScaleW, targetScaleH);

        bgScaleVal = 1 - (scaleProgress * (1 - targetScale));
        gapVal = 6 - (scaleProgress * 4);

        // Base translateY is -50%. We drop it by up to 30vh mathematically cleanly.
        const translateY = `calc(-50% + ${dropProgress * 15}vh)`;

        slide3BgGrid.style.transform = `translate(-50%, ${translateY}) scale(${bgScaleVal})`;
        slide3BgGrid.style.gap = `${gapVal}rem`;

        let centerScaleVal = bgScaleVal * (1 + (0.5 * collapseProgress));

        const cells = Array.from(slide3BgGrid.children);
        if (cells.length === 9) {
            cells.forEach(c => c.style.position = 'relative');

            // Set fading and translation based safely cleanly on mapping
            [0, 1, 2].forEach(i => {
                cells[i].style.transform = `translateY(calc(${collapseProgress * 100}% + ${collapseProgress * gapVal}rem))`;
                cells[i].style.zIndex = '0';
                cells[i].style.opacity = 1 - collapseProgress; // Fade completely unseen
            });

            [3, 4, 5].forEach(i => {
                cells[i].style.transform = `translateY(0)`;
                cells[i].style.zIndex = '10';
            });

            [6, 7, 8].forEach(i => {
                cells[i].style.transform = `translateY(calc(-${collapseProgress * 100}% - ${collapseProgress * gapVal}rem))`;
                cells[i].style.zIndex = '0';
                cells[i].style.opacity = 1 - collapseProgress; // Fade completely unseen
            });

            // Side images linearly reach 100% true opacity without dark filtering
            const targetOpacity = 0.4 + (0.6 * collapseProgress);
            const filterBrightness = 1.0;
            const img3 = cells[3].querySelector('img');
            const img5 = cells[5].querySelector('img');
            if (img3) {
                img3.style.opacity = targetOpacity;
                img3.style.filter = `brightness(1)`;
            }
            if (img5) {
                img5.style.opacity = targetOpacity;
                img5.style.filter = `brightness(1)`;
            }
        }

        if (zoomImageContainer) {
            zoomImageContainer.style.transform = `translate(-50%, ${translateY}) scale(${centerScaleVal})`;
            // Sync center image overlay with dropdown
            // To properly overlap if they use arrows, the main image might need explicit z-indexing internally natively
        }

        // Handle Arrows fading in smoothly and translating down with the bundle
        const arrows = document.getElementById('slide-3-arrows');
        if (arrows) {
            arrows.style.opacity = collapseProgress;
            arrows.style.transform = `translate(-50%, ${translateY})`;
            arrows.style.pointerEvents = collapseProgress > 0.8 ? 'auto' : 'none'; // Only clickable when visible
        }
        
        // Handle Phase 3 Title Header Fade In
        const slide3Header = document.getElementById('slide-3-header');
        if (slide3Header) {
            slide3Header.style.opacity = dropProgress;
            slide3Header.style.transform = `translateY(${dropProgress * 20 - 20}px)`; // Glides slightly down into position
            slide3Header.style.pointerEvents = dropProgress > 0.8 ? 'auto' : 'none';
        }
    }

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

                if (worksListColumn) worksListColumn.classList.add('works-slide-in');
                if (thumbnailGallery) thumbnailGallery.classList.add('gallery-visible');

                // ENABLE POINTER EVENTS ON IMAGE CONTAINER SO LINK IS CLICKABLE
                zoomImageContainer.style.pointerEvents = 'auto';

                setThumbnails('portfolio', true);

                // Pop Animation
                if (thumbnailGallery) {
                    const thumbs = thumbnailGallery.querySelectorAll('img');
                    thumbs.forEach((img, idx) => {
                        setTimeout(() => {
                            img.classList.add('thumb-visible');
                        }, idx * 100 + 100);
                    });
                }

                // Background Grid Fade In
                if (slide3BgGrid) {
                    slide3BgGrid.classList.remove('opacity-0');
                    slide3BgGrid.classList.add('opacity-100');
                    const gridImgs = slide3BgGrid.querySelectorAll('img');
                    gridImgs.forEach((img, idx) => {
                        setTimeout(() => {
                            img.classList.remove('opacity-20');
                            img.classList.add('opacity-40');
                        }, idx * 100);
                    });
                }
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
            if (worksListColumn) {
                worksListColumn.style.transition = 'none';
                worksListColumn.classList.remove('works-slide-in');
            }

            // Disable transition for instant Reset
            if (thumbnailGallery) {
                thumbnailGallery.style.transition = 'none';
                thumbnailGallery.classList.remove('gallery-visible');
            }

            // DISABLE POINTER EVENTS IMMEDIATELY
            zoomImageContainer.style.pointerEvents = 'none';

            // Reset Scale Instantly
            if (thumbnailGallery) {
                const thumbs = thumbnailGallery.querySelectorAll('img');
                thumbs.forEach(img => {
                    img.style.transition = 'none';
                    img.classList.remove('thumb-visible');
                });
            }

            // Background Grid Fade Out
            if (slide3BgGrid) {
                slide3BgGrid.classList.remove('opacity-100');
                slide3BgGrid.classList.add('opacity-0');
                const gridImgs = slide3BgGrid.querySelectorAll('img');
                gridImgs.forEach(img => {
                    img.classList.remove('opacity-40');
                    img.classList.add('opacity-20');
                });
            }

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


// --- AUTHENTICATION STATE HANDLING ---
async function checkAuthStatus() {
    try {
        const response = await fetch(MKAVS_CONFIG.API_BASE_URL + '/auth/status', {
            credentials: 'include'
        });
        const data = await response.json();

        const loginBtn = document.getElementById('desktop-login-btn');
        const userIcon = document.querySelector('.fa-regular.fa-user')?.parentElement;
        const getStartedBtn = document.getElementById('get-started-button');

        if (data.loggedIn) {
            // User is logged in
            if (loginBtn) {
                loginBtn.textContent = 'Logout';
                loginBtn.href = MKAVS_CONFIG.API_BASE_URL + '/auth/logout';
                // Add click event for logout to clear local storage if needed
                loginBtn.addEventListener('click', () => {
                    localStorage.removeItem('mKavs_palette_likes');
                    localStorage.removeItem('mKavs_font_likes');
                });
            }

            if (userIcon) {
                userIcon.href = './profile/profile.html';

                if (data.user) {
                    const profileImageUrl = data.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.displayName || 'User')}&background=ccff00&color=000&size=150`;
                    userIcon.innerHTML = `<img src="${profileImageUrl}" alt="Profile" class="w-8 h-8 rounded-full border border-white hover:border-[#c7f908] transition-colors object-cover" style="margin-top:-0.2rem" onerror="this.src='https://ui-avatars.com/api/?name=User&background=ccff00&color=000&size=150'">`;
                }
            }

            if (getStartedBtn) {
                getStartedBtn.href = './consult/consult.html';
            }
        } else {
            // User is not logged in
            if (loginBtn) {
                loginBtn.textContent = 'Login';
                loginBtn.href = './loginpg/login.html';
            }

            // If user icon is clicked while logged out, redirect to login
            if (userIcon) {
                userIcon.href = './loginpg/login.html';
            }

            if (getStartedBtn) {
                getStartedBtn.href = './loginpg/login.html';
            }
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
}

// --- INIT ---

document.addEventListener('DOMContentLoaded', () => {
    // Check Auth Status
    checkAuthStatus();
    // Standard Elements
    allSlides = Array.from(document.querySelectorAll('.slide'));
    slide2 = document.getElementById('slide-2');
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
    slide3BgGrid = document.getElementById('slide-3-bg-grid');
    zoomMainImage = document.getElementById('zoom-image-back');
    thumbnailImages = thumbnailGallery ? thumbnailGallery.querySelectorAll('img') : [];

    endCapVideoSlide5 = document.getElementById('end-cap-video');
    const slide6 = document.getElementById('slide-6');
    endCapVideoSlide6 = slide6 ? slide6.querySelector('video') : null;

    scrollbarTrack = document.getElementById('custom-scrollbar-track');
    scrollbarThumb = document.getElementById('custom-scrollbar-thumb');

    // --- SETUP CAROUSEL ---
    document.querySelectorAll('.carousel-btn').forEach(btn => {
        btn.addEventListener('click', () => setThumbnails(btn.dataset.category));
    });

    const carouselLeft = document.getElementById('carousel-left');
    const carouselRight = document.getElementById('carousel-right');
    
    if (carouselLeft) {
        carouselLeft.addEventListener('click', () => {
            cycleCarousel('left');
        });
    }
    if (carouselRight) {
        carouselRight.addEventListener('click', () => {
             cycleCarousel('right');
        });
    }

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
    // Also Slide 6 footer
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
    
    // --- Intersection Observer for Video (Play when seen) ---
    if (endCapVideoSlide5) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    endCapVideoSlide5.play().catch(() => {});
                } else {
                    endCapVideoSlide5.pause();
                }
            });
        }, { threshold: 0.1 });
        videoObserver.observe(endCapVideoSlide5);
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
        // Slide 3 (Index 2) is now continuous scroll for parallax.

        const isContentScrollable = (currentIndex === 1) || (currentIndex === 2) || (currentIndex === 3);

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

        if (sessionStorage.getItem('preloaderShown')) {
            if (preloader) {
                preloader.style.display = 'none';
            }
            activateInitialSlide();
            return;
        }

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
                sessionStorage.setItem('preloaderShown', 'true');
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

    // --- Mid Character Animation Loop (Slide 6) ---
    const desktopMid = document.getElementById('mid-char');
    const mobileMid = document.getElementById('mid-char-mobile');
    let isChar1 = false;

    if (desktopMid || mobileMid) {
        function toggleMidChar() {
            isChar1 = !isChar1;
            const fileName = isChar1 ? 'mid1.png' : 'mid.png';
            const duration = isChar1 ? 1500 : 400; // mid1: 1.5s, mid: 0.4s

            if (desktopMid) {
                desktopMid.src = `images/${fileName}`;
            }
            if (mobileMid) {
                mobileMid.src = `../images/${fileName}`;
            }

            setTimeout(toggleMidChar, duration);
        }
        toggleMidChar();
    }
});