import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { WatchLaterProvider } from './context/WatchLaterContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import AnimatedRoutes from './components/AnimatedRoutes';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import './styles/index.css';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <AuthProvider>
      <WatchLaterProvider>
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingScreen key="loading" onFinished={() => setLoading(false)} />
          ) : (
            <Router>
              <div className="app">
                <Navbar />
                <AuthModal />
                <AnimatedRoutes />
                <Footer />
              </div>
            </Router>
          )}
        </AnimatePresence>
      </WatchLaterProvider>
    </AuthProvider>
  );
}

export default App;
