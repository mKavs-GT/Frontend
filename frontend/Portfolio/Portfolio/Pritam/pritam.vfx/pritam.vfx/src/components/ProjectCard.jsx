import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <>
            <motion.article
                className="project-card"
                variants={cardVariants}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.03, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                {/* Image */}
                <div className="project-card__image-wrapper">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="project-card__image"
                        loading="lazy"
                    />
                    <div className="project-card__overlay"></div>

                    {/* Year Badge */}
                    <span className="project-card__year">{project.year}</span>

                    {/* View Icon */}
                    <motion.div
                        className="project-card__view"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="project-card__content">
                    <span className="project-card__category">{project.category}</span>
                    <h3 className="project-card__title">{project.title}</h3>

                    {/* Tags */}
                    <div className="project-card__tags">
                        {project.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="project-card__tag">{tag}</span>
                        ))}
                    </div>
                </div>
            </motion.article>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="project-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            className="project-modal__content"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                className="project-modal__close"
                                onClick={() => setIsModalOpen(false)}
                                aria-label="Close modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>

                            {/* Modal Image */}
                            <div className="project-modal__image-wrapper">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="project-modal__image"
                                />
                            </div>

                            {/* Modal Info */}
                            <div className="project-modal__info">
                                <span className="project-modal__category">{project.category}</span>
                                <h2 className="project-modal__title">{project.title}</h2>
                                <p className="project-modal__description">{project.description}</p>

                                <div className="project-modal__meta">
                                    <div className="project-modal__meta-item">
                                        <span className="project-modal__meta-label">Year</span>
                                        <span className="project-modal__meta-value">{project.year}</span>
                                    </div>
                                    <div className="project-modal__meta-item">
                                        <span className="project-modal__meta-label">Tags</span>
                                        <div className="project-modal__tags">
                                            {project.tags.map((tag) => (
                                                <span key={tag} className="project-modal__tag">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProjectCard;
