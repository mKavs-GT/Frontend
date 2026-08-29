import React from 'react';
import logo from '../assets/logo.png';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <img src={logo} alt="FilmAura Logo" className="footer-logo-img" />
                </div>
                <p className="footer-copyright">Copyrights Reserved © mKavs Global Tech</p>
                <p className="footer-disclaimer">This is a Sample website and not used for any other purposes</p>
            </div>
        </footer>
    );
};

export default Footer;
