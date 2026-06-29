
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Expose React globally for Recharts UMD bundle
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
