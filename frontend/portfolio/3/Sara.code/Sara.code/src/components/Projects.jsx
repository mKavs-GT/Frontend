import './Projects.css';

const projectsData = [
    {
        id: 1,
        title: 'Vibe Check',
        description: 'A mood-tracking app that judges your music taste. Built with React & Spotify API.',
        image: 'https://i.ytimg.com/vi/_upAf1i3D48/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGDIgYihlMA8=&rs=AOn4CLAR5nVcczr-6HDd09XVSfYjCGPcAQ',
        tags: ['React', 'API', 'Chaos'],
        liveUrl: '#',
        githubUrl: '#'
    },
    {
        id: 2,
        title: 'Neon Dreams Store',
        description: 'E-commerce for digital artifacts. Holographic 3D product views.',
        image: 'https://www.shutterstock.com/shutterstock/videos/1029654185/thumb/1.jpg?ip=x480',
        tags: ['Three.js', 'Next.js', 'Stripe'],
        liveUrl: '#',
        githubUrl: '#'
    },
    {
        id: 3,
        title: 'Glitch Gallery',
        description: 'Generative art collection. Every visit creates a unique distortion.',
        image: 'https://blog.native-instruments.com/wp-content/uploads/2023/04/what-is-distortion-in-music-featured.jpg',
        tags: ['Canvas', 'WebGL', 'Art'],
        liveUrl: '#',
        githubUrl: '#'
    }
];

const Projects = () => {
    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <section id="projects" className="projects-section">
            <div className="container">
                <div className="projects-header">
                    <h2 className="projects-title">SELECTED</h2>
                    <span className="section-label">// 02 - PROJECTS</span>
                </div>

                <div className="projects-grid">
                    {projectsData.map((project) => (
                        <article
                            key={project.id}
                            className="project-card"
                            onMouseMove={handleMouseMove}
                        >
                            <div className="project-card-glow"></div>
                            <div className="project-image-wrapper">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="project-image"
                                />
                                <div className="project-tags">
                                    {project.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className={`project-tag ${index === project.tags.length - 1 ? 'tag-highlight' : ''}`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="project-content">
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-description">{project.description}</p>

                                <div className="project-links">
                                    <a href={project.liveUrl} className="project-link">
                                        <span className="link-text">LIVE</span>
                                        <span className="link-highlight">DEMO</span>
                                        <span className="link-arrow">↗</span>
                                    </a>
                                    <a href={project.githubUrl} className="project-github" aria-label="GitHub">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
