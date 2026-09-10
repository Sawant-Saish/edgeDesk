import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { JourneyProvider } from './context/JourneyContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <JourneyProvider>
        <App />
      </JourneyProvider>
    </AuthProvider>
  </React.StrictMode>
);
