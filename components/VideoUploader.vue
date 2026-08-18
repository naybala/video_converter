<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'file-selected', file: File): void
}>()

const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    emit('file-selected', file)
    // Reset file input value so same file can be re-selected if needed
    target.value = ''
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0]
    emit('file-selected', file)
  }
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <!-- Main Dropzone Container -->
    <div
      class="relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      :class="[
        isDragging
          ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 scale-[1.01]'
          : 'border-slate-700 bg-slate-800/50 hover:border-indigo-400 hover:bg-slate-800/80 hover:shadow-md'
      ]"
      tabindex="0"
      role="button"
      aria-label="Upload WebM video file"
      @click="triggerFileInput"
      @keydown.enter.prevent="triggerFileInput"
      @keydown.space.prevent="triggerFileInput"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept=".webm,video/webm"
        class="hidden"
        id="webm-file-input"
        @change="handleFileChange"
      />

      <!-- Upload Icon -->
      <div class="mx-auto w-16 h-16 mb-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>

      <!-- Title & Instructions -->
      <h3 class="text-xl font-semibold text-slate-100 mb-2 group-hover:text-white transition-colors">
        Upload WebM Video
      </h3>
      <p class="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
        Drag & drop your video here, or click to browse files from your computer.
      </p>

      <!-- Browse Button -->
      <div class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/20 transition-all duration-150 group-hover:shadow-indigo-500/30">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <span>Browse Files</span>
      </div>

      <!-- Format Notice -->
      <p class="mt-6 text-xs font-mono text-slate-500 uppercase tracking-wider">
        WebM files only • Up to 500 MB
      </p>
    </div>
  </div>
</template>
