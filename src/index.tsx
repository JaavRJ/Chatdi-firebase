import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/styles.scss';
import App from './App';
import FChatContextProvider from './context/FChatContextProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <FChatContextProvider>
      <App />
    </FChatContextProvider>
  </React.StrictMode>
);

