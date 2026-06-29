import { motion } from 'framer-motion';
import About from '../components/About';
import './AboutPage.css';

const AboutPage = () => {
    const experiences = [
        {
            year: '2024',
            title: 'Senior 2D Animator',
            company: 'Freelance',
            description: 'Creating captivating 2D animations, character animations, and motion graphics for clients worldwide.'
        },
        {
            year: '2023',
            title: 'Video Editor',
            company: 'Creative Studio',
            description: 'Led video production and editing for various branding and marketing campaigns.'
        },
        {
            year: '2022',
            title: 'Motion Graphics Artist',
            company: 'Animation Studio',
            description: 'Created dynamic motion graphics and visual effects for promotional content.'
        },
        {
            year: '2021',
            title: 'Junior Animator',
            company: 'Freelance',
            description: 'Started my creative journey with anime edits, AMVs, and small animation commissions.'
        }
    ];

    return (
        <main className="about-page">
            {/* Page Header */}
            <section className="about-page__header">
                <div className="container">
                    <motion.div
                        className="about-page__intro"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >

                        <h1 className="about-page__title">
                            The Story <span className="text-gradient">Behind the Art</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <About />

            {/* Experience Timeline */}
            <section className="about-page__experience">
                <div className="container">
                    <motion.h2
                        className="about-page__section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        My Journey
                    </motion.h2>

                    <div className="about-page__timeline">
                        {/* Vertical Progress Bar */}
                        <div className="about-page__timeline-progress-bg" />
                        <motion.div
                            className="about-page__timeline-progress-bar"
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: false, amount: 0.1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{ originY: 1 }}
                        />
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.year + exp.title}
                                className="about-page__timeline-item"
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="about-page__timeline-year">{exp.year}</div>
                                <div className="about-page__timeline-content">
                                    <h3>{exp.title}</h3>
                                    <span className="about-page__timeline-company">{exp.company}</span>
                                    <p>{exp.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Fun Facts */}
            <section className="about-page__facts">
                <div className="container">
                    <motion.h2
                        className="about-page__section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Fun Facts
                    </motion.h2>

                    <div className="about-page__facts-grid">
                        {[
                            { emoji: '🎬', fact: 'Edited 100+ anime AMVs' },
                            { emoji: '☕', fact: 'Fueled by chai and creativity' },
                            { emoji: '🎮', fact: 'Gaming enthusiast' },
                            { emoji: '🌙', fact: 'Night owl editor' },
                            { emoji: '🎵', fact: 'Music drives my edits' },
                            { emoji: '📚', fact: 'Always learning new techniques' }
                        ].map((item, index) => (
                            <motion.div
                                key={item.fact}
                                className="about-page__fact-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <span className="about-page__fact-emoji">{item.emoji}</span>
                                <span className="about-page__fact-text">{item.fact}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AboutPage;
