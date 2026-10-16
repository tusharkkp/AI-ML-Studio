import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/app/App';
import '@/index.css';

// Restore redirected route on static hosts (e.g. GitHub Pages)
const redirect = sessionStorage.getItem('aiml_redirect');
if (redirect) {
  sessionStorage.removeItem('aiml_redirect');
  window.history.replaceState(null, '', redirect);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
