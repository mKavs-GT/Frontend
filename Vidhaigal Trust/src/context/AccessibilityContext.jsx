import { createContext, useContext, useEffect, useState } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  // Font Size: 'small', 'medium', 'large'
  const [fontSize, setFontSize] = useState(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    return savedFontSize || 'medium';
  });

  // Apply font size to HTML root for REM scaling
  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'small') {
      root.style.fontSize = '14px';
    } else if (fontSize === 'large') {
      root.style.fontSize = '20px';
    } else {
      root.style.fontSize = '16px'; // default
    }
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  return (
    <AccessibilityContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
