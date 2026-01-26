import { motion } from 'framer-motion';
import Contact from '../components/Contact';
import './ContactPage.css';

const ContactPage = () => {
    return (
        <main className="contact-page">
            {/* Page Header */}
            <section className="contact-page__header">
                <div className="container">
                    <motion.div
                        className="contact-page__intro"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="contact-page__label">Contact</span>
                        <h1 className="contact-page__title">
                            Let's <span className="text-gradient">Connect</span>
                        </h1>
                        <p className="contact-page__description">
                            Have a project in mind or just want to say hello? I'd love to hear from you.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <Contact />
        </main>
    );
};

export default ContactPage;
