<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ConversionOptions, ResolutionPreset, FpsPreset, AudioBitrate, UpscalePreset } from '~/types/video'
import { DEFAULT_CONVERSION_OPTIONS } from '~/types/video'

const props = defineProps<{ modelValue: ConversionOptions }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: ConversionOptions): void }>()

const activeTab = ref<'quality' | 'enhance'>('quality')
const isExpanded = ref(false)

// ── Options data ──────────────────────────────────────────────────────────────
const resolutionOptions: { value: ResolutionPreset; label: string }[] = [
  { value: 'original', label: 'Original' },
  { value: '3840x2160', label: '4K UHD (3840×2160)' },
  { value: '1920x1080', label: '1080p Full HD' },
  { value: '1280x720',  label: '720p HD' },
  { value: '854x480',   label: '480p SD' },
  { value: '640x360',   label: '360p' },
]
const fpsOptions: { value: FpsPreset; label: string }[] = [
  { value: 'original', label: 'Original' },
  { value: '60', label: '60 fps' },
  { value: '30', label: '30 fps' },
  { value: '24', label: '24 fps (cinematic)' },
  { value: '15', label: '15 fps' },
]
const audioBitrateOptions: { value: AudioBitrate; label: string }[] = [
  { value: '64k', label: '64k' },
  { value: '128k', label: '128k' },
  { value: '192k', label: '192k' },
  { value: '256k', label: '256k' },
  { value: '320k', label: '320k' },
]
const upscaleOptions: { value: UpscalePreset; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: '1.5x', label: '1.5×' },
  { value: '2x', label: '2×' },
  { value: '4x', label: '4×' },
]

// ── Computed helpers ──────────────────────────────────────────────────────────
const crfLabel = computed(() => {
  const v = props.modelValue.crf
  if (v <= 15) return 'Exceptional'
  if (v <= 20) return 'High'
  if (v <= 27) return 'Balanced'
  if (v <= 35) return 'Low'
  return 'Minimal'
})
const crfColor = computed(() => {
  const v = props.modelValue.crf
  if (v <= 15) return 'text-emerald-400'
  if (v <= 20) return 'text-sky-400'
  if (v <= 27) return 'text-indigo-400'
  if (v <= 35) return 'text-amber-400'
  return 'text-rose-400'
})

const isDefault = computed(() => {
  const d = DEFAULT_CONVERSION_OPTIONS
  const m = props.modelValue
  const e = m.enhance
  const de = d.enhance
  return m.resolution === d.resolution && m.crf === d.crf && m.fps === d.fps &&
    m.audioBitrate === d.audioBitrate && e.upscale === de.upscale &&
    e.denoiseStrength === de.denoiseStrength && e.sharpenStrength === de.sharpenStrength &&
    e.brightness === de.brightness && e.contrast === de.contrast &&
    e.saturation === de.saturation && e.gamma === de.gamma
})

const hasEnhancement = computed(() => {
  const e = props.modelValue.enhance
  return e.upscale !== 'none' || e.denoiseStrength > 0 || e.sharpenStrength > 0 ||
    e.brightness !== 0 || e.contrast !== 0 || e.saturation !== 0 || e.gamma !== 0
})

const upscaleDisabled = computed(() => props.modelValue.resolution !== 'original')

// ── Update helpers ────────────────────────────────────────────────────────────
const update = <K extends keyof ConversionOptions>(key: K, value: ConversionOptions[K]) =>
  emit('update:modelValue', { ...props.modelValue, [key]: value })

const updateEnhance = <K extends keyof ConversionOptions['enhance']>(
  key: K, value: ConversionOptions['enhance'][K]
) => emit('update:modelValue', { ...props.modelValue, enhance: { ...props.modelValue.enhance, [key]: value } })

const resetAll = () => emit('update:modelValue', {
  ...DEFAULT_CONVERSION_OPTIONS,
  enhance: { ...DEFAULT_CONVERSION_OPTIONS.enhance }
})
</script>

<template>
  <div class="w-full rounded-xl border border-slate-700/60 bg-slate-800/40 overflow-hidden">

    <!-- Header Toggle -->
    <button
      type="button"
      class="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-700/30 transition-colors"
      :aria-expanded="isExpanded"
      @click="isExpanded = !isExpanded"
    >
      <div class="flex items-center gap-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Settings</span>
        <span v-if="!isDefault && !isExpanded" class="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Custom</span>
        <span v-if="hasEnhancement && !isExpanded" class="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30">Enhanced</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0" :class="{ 'rotate-180': isExpanded }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Expandable body -->
    <div v-show="isExpanded" class="border-t border-slate-700/60">

      <!-- Tab bar -->
      <div class="flex border-b border-slate-700/60">
        <button
          v-for="tab in [{ id: 'quality', label: 'Quality' }, { id: 'enhance', label: 'Enhance' }]"
          :key="tab.id"
          type="button"
          class="flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors"
          :class="activeTab === tab.id
            ? 'text-indigo-400 border-b-2 border-indigo-500 -mb-px bg-slate-800/60'
            : 'text-slate-500 hover:text-slate-300'"
          @click="activeTab = (tab.id as 'quality' | 'enhance')"
        >
          {{ tab.label }}
          <span v-if="tab.id === 'enhance' && hasEnhancement" class="ml-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 inline-block"></span>
        </button>
      </div>

      <!-- ── QUALITY TAB ───────────────────────────────────────────────────── -->
      <div v-show="activeTab === 'quality'" class="px-5 py-5 space-y-5">

        <!-- Resolution + FPS row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label for="opt-resolution" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Resolution</label>
            <div class="relative">
              <select id="opt-resolution" :value="modelValue.resolution" class="w-full appearance-none bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer" @change="update('resolution', ($event.target as HTMLSelectElement).value as ResolutionPreset)">
                <option v-for="o in resolutionOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
              <svg class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          <div class="space-y-1.5">
            <label for="opt-fps" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Frame Rate</label>
            <div class="relative">
              <select id="opt-fps" :value="modelValue.fps" class="w-full appearance-none bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer" @change="update('fps', ($event.target as HTMLSelectElement).value as FpsPreset)">
                <option v-for="o in fpsOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
              <svg class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <!-- CRF Slider -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label for="opt-crf" class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quality (CRF)</label>
            <div class="flex items-center gap-2">
              <span :class="['text-xs font-bold font-mono', crfColor]">{{ crfLabel }}</span>
              <span class="text-xs text-slate-500 font-mono">{{ modelValue.crf }}</span>
            </div>
          </div>
          <input id="opt-crf" type="range" min="0" max="51" step="1" :value="modelValue.crf" class="w-full h-2 rounded-full appearance-none cursor-pointer crf-slider" @input="update('crf', Number(($event.target as HTMLInputElement).value))" />
          <div class="flex justify-between text-[10px] text-slate-600 font-mono">
            <span>← Better quality</span><span>Smaller file →</span>
          </div>
        </div>

        <!-- Audio Bitrate -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Audio Bitrate</label>
          <div class="flex gap-2 flex-wrap">
            <button v-for="o in audioBitrateOptions" :key="o.value" type="button" class="px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border" :class="modelValue.audioBitrate === o.value ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'" @click="update('audioBitrate', o.value)">
              {{ o.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── ENHANCE TAB ───────────────────────────────────────────────────── -->
      <div v-show="activeTab === 'enhance'" class="px-5 py-5 space-y-5">

        <!-- Upscale -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upscale</label>
            <span v-if="upscaleDisabled" class="text-[10px] text-amber-400 font-mono">Disabled when resolution is set</span>
          </div>
          <div class="flex gap-2 flex-wrap">
            <button v-for="o in upscaleOptions" :key="o.value" type="button" :disabled="upscaleDisabled && o.value !== 'none'" class="px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border disabled:opacity-40 disabled:cursor-not-allowed" :class="modelValue.enhance.upscale === o.value ? 'bg-violet-600 border-violet-500 text-white' : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'" @click="!upscaleDisabled && updateEnhance('upscale', o.value)">
              {{ o.label }}
            </button>
          </div>
          <p v-if="modelValue.enhance.upscale !== 'none'" class="text-[10px] text-slate-500 font-mono">Uses Lanczos algorithm for high-quality upscaling</p>
        </div>

        <!-- Denoise -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label for="opt-denoise" class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Denoise</label>
            <span class="text-xs font-mono" :class="modelValue.enhance.denoiseStrength > 0 ? 'text-violet-400' : 'text-slate-600'">
              {{ modelValue.enhance.denoiseStrength > 0 ? modelValue.enhance.denoiseStrength + '%' : 'Off' }}
            </span>
          </div>
          <input id="opt-denoise" type="range" min="0" max="100" step="5" :value="modelValue.enhance.denoiseStrength" class="w-full h-2 rounded-full appearance-none cursor-pointer enhance-slider" @input="updateEnhance('denoiseStrength', Number(($event.target as HTMLInputElement).value))" />
          <p class="text-[10px] text-slate-600 font-mono">Reduces video noise and grain (hqdn3d)</p>
        </div>

        <!-- Sharpen -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label for="opt-sharpen" class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sharpen</label>
            <span class="text-xs font-mono" :class="modelValue.enhance.sharpenStrength > 0 ? 'text-violet-400' : 'text-slate-600'">
              {{ modelValue.enhance.sharpenStrength > 0 ? modelValue.enhance.sharpenStrength + '%' : 'Off' }}
            </span>
          </div>
          <input id="opt-sharpen" type="range" min="0" max="100" step="5" :value="modelValue.enhance.sharpenStrength" class="w-full h-2 rounded-full appearance-none cursor-pointer enhance-slider" @input="updateEnhance('sharpenStrength', Number(($event.target as HTMLInputElement).value))" />
          <p class="text-[10px] text-slate-600 font-mono">Enhances edge detail (unsharp mask)</p>
        </div>

        <!-- Color Adjustments -->
        <div class="space-y-3 pt-1 border-t border-slate-700/40">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-2">Color Adjustments</p>

          <!-- Reusable color slider rows -->
          <div v-for="ctrl in [
            { key: 'brightness', label: 'Brightness', min: -100, max: 100 },
            { key: 'contrast',   label: 'Contrast',   min: -100, max: 100 },
            { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
            { key: 'gamma',      label: 'Gamma',      min: -50,  max: 50  },
          ]" :key="ctrl.key" class="space-y-1">
            <div class="flex items-center justify-between">
              <label :for="'opt-' + ctrl.key" class="text-xs text-slate-400">{{ ctrl.label }}</label>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono" :class="(modelValue.enhance as any)[ctrl.key] !== 0 ? 'text-violet-400' : 'text-slate-600'">
                  {{ (modelValue.enhance as any)[ctrl.key] > 0 ? '+' : '' }}{{ (modelValue.enhance as any)[ctrl.key] }}
                </span>
                <button v-if="(modelValue.enhance as any)[ctrl.key] !== 0" type="button" class="text-[10px] text-slate-500 hover:text-slate-300 font-mono transition-colors" @click="updateEnhance(ctrl.key as any, 0)">reset</button>
              </div>
            </div>
            <input :id="'opt-' + ctrl.key" type="range" :min="ctrl.min" :max="ctrl.max" step="1" :value="(modelValue.enhance as any)[ctrl.key]" class="w-full h-2 rounded-full appearance-none cursor-pointer color-slider" @input="updateEnhance(ctrl.key as any, Number(($event.target as HTMLInputElement).value))" />
          </div>
        </div>

        <!-- Reset Enhancements -->
        <div class="pt-1 flex justify-end">
          <button v-if="hasEnhancement" type="button" class="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium" @click="emit('update:modelValue', { ...modelValue, enhance: { upscale: 'none', denoiseStrength: 0, sharpenStrength: 0, brightness: 0, contrast: 0, saturation: 0, gamma: 0 } })">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Reset enhancements
          </button>
        </div>
      </div>

      <!-- Reset all -->
      <div v-if="!isDefault" class="px-5 pb-4 flex justify-end border-t border-slate-700/40 pt-3">
        <button type="button" class="text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium" @click="resetAll">Reset all to defaults</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.crf-slider { background: linear-gradient(to right, #10b981 0%, #6366f1 40%, #f59e0b 70%, #ef4444 100%); }
.enhance-slider { background: linear-gradient(to right, #1e293b 0%, #7c3aed 100%); }
.color-slider { background: linear-gradient(to right, #1e293b 0%, #6366f1 50%, #1e293b 100%); }

.crf-slider::-webkit-slider-thumb,
.enhance-slider::-webkit-slider-thumb,
.color-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
  cursor: pointer;
}
.crf-slider::-moz-range-thumb,
.enhance-slider::-moz-range-thumb,
.color-slider::-moz-range-thumb {
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #6366f1;
  cursor: pointer;
}
</style>
