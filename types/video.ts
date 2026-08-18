export type ConversionStatus =
  | 'IDLE'
  | 'FILE_SELECTED'
  | 'LOADING_FFMPEG'
  | 'READY'
  | 'CONVERTING'
  | 'COMPLETED'
  | 'ERROR'

export interface VideoFileInfo {
  name: string
  size: number
  type: string
  lastModified: number
  objectUrl: string
}

export interface ConversionProgress {
  ratio: number // 0 to 1
  percentage: number // 0 to 100
  time?: number // seconds
}

export interface ConversionError {
  title: string
  message: string
  code?: string
  rawError?: unknown
}

// ── V2: Quality Controls ──────────────────────────────────────────────────────

export type ResolutionPreset =
  | 'original'
  | '3840x2160'  // 4K UHD
  | '1920x1080'  // 1080p Full HD
  | '1280x720'   // 720p HD
  | '854x480'    // 480p SD
  | '640x360'    // 360p

export type FpsPreset = 'original' | '60' | '30' | '24' | '15'

export type AudioBitrate = '64k' | '128k' | '192k' | '256k' | '320k'

export interface ConversionOptions {
  /** Target resolution — 'original' keeps source dimensions */
  resolution: ResolutionPreset
  /** CRF quality value (0–51). Lower = better quality, larger file. Default: 23 */
  crf: number
  /** Target frame rate — 'original' keeps source FPS */
  fps: FpsPreset
  /** Audio bitrate. Ignored when audio is stripped. Default: '128k' */
  audioBitrate: AudioBitrate
}

export const DEFAULT_CONVERSION_OPTIONS: ConversionOptions = {
  resolution: 'original',
  crf: 23,
  fps: 'original',
  audioBitrate: '128k'
}
