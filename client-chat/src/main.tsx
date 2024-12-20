import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App.tsx';
import './index.css';
import store from './redux/store.ts';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
export const Main: React.FC = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
};

root.render(<Main />);
