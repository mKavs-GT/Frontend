import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import PortfolioGrid from '../components/PortfolioGrid';
import About from '../components/About';
import './Home.css';

const Home = () => {
    return (
        <main className="home">
            {/* Hero Section */}
            <Hero />

            {/* About Teaser */}
            <About compact={true} />

            {/* Featured Work Section */}
            <section className="home__section">
                <div className="container">
                    <motion.div
                        className="home__section-header"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="home__section-label">Featured Work</span>
                        <h2 className="home__section-title">
                            Selected <span className="text-gradient">Projects</span>
                        </h2>
                        <p className="home__section-description">
                            A curated collection of my best work in video editing, graphic design, and motion graphics.
                        </p>
                    </motion.div>

                    <PortfolioGrid featured={true} limit={3} />

                    <motion.div
                        className="home__section-cta"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Link to="/projects" className="btn btn-secondary">
                            View All Projects
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="home__cta-section">
                <div className="container">
                    <motion.div
                        className="home__cta-content"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="home__cta-title">
                            Ready to Create Something <span className="text-gradient">Extraordinary?</span>
                        </h2>
                        <p className="home__cta-description">
                            Let's collaborate and bring your creative vision to life with stunning visuals and captivating edits.
                        </p>
                        <Link to="/contact" className="btn btn-primary">
                            Start a Project
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default Home;
