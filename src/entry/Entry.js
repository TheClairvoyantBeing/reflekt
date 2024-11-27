// src/entry/Entry.js
import React, { useState } from 'react';
import './Entry.css';

function Entry() {
  const [entry, setEntry] = useState('');

  // Handle text area change
  const handleEntryChange = (e) => {
    setEntry(e.target.value);
  };

  // Save entry in JSON format
  const handleSaveEntry = () => {
    if (!entry) {
      alert('Please write something in your diary!');
      return;
    }

    const newEntry = {
      id: new Date().toISOString(),  // Using ISO string as a unique identifier
      text: entry,
      timestamp: new Date().toLocaleString(),
    };

    // Retrieve existing entries from localStorage or create an empty array
    const savedEntries = JSON.parse(localStorage.getItem('entries')) || [];
    savedEntries.push(newEntry);

    // Save the updated entries list in localStorage
    localStorage.setItem('entries', JSON.stringify(savedEntries));

    setEntry(''); // Reset the entry field
    alert('Entry saved!');
  };

  return (
    <div className="entry">
      <h2>Create a New Entry</h2>
      <textarea
        value={entry}
        onChange={handleEntryChange}
        placeholder="Write your diary entry here..."
      ></textarea>
      <button onClick={handleSaveEntry} className="save-btn">Save Entry</button>
    </div>
  );
}

export default Entry;
