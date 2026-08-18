<script setup lang="ts">
import type { VideoFileInfo } from '~/types/video'
import { formatFileSize } from '~/utils/formatFileSize'

defineProps<{
  fileInfo: VideoFileInfo
  isLoadingFfmpeg?: boolean
}>()

const emit = defineEmits<{
  (e: 'start-conversion'): void
  (e: 'change-file'): void
}>()
</script>

<template>
  <div class="w-full max-w-2xl mx-auto bg-slate-800/70 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
    <!-- Header / Metadata bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-700/60">
      <div class="flex items-start gap-3.5 min-w-0">
        <div class="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="min-w-0">
          <h3 class="text-base font-semibold text-slate-100 truncate font-mono" :title="fileInfo.name">
            {{ fileInfo.name }}
          </h3>
          <div class="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
            <span>{{ formatFileSize(fileInfo.size) }}</span>
            <span class="text-slate-600">•</span>
            <span class="px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-300 text-[11px] uppercase tracking-wide">
              {{ fileInfo.type }}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium self-start sm:self-center px-3 py-1.5 rounded-lg hover:bg-slate-700/50"
        @click="emit('change-file')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Change file</span>
      </button>
    </div>

    <!-- Video Preview Frame -->
    <div class="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner mb-6 flex items-center justify-center min-h-[220px]">
      <video
        :key="fileInfo.objectUrl"
        controls
        preload="metadata"
        playsinline
        class="w-full max-h-[380px] object-contain rounded-xl"
        style="max-width: 100%;"
      >
        <source :src="fileInfo.objectUrl" :type="fileInfo.type || 'video/webm'" />
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Primary Action Button -->
    <div class="flex flex-col sm:flex-row items-center justify-end gap-3">
      <button
        type="button"
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isLoadingFfmpeg"
        @click="emit('start-conversion')"
      >
        <svg v-if="!isLoadingFfmpeg" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <svg v-else class="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>

        <span>{{ isLoadingFfmpeg ? 'Initializing FFmpeg...' : 'Convert to MP4' }}</span>
      </button>
    </div>
  </div>
</template>
