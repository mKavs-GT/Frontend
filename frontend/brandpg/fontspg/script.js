// DOM Elements
const fontGrid = document.getElementById('font-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

// State
let likedFonts = new Set();
try {
    const storedLikes = localStorage.getItem('mKavs_font_likes');
    if (storedLikes) {
        likedFonts = new Set(JSON.parse(storedLikes));
    }
} catch (e) {
    console.error('Error loading liked fonts:', e);
}

// Initialize
async function init() {
    // Register GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    await checkAuth();
    renderFonts();
    setupFilters();
    showToast('Welcome to Typography!');
}

async function checkAuth() {
    try {
        const response = await fetch('/api/user/me');
        if (!response.ok) {
            // Not signed in - clear all local favorites
            localStorage.removeItem('mKavs_font_likes');
            likedFonts = new Set();
            return;
        }
        
        const user = await response.json();
        if (user.favoriteFonts) {
            likedFonts = new Set(user.favoriteFonts);
            localStorage.setItem('mKavs_font_likes', JSON.stringify([...likedFonts]));
        }
    } catch (e) {
        console.error('Auth check failed:', e);
        // On error (e.g. server down), we might want to keep local but the user requested "default when not signed in"
        // So we clear it to be safe.
        localStorage.removeItem('mKavs_font_likes');
        likedFonts = new Set();
    }
}

// Render Font Tiles
function renderFonts() {
    fontGrid.innerHTML = '';
    
    // Ensure FONT_DATA is available
    const outputFonts = window.FONT_DATA || [];
    
    outputFonts.forEach(font => {
        const tile = createFontTile(font);
        fontGrid.appendChild(tile);
    });
}

function createFontTile(font) {
    const tile = document.createElement('div');
    tile.className = 'font-tile';
    tile.setAttribute('data-category', font.category);
    tile.setAttribute('data-id', font.id);
    tile.setAttribute('data-name', font.name);
    
    const isLiked = likedFonts.has(font.name);
    
    tile.innerHTML = `
        <button class="like-btn ${isLiked ? 'active' : ''}" onclick="toggleLike(event, ${font.id})" aria-label="Like font">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        </button>
        <div class="font-display" style="font-family: ${font.family};">${font.name}</div>
        <div class="font-category">${font.category}</div>
    `;
    
    // GSAP ScrollTrigger Animation for entry
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.from(tile, {
            y: 20,
            opacity: 0,
            duration: 0.25,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: tile,
                start: 'top 95%',
                toggleActions: 'play none none reverse'
            }
        });
    }
    
    return tile;
}

// Filter Functionality
function setupFilters() {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter tiles
            const tiles = document.querySelectorAll('.font-tile');
            let visibleCount = 0;
            
            tiles.forEach(tile => {
                const tileCategory = tile.getAttribute('data-category');
                const tileName = tile.getAttribute('data-name');
                
                let shouldShow = false;
                
                if (category === 'All') {
                    shouldShow = true;
                } else if (category === 'Favorites') {
                    shouldShow = likedFonts.has(tileName);
                } else {
                    shouldShow = tileCategory === category;
                }
                
                if (shouldShow) {
                    tile.style.display = 'flex';
                    visibleCount++;
                } else {
                    tile.style.display = 'none';
                }
            });
            
            if (visibleCount === 0) {
                 // Optional: Show "No fonts found" message
            }
        });
    });
}

// Like Functionality
window.toggleLike = function(event, id) {
    event.stopPropagation(); // Prevent potentially opening a modal if we added one later
    
    const btn = event.currentTarget;
    
    const font = window.FONT_DATA.find(f => f.id === id);
    if (!font) return;
    const name = font.name;
    
    if (likedFonts.has(name)) {
        likedFonts.delete(name);
        btn.classList.remove('active');
        btn.querySelector('svg').setAttribute('fill', 'none');
        // If we are in "Favorites" view, remove the tile instantly
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-category');
        if (activeFilter === 'Favorites' || activeFilter === 'Fav') { // Handle both desktop and mobile label
             const tile = btn.closest('.font-tile');
             gsap.to(tile, {
                 opacity: 0,
                 scale: 0.8,
                 duration: 0.3,
                 onComplete: () => tile.style.display = 'none'
             });
        }
    } else {
        likedFonts.add(name);
        btn.classList.add('active');
        btn.querySelector('svg').setAttribute('fill', 'currentColor');
        
        showToast(`Added ${name} to favorites`);
    }
    
    // Save to localStorage
    localStorage.setItem('mKavs_font_likes', JSON.stringify([...likedFonts]));

    // Sync with backend
    fetch('/api/user/favorites/sync', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fonts: [...likedFonts]
        })
    }).catch(err => console.error('Error syncing font likes:', err));
}

// Toast Notification
function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Start
document.addEventListener('DOMContentLoaded', init);
