import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import {PrivyProvider} from '@privy-io/react-auth';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      // clientId={import.meta.env.VITE_PRIVY_CLIENT_ID}
      config={{
        // Create embedded wallets for users who don't have a wallet
        loginMethodsAndOrder: {
          primary: ['privy:cmd8euall0037le0my79qpz42'],
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);
