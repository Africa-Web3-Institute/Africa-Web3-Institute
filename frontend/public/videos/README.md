# Video Assets

Place ambient looping video files here. All videos are used as silent background loops
with `autoPlay muted loop playsInline`. They fall back gracefully to poster images if absent.

| File | Used in | Recommended |
|------|---------|-------------|
| `hero-ambient.mp4` | HeroSection | aerial Africa city skyline or tech conference |
| `programs-ambient.mp4` | Programs section | blurred conference / panel discussion footage |
| `community-ambient.mp4` | Community section | people networking / collaborating footage |
| `cta-ambient.mp4` | Final CTA section | slow aerial or abstract pattern |

## Tips
- Keep each file under **8 MB** — use HandBrake or FFmpeg to compress.
- Ideal dimensions: **1920×1080** at 24fps, H.264, CRF 28–32.
- FFmpeg one-liner: `ffmpeg -i input.mp4 -vcodec libx264 -crf 30 -an -movflags +faststart output.mp4`
- Free sources: [Pexels Videos](https://www.pexels.com/videos/), [Coverr](https://coverr.co/)

Until files are present the `<video>` tags render nothing and the poster `<img>` or slide images show instead.
