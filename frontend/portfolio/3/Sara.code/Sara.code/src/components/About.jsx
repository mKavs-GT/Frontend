import './About.css';

const About = () => {
    const skills = ['React', 'TypeScript', 'Node.js', 'WebGL'];

    const handleMouseMove = (e) => {
        const tag = e.currentTarget;
        const rect = tag.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        tag.style.setProperty('--mouse-x', `${x}px`);
        tag.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <section id="about" className="about-section">
            <div className="container">
                <span className="section-label">// 01 - ABOUT ME</span>

                <div className="about-grid">
                    <div className="about-card">
                        <div className="about-image-wrapper">
                            <img
                                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=600&fit=crop"
                                alt="Sara"
                                className="about-image"
                            />
                            <div className="about-image-overlay">
                                <h3 className="overlay-name">Sara</h3>
                                <span className="overlay-handle">@sara.codes</span>
                            </div>
                        </div>
                        <div className="about-card-border"></div>
                    </div>

                    <div className="about-content">
                        <h2 className="about-title">
                            <span className="title-top">HEY,</span>
                            <span className="title-mid">I'M SARA</span>
                            <span className="title-gradient">DIGITAL</span>
                            <span className="title-gradient">NATIVE.</span>
                        </h2>

                        <p className="about-description">
                            Digital native born with a keyboard in my hand. I don't just write code; I curate digital experiences that hit different. Obsessed with clean UI, fluid micro-interactions, and that perfect premium vibe.
                        </p>

                        <blockquote className="about-quote">
                            <span className="quote-mark">"</span>
                            I build <span className="quote-highlight">main character energy</span> for the web.
                            <span className="quote-mark">"</span>
                        </blockquote>

                        <div className="about-skills">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="skill-tag"
                                    onMouseMove={handleMouseMove}
                                >
                                    <div className="skill-tag-glow"></div>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
