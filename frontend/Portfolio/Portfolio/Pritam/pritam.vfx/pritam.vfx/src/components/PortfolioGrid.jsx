import { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { projects, categories } from '../data/projects';
import './PortfolioGrid.css';

const PortfolioGrid = ({ featured = false, limit = null }) => {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredProjects = projects.filter((project) => {
        if (featured && !project.featured) return false;
        if (activeCategory === 'All') return true;
        return project.category === activeCategory;
    });

    const displayProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="portfolio-grid">
            {/* Category Filters - only show when not featured */}
            {!featured && (
                <div className="portfolio-grid__filters">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`portfolio-grid__filter ${activeCategory === category ? 'portfolio-grid__filter--active' : ''}`}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}

            {/* Projects Grid */}
            <motion.div
                className="portfolio-grid__grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={activeCategory}
            >
                {displayProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </motion.div>

            {/* Empty State */}
            {displayProjects.length === 0 && (
                <div className="portfolio-grid__empty">
                    <p>No projects found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default PortfolioGrid;
