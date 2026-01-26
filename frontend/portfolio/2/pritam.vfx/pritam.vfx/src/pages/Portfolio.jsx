import { motion } from 'framer-motion';
import PortfolioGrid from '../components/PortfolioGrid';
import './Portfolio.css';

const Portfolio = () => {
    return (
        <main className="portfolio-page">
            {/* Page Header */}
            <section className="portfolio-page__header">
                <div className="container">
                    <motion.div
                        className="portfolio-page__intro"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="portfolio-page__label">My Work</span>
                        <h1 className="portfolio-page__title">
                            Creative <span className="text-gradient">Projects</span>
                        </h1>
                        <p className="portfolio-page__description">
                            Explore my collection of video edits, graphic designs, and motion graphics.
                            Each project tells a unique story crafted with passion and precision.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Portfolio Grid */}
            <section className="portfolio-page__grid">
                <div className="container">
                    <PortfolioGrid />
                </div>
            </section>
        </main>
    );
};

export default Portfolio;
