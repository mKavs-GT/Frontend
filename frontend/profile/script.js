
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

                // Render Consultations
                renderConsultations(user.consultations);

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
                window.location.href = '../loginpg/login.html';
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

    // Render Consultations
    function renderConsultations(consultations) {
        const container = document.getElementById('consultationContainer');
        if (!container) return;

        if (!consultations || consultations.length === 0) {
            container.innerHTML = `
                <div class="empty-consultation">
                    <i class="fa-solid fa-file-contract"></i>
                    <p>No active consultations requested.</p>
                    <a href="../consult/consult.html" class="request-btn" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #c7f908; color: #000; border-radius: 8px; text-decoration: none; font-weight: 600;">Request Now</a>
                </div>
            `;
            return;
        }

        let html = '<div class="consultation-list" style="display:flex; flex-direction:column; gap:15px; width: 100%;">';
        
        // Sort by timestamp descending
        const sorted = [...consultations].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        sorted.forEach(c => {
            const date = c.timestamp ? new Date(c.timestamp).toLocaleDateString() : 'N/A';
            const planDisplay = c.plan || 'Not selected';
            html += `
                <div class="consultation-item" style="padding: 15px; border-radius: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);">
                    <div style="display:flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #c7f908; font-weight: 600;">${planDisplay.toUpperCase()}</span>
                        <span style="color: var(--text-muted, #9ca3af); font-size: 0.85rem;">${date}</span>
                    </div>
                    <p style="margin-bottom: 8px; font-size: 0.95rem; color: #fff;">${c.projectInfo || 'No project description provided.'}</p>
                    <p style="margin-bottom: 0; font-size: 0.85rem; color: var(--text-muted, #9ca3af);">Preference: ${c.connectPreference || 'Not specified'}</p>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
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

    // Dashboard Tabs Navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Find matching tab content and activate it
            const targetId = btn.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            if(targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
});
