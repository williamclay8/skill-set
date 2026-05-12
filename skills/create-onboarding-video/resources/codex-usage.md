# Codex Usage

Use this resource when running `create-onboarding-video` inside Codex or another OpenAI product surface.

## Resource Loading

- Start with `SKILL.md`, then load only the resources needed for the current step.
- Use `resources/intake-checklist.md` before planning if screenshots, feature intent, output format, or delivery requirements are unclear.
- Use `resources/storyboard-template.md` before writing Remotion code so the focal crop, interaction, caption, timing, and verification notes are explicit.
- Load `resources/cursor-component.md` only for pointer-led tap, click, or selection beats.
- Load `resources/app-store-preview.md` only when the user asks for App Store preview constraints.
- Use `resources/render-verification.md` before calling the work complete.

## Local Render Verification

- Keep Remotion work in the local workspace unless the user asks for a different destination.
- Render drafts locally before final review. Do not treat TypeScript compilation or static inspection as enough for motion work.
- Inspect the rendered video for crop accuracy, caption placement, pointer timing, transitions, pacing, and readability at the requested aspect ratio.
- Run `scripts/validate-app-preview.mjs` when the package includes it and the video is intended as an app preview.

## Browser Preview Checks

- When a Remotion preview server is available, open it in the browser and verify the composition visually.
- Check both the first meaningful frame and representative interaction beats. Look for blank canvases, missing screenshot assets, off-frame crops, overlapping captions, and pointer/ripple drift.
- If the work changes layout, preview the requested output size and any required mobile/desktop review viewports.

## Privacy And Local Handling

- Treat supplied screenshots, recordings, and renders as private user assets.
- Do not upload, publish, or share source media, intermediate frames, or final renders unless the user explicitly asks.
- Avoid including private screenshots in commits unless the user has asked for those assets to become part of the repository.
- Prefer local file paths in handoff notes so the user can inspect artifacts without exposing them externally.

## Lumi Hygiene

- Track whether changes are local, committed, pushed, and deployed or live.
- If useful changes are ready to keep and commits are allowed, nudge toward committing them so the working tree stays clean.
- If the result must be viewable on a live website or hosted preview, call out deployment status clearly and do not mark the work done until deployment is confirmed or the remaining deployment step is explicit.
- Never revert or discard dirty changes unless the user explicitly asks.
