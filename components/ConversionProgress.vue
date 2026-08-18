<script setup lang="ts">
import { computed } from 'vue'
import type { ConversionStatus } from '~/types/video'

const props = defineProps<{
  status: ConversionStatus
  progress: number
}>()

const statusText = computed(() => {
  switch (props.status) {
    case 'LOADING_FFMPEG':
      return 'Loading FFmpeg.wasm (31 MB) from local server...'
    case 'CONVERTING':
      if (props.progress === 0) return 'Preparing WebM video streams...'
      if (props.progress >= 98) return 'Finalizing MP4 video container...'
      return 'Encoding video to MP4 (H.264 / AAC)...'
    default:
      return 'Processing video...'
  }
})
</script>

<template>
  <div class="w-full max-w-xl mx-auto bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
    <div class="flex items-center gap-4 mb-6">
      <div class="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
        <svg class="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div class="min-w-0 flex-1">
        <h4 class="text-base font-semibold text-slate-100 mb-0.5">
          {{ status === 'LOADING_FFMPEG' ? 'Initializing Converter' : 'Converting Video' }}
        </h4>
        <p class="text-xs text-slate-400 truncate font-mono">
          {{ statusText }}
        </p>
      </div>

      <div class="text-right">
        <span class="text-2xl font-bold font-mono text-indigo-400">
          {{ progress }}%
        </span>
      </div>
    </div>

    <!-- Accessible Progress Bar -->
    <div
      class="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/60"
      role="progressbar"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="statusText"
    >
      <div
        class="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-sky-400 rounded-full transition-all duration-300 shadow-sm shadow-indigo-500/50"
        :style="{ width: `${Math.max(2, progress)}%` }"
      ></div>
    </div>

    <div class="mt-4 flex items-center justify-between text-xs text-slate-500 font-mono">
      <span>100% Client-side Processing</span>
      <span>FFmpeg.wasm</span>
    </div>
  </div>
</template>
