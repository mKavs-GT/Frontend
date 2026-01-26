import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            name: 'Instagram',
            url: 'https://instagram.com',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
            )
        },
        {
            name: 'Behance',
            url: 'https://behance.net',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.619.998 2.241 2.252 2.241.97 0 1.692-.475 1.934-1.212h3.57zm-6.736-4.054h4.008c-.088-1.159-.888-1.8-1.958-1.8-1.17 0-1.854.668-2.05 1.8zM9.072 21H.944V5h8.128c3.087 0 4.935 1.648 4.935 4.323 0 1.79-.923 2.936-2.305 3.535 1.775.545 2.842 1.888 2.842 3.898 0 2.979-2.286 4.244-5.472 4.244zM4.79 8.5v3h3.144c1.107 0 1.948-.462 1.948-1.5s-.841-1.5-1.948-1.5H4.79zm0 6v3.5h3.676c1.249 0 2.094-.673 2.094-1.75s-.845-1.75-2.094-1.75H4.79z" />
                </svg>
            )
        },
        {
            name: 'YouTube',
            url: 'https://youtube.com',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
            )
        },
        {
            name: 'Twitter',
            url: 'https://twitter.com',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            )
        }
    ];

    return (
        <footer className="footer">
            <div className="footer__container">
                {/* Brand */}
                <div className="footer__brand">
                    <Link to="/" className="footer__logo">
                        <motion.div
                            className="footer__logo-wrapper"
                            initial="initial"
                            whileHover="hover"
                            style={{ display: 'flex', alignItems: 'center', gap: 'inherit' }}
                        >
                            <Logo size={36} className="footer__logo-img" />
                            <span className="footer__logo-text">pritam.vfx</span>
                        </motion.div>
                    </Link>
                    <p className="footer__tagline">
                        Crafting visual stories that captivate and inspire.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="footer__links">
                    <h4 className="footer__heading">Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/projects">Projects</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                {/* Services */}
                <div className="footer__links">
                    <h4 className="footer__heading">Services</h4>
                    <ul>
                        <li><span>Video Editing</span></li>
                        <li><span>Graphic Design</span></li>
                        <li><span>Motion Graphics</span></li>
                        <li><span>Anime Edits</span></li>
                    </ul>
                </div>

                {/* Social */}
                <div className="footer__social">
                    <h4 className="footer__heading">Connect</h4>
                    <div className="footer__social-links">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer__social-link"
                                aria-label={social.name}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer__bottom">
                <p>Copyrights Reserved © mKavs Global Tech</p>
                <p>This is a Sample website and not used for any other purposes</p>
            </div>
        </footer>
    );
};

export default Footer;
