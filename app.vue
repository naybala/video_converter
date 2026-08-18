<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
    <!-- Subtle Background Glow / Mesh Effects -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full"></div>
    <div class="absolute top-1/3 left-1/4 w-96 h-96 bg-sky-500/5 blur-[100px] pointer-events-none rounded-full"></div>

    <NuxtPage />
  </div>
</template>
