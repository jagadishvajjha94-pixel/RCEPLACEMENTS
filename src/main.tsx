import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App';
import { ErrorBoundary } from './ErrorBoundary';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: Arial; text-align: center;">
      <h1 style="color: #ef4444;">Error Loading Application</h1>
      <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
      <p>Please check the browser console (F12) for more details.</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
        Reload Page
      </button>
    </div>
  `;
}
