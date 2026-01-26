const fs = require('fs');
const path = require('path');

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

        const parts = line.split(',');

        if (parts.length >= 7) {
            palettes.push({
                id: i,
                name: parts[0].trim(),
                type: parts[1].trim(),
                colors: [
                    parts[2].trim(),
                    parts[3].trim(),
                    parts[4].trim(),
                    parts[5].trim(),
                    parts[6].trim()
                ]
            });
        }
    }

    // SMART POPULAR SELECTION:
    // Select a balanced mix from each category to ensure diversity
    const lightSaaS = palettes.filter(p => p.type.includes('Light / SaaS'));
    const darkPro = palettes.filter(p => p.type.includes('Dark / Professional'));
    const boldArt = palettes.filter(p => p.type.includes('Bold / Artistic'));

    // Take every Nth palette from each category for even distribution
    const popularIds = new Set();
    const samplesPerCategory = 20;

    // Sample from Light/SaaS
    const lightStep = Math.floor(lightSaaS.length / samplesPerCategory);
    for (let i = 0; i < samplesPerCategory && i * lightStep < lightSaaS.length; i++) {
        popularIds.add(lightSaaS[i * lightStep].id);
    }

    // Sample from Dark/Professional
    const darkStep = Math.floor(darkPro.length / samplesPerCategory);
    for (let i = 0; i < samplesPerCategory && i * darkStep < darkPro.length; i++) {
        popularIds.add(darkPro[i * darkStep].id);
    }

    // Sample from Bold/Artistic
    const boldStep = Math.floor(boldArt.length / samplesPerCategory);
    for (let i = 0; i < samplesPerCategory && i * boldStep < boldArt.length; i++) {
        popularIds.add(boldArt[i * boldStep].id);
    }

    console.log(`Selected ${popularIds.size} popular palettes with balanced distribution`);

    const scriptContent = `
// Popular palette IDs - intelligently selected for diversity
// Balanced mix: ~20 Light/SaaS, ~20 Dark/Professional, ~20 Bold/Artistic
const POPULAR_PALETTE_IDS = new Set(${JSON.stringify([...popularIds])});

const PALETTE_DATA = ${JSON.stringify(palettes, null, 2)};

class CuratedPaletteStudio {
    constructor() {
        this.allPalettes = PALETTE_DATA;
        this.filteredPalettes = [];
        
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
        this.setupEventListeners();
        this.applyFiltersAndSort();
        this.initGSAP();
    }

    setupEventListeners() {
        this.setupCategoryTabs();
        
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFiltersAndSort();
            });
        }

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
        // Filter
        if (this.currentCategory === 'all') {
            this.filteredPalettes = [...this.allPalettes];
        } else if (this.currentCategory === 'popular') {
            // Popular: Curated selection with balanced distribution
            this.filteredPalettes = this.allPalettes.filter(p => POPULAR_PALETTE_IDS.has(p.id));
        } else {
            this.filteredPalettes = this.allPalettes.filter(p => {
                if (this.currentCategory === 'Modern SaaS') return p.type.includes('Light / SaaS');
                if (this.currentCategory === 'Dark Mode') return p.type.includes('Dark / Professional');
                if (this.currentCategory === 'Bold / Experimental') return p.type.includes('Bold / Artistic');
                return false;
            });
        }
        
        this.sortPalettes();
        
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
            default:
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
        
        if (this.currentIndex >= this.filteredPalettes.length) {
            if (this.loader) this.loader.style.display = 'none';
        }
        
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    createPaletteCard(palette) {
        const card = document.createElement('div');
        card.className = 'palette-card';
        
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
            </div>
        \`;

        card.querySelectorAll('.color-strip').forEach(strip => {
            strip.addEventListener('click', () => {
                const hex = strip.dataset.hex;
                this.copyToClipboard(hex);
            });
        });

        if (typeof gsap !== 'undefined') {
            gsap.from(card, {
                y: 60,
                opacity: 0,
                scale: 0.9,
                rotationX: 15,
                duration: 0.8,
                ease: 'back.out(1.4)',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        return card;
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast(\`Copied \${text}\`);
        } catch (err) {
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

        toast.offsetHeight;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }

    initGSAP() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            const tl = gsap.timeline();
            
            tl.from('h1', {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            })
            .from('.subtitle', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6')
            .from('.controls-section', {
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

    new CuratedPaletteStudio();
});
`;

    fs.writeFileSync(outputPath, scriptContent);
    console.log('Successfully created script.js with intelligent Popular selection!');

} catch (error) {
    console.error('Error processing CSV:', error);
}
