import { ref, shallowRef, computed, onUnmounted } from 'vue'
import type { ConversionStatus, VideoFileInfo, ConversionError } from '~/types/video'

// Configurable constants
export const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500 MB

export function useVideoConverter() {
  const status = ref<ConversionStatus>('IDLE')
  const progress = ref<number>(0)
  const isLoaded = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const isConverting = ref<boolean>(false)
  const error = ref<ConversionError | null>(null)

  const selectedFile = ref<File | null>(null)
  const fileInfo = ref<VideoFileInfo | null>(null)
  const outputUrl = ref<string | null>(null)
  const outputFileName = ref<string>('')

  // We use shallowRef for FFmpeg instance to avoid Vue reactivity wrapping WebAssembly objects
  const ffmpegRef = shallowRef<any>(null)

  const isIdle = computed(() => status.value === 'IDLE')
  const isReady = computed(() => status.value === 'READY' || status.value === 'FILE_SELECTED')
  const isCompleted = computed(() => status.value === 'COMPLETED')
  const hasError = computed(() => status.value === 'ERROR')

  /**
   * Helper to safely cleanup file preview and output blob URLs
   */
  const cleanupUrls = () => {
    if (import.meta.client) {
      if (fileInfo.value?.objectUrl) {
        URL.revokeObjectURL(fileInfo.value.objectUrl)
        fileInfo.value.objectUrl = ''
      }
      if (outputUrl.value) {
        URL.revokeObjectURL(outputUrl.value)
        outputUrl.value = null
      }
    }
  }

  /**
   * Validate uploaded video file
   */
  const validateFile = (file: File): { valid: boolean; errorMsg?: string } => {
    // 1. File extension validation
    const nameLower = file.name.toLowerCase()
    if (!nameLower.endsWith('.webm')) {
      return {
        valid: false,
        errorMsg: 'Only WebM files (.webm) are supported.'
      }
    }

    // 2. MIME type check if present
    if (file.type && !file.type.includes('webm') && !file.type.includes('video')) {
      return {
        valid: false,
        errorMsg: 'Only WebM files are supported.'
      }
    }

    // 3. File size validation
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        errorMsg: `The selected file is too large. Maximum file size is 500 MB.`
      }
    }

    return { valid: true }
  }

  /**
   * Handle WebM file selection
   */
  const selectFile = (file: File): boolean => {
    // Clear previous errors & output
    error.value = null
    if (outputUrl.value && import.meta.client) {
      URL.revokeObjectURL(outputUrl.value)
      outputUrl.value = null
    }

    const validation = validateFile(file)
    if (!validation.valid) {
      status.value = 'ERROR'
      error.value = {
        title: 'Invalid File',
        message: validation.errorMsg || 'Please select a valid WebM video file.'
      }
      return false
    }

    // Revoke old source object URL if existing
    if (fileInfo.value?.objectUrl && import.meta.client) {
      URL.revokeObjectURL(fileInfo.value.objectUrl)
    }

    selectedFile.value = file
    const objectUrl = import.meta.client ? URL.createObjectURL(file) : ''

    fileInfo.value = {
      name: file.name,
      size: file.size,
      type: file.type || 'video/webm',
      lastModified: file.lastModified,
      objectUrl
    }

    // Determine target MP4 filename
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
    outputFileName.value = `${baseName}.mp4`

    status.value = isLoaded.value ? 'READY' : 'FILE_SELECTED'
    return true
  }

  /**
   * Lazy initialization of FFmpeg.wasm
   */
  const loadFFmpeg = async (): Promise<boolean> => {
    if (!import.meta.client) return false
    if (isLoaded.value && ffmpegRef.value) return true
    if (isLoading.value) return false

    isLoading.value = true
    const previousStatus = status.value
    status.value = 'LOADING_FFMPEG'
    error.value = null

    try {
      // Dynamically import @ffmpeg/ffmpeg on client only
      const { FFmpeg } = await import('@ffmpeg/ffmpeg')

      const ffmpeg = new FFmpeg()

      // Collect FFmpeg log output for better error reporting
      const ffmpegLogs: string[] = []

      // Set up real progress handler
      ffmpeg.on('progress', ({ progress: p }) => {
        // p is between 0 and 1
        const pct = Math.min(100, Math.max(0, Math.round(p * 100)))
        progress.value = pct
      })

      // Capture ALL FFmpeg log lines so we can surface useful errors
      ffmpeg.on('log', ({ message }) => {
        ffmpegLogs.push(message)
        console.debug('[FFmpeg]', message)
      })

      // Store log collector on the instance so convert() can read it
      ;(ffmpeg as any)._logs = ffmpegLogs

      // Load FFmpeg core from local /public/ffmpeg/ directory.
      // Files are served from the same origin so no toBlobURL wrapper is needed,
      // which eliminates the ~25MB CDN download delay on each use.
      await ffmpeg.load({
        coreURL: '/ffmpeg/ffmpeg-core.js',
        wasmURL: '/ffmpeg/ffmpeg-core.wasm'
      })

      ffmpegRef.value = ffmpeg
      isLoaded.value = true
      isLoading.value = false
      status.value = selectedFile.value ? 'READY' : previousStatus === 'FILE_SELECTED' ? 'READY' : 'IDLE'
      return true
    } catch (err: any) {
      console.error('[FFmpeg Load Error]', err)
      isLoading.value = false
      status.value = 'ERROR'
      error.value = {
        title: 'FFmpeg Load Failed',
        message: 'Unable to initialize the video converter. Please check your internet connection or try refreshing the page.',
        rawError: err
      }
      return false
    }
  }

  /**
   * Run ffmpeg.exec and return {exitCode, logs}
   */
  const runExec = async (ffmpeg: any, args: string[]): Promise<number> => {
    const code: number = await ffmpeg.exec(args)
    return code
  }

  /**
   * Convert WebM to MP4 with audio fallback chain:
   *   1. VP9/VP8 + Opus→AAC  (most common screencast format)
   *   2. Video-only (strips audio if AAC encode fails)
   */
  const convert = async (): Promise<boolean> => {
    if (!selectedFile.value) {
      error.value = { title: 'No File Selected', message: 'Please select a WebM video to convert.' }
      return false
    }

    if (!isLoaded.value || !ffmpegRef.value) {
      const loaded = await loadFFmpeg()
      if (!loaded) return false
    }

    status.value = 'CONVERTING'
    isConverting.value = true
    progress.value = 0
    error.value = null

    const ffmpeg = ffmpegRef.value
    const logs: string[] = (ffmpeg as any)._logs ?? []
    const inputName = 'input.webm'
    const outputName = 'output.mp4'

    try {
      const { fetchFile } = await import('@ffmpeg/util')

      // Write the WebM file into the FFmpeg virtual filesystem
      const fileData = await fetchFile(selectedFile.value)
      await ffmpeg.writeFile(inputName, fileData)

      // ── Strategy 1: Full conversion with audio (H.264 + AAC) ─────────────
      // -pix_fmt yuv420p is required for browser HTML5 playback compatibility
      // scale=trunc(iw/2)*2:trunc(ih/2)*2 rounds odd pixel dimensions to even —
      //   H.264 (libx264) requires both width and height to be divisible by 2.
      console.log('[FFmpeg] Trying: H.264 + AAC...')
      let exitCode: number = await runExec(ffmpeg, [
        '-i', inputName,
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-pix_fmt', 'yuv420p',
        '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        outputName
      ])

      // ── Strategy 2: If audio encode failed, try video-only ────────────────
      // Screencast WebM files often use Opus audio; if the build can't transcode it,
      // strip audio and produce a silent MP4 which will still play fine.
      if (exitCode !== 0) {
        console.warn(`[FFmpeg] Audio strategy failed (exit ${exitCode}). Retrying video-only...`)
        // Clean up any partial output from failed attempt
        try { await ffmpeg.deleteFile(outputName) } catch (_) {}

        exitCode = await runExec(ffmpeg, [
          '-i', inputName,
          '-c:v', 'libx264',
          '-preset', 'ultrafast',
          '-pix_fmt', 'yuv420p',
          '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
          '-an',
          '-movflags', '+faststart',
          outputName
        ])
      }

      if (exitCode !== 0) {
        const lastLines = logs.slice(-15).join('\n')
        console.error('[FFmpeg] All strategies failed. Last logs:\n', lastLines)
        throw new Error(`FFmpeg exited with code ${exitCode}`)
      }

      // ── Read output from virtual FS ───────────────────────────────────────
      const rawData = await ffmpeg.readFile(outputName)
      let uint8Data: Uint8Array
      if (typeof rawData === 'string') {
        uint8Data = new TextEncoder().encode(rawData)
      } else {
        uint8Data = rawData as Uint8Array
      }

      if (uint8Data.byteLength === 0) {
        throw new Error('Output file is empty — conversion may have failed silently.')
      }

      const mp4Blob = new Blob([uint8Data], { type: 'video/mp4' })
      console.log(`[FFmpeg] Success! Output size: ${(mp4Blob.size / 1024 / 1024).toFixed(2)} MB`)

      if (outputUrl.value && import.meta.client) URL.revokeObjectURL(outputUrl.value)
      outputUrl.value = URL.createObjectURL(mp4Blob)
      progress.value = 100

      // Cleanup virtual FS to free WebAssembly heap memory
      try {
        await ffmpeg.deleteFile(inputName)
        await ffmpeg.deleteFile(outputName)
      } catch (fsErr) {
        console.warn('[FFmpeg FS Cleanup]', fsErr)
      }

      isConverting.value = false
      status.value = 'COMPLETED'
      return true

    } catch (err: unknown) {
      console.error('[FFmpeg Conversion Error]', err)
      isConverting.value = false
      status.value = 'ERROR'

      const errStr = String(err instanceof Error ? err.message : err)
      let userMsg = 'Conversion failed. Please check the browser console (F12) for details.'

      if (errStr.includes('memory') || errStr.includes('OOM')) {
        userMsg = 'Conversion failed — not enough browser memory. Try a smaller video or close other tabs.'
      } else if (errStr.includes('empty')) {
        userMsg = 'Conversion produced no output. The WebM codec may not be supported by FFmpeg.wasm.'
      } else if (errStr.includes('exit')) {
        userMsg = 'FFmpeg could not process this file. Check the browser console (F12 → Console) for the exact error from FFmpeg.'
      }

      error.value = { title: 'Conversion Failed', message: userMsg, rawError: err }

      // Cleanup virtual FS on error
      try {
        await ffmpeg.deleteFile(inputName).catch(() => {})
        await ffmpeg.deleteFile(outputName).catch(() => {})
      } catch (_) {}

      return false
    }
  }

  /**
   * Reset converter state back to IDLE
   */
  const reset = () => {
    cleanupUrls()
    selectedFile.value = null
    fileInfo.value = null
    outputUrl.value = null
    outputFileName.value = ''
    progress.value = 0
    error.value = null
    isConverting.value = false
    status.value = isLoaded.value ? 'IDLE' : 'IDLE'
  }

  // Cleanup object URLs on unmount
  onUnmounted(() => {
    cleanupUrls()
  })

  return {
    status,
    progress,
    isLoaded,
    isLoading,
    isConverting,
    error,
    selectedFile,
    fileInfo,
    outputUrl,
    outputFileName,

    isIdle,
    isReady,
    isCompleted,
    hasError,

    selectFile,
    loadFFmpeg,
    convert,
    reset,
    cleanupUrls
  }
}
