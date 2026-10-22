import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// This finds the <div id="root"> in index.html
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// This puts your App component inside that div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
