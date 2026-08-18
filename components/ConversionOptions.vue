<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ConversionOptions, ResolutionPreset, FpsPreset, AudioBitrate } from '~/types/video'
import { DEFAULT_CONVERSION_OPTIONS } from '~/types/video'

const props = defineProps<{
  modelValue: ConversionOptions
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ConversionOptions): void
}>()

const isExpanded = ref(false)

// ── Local helpers ─────────────────────────────────────────────────────────────

const resolutionOptions: { value: ResolutionPreset; label: string; badge?: string }[] = [
  { value: 'original', label: 'Original', badge: 'keep source' },
  { value: '3840x2160', label: '4K UHD', badge: '3840×2160' },
  { value: '1920x1080', label: '1080p Full HD', badge: '1920×1080' },
  { value: '1280x720', label: '720p HD', badge: '1280×720' },
  { value: '854x480', label: '480p SD', badge: '854×480' },
  { value: '640x360', label: '360p', badge: '640×360' },
]

const fpsOptions: { value: FpsPreset; label: string }[] = [
  { value: 'original', label: 'Original' },
  { value: '60', label: '60 fps' },
  { value: '30', label: '30 fps' },
  { value: '24', label: '24 fps (cinematic)' },
  { value: '15', label: '15 fps' },
]

const audioBitrateOptions: { value: AudioBitrate; label: string }[] = [
  { value: '64k', label: '64 kbps' },
  { value: '128k', label: '128 kbps' },
  { value: '192k', label: '192 kbps' },
  { value: '256k', label: '256 kbps' },
  { value: '320k', label: '320 kbps' },
]

// CRF quality label
const crfLabel = computed(() => {
  const v = props.modelValue.crf
  if (v <= 15) return 'Exceptional'
  if (v <= 20) return 'High'
  if (v <= 27) return 'Balanced'
  if (v <= 35) return 'Low'
  return 'Minimal'
})

const crfLabelColor = computed(() => {
  const v = props.modelValue.crf
  if (v <= 15) return 'text-emerald-400'
  if (v <= 20) return 'text-sky-400'
  if (v <= 27) return 'text-indigo-400'
  if (v <= 35) return 'text-amber-400'
  return 'text-rose-400'
})

// Summary shown when panel is collapsed
const settingsSummary = computed(() => {
  const parts: string[] = []
  const res = resolutionOptions.find(r => r.value === props.modelValue.resolution)
  parts.push(res?.label ?? 'Original')
  parts.push(`CRF ${props.modelValue.crf}`)
  if (props.modelValue.fps !== 'original') parts.push(`${props.modelValue.fps} fps`)
  return parts.join(' · ')
})

const isDefault = computed(() =>
  props.modelValue.resolution === DEFAULT_CONVERSION_OPTIONS.resolution &&
  props.modelValue.crf === DEFAULT_CONVERSION_OPTIONS.crf &&
  props.modelValue.fps === DEFAULT_CONVERSION_OPTIONS.fps &&
  props.modelValue.audioBitrate === DEFAULT_CONVERSION_OPTIONS.audioBitrate
)

// ── Emit helpers ──────────────────────────────────────────────────────────────

const update = <K extends keyof ConversionOptions>(key: K, value: ConversionOptions[K]) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const resetToDefaults = () => {
  emit('update:modelValue', { ...DEFAULT_CONVERSION_OPTIONS })
}
</script>

<template>
  <div class="w-full rounded-xl border border-slate-700/60 bg-slate-800/40 overflow-hidden">
    <!-- Header / Toggle Row -->
    <button
      type="button"
      class="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-700/30 transition-colors"
      :aria-expanded="isExpanded"
      aria-controls="conversion-options-panel"
      @click="isExpanded = !isExpanded"
    >
      <div class="flex items-center gap-2.5">
        <!-- Gear icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Quality Settings</span>
        <!-- Changed badge -->
        <span v-if="!isDefault" class="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Custom
        </span>
      </div>

      <div class="flex items-center gap-3">
        <!-- Collapsed summary -->
        <span v-if="!isExpanded" class="text-xs text-slate-500 font-mono hidden sm:block">
          {{ settingsSummary }}
        </span>
        <!-- Chevron -->
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0" :class="{ 'rotate-180': isExpanded }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>

    <!-- Expandable Panel -->
    <div
      v-show="isExpanded"
      id="conversion-options-panel"
      class="border-t border-slate-700/60 px-5 py-5 space-y-5"
    >
      <!-- Row 1: Resolution + FPS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Resolution -->
        <div class="space-y-1.5">
          <label for="opt-resolution" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Resolution
          </label>
          <div class="relative">
            <select
              id="opt-resolution"
              :value="modelValue.resolution"
              class="w-full appearance-none bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
              @change="update('resolution', ($event.target as HTMLSelectElement).value as ResolutionPreset)"
            >
              <option v-for="opt in resolutionOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}{{ opt.badge && opt.value !== 'original' ? ` (${opt.badge})` : '' }}
              </option>
            </select>
            <svg class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- FPS -->
        <div class="space-y-1.5">
          <label for="opt-fps" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Frame Rate
          </label>
          <div class="relative">
            <select
              id="opt-fps"
              :value="modelValue.fps"
              class="w-full appearance-none bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
              @change="update('fps', ($event.target as HTMLSelectElement).value as FpsPreset)"
            >
              <option v-for="opt in fpsOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
            <svg class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Row 2: CRF Quality Slider -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label for="opt-crf" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Quality
          </label>
          <div class="flex items-center gap-2">
            <span :class="['text-xs font-bold font-mono', crfLabelColor]">{{ crfLabel }}</span>
            <span class="text-xs text-slate-500 font-mono">CRF {{ modelValue.crf }}</span>
          </div>
        </div>

        <!-- Slider track with gradient -->
        <div class="relative">
          <input
            id="opt-crf"
            type="range"
            min="0"
            max="51"
            step="1"
            :value="modelValue.crf"
            class="w-full h-2 rounded-full appearance-none cursor-pointer crf-slider"
            :aria-label="`Quality CRF value: ${modelValue.crf} (${crfLabel})`"
            @input="update('crf', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div class="flex justify-between text-[10px] text-slate-600 font-mono">
          <span>← Better quality / bigger file</span>
          <span>Smaller file / lower quality →</span>
        </div>
      </div>

      <!-- Row 3: Audio Bitrate -->
      <div class="space-y-1.5">
        <label for="opt-audio-bitrate" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Audio Bitrate
        </label>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="opt in audioBitrateOptions"
            :key="opt.value"
            type="button"
            class="px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border"
            :class="modelValue.audioBitrate === opt.value
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
              : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'"
            @click="update('audioBitrate', opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- Reset button -->
      <div class="pt-1 flex justify-end">
        <button
          v-if="!isDefault"
          type="button"
          class="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium"
          @click="resetToDefaults"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Reset to defaults</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom slider — cross-browser thumb styling */
.crf-slider {
  background: linear-gradient(to right,
    #10b981 0%,
    #6366f1 40%,
    #f59e0b 70%,
    #ef4444 100%
  );
}
.crf-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  cursor: pointer;
  transition: box-shadow 0.15s;
}
.crf-slider::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 5px rgba(99, 102, 241, 0.3);
}
.crf-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #6366f1;
  cursor: pointer;
}
</style>
