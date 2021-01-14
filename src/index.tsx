import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import { ToastProvider } from 'react-toast-notifications';

ReactDOM.render(
  // <React.StrictMode>
  <ToastProvider>,
    <App />,
  </ToastProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);


