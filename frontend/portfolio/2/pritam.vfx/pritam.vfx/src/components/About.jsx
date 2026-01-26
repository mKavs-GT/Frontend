import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import './About.css';

const AnimatedCounter = ({ from, to, delay, duration }) => {
    const count = useMotionValue(from);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [display, setDisplay] = useState(from);

    useEffect(() => {
        const controls = animate(count, to, {
            delay,
            duration,
            ease: "easeOut",
            onUpdate: (latest) => setDisplay(Math.round(latest))
        });
        return controls.stop;
    }, [count, to, delay, duration]);

    return <span>{display}%</span>;
};

const About = ({ compact = false }) => {
    const skills = [
        { name: 'Adobe Premiere Pro', level: 95 },
        { name: 'After Effects', level: 90 },
        { name: 'Photoshop', level: 92 },
        { name: 'Illustrator', level: 85 },
        { name: 'DaVinci Resolve', level: 80 },
        { name: 'Figma', level: 75 }
    ];

    const stats = [
        { value: '50+', label: 'Projects Completed' },
        { value: '3+', label: 'Years Experience' },
        { value: '30+', label: 'Happy Clients' },
        { value: '1M+', label: 'Views on Edits' }
    ];

    return (
        <section className={`about ${compact ? 'about--compact' : ''}`}>
            <div className="about__container">
                {/* Image Section */}
                <motion.div
                    className="about__image-section"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="about__image-wrapper">
                        <div className="about__image-frame">
                            <img
                                src="https://images.stockcake.com/public/6/5/4/654dd948-affc-44f8-b84b-220a6617c8ef/neon-grid-horizon-stockcake.jpg"
                                alt="Pritam - Video Editor & 2D Animator"
                                className="about__image"
                            />
                        </div>
                        {/* Decorative Elements */}
                        <div className="about__decoration about__decoration--1"></div>
                        <div className="about__decoration about__decoration--2"></div>
                    </div>

                    {/* Stats */}
                    {!compact && (
                        <div className="about__stats">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    className="about__stat"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                        // Default duration/delay for entrance
                                        default: { delay: index * 0.1, duration: 0.5 }
                                    }}
                                >
                                    <span className="about__stat-value">{stat.value}</span>
                                    <span className="about__stat-label">{stat.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Content Section */}
                <motion.div
                    className="about__content"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >

                    <h2 className="about__title">
                        Crafting Visual <span className="text-gradient">Magic</span>
                    </h2>

                    <div className="about__text">
                        <p>
                            Hey there! I'm Pritam, a passionate video editor and 2D animator
                            with a love for creating cinematic experiences. From anime edits to
                            motion graphics and character animation, I bring stories to life through visual artistry.
                        </p>
                        <p>
                            My journey began with a fascination for movies and anime, which evolved
                            into a career in creative design. I believe every project tells a unique
                            story, and I'm here to make yours unforgettable.
                        </p>
                    </div>

                    {/* Skills */}
                    {!compact && (
                        <div className="about__skills">
                            <h4 className="about__skills-title">My Skills</h4>
                            <div className="about__skills-grid">
                                {skills.map((skill, index) => (
                                    <motion.div
                                        key={skill.name}
                                        className="about__skill"
                                        initial={{ opacity: 0, width: 0 }}
                                        whileInView={{ opacity: 1, width: '100%' }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                    >
                                        <div className="about__skill-header">
                                            <span className="about__skill-name">{skill.name}</span>
                                            <span className="about__skill-level">
                                                <AnimatedCounter
                                                    from={0}
                                                    to={skill.level}
                                                    delay={0.5 + index * 0.2}
                                                    duration={1}
                                                />
                                            </span>
                                        </div>
                                        <div className="about__skill-bar">
                                            <motion.div
                                                className="about__skill-fill"
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.level}%` }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    delay: 0.5 + index * 0.2,
                                                    duration: 1,
                                                    ease: "easeOut"
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default About;
