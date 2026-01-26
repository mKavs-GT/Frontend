import { useState } from 'react';

export function Toolbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav id="main-toolbar"
            className="absolute top-0 left-0 right-0 p-2 pt-4 md:p-4 md:pt-7 w-full bg-transparent z-[70] transition-transform duration-700 ease-out">
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
                        <a href="/brandpg/brnd.html" target="_blank" rel="noopener noreferrer"
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
                        <a href="../../pricingpage/pricing.html" target="_blank" rel="noopener noreferrer"
                            className="text-lg text-white hover:text-[#c7f908] transition-colors">Pricing</a>
                        <a href="../../consult/consult.html" target="_blank" rel="noopener noreferrer"
                            className="text-lg text-white hover:text-[#c7f908] transition-colors">Book Us</a>
                        {/* Login Button Styled */}
                        <a href="../../loginpg/login.html"
                            className="login-btn text-lg text-white hover:text-[#c7f908] transition-colors">Login</a>
                    </div>
                    <div className="flex space-x-4 text-xl">
                        <a href="https://www.instagram.com/mkavsglobaltech/" target="_blank" rel="noopener noreferrer"
                            className="text-white hover:text-[#c7f908]"><i className="fa-brands fa-instagram"></i></a>
                        <a href="#" className="text-white hover:text-[#c7f908]"><i className="fa-brands fa-discord"></i></a>
                        <a href="https://www.linkedin.com/company/mkavs-global-tech/about/" target="_blank" rel="noopener noreferrer"
                            className="text-white hover:text-[#c7f908]"><i className="fa-brands fa-linkedin-in"></i></a>
                        <a href="../../profile/profile.html" className="text-white hover:text-[#c7f908]"><i
                            className="fa-regular fa-user"></i></a>
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
                    <a href="../../loginpg/login.html" className="text-white hover:text-[#c7f908] transition-colors">Login</a>
                </div>
            )}
        </nav>
    );
}
