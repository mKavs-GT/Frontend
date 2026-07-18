document.addEventListener('DOMContentLoaded', () => {
    // Preloader tracking removed.
    let lastScrollY = window.scrollY;
    // Attempt to find the main toolbar by ID first, then by class if not found
    const toolbar = document.getElementById('main-toolbar') || document.querySelector('.main-toolbar');

    if (!toolbar) {
        console.warn('Sticky Navbar: Matching toolbar not found.');
        return;
    }

    // Ensure the toolbar has the transition property for smooth animation
    // We append this style if it's not already usually there, 
    // but best to rely on CSS. We'll enforce a minimal transition here just in case.
    if (!toolbar.style.transition) {
        toolbar.style.transition = 'transform 0.3s ease-in-out';
    }

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Threshold to avoid jitter on small scrolls
        if (Math.abs(currentScrollY - lastScrollY) < 5) return;

        if (currentScrollY > window.innerHeight * 0.6) {
            toolbar.classList.add('scrolled-past-header');
        } else {
            toolbar.classList.remove('scrolled-past-header');
        }

        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            // Scrolling DOWN -> Hide Toolbar
            // Move it up by its own height or 100%
            toolbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling UP -> Show Toolbar
            toolbar.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ─── Auth State Cache (localStorage) ─────────────────────────────────────
    // Cache key and TTL (10 minutes). Allows instant navbar update after login
    // without relying on cross-origin cookies being sent on every page load.
    const AUTH_CACHE_KEY = 'mkavs_auth_cache';
    const AUTH_CACHE_TTL = 10 * 60 * 1000; // 10 minutes in ms

    function getAuthCache() {
        try {
            const raw = localStorage.getItem(AUTH_CACHE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (Date.now() - parsed.ts > AUTH_CACHE_TTL) {
                localStorage.removeItem(AUTH_CACHE_KEY);
                return null;
            }
            return parsed;
        } catch (e) {
            return null;
        }
    }

    function setAuthCache(data) {
        try {
            localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({ ...data, ts: Date.now() }));
        } catch (e) { /* quota exceeded – ignore */ }
    }

    function clearAuthCache() {
        localStorage.removeItem(AUTH_CACHE_KEY);
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Applies auth state to the navbar UI
    function applyAuthState(data, baseUrl) {
        const loginBtns = document.querySelectorAll('.login-btn, #desktop-login-btn');
        const userIcons = document.querySelectorAll('.fa-regular.fa-user');

        if (data.loggedIn) {
            loginBtns.forEach(btn => {
                // Only change if it's currently showing "Login"
                const text = btn.textContent.trim().toLowerCase();
                if (text === 'login') {
                    btn.textContent = 'Logout';
                    btn.href = baseUrl + '/auth/logout';
                    btn.addEventListener('click', () => {
                        clearAuthCache();
                        localStorage.removeItem('mKavs_palette_likes');
                        localStorage.removeItem('mKavs_font_likes');
                    });
                }
            });

            userIcons.forEach(icon => {
                const parent = icon.parentElement;
                if (parent) {
                    parent.href = "/Profile";
                }
                if (data.user) {
                    const profileImageUrl = data.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.displayName || 'User')}&background=ccff00&color=000&size=150`;
                    const imgEl = document.createElement('img');
                    imgEl.src = profileImageUrl;
                    imgEl.alt = "Profile";
                    imgEl.style.width = "24px";
                    imgEl.style.height = "24px";
                    imgEl.style.borderRadius = "50%";
                    imgEl.style.border = "1px solid white";
                    imgEl.style.objectFit = "cover";
                    imgEl.style.marginTop = "-0.2rem";
                    imgEl.style.display = "inline-block";
                    
                    imgEl.onerror = function() {
                        this.src = "https://ui-avatars.com/api/?name=User&background=ccff00&color=000&size=150";
                    };
                    
                    // Only replace if the icon is still there
                    if (icon.parentNode) {
                        icon.parentNode.replaceChild(imgEl, icon);
                    }
                }
            });

            // User is logged in. Point "Book Us" links directly to /Consult
            const bookUsLinks = Array.from(document.querySelectorAll('a')).filter(a => a.href && (a.href.includes("/BookUs") || a.href.includes("/Consult")));
            bookUsLinks.forEach(link => {
                link.href = '/Consult';
            });
        } else {
            // User is not logged in
            loginBtns.forEach(btn => {
                if (btn.textContent.trim().toLowerCase() === 'logout') {
                    btn.textContent = 'Login';
                    btn.href = '/BookUs';
                }
            });

            userIcons.forEach(icon => {
                const parent = icon.parentElement;
                if (parent) {
                    parent.href = '/BookUs';
                }
            });

            // Update "Book Us" links to point to login if they require auth
            const bookUsLinks = Array.from(document.querySelectorAll('a')).filter(a => a.href && (a.href.includes("/BookUs") || a.href.includes("/Consult")));
            bookUsLinks.forEach(link => {
                link.href = '/BookUs'; // Native /BookUs route points to Login anyway
            });

            // Actively protect the /Consult page (not /BookUs, which is the login page)
            const currentPath = window.location.pathname;
            if (currentPath.includes("/Consult") || currentPath.endsWith("/Consult")) {
                window.location.href = '/Login?redirect=/Consult';
            }
        }
    }

    // Global Auth Status check for all pages with sticky-navbar
    async function checkAuthStatusGlobal() {
        // Robustly determine API URL
        const baseUrl = (window.MKAVS_CONFIG && window.MKAVS_CONFIG.API_BASE_URL) 
            ? window.MKAVS_CONFIG.API_BASE_URL 
            : 'https://api-mkavs.vercel.app'; // Fallback to production API

        // ── Step 1: Apply cached auth state immediately (instant UI update) ──
        const cached = getAuthCache();
        if (cached) {
            applyAuthState(cached, baseUrl);
        }

        // ── Step 2: Verify with the API in the background ────────────────────
        try {
            const response = await fetch(baseUrl + '/auth/status', {
                credentials: 'include'
            });
            const data = await response.json();

            // Cache the fresh result
            setAuthCache(data);

            // Apply fresh state (may override cached state if session expired)
            applyAuthState(data, baseUrl);

        } catch (error) {
            console.warn('Auth status check failed (network/CORS):', error.message);
            // If cache exists and API is unreachable, keep the cached UI state.
            // If no cache and API fails, the navbar stays as-is (Login).
        }
    }
    
    checkAuthStatusGlobal();
});
