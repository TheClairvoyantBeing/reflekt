// In your index.js or main entry file
import React from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from './App'; // Ensure you import AppWrapper
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <AppWrapper /> {/* Render the AppWrapper here */}
  </React.StrictMode>,
  document.getElementById('root')
);