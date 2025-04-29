import { createRoot } from 'react-dom/client';
import PublicRoute from './routes/PublicRoute.jsx';
import { StrictMode } from 'react';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <PublicRoute />
  </StrictMode>
);
