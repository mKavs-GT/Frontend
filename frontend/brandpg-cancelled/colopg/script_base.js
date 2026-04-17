
const CSV_BASE64 = `__CSV_BASE64_PLACEHOLDER__`;

class CuratedPaletteStudio {
    constructor() {
        this.allPalettes = [];
        this.filteredPalettes = [];
        this.likedPalettes = new Set();

        this.currentCategory = 'all';
        this.currentSort = 'default';

        this.batchSize = 40;
        this.currentIndex = 0;
        this.initialSize = 60;

        this.paletteGrid = document.getElementById('paletteGrid');
        this.loader = document.getElementById('loader');
        this.sentinel = document.getElementById('sentinel');

        this.init();
    }

    async init() {
        this.loadLikes();
        this.setupEventListeners();
        await this.loadCSVData();
        this.initGSAP();
    }

    loadLikes() {
        const stored = localStorage.getItem('mKavs_palette_likes');
        if (stored) {
            this.likedPalettes = new Set(JSON.parse(stored));
        }
    }

    saveLikes() {
        localStorage.setItem('mKavs_palette_likes', JSON.stringify([...this.likedPalettes]));
    }

    async loadCSVData() {
        try {
            // Decode Base64 CSV data
            if (typeof CSV_BASE64 !== 'undefined' && CSV_BASE64 && CSV_BASE64 !== '__CSV_BASE64_PLACEHOLDER__') {
                const csvText = atob(CSV_BASE64);
                this.parseCSV(csvText);
            } else {
                throw new Error("CSV data not loaded correctly.");
            }
        } catch (error) {
            console.error('Error loading CSV:', error);
            this.showToast('Error loading palettes');
            this.loader.style.display = 'none';
        }
    }

    parseCSV(text) {
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());

        // Parse rows
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;

            // Handle potential commas in quoted fields (though simple split works for this specific CSV structure)
            const row = lines[i].split(',');

            if (row.length < headers.length) continue;

            const palette = {
                id: i,
                name: row[0].trim(),
                type: row[1].trim(),
                colors: [
                    row[2].trim(), // Background
                    row[3].trim(), // Surface
                    row[4].trim(), // Primary
                    row[5].trim(), // Secondary
                    row[6].trim()  // Text
                ]
            };

            this.allPalettes.push(palette);
        }

        this.applyFiltersAndSort();
    }

    setupEventListeners() {
        // Category Tabs
        this.setupCategoryTabs();

        // Sort Dropdown
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.applyFiltersAndSort();
        });

        // Infinite Scroll
        this.setupInfiniteScroll();
    }

    setupCategoryTabs() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.dataset.category;

                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                this.currentCategory = category;
                this.applyFiltersAndSort();
            });
        });
    }

    applyFiltersAndSort() {
        // 1. Filter
        if (this.currentCategory === 'all') {
            this.filteredPalettes = [...this.allPalettes];
        } else if (this.currentCategory === 'liked') {
            this.filteredPalettes = this.allPalettes.filter(p => this.likedPalettes.has(p.id));
        } else {
            // Map categories based on type
            this.filteredPalettes = this.allPalettes.filter(p => {
                if (this.currentCategory === 'Modern SaaS') return p.type.includes('Light / SaaS');
                if (this.currentCategory === 'Dark Mode') return p.type.includes('Dark / Professional');
                if (this.currentCategory === 'Bold / Experimental') return p.type.includes('Bold / Artistic');
                return false;
            });
        }

        // 2. Sort
        this.sortPalettes();

        // 3. Reset View
        this.currentIndex = 0;
        this.paletteGrid.innerHTML = '';
        this.loadMorePalettes(this.initialSize);
    }

    sortPalettes() {
        switch (this.currentSort) {
            case 'az':
                this.filteredPalettes.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'type':
                this.filteredPalettes.sort((a, b) => a.type.localeCompare(b.type));
                break;
            case 'liked':
                // Sort liked first
                this.filteredPalettes.sort((a, b) => {
                    const aLiked = this.likedPalettes.has(a.id);
                    const bLiked = this.likedPalettes.has(b.id);
                    return bLiked - aLiked;
                });
                break;
            default:
                // Default order (ID)
                this.filteredPalettes.sort((a, b) => a.id - b.id);
        }
    }

    setupInfiniteScroll() {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                this.loadMorePalettes(this.batchSize);
            }
        }, { rootMargin: '200px' });

        observer.observe(this.sentinel);
    }

    loadMorePalettes(count) {
        const nextBatch = this.filteredPalettes.slice(this.currentIndex, this.currentIndex + count);

        if (nextBatch.length === 0) {
            this.loader.style.display = 'none';
            return;
        }

        this.loader.style.display = 'block';

        nextBatch.forEach(palette => {
            const card = this.createPaletteCard(palette);
            this.paletteGrid.appendChild(card);
        });

        this.currentIndex += nextBatch.length;

        // Hide loader if no more items
        if (this.currentIndex >= this.filteredPalettes.length) {
            this.loader.style.display = 'none';
        }

        // Refresh ScrollTrigger
        ScrollTrigger.refresh();
    }

    createPaletteCard(palette) {
        const card = document.createElement('div');
        card.className = 'palette-card';
        const isLiked = this.likedPalettes.has(palette.id);

        card.innerHTML = `
            <div class="color-strips">
                ${palette.colors.map(color => `
                    <div class="color-strip" style="background-color: ${color}" data-hex="${color}">
                        <span class="hex-code">${color}</span>
                    </div>
                `).join('')}
            </div>
            <div class="card-footer">
                <div class="palette-info">
                    <span class="palette-name">${palette.name}</span>
                    <span class="palette-type">${palette.type}</span>
                </div>
                <button class="like-btn ${isLiked ? 'active' : ''}" aria-label="Like palette">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
        `;

        // Add Event Listeners

        // PENCIL LIFT ANIMATION - COMPLETE REWRITE
        const strips = card.querySelectorAll('.color-strip');
        
        const getSiblings = (elem) => {
            return Array.from(elem.parentNode.children).filter(el => el !== elem && el.classList.contains('color-strip'));
        }

        strips.forEach(strip => {
            let hoverAnimation = null;

            strip.addEventListener('mouseenter', function() {
                // KILL any existing animations immediately
                if (hoverAnimation) hoverAnimation.kill();
                gsap.killTweensOf(strip);
                gsap.killTweensOf(getSiblings(strip));

                const siblings = getSiblings(strip);

                // Animate THIS strip UP
                hoverAnimation = gsap.to(strip, {
                  y: -35,
                  scale: 1.05,
                  zIndex: 1000,
                  boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.3)',
                  duration: 0.4,
                  ease: 'power3.out'
                });

                // Animate SIBLINGS DIM
                gsap.to(siblings, {
                  opacity: 0.5,
                  filter: 'grayscale(50%)',
                  duration: 0.4,
                  ease: 'power3.out'
                });
            });

            strip.addEventListener('mouseleave', function() {
                // KILL all animations
                if (hoverAnimation) hoverAnimation.kill();
                gsap.killTweensOf(strip);
                gsap.killTweensOf(getSiblings(strip));

                const siblings = getSiblings(strip);

                // Animate strip BACK DOWN - MUST reset ALL properties
                hoverAnimation = gsap.to(strip, {
                  y: 0,
                  scale: 1,
                  zIndex: 1,
                  boxShadow: 'none',
                  duration: 0.3,
                  ease: 'power2.inOut'
                });

                // Animate siblings BACK to normal
                gsap.to(siblings, {
                  opacity: 1,
                  filter: 'grayscale(0%)',
                  duration: 0.3,
                  ease: 'power2.inOut'
                });
            });

            strip.addEventListener('click', (e) => {
                const hex = strip.dataset.hex;
                this.copyToClipboard(hex);
                
                e.stopPropagation();
                gsap.fromTo(strip,
                    { scale: 0.95, y: -30 },
                    { scale: 1.05, y: -35, duration: 0.2, ease: 'back.out(1.5)' }
                );
            });
        });

        // Like Button
        const likeBtn = card.querySelector('.like-btn');
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleLike(palette.id, likeBtn);
        });

        // GSAP Animation for entry
        gsap.from(card, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        });

        return card;
    }

    toggleLike(id, btn) {
        if (this.likedPalettes.has(id)) {
            this.likedPalettes.delete(id);
            btn.classList.remove('active');
            btn.querySelector('svg').setAttribute('fill', 'none');
        } else {
            this.likedPalettes.add(id);
            btn.classList.add('active');
            btn.querySelector('svg').setAttribute('fill', 'currentColor');

            // Animation
            gsap.fromTo(btn,
                { scale: 0.8 },
                { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }
            );
        }
        this.saveLikes();

        // If currently viewing 'liked' category, refresh view
        if (this.currentCategory === 'liked') {
            this.applyFiltersAndSort();
        }
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast(`Copied ${text}`);
        } catch (err) {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast(`Copied ${text}`);
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Animate in
        gsap.to(toast, {
            y: 0,
            opacity: 1,
            duration: 0.3
        });

        // Remove after 2s
        setTimeout(() => {
            gsap.to(toast, {
                y: 20,
                opacity: 0,
                duration: 0.3,
                onComplete: () => toast.remove()
            });
        }, 2000);
    }

    initGSAP() {
        gsap.registerPlugin(ScrollTrigger);

        // Header Animation
        const tl = gsap.timeline();

        tl.from('h1', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
            .from('h2', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6')
            .from('.controls', {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Start App
    new CuratedPaletteStudio();
});
