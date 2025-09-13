import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import RootLayout from './layout.tsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RootLayout>
        <App />
      </RootLayout>
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}
