/**
 * Client-side image compression using Canvas API.
 * Converts to WebP at reduced quality — no npm dependencies.
 */

/**
 * Compress an image file to a base64 WebP string.
 * @param {File} file - The image file from input
 * @param {number} maxWidth - Max width in pixels (default 800)
 * @param {number} quality - WebP quality 0-1 (default 0.7)
 * @returns {Promise<string>} base64 data URL
 */
export function compressImage(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        // Scale down if larger than maxWidth
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // Try WebP first, fall back to JPEG
        let dataUrl = canvas.toDataURL('image/webp', quality)
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality)
        }

        resolve(dataUrl)
      }
      img.onerror = reject
      img.src = event.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Get the size of a base64 string in bytes (approximate).
 */
export function getBase64Size(base64Str) {
  const padding = (base64Str.match(/=/g) || []).length
  return Math.floor((base64Str.length * 3) / 4) - padding
}

/**
 * Format bytes to human-readable string.
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
