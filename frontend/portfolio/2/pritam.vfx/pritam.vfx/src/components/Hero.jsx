import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const heroRef = useRef(null);

    // Simplified mouse position tracking for a more "alive" background
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Direct mouse position for the "glow" effect
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    // Spring configs for different layers
    const springConfig = { damping: 25, stiffness: 150 };
    const springConfigSlow = { damping: 30, stiffness: 100 };
    const springConfigGrid = { damping: 40, stiffness: 60 };

    // Animated values for background elements (Parallax)
    const x1 = useSpring(mouseX, springConfig);
    const y1 = useSpring(mouseY, springConfig);
    const x2 = useSpring(mouseX, springConfigSlow);
    const y2 = useSpring(mouseY, springConfigSlow);

    // Subtle grid shift
    const gridX = useSpring(mouseX, springConfigGrid);
    const gridY = useSpring(mouseY, springConfigGrid);

    // Smooth cursor glow
    const glowX = useSpring(cursorX, springConfig);
    const glowY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!heroRef.current) return;

            const rect = heroRef.current.getBoundingClientRect();

            // Normalized position (-1 to 1)
            const offsetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const offsetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

            // Parallax offsets (DRAMATIC)
            mouseX.set(offsetX * 120);
            mouseY.set(offsetY * 80);

            // Direct cursor position for glow (relative to hero section)
            cursorX.set(e.clientX - rect.left);
            cursorY.set(e.clientY - rect.top);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY, cursorX, cursorY]);

    return (
        <section className="hero" ref={heroRef}>
            {/* Background Effects with Mouse Tracking */}
            <div className="hero__bg">
                {/* Interactive Mouse Glow */}
                <motion.div
                    className="hero__mouse-glow"
                    style={{
                        left: glowX,
                        top: glowY,
                    }}
                />

                <motion.div
                    className="hero__gradient hero__gradient--1"
                    style={{ x: x1, y: y1 }}
                />
                <motion.div
                    className="hero__gradient hero__gradient--2"
                    style={{ x: x2, y: y2 }}
                />
                <motion.div
                    className="hero__gradient hero__gradient--3"
                    style={{ x: gridX, y: gridY }}
                />
                <motion.div
                    className="hero__grid"
                    style={{ x: gridX, y: gridY }}
                />
            </div>

            <div className="hero__container">
                <motion.div
                    className="hero__content"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Tagline */}
                    <motion.span
                        className="hero__tagline"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        Video Editor & 2D Animator
                    </motion.span>

                    {/* Main Title */}
                    <motion.h1
                        className="hero__title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        Creating <span className="text-gradient">Visual Stories</span>
                        <br />
                        That Captivate
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        className="hero__description"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        Hi, I'm Pritam. I craft cinematic video edits, 2D animations, and visual
                        experiences that leave a lasting impression. Let's bring your vision to life.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="hero__cta"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                    >
                        <Link to="/projects" className="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            View My Work
                        </Link>
                        <Link to="/contact" className="btn btn-secondary">
                            Get In Touch
                        </Link>
                    </motion.div>

                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    className="hero__scroll"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                >
                    <span>Scroll to explore</span>
                    <div className="hero__scroll-line">
                        <div className="hero__scroll-dot"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
