import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('nav.contact')} | Vidhaigal Trust</title>
      </Helmet>

      <main role="main" className="pt-24 pb-20 bg-beige min-h-screen">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-primary mb-4">{t('nav.contact')}</h1>
            <p className="text-xl text-gray-600">We'd love to hear from you. Get in touch with us!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Details Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-light-green text-primary rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-dark mb-1">Our Office</h3>
                  <p className="text-gray-600">123 Seed Street, Green Avenue,<br/>Chennai, Tamil Nadu, 600001</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-light-green text-primary rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-dark mb-1">Call Us</h3>
                  <p className="text-gray-600">+91 98765 43210</p>
                  <p className="text-gray-600">+91 44 2345 6789</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-light-green text-primary rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                  <FaEnvelope />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-dark mb-1">Email Us</h3>
                  <p className="text-gray-600">contact@vidhaigaltrust.org</p>
                  <p className="text-gray-600">volunteer@vidhaigaltrust.org</p>
                </div>
              </div>

              <div className="bg-primary text-white p-8 rounded-2xl shadow-lg border border-primary text-center">
                <h3 className="font-bold text-xl mb-4">Follow Us</h3>
                <div className="flex justify-center gap-4">
                  <a href="#" aria-label="Facebook" className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl hover:bg-secondary hover:text-text-dark transition-colors"><FaFacebook /></a>
                  <a href="#" aria-label="Twitter" className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl hover:bg-secondary hover:text-text-dark transition-colors"><FaTwitter /></a>
                  <a href="#" aria-label="Instagram" className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl hover:bg-secondary hover:text-text-dark transition-colors"><FaInstagram /></a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-3xl font-extrabold text-text-dark mb-8">Send Us a Message</h3>
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                    <input id="contact-name" type="text" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none bg-gray-50" placeholder="John Doe" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input id="contact-email" type="email" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none bg-gray-50" placeholder="john@example.com" />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input id="contact-subject" type="text" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none bg-gray-50" placeholder="How can we help you?" />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea id="contact-message" rows="6" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none bg-gray-50 resize-none" placeholder="Write your message here..."></textarea>
                </div>

                <button className="px-10 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-green-800 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-12 w-full h-[400px] bg-gray-300 rounded-2xl overflow-hidden relative shadow-lg">
             <img src="https://placehold.co/1200x400/D8F3DC/2D6A4F?text=Google+Maps+Embed+Placeholder" alt="Map" className="w-full h-full object-cover" />
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
