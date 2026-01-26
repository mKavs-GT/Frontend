import { useState, useEffect, useRef } from 'react';
import './StatsWrapped.css';

const statsData = [
    {
        id: 1,
        category: 'FRONTEND',
        name: 'React',
        description: 'Top 0.01% Artist',
        progress: 95,
        color: 'pink'
    },
    {
        id: 2,
        category: 'LANGUAGES',
        name: 'TypeScript',
        description: 'On Repeat',
        progress: 88,
        color: 'cyan'
    },
    {
        id: 3,
        category: 'STYLING',
        name: 'Tailwind CSS',
        description: 'Lover: Speed',
        progress: 90,
        color: 'green'
    },
    {
        id: 4,
        category: 'BACKEND',
        name: 'Node.js',
        description: 'Most Played',
        progress: 82,
        color: 'green'
    }
];

const StatsWrapped = () => {
    const [animate, setAnimate] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setAnimate(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <section id="stats" className="stats-section" ref={sectionRef}>
            <div className="container">
                <div className="stats-header">
                    <h2 className="stats-title">
                        <span className="title-white">STATS</span>
                        <span className="title-gradient">WRAPPED</span>
                    </h2>
                    <p className="stats-subtitle">My top genres this year</p>
                </div>

                <div className="stats-grid">
                    {statsData.map((stat, index) => (
                        <div
                            key={stat.id}
                            className={`stat-wrapper ${animate ? 'in-view' : ''}`}
                            style={{
                                transitionDelay: `${index * 0.15}s`,
                                '--index': index
                            }}
                        >
                            <div
                                className={`stat-card stat-${stat.color}`}
                                onMouseMove={handleMouseMove}
                            >
                                <div className="stat-card-glow"></div>
                                <div className="stat-header">
                                    <span className="stat-category">{stat.category}</span>
                                    <span className="stat-icon">🎵</span>
                                </div>

                                <h3 className="stat-name">{stat.name}</h3>
                                <p className="stat-description">{stat.description}</p>

                                <div className="stat-progress">
                                    <div
                                        className="stat-progress-bar"
                                        style={{
                                            width: animate ? `${stat.progress}%` : '0%',
                                            transition: `width 1.5s cubic-bezier(0.65, 0, 0.35, 1) ${0.5 + (index * 0.15)}s`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsWrapped;
