import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // This imports your main application component
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);