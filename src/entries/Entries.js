// src/entries/Entries.js
import React, { useState, useEffect } from 'react';
import './Entries.css';

function Entries() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Retrieve the saved entries from localStorage
    const savedEntries = JSON.parse(localStorage.getItem('entries')) || [];
    setEntries(savedEntries); // Update state with the retrieved entries
  }, []);

  return (
    <div className="entries">
      <h2>Old Diary Entries</h2>
      <div className="entry-list">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <div key={entry.id} className="entry-item">
              <p><strong>{entry.timestamp}</strong></p>
              <p>{entry.text}</p>
            </div>
          ))
        ) : (
          <p>No entries found. Start writing!</p>
        )}
      </div>
    </div>
  );
}

export default Entries;
