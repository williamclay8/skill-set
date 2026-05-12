# Render verification

Use this checklist before showing or handing off a Remotion onboarding video or App Store preview.

## Local preview

From the Remotion project directory:

```bash
npm install
npm run preview
```

If `npm install` reports audit findings, note them in the handoff. Do not run `npm audit fix` inside the source skill package unless the user approves dependency changes.

If the template exposes Remotion directly instead of npm scripts:

```bash
npx remotion preview
```

Open the preview and watch the full composition. Check that:
- The composition is the intended width, height, fps, and duration.
- No screenshot slice is missing, stretched, blurry, or mis-cropped.
- Captions fit and stay in the fixed top caption band.
- Cursor-led taps move before the tap ripple fires.
- Connected beats with identical captions do not re-animate the caption.
- No focal UI is blocked by captions, safe-area chrome, or poster-frame UI.

## Preflight composition metadata

List compositions and confirm the selected composition id:

```bash
npx remotion compositions
```

For App Store previews, use a 30 fps composition and one of Apple's accepted iPhone/iPad resolutions. Common targets:

```bash
# Modern iPhone portrait preview
npx remotion render src/Root.tsx OnboardingPreview out/app-preview-iphone-886x1920.mp4 --codec=h264 --pixel-format=yuv420p --fps=30 --width=886 --height=1920

# 5.5" / 4" iPhone portrait fallback
npx remotion render src/Root.tsx OnboardingPreview out/app-preview-iphone-1080x1920.mp4 --codec=h264 --pixel-format=yuv420p --fps=30 --width=1080 --height=1920

# iPad portrait preview
npx remotion render src/Root.tsx OnboardingPreview out/app-preview-ipad-1200x1600.mp4 --codec=h264 --pixel-format=yuv420p --fps=30 --width=1200 --height=1600
```

If the project uses package scripts, prefer the local script names:

```bash
npm run render -- --codec=h264 --pixel-format=yuv420p --fps=30 --width=886 --height=1920
```

## Render review

After rendering:

```bash
open out/app-preview-iphone-886x1920.mp4
```

Scrub the first frame, 5-second poster frame, and final second. Confirm:
- Duration is 15-30 seconds for App Store preview output.
- Poster frame around 5 seconds sells the feature without awkward transition blur.
- Motion is smooth and not too fast to understand.
- Audio is silent by design or stereo AAC/PCM at 44.1 kHz or 48 kHz.
- File size is under 500 MB.

## App Store validation script

Run the bundled validator from the repo root:

```bash
node skills/create-onboarding-video/scripts/validate-app-preview.mjs out/app-preview-iphone-886x1920.mp4
```

The script uses `ffprobe` when available. It checks file size, extension, duration, dimensions, frame rate, codec family, and audio track shape. Without `ffprobe`, it still checks file existence, extension, and file size, then asks you to install or expose `ffprobe` for full media validation.

Helpful optional checks:

```bash
ffprobe -hide_banner -show_format -show_streams out/app-preview-iphone-886x1920.mp4
du -h out/app-preview-iphone-886x1920.mp4
```

## Handoff note

When the output must be live on the App Store, do not call the work complete until the preview has been uploaded to App Store Connect, processed successfully, and the selected poster frame has been reviewed.
