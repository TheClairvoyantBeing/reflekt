import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEntry } from '../lib/entries'
import { compressImage } from '../lib/imageUtils'
import toast from 'react-hot-toast'
import '../styles/entry.css'

const MOODS = [
  { key: 'Calm', emoji: '😌', label: 'Calm' },
  { key: 'Happy', emoji: '😊', label: 'Happy' },
  { key: 'Productive', emoji: '⚡', label: 'Productive' },
  { key: 'Motivated', emoji: '🔥', label: 'Motivated' },
  { key: 'Reflective', emoji: '🌙', label: 'Reflective' },
  { key: 'Sad', emoji: '😢', label: 'Sad' },
]

export default function NewEntryPage({ user }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('Calm')
  const [images, setImages] = useState([]) // Array of base64 strings
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Limit to 3 images
    if (images.length >= 3) {
      toast.error('Maximum 3 images per entry')
      return
    }

    setUploading(true)
    const toastId = toast.loading('Compressing image...')
    try {
      const base64 = await compressImage(file, 800, 0.7) // Resize to 800px width, 0.7 quality
      setImages([...images, base64])
      toast.success('Image added', { id: toastId })
    } catch (error) {
      toast.error('Failed to process image', { id: toastId })
      console.error(error)
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = null
    }
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!content.trim() && images.length === 0) {
      toast.error('Write something or add an image.')
      return
    }

    setSaving(true)
    try {
      const { error } = await createEntry(
        user.uid,
        title.trim() || 'Untitled Entry',
        content.trim(),
        mood,
        ['journal'],
        images
      )
      if (error) throw error
      toast.success('Entry saved!')
      navigate('/entries')
    } catch (error) {
      toast.error(error.message || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="editor-fullscreen fade-in">
      {/* Top Bar */}
      <header className="editor-topbar">
        <button onClick={() => navigate(-1)} className="editor-back">
          <span className="material-icons">arrow_back</span>
        </button>
        <div className="editor-topbar-right">
          <span className="editor-autosave">{saving ? 'Saving...' : 'Ready'}</span>
          <button onClick={handleSave} className="btn-primary btn-with-icon" disabled={saving || (images.length === 0 && !content.trim())}>
            <span className="material-icons" style={{ fontSize: 16 }}>check</span>
            Save & Close
          </button>
        </div>
      </header>

      {/* Main Editor */}
      <main className="editor-body">
        <div className="editor-content">
          {/* Date & Time */}
          <div className="editor-meta">
            <span className="material-icons" style={{ fontSize: 16 }}>calendar_today</span>
            <span>{dateStr}</span>
            <span className="meta-dot" />
            <span>{timeStr}</span>
          </div>

          {/* Mood Selector */}
          <div className="mood-selector">
            {MOODS.map((m) => (
              <button
                key={m.key}
                className={`mood-pill ${mood === m.key ? 'active' : ''}`}
                onClick={() => setMood(m.key)}
              >
                <span className="mood-emoji">{m.emoji}</span>
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>

          {/* Images Grid */}
          {images.length > 0 && (
            <div className="editor-images">
              {images.map((img, i) => (
                <div key={i} className="editor-image-preview">
                  <img src={img} alt={`Attachment ${i + 1}`} />
                  <button className="remove-image-btn" onClick={() => removeImage(i)}>
                    <span className="material-icons">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Title */}
          <input
            className="editor-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your day a headline..."
            maxLength={200}
          />

          {/* Textarea */}
          <textarea
            className="editor-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            autoFocus
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="editor-footer">
        <div className="editor-stats">
          <span>{wordCount} words</span>
          <span className="meta-dot" />
          <label className="editor-upload-btn" title="Attach image">
            <span className="material-icons">image</span>
            <span>Attach Image</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              disabled={uploading || images.length >= 3}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        <div className="editor-status">
          <span className="status-dot" />
        </div>
      </footer>
    </div>
  )
}
