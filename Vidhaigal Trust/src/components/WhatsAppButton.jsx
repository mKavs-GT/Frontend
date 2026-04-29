import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/917411563006"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[90] bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
    >
      <FaWhatsapp size={32} />
      <span className="absolute right-full mr-4 bg-white text-text-dark text-sm px-3 py-1 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Chat with us!
      </span>
    </a>
  );
};

export default WhatsAppButton;
