import React, { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { exportAsJSON, exportAsMarkdown } from '../lib/exportUtils'
import { getEntries } from '../lib/entries'
import toast from 'react-hot-toast'
import '../styles/settings.css'

export default function SettingsPage({ user }) {
  const { theme, aesthetic, font, toggleTheme, setThemeMode, setAesthetic, setFont, fonts } = useTheme()
  const [config, setConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  })
  const [showConfig, setShowConfig] = useState(false)
  
  // Load existing config if available (from localStorage)
  useEffect(() => {
    const saved = localStorage.getItem('firebase-config-override')
    if (saved) {
      try {
        setConfig(JSON.parse(saved))
      } catch (e) { /* ignore */ }
    }
  }, [])

  const handleConfigChange = (e) => {
    const { name, value } = e.target
    setConfig(prev => ({ ...prev, [name]: value }))
  }

  const saveConfig = () => {
    localStorage.setItem('firebase-config-override', JSON.stringify(config))
    toast.success('Configuration saved. Please reload the app.')
  }

  const handleExport = async (type) => {
    const toastId = toast.loading('Preparing export...')
    try {
      const { data } = await getEntries(user.uid)
      if (type === 'json') exportAsJSON(data)
      else exportAsMarkdown(data)
      toast.success('Export started', { id: toastId })
    } catch (error) {
      toast.error('Export failed', { id: toastId })
    }
  }

  return (
    <div className="settings-page fade-in">
      <h1 className="settings-title">Settings</h1>

      {/* Appearance Section */}
      <section className="settings-section">
        <h2 className="settings-heading">Appearance</h2>
        
        <div className="settings-grid">
          {/* Theme */}
          <div className="setting-item">
            <label>Theme Mode</label>
            <div className="btn-group">
              <button 
                className={`btn-group-item ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setThemeMode('light')}
              >
                <span className="material-icons">light_mode</span> Light
              </button>
              <button 
                className={`btn-group-item ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setThemeMode('dark')}
              >
                <span className="material-icons">dark_mode</span> Dark
              </button>
            </div>
          </div>

          {/* Aesthetic */}
          <div className="setting-item">
            <label>Aesthetic</label>
            <div className="btn-group">
              <button 
                className={`btn-group-item ${aesthetic === 'minimalist' ? 'active' : ''}`}
                onClick={() => setAesthetic('minimalist')}
              >
                Minimalist
              </button>
              <button 
                className={`btn-group-item ${aesthetic === 'moody' ? 'active' : ''}`}
                onClick={() => setAesthetic('moody')}
              >
                Moody
              </button>
            </div>
          </div>

          {/* Typography */}
          <div className="setting-item full-width">
            <label>Typography</label>
            <div className="font-grid">
              {Object.entries(fonts).map(([key, { name, family }]) => (
                <button
                  key={key}
                  className={`font-card ${font === key ? 'active' : ''}`}
                  onClick={() => setFont(key)}
                  style={{ fontFamily: family }}
                >
                  <span className="font-name">{name}</span>
                  <span className="font-preview">The quick brown fox jumps over the lazy dog.</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="settings-section">
        <h2 className="settings-heading">Data Management</h2>
        <div className="export-options">
          <div className="export-card">
            <span className="material-icons export-icon">data_object</span>
            <div className="export-info">
              <h3>Export as JSON</h3>
              <p>Raw data format, good for backups or developer use.</p>
            </div>
            <button className="btn-secondary" onClick={() => handleExport('json')}>Download JSON</button>
          </div>

          <div className="export-card">
            <span className="material-icons export-icon">description</span>
            <div className="export-info">
              <h3>Export as Markdown</h3>
              <p>Readable format, good for printing or other notes apps.</p>
            </div>
            <button className="btn-secondary" onClick={() => handleExport('markdown')}>Download Markdown</button>
          </div>
        </div>
      </section>

      {/* Firebase Configuration */}
      <section className="settings-section">
        <div className="section-header-row">
          <h2 className="settings-heading">Firebase Configuration</h2>
          <button 
            className="btn-text" 
            onClick={() => setShowConfig(!showConfig)}
          >
            {showConfig ? 'Hide Config' : 'Show Config'}
          </button>
        </div>
        
        <div className="firebase-guide">
          <h3>How to connect your own Firebase</h3>
          <ol>
            <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer">Firebase Console</a> and create a project.</li>
            <li>Add a Web App (`&lt;/&gt;` icon) to get your config.</li>
            <li>Enable <strong>Authentication</strong> (Email/Password).</li>
            <li>Create <strong>Firestore Database</strong> (Production mode).</li>
            <li>Paste your config values below to connect this app to your database.</li>
          </ol>
        </div>

        {showConfig && (
          <div className="config-form fade-in-up">
            <div className="input-group">
              <label>API Key</label>
              <input 
                type="text" 
                name="apiKey" 
                value={config.apiKey} 
                onChange={handleConfigChange} 
                placeholder="AIza..."
              />
            </div>
            <div className="input-group">
              <label>Auth Domain</label>
              <input 
                type="text" 
                name="authDomain" 
                value={config.authDomain} 
                onChange={handleConfigChange} 
                placeholder="project-id.firebaseapp.com"
              />
            </div>
            <div className="input-group">
              <label>Project ID</label>
              <input 
                type="text" 
                name="projectId" 
                value={config.projectId} 
                onChange={handleConfigChange} 
                placeholder="project-id"
              />
            </div>
            <div className="input-group">
              <label>Storage Bucket</label>
              <input 
                type="text" 
                name="storageBucket" 
                value={config.storageBucket} 
                onChange={handleConfigChange} 
                placeholder="project-id.appspot.com"
              />
            </div>
            <div className="input-group">
              <label>Messaging Sender ID</label>
              <input 
                type="text" 
                name="messagingSenderId" 
                value={config.messagingSenderId} 
                onChange={handleConfigChange} 
                placeholder="123456789"
              />
            </div>
            <div className="input-group">
              <label>App ID</label>
              <input 
                type="text" 
                name="appId" 
                value={config.appId} 
                onChange={handleConfigChange} 
                placeholder="1:123456789:web:abc..."
              />
            </div>
            <button className="btn-primary" onClick={saveConfig}>Save Configuration</button>
            <p className="config-note">Reflekt will use these values instead of the default environment variables.</p>
          </div>
        )}
      </section>
    </div>
  )
}
