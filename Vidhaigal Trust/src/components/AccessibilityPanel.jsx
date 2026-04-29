import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { FaEye, FaTimes, FaCheck } from 'react-icons/fa';

const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { colorMode, setColorMode } = useTheme();
  const { fontSize, setFontSize } = useAccessibility();

  const colorModes = [
    { id: 'normal', label: 'Normal (Default)' },
    { id: 'deuteranopia', label: 'Deuteranopia (Green Blindness)' },
    { id: 'protanopia', label: 'Protanopia (Red Blindness)' },
    { id: 'tritanopia', label: 'Tritanopia (Blue Blindness)' },
    { id: 'high-contrast', label: 'High Contrast' }
  ];

  const fontSizes = [
    { id: 'small', label: 'A-', title: 'Small Text' },
    { id: 'medium', label: 'A', title: 'Default Text' },
    { id: 'large', label: 'A+', title: 'Large Text' }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[9999]">
      {isOpen && (
        <div className="bg-white border-2 border-primary shadow-2xl rounded-2xl p-6 w-80 mb-4 transition-all">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="font-bold text-lg text-text-dark">Accessibility Options</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-primary transition-colors"
              aria-label="Close accessibility panel"
            >
              <FaTimes />
            </button>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-sm text-gray-600 mb-3">Color Vision</h4>
            <div className="space-y-2">
              {colorModes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setColorMode(mode.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center transition-colors ${
                    colorMode === mode.id ? 'bg-primary text-white font-bold' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                  aria-pressed={colorMode === mode.id}
                >
                  {mode.label}
                  {colorMode === mode.id && <FaCheck />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-3">Text Size</h4>
            <div className="flex gap-2">
              {fontSizes.map(size => (
                <button
                  key={size.id}
                  onClick={() => setFontSize(size.id)}
                  title={size.title}
                  className={`flex-1 py-2 rounded-lg border font-bold transition-colors ${
                    fontSize === size.id ? 'bg-secondary text-text-dark border-secondary' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-pressed={fontSize === size.id}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl hover:bg-green-800 transition-transform hover:scale-105"
        aria-label="Accessibility Options"
        title="Accessibility Options"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <FaEye className="text-2xl" />
      </button>
    </div>
  );
};

export default AccessibilityPanel;
