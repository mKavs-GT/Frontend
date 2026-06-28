import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const BrandCTA = () => {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const rightSideRef = useRef(null);
  const [authUrl, setAuthUrl] = useState('/loginpg/login.html'); // Default to login

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('https://api-mkavs.vercel.app/auth/status', {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.loggedIn) {
          setAuthUrl('/consult/consult.html');
        } else {
          setAuthUrl('/loginpg/login.html');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
    checkAuth();
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const rightSide = rightSideRef.current;

    if (!section || !grid || !rightSide) return;

    // Only apply on desktop
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
      const totalHeight = grid.scrollHeight;
      const viewHeight = rightSide.offsetHeight;
      const distance = totalHeight - viewHeight;

      if (distance > 0) {
        gsap.to(grid, {
          y: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 5%", // Pin slightly before hitting the very top
            end: `+=${distance + 500}`, // Slightly longer scroll
            pin: true,
            scrub: 1.2,
            invalidateOnRefresh: true,
          }
        });
      }
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <>
      <style>{`
        #projects-exact {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          min-height: 100vh;
          position: relative;
          background: #1F1F1F;
          border-top: 1px solid #1a1a1a;
          overflow: visible;
          backface-visibility: hidden;
          transform-style: preserve-3d;
          font-family: "Space Grotesk", sans-serif;
          margin-top: 0px;
          border-radius: 40px;
        }

        .project-left-exact {
          width: 40%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 4rem 6vw;
          z-index: 10;
          backface-visibility: hidden;
        }

        .project-left-content-exact {
          max-width: 450px;
        }

        .project-title-exact {
          font-family: "Syncopate", sans-serif;
          font-size: 3.8vw;
          line-height: 0.95;
          font-weight: 800;
          margin-bottom: 2.5rem;
          color: #fff;
          text-transform: uppercase;
        }

        .project-title-exact em {
          font-family: "Playfair Display", serif;
          font-weight: 400;
          font-style: italic;
          color: #ccff00;
          text-transform: lowercase;
          -webkit-text-stroke: 0;
        }

        .project-description-exact {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #888;
          margin-bottom: 3.5rem;
          font-weight: 300;
        }

        .btn-arrow-exact {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          text-decoration: none;
          color: #fff;
          font-weight: 700;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-arrow-exact svg {
          transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .btn-arrow-exact:hover {
          color: #ccff00;
          border-color: #ccff00;
        }

        .btn-arrow-exact:hover svg {
          transform: translateX(8px);
          stroke: #ccff00;
        }

        .project-right-exact {
          width: 60%;
          height: 100vh;
          overflow: hidden;
          position: relative;
        }

        .cards-grid-exact {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 2rem;
          padding: 10rem 2rem 150px 0;
          width: 100%;
        }

        .project-card-exact {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2.5rem;
          background: #080808;
          border: 1px solid #222;
          transition: all 0.5s ease;
          min-height: 450px;
          cursor: pointer;
        }

        .project-card-exact:hover {
          border-color: #ccff00;
        }

        .project-card-exact h3 {
          font-family: 'Syncopate', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .project-card-exact p {
          color: #888;
          font-size: 1.1rem;
          line-height: 1.6;
          font-weight: 300;
        }

        .img-container-exact {
          width: 100%;
          height: 220px;
          margin-top: 1.5rem;
          overflow: hidden;
          border-radius: 8px;
        }

        .img-container-exact img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .project-card-exact:hover .img-container-exact img {
          transform: scale(1.05);
        }

        .card-link-exact {
          margin-top: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #fff;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.8rem;
          transition: color 0.3s ease;
        }

        .project-card-exact:hover .card-link-exact {
          color: #ccff00;
        }

        @media (max-width: 1024px) {
          #projects-exact {
            flex-direction: column;
            height: auto;
          }

          .project-left-exact, .project-right-exact {
            width: 100%;
            height: auto;
            padding: 4rem 8vw;
          }

          .cards-grid-exact {
            grid-template-columns: 1fr;
            padding-right: 0;
            padding-top: 2rem;
          }

          .project-title-exact {
            font-size: 10vw;
          }
        }
      `}</style>

      <section id="projects-exact" ref={sectionRef}>
        <div className="project-left-exact">
          <div className="project-left-content-exact">
            <h2 className="project-title-exact">EXPLORE <br /><em>Our Latest</em> Work</h2>
            <p className="project-description-exact">
              From bold branding to intuitive user interfaces, we turn ambitious ideas into digital reality. Dive into our portfolio to see how we help businesses stand out and grow.
            </p>
            <a href={authUrl} className="btn-arrow-exact">
              Book Consultation
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>

        <div className="project-right-exact" ref={rightSideRef}>
          <div className="cards-grid-exact" ref={gridRef}>
            <div className="project-card-exact" onClick={() => window.location.hash = 'portfolio'}>
              <div>
                <h3 className="text-white">Portfolio Websites</h3>
                <p>High-impact designs that showcase your creative projects with intention.</p>
                <div className="img-container-exact">
                  <img src="./src/assets/portfolio.jpg" alt="Portfolio Websites" />
                </div>
              </div>
              <div className="card-link-exact">
                View More
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>

            <div className="project-card-exact" onClick={() => window.location.hash = 'ecommerce'}>
              <div>
                <h3 className="text-white">E Commerce Websites</h3>
                <p>Scalable digital stores integrated with online booking systems to drive business growth.</p>
                <div className="img-container-exact">
                  <img src="./src/assets/ecommerce.jpg" alt="E Commerce Websites" />
                </div>
              </div>
              <div className="card-link-exact">
                View More
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>

            <div className="project-card-exact" onClick={() => window.location.hash = 'company'}>
              <div>
                <h3 className="text-white">Company Websites</h3>
                <p>Professional full-stack web solutions that establish a strong brand identity and digital presence.</p>
                <div className="img-container-exact">
                  <img src="./src/assets/company.jpg" alt="Company Websites" />
                </div>
              </div>
              <div className="card-link-exact">
                View More
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>

            <div className="project-card-exact" onClick={() => window.location.hash = 'portal'}>
              <div>
                <h3 className="text-white">Portals & Dashboards</h3>
                <p>Custom-built technical architectures designed to manage complex data and streamline user interactions.</p>
                <div className="img-container-exact">
                  <img src="./src/assets/dashboard.jpg" alt="Portals & Dashboards" />
                </div>
              </div>
              <div className="card-link-exact">
                View More
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BrandCTA;
