import React, { useState, useEffect } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import StatsWrapped from './components/StatsWrapped';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

import ScrollReveal from './components/ScrollReveal';

function App() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after bar completes (approx 3.5s)
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3800);

    // Unmount component after fade out transition
    const removeTimer = setTimeout(() => {
      setLoading(false);
    }, 4600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {loading && <LoadingScreen fadeOut={fadeOut} />}
      <div className="app">
        <Navbar />
        <main>
          <Hero />
          <ScrollReveal>
            <About />
          </ScrollReveal>
          <ScrollReveal>
            <Projects />
          </ScrollReveal>
          <ScrollReveal>
            <StatsWrapped />
          </ScrollReveal>
          <ScrollReveal>
            <Contact />
          </ScrollReveal>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
