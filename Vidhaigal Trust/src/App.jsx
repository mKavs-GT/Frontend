import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import About from './pages/About';
import Initiatives from './pages/Initiatives';
import Gallery from './pages/Gallery';
import ProjectTracker from './pages/ProjectTracker';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
import Impact from './pages/Impact';
import FieldWorker from './pages/FieldWorker';
import Partner from './pages/Partner';

import { ThemeProvider } from './context/ThemeContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import AccessibilityPanel from './components/AccessibilityPanel';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading for the seed animation
    const timer = setTimeout(() => setLoading(false), 2000);

    // Global keyboard navigation listener
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    };
    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-nav');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  if (loading) return <Loader />;

  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <Router>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen relative">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/initiatives" element={<Initiatives />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/tracker" element={<ProjectTracker />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/impact" element={<Impact />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/field-reporter" element={<FieldWorker />} />
                <Route path="/partner" element={<Partner />} />
              </Routes>
            </div>
            <WhatsAppButton />
            <AccessibilityPanel />
            <Footer />
          </div>
        </Router>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}

export default App;
