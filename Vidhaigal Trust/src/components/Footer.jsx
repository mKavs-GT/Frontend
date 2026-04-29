import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand & About */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="https://placehold.co/40x40/FFF/2D6A4F?text=V" alt="Vidhaigal Logo" className="w-10 h-10 rounded-full" />
              <span className="text-2xl font-bold text-secondary">Vidhaigal Trust</span>
            </Link>
            <p className="text-sm text-gray-200 leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                <FaTwitter />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                <FaInstagram />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-white/20 pb-2 inline-block">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-300 hover:text-secondary transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/initiatives" className="text-gray-300 hover:text-secondary transition-colors">{t('nav.initiatives')}</Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-secondary transition-colors">{t('nav.gallery')}</Link></li>
              <li><Link to="/tracker" className="text-gray-300 hover:text-secondary transition-colors">{t('nav.tracker')}</Link></li>
              <li><Link to="/donate" className="text-gray-300 hover:text-secondary transition-colors">{t('nav.donate')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-white/20 pb-2 inline-block">{t('footer.contactUs')}</h3>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-secondary mt-1">📍</span>
                <span>123 Seed Street, Green Avenue,<br />Chennai, Tamil Nadu, India</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-secondary">📞</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-secondary">✉️</span>
                <span>contact@vidhaigaltrust.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
          <p>{t('footer.copyright')}</p>
          <Link to="/field-reporter" className="text-xs text-gray-400 hover:text-primary transition-colors">
            Field Reporter →
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
