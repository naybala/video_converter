# WebM to MP4 Converter

A fast, modern, privacy-first browser-based video converter built with Nuxt 3 and FFmpeg.wasm. Convert WebM video files to MP4 format **100% client-side** without uploading video files to any backend server.

🔗 **Live Demo**: [https://vd-converter.netlify.app/](https://vd-converter.netlify.app/)

---

## Features

- **100% Privacy-First**: Videos never leave your device. All processing happens locally in your web browser.
- **Drag & Drop Upload**: Drag & drop your WebM files or use the file picker.
- **File Validation & Metadata**: Instant validation of file format, MIME type, and size limit (up to 500 MB).
- **Original Video Preview**: Preview your source WebM video before converting.
- **Quality Controls**: Configure resolution, CRF quality, frame rate, and audio bitrate before converting.
- **Real-Time Progress**: Live conversion progress (0–100%) driven by actual FFmpeg WebAssembly events.
- **MP4 Preview & Download**: Instant video playback of converted MP4 and one-click download.
- **Clean Developer-Tool Aesthetic**: Sleek dark UI built with Tailwind CSS, responsive on mobile and desktop.
- **Automatic Memory Cleanup**: Revokes object URLs and cleans virtual WebAssembly filesystem to prevent memory leaks.

---

## Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) (Vue 3 Composition API + TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Core Video Converter**: [FFmpeg.wasm](https://ffmpegwasm.netlify.app/) (`@ffmpeg/ffmpeg`, `@ffmpeg/util`, `@ffmpeg/core`)
- **Fonts**: Inter & JetBrains Mono

---

## How It Works

```text
User selects WebM File
        ↓
Browser initializes FFmpeg.wasm (loaded locally — no CDN)
        ↓
User configures quality settings (resolution, CRF, FPS, audio)
        ↓
FFmpeg virtual filesystem loads WebM data
        ↓
FFmpeg executes H.264 / AAC conversion with selected options
        ↓
Generate MP4 Blob & Object URL
        ↓
Preview & Download MP4
```

---

## Local Development

### Prerequisites

- Node.js 18+
- `npm` or `pnpm`

### Installation

```bash
# Clone the repository
cd video_converter

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open `http://localhost:3000` in your web browser.

### Production Build

```bash
# Build static / server output
pnpm build

# Preview build locally
pnpm preview
```

---

## Browser Compatibility

Compatible with modern desktop and mobile browsers supporting WebAssembly:

- Google Chrome / Chromium 90+
- Mozilla Firefox 89+
- Apple Safari 15.2+
- Microsoft Edge 90+

---

## Privacy

- **Zero Server Uploads**: No backend `/api/upload` or cloud storage endpoints exist.
- **No Telemetry**: No filenames, metadata, or video bytes are transmitted anywhere.
- **Local FFmpeg Core**: The FFmpeg WASM binary is served from the same origin — no external CDN requests after first load.

---

## Limitations

- Conversion speed depends directly on the user's client hardware and CPU capabilities.
- Extremely large videos (e.g. >500 MB) may hit browser WebAssembly memory limits (typically 2GB max allocation in V8).
- FFmpeg.wasm single-threaded core — conversion is sequential, not parallelized.

---

## Roadmap

| Version | Features |
|---------|----------|
| **V1** ✅ | WebM → MP4 conversion, drag & drop, preview, download |
| **V2** ✅ | Quality controls: resolution, CRF, FPS, audio bitrate |
| **V3** ✅ | Enhancements: upscale (Lanczos), denoise, sharpen, color adjustment |
| Future | Batch conversion, PWA offline support |

---

## License

MIT License
