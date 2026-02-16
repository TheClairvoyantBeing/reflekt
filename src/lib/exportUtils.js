/**
 * Export utilities for diary entries.
 */

/**
 * Download entries as a JSON file.
 */
export function exportAsJSON(entries) {
  const data = entries.map((e) => ({
    title: e.title,
    content: e.content,
    mood: e.mood || 'Calm',
    tags: e.tags || [],
    created_at: e.created_at,
    updated_at: e.updated_at,
  }))

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  downloadBlob(blob, `reflekt-export-${getDateStamp()}.json`)
}

/**
 * Download entries as a Markdown file.
 */
export function exportAsMarkdown(entries) {
  let md = `# Reflekt — Journal Export\n\nExported on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n---\n\n`

  entries.forEach((entry) => {
    const date = new Date(entry.created_at).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
    const time = new Date(entry.created_at).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit',
    })

    md += `## ${entry.title || 'Untitled Entry'}\n\n`
    md += `**Date:** ${date} at ${time}  \n`
    md += `**Mood:** ${entry.mood || 'Calm'}  \n`
    if (entry.tags?.length) {
      md += `**Tags:** ${entry.tags.map((t) => `#${t}`).join(' ')}  \n`
    }
    md += `\n${entry.content}\n\n---\n\n`
  })

  const blob = new Blob([md], { type: 'text/markdown' })
  downloadBlob(blob, `reflekt-export-${getDateStamp()}.md`)
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function getDateStamp() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
