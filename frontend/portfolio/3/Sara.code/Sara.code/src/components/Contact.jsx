import { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
        alert('Message sent! 🚀');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <section id="contact" className="contact-section">
            <div className="container">
                <div className="contact-header">
                    <h2 className="contact-title">
                        <span className="title-white">DON'T BE</span>
                        <span className="title-gradient">SHY</span>
                    </h2>
                    <p className="contact-subtitle">
                        Got a project? A vibe check? Or just want to send memes?
                        <br />
                        <span className="subtitle-highlight">My inbox is open.</span>
                    </p>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="What do I call you? 👋"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Where do I reply? 📬"
                                required
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Spill the tea... 🐸"
                            required
                            className="form-textarea"
                            rows="5"
                        ></textarea>
                    </div>

                    <button type="submit" className="form-submit">
                        SEND IT 🚀
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Contact;
