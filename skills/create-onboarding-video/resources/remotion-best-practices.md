# Remotion Best Practices

Use this bundled resource whenever a separate companion `remotion-best-practices` skill is not available. It is the local source of truth for Remotion code authored by `create-onboarding-video`.

## Project Shape

- Start from `assets/remotion-onboarding-template` when present.
- Before installing or rendering, confirm the environment can run Remotion: Node.js 16+ or Bun 1.0.3+, macOS 15+ on macOS, or Linux with libc 2.35+ and the required Chromium/graphics packages. Alpine Linux and nixOS are not supported Remotion targets.
- For commercial use, remind the user to confirm Remotion licensing. Remotion is free for individuals, for-profit organizations with up to 3 employees, nonprofits/not-for-profits, and non-commercial evaluation; other commercial users need a company license.
- Put screenshots in `public/<screen-name>/<state>.png` and load them with `staticFile()`.
- Define one flow-level `<Composition>` in `src/Root.tsx`.
- Put per-beat scenes in `src/scenes/`.
- Put shared transitions in `src/transitions/`.
- Keep reusable primitives in `src/components/`, especially caption, cursor, and slice/crop helpers.
- Use 30fps and 1080x1920 portrait by default. Expose dimensions, colors, and copy as props when variants are requested.

## Scene Authoring

- Compose with `<AbsoluteFill>` and `<Sequence>` so each beat has explicit timing.
- Use `useCurrentFrame()`, `interpolate()`, `spring()`, and `Easing.bezier(0.16, 1, 0.3, 1)` for UI-like movement.
- Prefer `spring()` for arrival, scale, sheet motion, shared elements, and result landings.
- Keep linear interpolation for opacity or simple progress only.
- Clamp interpolation ranges to avoid motion leaking into adjacent beats.
- Centralize timing constants. Avoid magic numbers scattered across scenes.

## Cropped UI Pieces

- Do not render full screenshots as the primary visual.
- Extract the focal component with CSS crops, `overflow: hidden`, `clip-path`, border-radius masks, or absolute-positioned image slices.
- Keep the crop large enough to understand the interaction but small enough that app chrome is omitted or only implied.
- Put isolated UI pieces on clean tinted backgrounds, not busy full-screen mockups.
- Preserve screenshot fidelity: avoid scaling tiny crops beyond sharpness, and use high-resolution stills when possible.

## Captions

- Use one shared `TopCaption` component across every beat.
- Anchor captions in a fixed top band, about 200-240px tall on a 1080x1920 canvas.
- For a 1080-wide canvas, default to about 54px, weight 700, with a max width so long lines wrap.
- Caption entry should finish in the first 10-14 frames: fade in while moving up from about 60px below rest.
- Keep captions visible for the full beat. Do not fade them out early.
- When adjacent beats use identical caption text, render continuation captions statically so they do not flicker.

## Cursor And Interaction

- For taps, clicks, or selections, load `resources/cursor-component.md`.
- The pointer appears at the visual center of the focal area, then moves in one straight line to the target before the tap ripple.
- Multiple taps on the same UI keep one continuous pointer that glides from target to target.
- New UI or new screen means the pointer resets: fade out, then fade in at the next focal center.
- Illustrative result/highlight beats can use glow rings and do not need a cursor.

## Rendering And Checks

- Render a short preview first, then review the MP4 visually.
- Verify every beat has a readable caption, no overlapping UI, and no accidental whole-screen presentation.
- Check that pointer timing leads taps, crops stay sharp, transitions do not reveal hidden screenshot edges, and the final frame lands cleanly.
- Use `scripts/validate-app-preview.mjs` when the project includes that validator.

## Render Failure Recovery

- Missing image or font: confirm the asset is under the Remotion project's `public/` folder beside the `package.json`, then load it with `staticFile()`.
- Blank or mis-sized output: run `npx remotion compositions`, confirm the composition id, width, height, fps, and duration, then render a short frame range.
- TypeScript or bundling failure: fix the first compiler error before changing animation logic.
- Slow or memory-heavy render: lower concurrency, render a short frame range first, or switch image format/quality only after visual correctness is proven.
