import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { MdLanguage } from 'react-icons/md';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-dark hover:text-primary transition-colors focus:outline-none"
        aria-expanded={isOpen}
        aria-controls="language-menu"
        aria-label="Change language"
      >
        <MdLanguage size={20} />
        <span className="hidden sm:inline">{i18n.language.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div id="language-menu" className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md overflow-hidden z-50 border border-gray-100">
          <ul className="py-1">
            <li>
              <button
                onClick={() => changeLanguage('en')}
                className={`block w-full text-left px-4 py-2 text-sm ${i18n.language === 'en' ? 'bg-light-green text-primary font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                English
              </button>
            </li>
            <li>
              <button
                onClick={() => changeLanguage('ta')}
                className={`block w-full text-left px-4 py-2 text-sm ${i18n.language === 'ta' ? 'bg-light-green text-primary font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                தமிழ்
              </button>
            </li>
            <li>
              <button
                onClick={() => changeLanguage('hi')}
                className={`block w-full text-left px-4 py-2 text-sm ${i18n.language === 'hi' ? 'bg-light-green text-primary font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                हिन्दी
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
