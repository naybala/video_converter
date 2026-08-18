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
