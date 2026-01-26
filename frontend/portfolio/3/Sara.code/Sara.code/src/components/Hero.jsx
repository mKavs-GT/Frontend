import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import './Hero.css';
import Logo from './Logo';

const Hero = () => {
    const scrollToWork = () => {
        const element = document.getElementById('projects');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToContact = () => {
        const element = document.getElementById('contact');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="hero">
            <div className="hero-background">
                <div className="hero-gradient"></div>
                <div className="hero-particles"></div>

                {/* Floating monochrome icons */}
                <div className="floating-icons">
                    <div className="floating-icon icon-1"><FaGithub /></div>
                    <div className="floating-icon icon-2"><FaLinkedin /></div>
                    <div className="floating-icon icon-3"><FaXTwitter /></div>
                    <div className="floating-icon icon-4"><FaGithub /></div>
                    <div className="floating-icon icon-5"><FaLinkedin /></div>
                </div>
            </div>

            <div className="hero-socials-top">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-top-link"><FaGithub /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-top-link"><FaLinkedin /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-top-link"><FaXTwitter /></a>
            </div>

            <div className="hero-content">
                <div className="hero-badge" onClick={scrollToContact} style={{ cursor: 'pointer' }}>
                    <Logo className="badge-logo" />
                    <span className="badge-text">Available for hire</span>
                </div>

                <h1 className="hero-title">
                    <span className="title-line title-white">UNFILTERED</span>
                    <span className="title-line title-ampersand">&</span>
                    <span className="title-line title-gradient">UNBOTHERED</span>
                </h1>

                <p className="hero-description">
                    Building digital experiences that hit different. Full-stack developer obsessed with clean code and chaotic energy.
                </p>

                <button className="hero-cta" onClick={scrollToWork}>
                    <span>See My Work</span>
                    <span className="cta-arrow">↓</span>
                </button>

                <div className="scroll-indicator">
                    <span className="scroll-text">SCROLL TO EXPLORE</span>
                </div>
            </div>
        </section>
    );
};

export default Hero;
