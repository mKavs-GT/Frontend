import Logo from './Logo';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-tagline">
                    <Logo className="footer-logo-icon" />
                    <span className="tagline-text">STAY WEIRD</span>
                    <Logo className="footer-logo-icon" />
                </div>

                <p className="footer-copyright">
                    Copyrights Reserved © mKavs Global Tech
                </p>
                <p className="footer-disclaimer">
                    This is a Sample website and not used for any other purposes as a footer
                </p>

                <div className="footer-links">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                        GitHub
                    </a>
                    <span className="footer-divider">·</span>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                        LinkedIn
                    </a>
                    <span className="footer-divider">·</span>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                        Twitter
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
