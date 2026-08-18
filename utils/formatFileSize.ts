/**
 * Formats a file size in bytes into a human-readable string (Bytes, KB, MB, GB).
 * @param bytes File size in bytes
 * @param decimals Number of decimal places (default 1)
 */
export function formatFileSize(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 Bytes'
  if (isNaN(bytes) || bytes < 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const formattedValue = parseFloat((bytes / Math.pow(k, i)).toFixed(dm))

  return `${formattedValue} ${sizes[i]}`
}
