import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './index.css';
// import './tailwind.css'; // Update this line
// import './App.css';
import { AuthProvider } from './components/context/AuthContext';
import ToastProvider from './components/Toast/ToastProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider />
      <App />
    </AuthProvider>
  </React.StrictMode>
);
