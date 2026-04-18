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
            // Robustly determine API URL
            const baseUrl = (window.MKAVS_CONFIG && window.MKAVS_CONFIG.API_BASE_URL) 
                ? window.MKAVS_CONFIG.API_BASE_URL 
                : 'https://api-mkavs.vercel.app'; // Fallback to production API

            const response = await fetch(baseUrl + '/auth/status', {
                credentials: 'include'
            });
            const data = await response.json();

            const loginBtns = document.querySelectorAll('.login-btn, #desktop-login-btn');
            const userIcons = document.querySelectorAll('.fa-regular.fa-user');
            
            // Helper to get relative prefix based on depth
            const currentPath = window.location.pathname;
            const isInSubfolder = currentPath.includes('/about/') || 
                                currentPath.includes('/pricingpage/') || 
                                currentPath.includes('/consult/') || 
                                currentPath.includes('/support/') || 
                                currentPath.includes('/loginpg/') || 
                                currentPath.includes('/profile/');
            
            const prefix = isInSubfolder ? '../' : './';

            if (data.loggedIn) {
                loginBtns.forEach(btn => {
                    // Only change if it's currently showing "Login"
                    const text = btn.textContent.trim().toLowerCase();
                    if (text === 'login') {
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
                        parent.href = prefix + 'profile/profile.html';
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
            } else {
                // User is not logged in
                loginBtns.forEach(btn => {
                    if (btn.textContent.trim().toLowerCase() === 'logout') {
                        btn.textContent = 'Login';
                        btn.href = prefix + 'loginpg/login.html';
                    }
                });

                userIcons.forEach(icon => {
                    const parent = icon.parentElement;
                    if (parent) {
                        parent.href = prefix + 'loginpg/login.html';
                    }
                });

                // Update "Book Us" links to point to login if they require auth
                const bookUsLinks = Array.from(document.querySelectorAll('a')).filter(a => a.href && a.href.includes('consult.html'));
                bookUsLinks.forEach(link => {
                    link.href = prefix + 'loginpg/login.html';
                });

                // Actively protect the consult page
                if (currentPath.includes('consult/consult.html')) {
                    window.location.href = '../loginpg/login.html';
                }
            }
        } catch (error) {
            console.error('Error checking auth status (global):', error);
        }
    }
    
    checkAuthStatusGlobal();
});
