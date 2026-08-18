<script setup lang="ts">
import type { ConversionError } from '~/types/video'

defineProps<{
  error: ConversionError
}>()

const emit = defineEmits<{
  (e: 'reset'): void
}>()
</script>

<template>
  <div
    class="w-full max-w-xl mx-auto bg-rose-950/40 border border-rose-900/60 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm"
    role="alert"
    aria-live="assertive"
  >
    <div class="flex items-start gap-4">
      <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0 mt-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <div class="min-w-0 flex-1">
        <h4 class="text-base font-semibold text-rose-200 mb-1">
          {{ error.title || 'Error' }}
        </h4>
        <p class="text-sm text-rose-300/80 leading-relaxed mb-6">
          {{ error.message }}
        </p>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs sm:text-sm shadow-md transition-colors"
            @click="emit('reset')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
