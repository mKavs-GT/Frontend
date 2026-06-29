
import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import JournalPage from './pages/JournalPage';
import TripPlannerPage from './pages/TripPlannerPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import HotspotDetail from './components/HotspotDetail';
import { Page, Hotspot } from './types';
import { destinations } from './constants/destinations';

export default function App() {
  const [page, setPage] = useState<Page>('loading');
  const [isFinishing, setIsFinishing] = useState(false);
  const [revealUI, setRevealUI] = useState(false);
  const [revealNav, setRevealNav] = useState(false);
  const [pageEffect, setPageEffect] = useState(true); // Control page fade effect
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  const navigateTo = (p: Page) => {
    if (p === page) return;
    setPageEffect(false); // Triggers "Refocus Dissolve" out
    setTimeout(() => {
      setPage(p);
      setPageEffect(true); // Triggers "Refocus Dissolve" in
      // If navigating back to home from elsewhere, ensure we don't restart the "reveal" animations
      if (p === 'home') {
        setIsFinishing(true);
        setRevealUI(true);
        setRevealNav(true);
      }
    }, 600); // More luxurious timing
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFinishing(true); // Act 1: Start Background Refocus (takes 2s)
      setTimeout(() => {
        setRevealUI(true); // Act 2: Reveal Content (starts ONLY after zoom is done)
        setTimeout(() => {
          setRevealNav(true); // Act 3: Reveal Navigation
          setTimeout(() => setPage('home'), 1000);
        }, 1200); // 1.2s delay for a clean visual separation
      }, 2100); // Wait 2.1s for the 2s zoom + blur transition to fully settle
    }, 4000); // Extended initial loading to 4 seconds for a more majestic feel
    return () => clearTimeout(timer);
  }, []);

  const handleSelectHotspot = (hotspotName: string) => {
    const hotspot = destinations.flatMap(c => c.categories.flatMap(cat => cat.hotspots)).find(h => h.name === hotspotName);
    if (hotspot) {
      setSelectedHotspot(hotspot);
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage setPage={setPage} onSelectHotspot={handleSelectHotspot} />;
      case 'explore':
        return <ExplorePage onSelectHotspot={handleSelectHotspot} />;
      case 'journal':
        return <JournalPage />;
      case 'tripplanner':
        return <TripPlannerPage />;
      case 'login':
        return <LoginPage setPage={setPage} />;
      case 'signup':
        return <SignUpPage setPage={setPage} />;
      default:
        return <HomePage setPage={setPage} onSelectHotspot={handleSelectHotspot} />;
    }
  };

  const isInitialLoading = page === 'loading';
  const showUI = (!isInitialLoading && page !== 'login' && page !== 'signup') || revealNav;
  const showHeaderFooter = (!isInitialLoading && page !== 'login' && page !== 'signup') || revealNav;

  // Reset scroll to top whenever the page changes (useful for SPA "navigation")
  useEffect(() => {
    if (page === 'loading') return;
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (e) {
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    }
  }, [page]);

  return (
    <div className="bg-waypoint-dark min-h-screen text-[#f3e8ff] font-sans overflow-x-hidden relative">
      {/* Fixed UI - Header */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        {(showHeaderFooter || revealNav) && <Header setPage={navigateTo} currentPage={page} />}
      </div>

      {/* Background Content - Blurred while loading */}
      <div className={`transition-all duration-[1500ms] ease-in-out ${isInitialLoading && !isFinishing ? 'blur-3xl pointer-events-none' : 'blur-0'}`}>
        <main className={`${(showHeaderFooter || revealNav) ? 'pt-20' : ''} transition-all duration-[800ms] cubic-bezier(0.4, 0, 0.2, 1) ${pageEffect ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-[0.98] blur-xl pointer-events-none'}`}>
          {isInitialLoading ? (
            <HomePage
              setPage={navigateTo}
              onSelectHotspot={handleSelectHotspot}
              isHeaderPresent={isFinishing}
              revealText={revealUI}
            />
          ) : renderPage()}
        </main>
      </div>

      {/* Fixed UI - Footer */}
      <div className={`transition-all duration-1000 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        {(showHeaderFooter || revealNav) && <Footer setPage={navigateTo} />}
      </div>

      {/* Loading Overlay */}
      {(page === 'loading') && (
        <div className={`fixed inset-0 z-[100] transition-opacity duration-1000 ease-in-out ${isFinishing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <LoadingScreen />
        </div>
      )}

      {selectedHotspot && <HotspotDetail hotspot={selectedHotspot} onClose={() => setSelectedHotspot(null)} />}
    </div>
  );
}