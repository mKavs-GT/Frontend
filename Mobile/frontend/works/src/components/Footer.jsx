import React from 'react';

const Footer = () => {
  return (
    <section className="pricing-dj-section w-full">
      <div className="pricing-dj-container">
        <div className="pricing-dj-content">
          <div className="pricing-dj-text">
            <h1 className="pricing-dj-title">
              YOUR <br />
              <span className="pricing-dj-blue">DIGITAL JOURNEY</span><br />
              <span className="pricing-dj-lime">STARTS HERE.</span>
            </h1>
            <div className="pricing-dj-buttons">
              <a href="/consult" rel="noopener noreferrer">
                <button className="btn-dj btn-dj-primary">BOOK FREE CONSULTATION</button>
              </a>
              <a href="/support" rel="noopener noreferrer">
                <button className="btn-dj btn-dj-secondary">CUSTOMER SUPPORT</button>
              </a>
            </div>
          </div>
          <div className="pricing-dj-video">
            <video src="/images/mascot.mp4" autoPlay loop muted playsInline></video>
          </div>
        </div>
      </div>

      <div className="pricing-copyright">
        &copy; COPYRIGHT MKAVS GLOBAL TECH/ SUPPORT@MKAVS.COM
      </div>
    </section>
  );
};

export default Footer;
