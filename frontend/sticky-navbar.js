document.addEventListener('DOMContentLoaded', () => {
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

    // Global Auth Status check for all pages with sticky-navbar
    async function checkAuthStatusGlobal() {
        try {
            const baseUrl = (window.MKAVS_CONFIG && window.MKAVS_CONFIG.API_BASE_URL) ? window.MKAVS_CONFIG.API_BASE_URL : 'https://api.mkavs.com';
            const response = await fetch(baseUrl + '/auth/status', {
                credentials: 'include'
            });
            const data = await response.json();

            const loginBtns = document.querySelectorAll('.login-btn, #desktop-login-btn');
            const userIcons = document.querySelectorAll('.fa-regular.fa-user');

            if (data.loggedIn) {
                loginBtns.forEach(btn => {
                    if (btn.textContent.trim().toLowerCase() === 'login') {
                        btn.textContent = 'Logout';
                        btn.href = baseUrl + '/auth/logout';
                        btn.addEventListener('click', () => {
                            localStorage.removeItem('mKavs_palette_likes');
                            localStorage.removeItem('mKavs_font_likes');
                        });
                    }
                });

                userIcons.forEach(icon => {
                    const parent = icon.parentElement;
                    if (parent) {
                        try {
                            const currentPath = window.location.pathname;
                            const isRoot = currentPath.endsWith('/') || currentPath.endsWith('index.html') && !currentPath.includes('/portfolio/') && !currentPath.includes('/frontend/');
                            // Always update href to profile based on relative path
                            parent.href = isRoot ? './profile/profile.html' : '../profile/profile.html';
                        } catch(e) {}
                    }
                    if (data.user) {
                        const profileImageUrl = data.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.displayName || 'User')}&background=ccff00&color=000&size=150`;
                        const imgEl = document.createElement('img');
                        imgEl.src = profileImageUrl;
                        imgEl.alt = "Profile";
                        // Basic stylings that fit everywhere
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
                        icon.parentElement.replaceChild(imgEl, icon);
                    }
                });
            } else {
                userIcons.forEach(icon => {
                    const parent = icon.parentElement;
                    if (parent) {
                        try {
                            const currentPath = window.location.pathname;
                            const isRoot = currentPath.endsWith('/') || currentPath.endsWith('index.html') && !currentPath.includes('/portfolio/') && !currentPath.includes('/frontend/');
                            parent.href = isRoot ? './loginpg/login.html' : '../loginpg/login.html';
                        } catch(e) {}
                    }
                });

                // Redirect "Book Us" buttons in toolbars or everywhere to Login if unauthenticated
                const bookUsLinks = Array.from(document.querySelectorAll('a')).filter(a => a.href && a.href.includes('consult.html'));
                bookUsLinks.forEach(link => {
                    try {
                        const currentPath = window.location.pathname;
                        const isRoot = currentPath.endsWith('/') || currentPath.endsWith('index.html') && !currentPath.includes('/portfolio/') && !currentPath.includes('/frontend/');
                        link.href = isRoot ? './loginpg/login.html' : '../loginpg/login.html';
                    } catch(e) {}
                });

                // Actively kick out users who navigate directly to consult.html while unauthenticated
                const currentPath = window.location.pathname;
                if (currentPath.includes('consult.html')) {
                    window.location.href = '../loginpg/login.html';
                }
            }
        } catch (error) {
            console.error('Error checking auth status (global):', error);
        }
    }
    
    checkAuthStatusGlobal();
});
