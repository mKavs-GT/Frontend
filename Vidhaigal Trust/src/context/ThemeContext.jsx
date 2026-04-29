import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Theme: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Color Mode: 'normal', 'deuteranopia', 'protanopia', 'tritanopia', 'high-contrast'
  const [colorMode, setColorMode] = useState(() => {
    const savedColorMode = localStorage.getItem('colorMode');
    return savedColorMode || 'normal';
  });

  // Effect to apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Effect to apply color mode
  useEffect(() => {
    document.documentElement.setAttribute('data-colorblind', colorMode);
    localStorage.setItem('colorMode', colorMode);
    
    // For debugging
    console.log(`Active Accessibility Mode: ${colorMode}`);
  }, [colorMode]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colorMode, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
