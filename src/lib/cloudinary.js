/**
 * Cloudinary image hosting via unsigned uploads.
 *
 * Unsigned means the browser uploads straight to Cloudinary with no server and
 * no API secret. The trade-off: the cloud name and preset are visible in the
 * bundle, so anyone could upload to that preset. Lock it down in the Cloudinary
 * console — see docs/CLOUDINARY.md.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER || 'mxl/posts'

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET)

const ENDPOINT = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

const MAX_BYTES = 10 * 1024 * 1024

/**
 * Uploads a File and resolves with the delivered URL.
 * `onProgress` receives 0-100 so the editor can show a real progress figure.
 */
export function uploadToCloudinary(file, onProgress) {
  if (!isCloudinaryConfigured) {
    return Promise.reject(
      new Error(
        'Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env — see docs/CLOUDINARY.md.',
      ),
    )
  }

  if (!file.type.startsWith('image/')) {
    return Promise.reject(new Error('That file is not an image.'))
  }

  if (file.size > MAX_BYTES) {
    return Promise.reject(
      new Error(
        `That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. Keep uploads under 10 MB.`,
      ),
    )
  }

  const body = new FormData()
  body.append('file', file)
  body.append('upload_preset', UPLOAD_PRESET)
  body.append('folder', FOLDER)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', ENDPOINT)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      let payload
      try {
        payload = JSON.parse(xhr.responseText)
      } catch {
        reject(new Error('Cloudinary returned an unreadable response.'))
        return
      }

      if (xhr.status >= 200 && xhr.status < 300 && payload.secure_url) {
        resolve(optimise(payload.secure_url))
      } else {
        reject(
          new Error(
            payload?.error?.message ??
              `Upload failed (${xhr.status}). Check the preset name and that it is set to Unsigned.`,
          ),
        )
      }
    }

    xhr.onerror = () => reject(new Error('Network error while uploading.'))
    xhr.send(body)
  })
}

/**
 * Injects Cloudinary delivery transforms into an upload URL.
 *
 * f_auto picks the best format per browser (AVIF/WebP), q_auto picks a quality
 * that still looks clean. Typically 60-80% smaller than the original.
 */
export function optimise(url, extra = '') {
  if (typeof url !== 'string' || !url.includes('/image/upload/')) return url
  if (/\/image\/upload\/[^/]*[fq]_auto/.test(url)) return url
  const transforms = ['f_auto', 'q_auto', extra].filter(Boolean).join(',')
  return url.replace('/image/upload/', `/image/upload/${transforms}/`)
}

/** Width-constrained variant, for thumbnails and cards. */
export function resized(url, width) {
  return optimise(url, `w_${width},c_limit`)
}
