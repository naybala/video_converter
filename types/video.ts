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

// ── V3: Enhancement Options ───────────────────────────────────────────────────

export type UpscalePreset = 'none' | '1.5x' | '2x' | '4x'

export interface EnhancementOptions {
  /** Upscale multiplier relative to source. Disabled when a resolution preset is set. */
  upscale: UpscalePreset
  /** Denoise strength 0–100 (0 = off). Maps to hqdn3d filter. */
  denoiseStrength: number
  /** Sharpen strength 0–100 (0 = off). Maps to unsharp filter. */
  sharpenStrength: number
  /** Brightness adjustment -100 to 100 (0 = no change). Maps to eq brightness -1.0–1.0. */
  brightness: number
  /** Contrast adjustment -100 to 100 (0 = no change). Maps to eq contrast 0.0–2.0. */
  contrast: number
  /** Saturation adjustment -100 to 100 (0 = no change). Maps to eq saturation 0.0–2.0. */
  saturation: number
  /** Gamma adjustment -50 to 50 (0 = no change). Maps to eq gamma 0.3–3.0 (log-ish). */
  gamma: number
}

export const DEFAULT_ENHANCEMENT_OPTIONS: EnhancementOptions = {
  upscale: 'none',
  denoiseStrength: 0,
  sharpenStrength: 0,
  brightness: 0,
  contrast: 0,
  saturation: 0,
  gamma: 0
}

// ── Combined options ──────────────────────────────────────────────────────────

export interface ConversionOptions {
  /** V2: Target resolution — 'original' keeps source dimensions */
  resolution: ResolutionPreset
  /** V2: CRF quality value (0–51). Lower = better quality, larger file. Default: 23 */
  crf: number
  /** V2: Target frame rate — 'original' keeps source FPS */
  fps: FpsPreset
  /** V2: Audio bitrate. Ignored when audio is stripped. Default: '128k' */
  audioBitrate: AudioBitrate
  /** V3: Video enhancement filters */
  enhance: EnhancementOptions
}

export const DEFAULT_CONVERSION_OPTIONS: ConversionOptions = {
  resolution: 'original',
  crf: 23,
  fps: 'original',
  audioBitrate: '128k',
  enhance: { ...DEFAULT_ENHANCEMENT_OPTIONS }
}
