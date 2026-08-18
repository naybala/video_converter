<script setup lang="ts">
defineProps<{
  outputUrl: string
  outputFileName: string
}>()

const emit = defineEmits<{
  (e: 'reset'): void
}>()
</script>

<template>
  <div class="w-full max-w-2xl mx-auto bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
    <!-- Success Banner -->
    <div class="flex items-center gap-3.5 pb-6 mb-6 border-b border-slate-700/60">
      <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div class="min-w-0 flex-1">
        <h3 class="text-lg font-bold text-slate-100">
          Conversion complete!
        </h3>
        <p class="text-xs text-slate-400 font-mono truncate mt-0.5" :title="outputFileName">
          {{ outputFileName }}
        </p>
      </div>
    </div>

    <!-- MP4 Video Player Preview -->
    <div class="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner mb-6 flex items-center justify-center min-h-[220px]">
      <video
        :key="outputUrl"
        controls
        preload="auto"
        playsinline
        class="w-full max-h-[380px] object-contain rounded-xl"
        style="max-width: 100%;"
      >
        <source :src="outputUrl" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Actions Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
      <button
        type="button"
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-sm transition-all"
        @click="emit('reset')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Convert Another Video</span>
      </button>

      <a
        :href="outputUrl"
        :download="outputFileName"
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 transition-all duration-150"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Download MP4</span>
      </a>
    </div>
  </div>
</template>
