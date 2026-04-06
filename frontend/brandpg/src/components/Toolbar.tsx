import { useState, useEffect } from 'react';

export function Toolbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userAuth, setUserAuth] = useState<{ loggedIn: boolean, user?: any }>({ loggedIn: false });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const API_BASE_URL = (window as any).MKAVS_CONFIG?.API_BASE_URL || 'https://api.mkavs.com';
                const response = await fetch(API_BASE_URL + '/auth/status', {
                    credentials: 'include'
                });
                const data = await response.json();
                setUserAuth(data);
            } catch (error) {
                console.error('Error checking auth status:', error);
            }
        };
        checkAuth();
    }, []);

    const profileImageUrl = userAuth.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(userAuth.user?.displayName || 'User')}&background=ccff00&color=000&size=150`;

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (Math.abs(currentScrollY - lastScrollY) < 5) return;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <nav id="main-toolbar"
            className={`fixed top-0 left-0 right-0 p-2 pt-4 md:p-4 md:pt-7 w-full bg-[#111111]/90 backdrop-blur-md z-[100] transition-transform duration-300 ease-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <div className="hidden md:flex items-center space-x-8 text-lg font-medium min-w-0 pointer-events-auto">
                    <div className="space-x-6 whitespace-nowrap flex items-center">
                        {/* Logo/Home links */}
                        <a href="../../index.html" id="toolbar-home-link"
                            className="text-lg text-white hover:text-[#c7f908] transition-colors">Home</a>
                        <a href="../../about/about.html"
                            className="text-lg text-white hover:text-[#c7f908] transition-colors">About</a>
                        <a href="../../index.html#our-works"
                            className="text-lg text-white hover:text-[#c7f908] transition-colors">Our Work</a>
                        <a href="/brandpg/brnd.html"
                            className="text-lg text-white hover:text-[#c7f908] transition-colors">Branding</a>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-lg ml-auto pointer-events-auto text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    &#x2261;
                </button>

                {/* Desktop Right Menu */}
                <div className="hidden md:flex items-center space-x-8 text-lg font-medium min-w-0 ml-auto pointer-events-auto">
                    <div className="space-x-6 whitespace-nowrap flex items-center">
                        <a href="../../pricingpage/pricing.html"
                            className="text-lg text-white hover:text-[#c7f908] transition-colors">Pricing</a>
                        <a href="../../consult/consult.html"
                            className="text-lg text-white hover:text-[#c7f908] transition-colors">Book Us</a>
                        <a href="../../support/support.html"
                            className="text-lg text-white hover:text-[#c7f908] transition-colors">Support</a>
                        {/* Login Button Styled */}
                        <a href="../../loginpg/login.html"
                            className="login-btn text-lg text-white hover:text-[#c7f908] transition-colors">
                            {userAuth.loggedIn ? 'Dashboard' : 'Login'}
                        </a>
                    </div>
                    <div className="flex space-x-4 text-xl items-center">
                        <a href="https://www.instagram.com/mkavsglobaltech/" target="_blank" rel="noopener noreferrer"
                            className="text-white hover:text-[#c7f908]"><i className="fa-brands fa-instagram"></i></a>
                        <a href="#" className="text-white hover:text-[#c7f908]"><i className="fa-brands fa-discord"></i></a>
                        <a href="https://www.linkedin.com/company/mkavs-global-tech/about/" target="_blank" rel="noopener noreferrer"
                            className="text-white hover:text-[#c7f908]"><i className="fa-brands fa-linkedin-in"></i></a>
                        <a href="../../profile/profile.html" className="text-white hover:text-[#c7f908] ml-2 flex items-center" title={userAuth.loggedIn ? `Logged in as ${userAuth.user?.displayName}` : 'Login'}>
                            {userAuth.loggedIn ? (
                                <img src={profileImageUrl} alt="Profile" className="w-6 h-6 rounded-full border border-white hover:border-[#c7f908] transition-colors object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=User&background=ccff00&color=000&size=150'; }} />
                            ) : (
                                <i className="fa-regular fa-user"></i>
                            )}
                        </a>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-black/90 p-4 flex flex-col space-y-4 shadow-lg backdrop-blur-md border-t border-white/10">
                    <a href="../../index.html" className="text-white hover:text-[#c7f908] transition-colors">Home</a>
                    <a href="../../about/about.html" className="text-white hover:text-[#c7f908] transition-colors">About</a>
                    <a href="../../index.html#our-works" className="text-white hover:text-[#c7f908] transition-colors">Our Work</a>
                    <a href="/brandpg/brnd.html" className="text-white hover:text-[#c7f908] transition-colors">Branding</a>
                    <a href="../../pricingpage/pricing.html" className="text-white hover:text-[#c7f908] transition-colors">Pricing</a>
                    <a href="../../consult/consult.html" className="text-white hover:text-[#c7f908] transition-colors">Book Us</a>
                    <a href="../../support/support.html" className="text-white hover:text-[#c7f908] transition-colors">Support</a>
                    <a href="../../loginpg/login.html" className="text-white hover:text-[#c7f908] transition-colors">{userAuth.loggedIn ? 'Dashboard' : 'Login'}</a>
                </div>
            )}
        </nav>
    );
}
