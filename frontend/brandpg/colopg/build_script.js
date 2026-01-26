
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '2000_professional_web_palettes.csv');
const outputPath = path.join(__dirname, 'script.js');

try {
    const csvData = fs.readFileSync(csvPath, 'utf8');
    const lines = csvData.split('\n');
    const palettes = [];

    // Skip header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Handle CSV parsing (assuming no commas in values based on file inspection)
        const parts = line.split(',');

        if (parts.length >= 7) {
            palettes.push({
                id: i,
                name: parts[0].trim(),
                type: parts[1].trim(),
                colors: [
                    parts[2].trim(), // Background
                    parts[3].trim(), // Surface
                    parts[4].trim(), // Primary
                    parts[5].trim(), // Secondary
                    parts[6].trim()  // Text
                ]
            });
        }
    }

    // Filter: Max 30 per letter
    const letterCounts = {};
    const filteredPalettes = [];
    console.log(`Total palettes found: ${palettes.length}`);

    for (const palette of palettes) {
        // Handle names that might not start with a letter or are empty
        if (!palette.name) {
            console.warn('Skipping palette with no name:', palette);
            continue;
        }

        const firstChar = palette.name.charAt(0).toUpperCase();
        // Check if it's a letter (optional, depending on requirements, but safe to just group by char)

        if (!letterCounts[firstChar]) {
            letterCounts[firstChar] = 0;
        }

        if (letterCounts[firstChar] < 30) {
            filteredPalettes.push(palette);
            letterCounts[firstChar]++;
        }
    }

    const scriptContent = `
const PALETTE_DATA = ${JSON.stringify(filteredPalettes, null, 2)};


class CuratedPaletteStudio {
    constructor() {
        this.allPalettes = PALETTE_DATA; // Use embedded data directly
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

    init() {
        this.loadLikes();
        this.setupEventListeners();
        // No need to load CSV, data is ready
        this.applyFiltersAndSort();
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

    setupEventListeners() {
        // Category Tabs
        this.setupCategoryTabs();
        
        // Sort Dropdown
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFiltersAndSort();
            });
        }

        // Infinite Scroll
        this.setupInfiniteScroll();
    }

    setupCategoryTabs() {
        const tabs = document.querySelectorAll('.filter-btn');
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
        if (this.paletteGrid) {
            this.paletteGrid.innerHTML = '';
            this.loadMorePalettes(this.initialSize);
        }
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
        if (!this.sentinel) return;
        
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
            if (this.loader) this.loader.style.display = 'none';
            return;
        }

        if (this.loader) this.loader.style.display = 'block';
        
        nextBatch.forEach(palette => {
            const card = this.createPaletteCard(palette);
            this.paletteGrid.appendChild(card);
        });

        this.currentIndex += nextBatch.length;
        
        // Hide loader if no more items
        if (this.currentIndex >= this.filteredPalettes.length) {
            if (this.loader) this.loader.style.display = 'none';
        }
        
        // Refresh ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    createPaletteCard(palette) {
        const card = document.createElement('div');
        card.className = 'palette-card';
        const isLiked = this.likedPalettes.has(palette.id);
        
        card.innerHTML = \`
            <div class="color-strips">
                \${palette.colors.map(color => \`
                    <div class="color-strip" style="background-color: \${color}" data-hex="\${color}">
                        <span class="hex-code">\${color}</span>
                    </div>
                \`).join('')}
            </div>
            <div class="card-footer">
                <div class="palette-info">
                    <span class="palette-name">\${palette.name}</span>
                    <span class="palette-type">\${palette.type}</span>
                </div>
                <button class="like-btn \${isLiked ? 'active' : ''}" aria-label="Like palette">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="\${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
        \`;

        // Add Event Listeners
        
        // Copy Hex
        card.querySelectorAll('.color-strip').forEach(strip => {
            strip.addEventListener('click', () => {
                const hex = strip.dataset.hex;
                this.copyToClipboard(hex);
            });
        });

        // Like Button
        const likeBtn = card.querySelector('.like-btn');
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleLike(palette.id, likeBtn);
        });

        // GSAP Animation for entry
        if (typeof gsap !== 'undefined') {
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
        }

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
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(btn, 
                    { scale: 0.8 },
                    { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }
                );
            }
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
            this.showToast(\`Copied \${text}\`);
        } catch (err) {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast(\`Copied \${text}\`);
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger reflow
        toast.offsetHeight;

        // Add show class for CSS transition
        toast.classList.add('show');

        // Remove after 2s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300); // Wait for transition out
        }, 2000);
    }

    initGSAP() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
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
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Lenis Smooth Scroll
    if (typeof Lenis !== 'undefined') {
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
    }

    // Start App
    new CuratedPaletteStudio();
});
`;

    fs.writeFileSync(outputPath, scriptContent);
    console.log('Successfully created script.js with embedded JSON data.');

} catch (error) {
    console.error('Error processing CSV:', error);
}
