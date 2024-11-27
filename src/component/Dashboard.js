// src/components/Dashboard.js
import React from 'react';
import './Dashboard.css';
import city from './city.jpg';  // Assuming the image is placed in the assets folder

function Dashboard() {
  return (
    <div className="dashboard">
      {/* Top image section */}
      <div className="header-image">
        <img src={city} alt="Header" />
      </div>

      {/* Form options section */}
      <div className="form-options">
        <h2>What would you like to do?</h2>
        <div className="options">
          <button className="option-btn" onClick={() => window.location.href = '/entry'}>Create a New Entry</button>
          <button className="option-btn" onClick={() => window.location.href = '/entries'}>View Old Entries</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
