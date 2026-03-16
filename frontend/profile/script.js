
document.addEventListener('DOMContentLoaded', () => {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const favoriteFontsGrid = document.getElementById('favoriteFontsGrid');
    const palettesSection = document.getElementById('palettes');
    // Removed single querySelector for userNameElement, now uses querySelectorAll inside loadUserProfile

    // Check if PALETTE_DATA adheres to global window object
    const paletteData = window.PALETTE_DATA || [];
    const fontData = window.FONT_DATA || [];

    // Load user profile from backend
    async function loadUserProfile() {
        try {
            const response = await fetch(MKAVS_CONFIG.API_BASE_URL + '/api/user/me', {
                credentials: 'include'
            });

            if (response.ok) {
                const user = await response.json();
                const userNameElements = document.querySelectorAll('.user-name');
                if (userNameElements.length > 0 && user.displayName) {
                    const firstName = user.displayName.split(' ')[0];
                    userNameElements.forEach(el => el.textContent = firstName);
                }
                const userEmailEl = document.getElementById('userEmail');
                if (userEmailEl) {
                    userEmailEl.textContent = user.email || user.username || 'user@mkavs.com';
                }
                const userPhotoEl = document.getElementById('userProfilePhoto');
                if (userPhotoEl) {
                    userPhotoEl.src = user.image || user.picture || user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=ccff00&color=000&size=150`;
                }

                // Render Project Details
                renderProjectDetails(user.adminData);

                // Store user data for potential later use
                window.currentUser = user;

                // Show the content now that we are authenticated
                const mainContent = document.querySelector('.main-content');
                if (mainContent) mainContent.style.display = 'block';

                // Sync backend favorites to localStorage
                if (user.favoritePalettes && user.favoritePalettes.length > 0) {
                    localStorage.setItem('mKavs_palette_likes', JSON.stringify(user.favoritePalettes));
                }
                if (user.favoriteFonts && user.favoriteFonts.length > 0) {
                    localStorage.setItem('mKavs_font_likes', JSON.stringify(user.favoriteFonts));
                }

                // Reload grids to reflect merged data
                loadFavorites();
                loadFontFavorites();
            } else if (response.status === 401) {
                // Not authenticated - redirect to login
                window.location.href = '/loginpg/login.html';
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    // Render project details
    function renderProjectDetails(adminData) {
        const container = document.getElementById('activeProjectContainer');
        if (!container) return;

        if (!adminData || !adminData.activeProjects) {
            container.innerHTML = `
                <div class="empty-project">
                    <p>No active projects at the moment.</p>
                </div>
            `;
            return;
        }

        const project = adminData.activeProjects;
        const progress = adminData.projectProgress || 0;

        container.innerHTML = `
            <div class="project-item">
                <div class="project-info">
                    <h4>${project}</h4>
                    <span class="status in-progress">${progress === 100 ? 'Completed' : 'In Progress'}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progress}%;"></div>
                </div>
                <p class="meta">Status: ${progress}% complete</p>
            </div>
        `;
    }

    // Initialize profile
    loadUserProfile();

    function loadFavorites() {
        const storedLikes = localStorage.getItem('mKavs_palette_likes');
        let likedIds = new Set();

        if (storedLikes) {
            try {
                likedIds = new Set(JSON.parse(storedLikes));
            } catch (e) {
                console.error("Error parsing favorites:", e);
            }
        }

        if (likedIds.size === 0) {
            // No favorites, do not hide the section. Just let it show the 'Add New' button.
            if (palettesSection) {
                palettesSection.style.display = 'block';
            }
            // We still need to clear any potential garbage if we weren't reloading
            // But the rest of the function handles clearing below.
        } else {
            // Show section if hidden
            if (palettesSection) {
                palettesSection.style.display = 'block';
            }
        }

        // Clear existing generated items (keeping the 'add-new' button)
        // We can just iterate backwards or remove elements that are not .add-new
        // Or cleaner: clear innerHTML and rebuild, appending 'add-new' at the end.
        // But 'add-new' is hardcoded in HTML. Let's find it.
        const addNewBtn = favoritesGrid.querySelector('.add-new');

        // Remove all palette-cards except add-new
        const cards = favoritesGrid.querySelectorAll('.palette-card:not(.add-new)');
        cards.forEach(card => card.remove());

        // Filter and render
        const likedPalettes = paletteData.filter(p => likedIds.has(p.name));

        likedPalettes.forEach(palette => {
            const card = createPaletteCard(palette);
            favoritesGrid.insertBefore(card, addNewBtn);
        });
    }

    function createPaletteCard(palette) {
        const card = document.createElement('div');
        card.className = 'palette-card';

        // Create colors HTML
        const colorsHtml = palette.colors.map(color => `
            <div class="color" style="background: ${color};" title="${color}"></div>
        `).join('');

        card.innerHTML = `
            <div class="colors">
                ${colorsHtml}
            </div>
            <span>${palette.name}</span>
        `;

        return card;
    }

    loadFavorites();
    loadFontFavorites();

    function loadFontFavorites() {
        if (!favoriteFontsGrid) return;

        const storedLikes = localStorage.getItem('mKavs_font_likes');
        let likedIds = new Set();

        if (storedLikes) {
            try {
                likedIds = new Set(JSON.parse(storedLikes));
            } catch (e) {
                console.error("Error parsing font favorites:", e);
            }
        }

        const addNewBtn = favoriteFontsGrid.querySelector('.add-new');

        // Remove all palette-cards except add-new
        const cards = favoriteFontsGrid.querySelectorAll('.palette-card:not(.add-new)');
        cards.forEach(card => card.remove());

        // Filter and render
        const likedFonts = fontData.filter(f => likedIds.has(f.name));

        likedFonts.forEach(font => {
            const card = createFontCard(font);
            favoriteFontsGrid.insertBefore(card, addNewBtn);
        });
    }

    function createFontCard(font) {
        const card = document.createElement('div');
        card.className = 'palette-card font-card';
        // Add font-card class for potential formatting

        card.innerHTML = `
            <div class="font-preview" style="font-family: ${font.family}; display: flex; align-items: center; justify-content: center; height: 120px; font-size: 3rem; color: var(--text-main);">Ag</div>
            <span>${font.name}</span>
        `;

        return card;
    }

    // Profile image upload handling removed as per user request

    // Logout and local storage clearing
    const logoutLinks = document.querySelectorAll('.logout-header-btn.with-text, a[href="/auth/logout"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', () => {
            localStorage.removeItem('mKavs_palette_likes');
            localStorage.removeItem('mKavs_font_likes');
        });
    });
});
