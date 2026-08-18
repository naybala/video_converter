<script setup lang="ts">
import { useVideoConverter } from '~/composables/useVideoConverter'

const {
  status,
  progress,
  isLoading,
  error,
  fileInfo,
  outputUrl,
  outputFileName,
  selectFile,
  convert,
  reset
} = useVideoConverter()

const handleFileSelect = (file: File) => {
  selectFile(file)
}

const handleStartConversion = async () => {
  await convert()
}
</script>

<template>
  <div class="relative z-10 flex-1 flex flex-col justify-between max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <!-- Header Section -->
    <header class="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
      <!-- Privacy Badge -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Your videos never leave your device</span>
      </div>

      <!-- App Title -->
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
        WebM to MP4 <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">Converter</span>
      </h1>

      <!-- Subtitle -->
      <p class="text-slate-400 text-base sm:text-lg leading-relaxed">
        Convert your WebM videos to MP4 format directly in your browser using FFmpeg.wasm. Simple, fast, and 100% private.
      </p>
    </header>

    <!-- Main Workspace Area -->
    <main class="flex-1 flex items-center justify-center mb-12">
      <div class="w-full">
        <!-- IDLE STATE -->
        <VideoUploader
          v-if="status === 'IDLE'"
          @file-selected="handleFileSelect"
        />

        <!-- FILE SELECTED OR READY STATE -->
        <VideoPreview
          v-else-if="(status === 'FILE_SELECTED' || status === 'READY') && fileInfo"
          :file-info="fileInfo"
          :is-loading-ffmpeg="isLoading"
          @start-conversion="handleStartConversion"
          @change-file="reset"
        />

        <!-- LOADING FFMPEG OR CONVERTING STATE -->
        <ConversionProgress
          v-else-if="status === 'LOADING_FFMPEG' || status === 'CONVERTING'"
          :status="status"
          :progress="progress"
        />

        <!-- COMPLETED STATE -->
        <ConversionResult
          v-else-if="status === 'COMPLETED' && outputUrl"
          :output-url="outputUrl"
          :output-file-name="outputFileName"
          @reset="reset"
        />

        <!-- ERROR STATE -->
        <ErrorMessage
          v-else-if="status === 'ERROR' && error"
          :error="error"
          @reset="reset"
        />
      </div>
    </main>

    <!-- Footer Section -->
    <footer class="pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Local Client-Side Processing • No Server Uploads</span>
      </div>

      <div class="flex items-center gap-4 text-slate-400">
        <span>Powered by Nuxt 3 & FFmpeg.wasm</span>
      </div>
    </footer>
  </div>
</template>
