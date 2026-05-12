---
name: create-onboarding-video
description: Produce short, punchy iOS app onboarding videos in Remotion that showcase a feature in action by animating isolated pieces of the UI (cropped components, not full screens) with nice UI-like transitions. Use when the user asks to create, build, or generate an onboarding video, app preview, feature demo clip, App Store preview, or any short video that demonstrates a mobile app feature using supplied screenshots.
---

# Create Onboarding Video

Create a short Remotion onboarding/app-preview video from supplied iOS app screenshots. The result should feel like an App Store preview zoomed into the moment that proves one feature works: cropped UI pieces, crisp interaction motion, and minimal explanatory text.

## Non-negotiables

- **Screenshots are required.** If the user has not supplied stills, stop and ask for them through normal Codex/user intake. Do not invent UI from descriptions.
- **Crop to UI pieces.** Never render or animate a whole screen as the main beat. Extract the relevant button, card, row, sheet, field, chart, empty state, or result area with masks/crops and place it on a clean background.
- **One feature per video.** Split unrelated features into separate videos.
- **Show the interaction.** Prefer pointer-led taps, state changes, masked reveals, shared-element swaps, spring motion, and subtle parallax over static screenshots or narration.
- **Match the app.** Use colors, type, spacing, and corner radii from the supplied stills.

## Production Workflow

1. **Intake.** Use `resources/intake-checklist.md` to collect screenshots, feature intent, order, aspect ratio, brand constraints, and delivery requirements. Ask concise follow-up questions in chat when anything required is missing.
2. **Storyboard.** Use `resources/storyboard-template.md` to plan each beat before authoring code: focal crop, interaction, caption, transition, duration, and verification notes.
3. **Set up Remotion.** Start from `assets/remotion-onboarding-template` when available. Confirm the local Node/Remotion environment first. Put stills in `public/<screen-name>/<state>.png`, scenes in `src/scenes/`, shared transitions in `src/transitions/`, and one flow-level composition in `src/Root.tsx`.
4. **Author scenes.** Follow `resources/remotion-best-practices.md`. If a separate companion `remotion-best-practices` skill is installed, use it before writing Remotion code; if it is missing, load and follow the bundled `resources/remotion-best-practices.md` instead.
5. **App Store variant.** When the user needs an App Store preview, also consult `resources/app-store-preview.md` for format and pacing expectations.
6. **Codex workflow.** Follow `resources/codex-usage.md` for repo-safe implementation habits.
7. **Render and verify.** Render drafts, inspect them visually, and run the package validator in `scripts/validate-app-preview.mjs` when applicable. Use `resources/render-verification.md` for the final review checklist.
8. **Iterate.** Treat the first render as a draft. Ask what should be slower, faster, cropped differently, or restaged, then revise and render again.

## Output Contract

Deliver a local Remotion project or patch that includes source stills under `public/`, React scene/components source, render commands, and the final MP4 path when a render was produced. For App Store previews, also report the target device bucket, dimensions, duration, codec/container, file size, audio status, poster-frame recommendation, and any remaining App Store Connect upload risks.

## Motion Rules

- Default to 30fps, 1080x1920 portrait, with width/height exposed as props when a variant is needed.
- Keep beats short: roughly 90-240 frames each.
- Use `<Sequence>` for beat timing and `spring()`/strong UI ease-out curves for motion.
- Use a single `TopCaption` component. Captions stay in a fixed top band, fade/slide up within the first 10-14 frames, remain visible for the full beat, and stay static across connected beats only when the caption text is exactly identical.
- For any tap/click/selection beat, load `resources/cursor-component.md`. The pointer must fade in at the visual center, glide in one straight segment to the target before the tap ripple, stay visible across multiple taps on the same UI, and reset only for a different UI or new screen.
- Pure illustrative beats may use glow/highlight motion instead of a cursor.

## Expected Resource Paths

This skill package includes these support paths:

- `resources/intake-checklist.md`
- `resources/storyboard-template.md`
- `resources/remotion-best-practices.md`
- `resources/app-store-preview.md`
- `resources/codex-usage.md`
- `resources/render-verification.md`
- `resources/cursor-component.md`
- `scripts/validate-app-preview.mjs`
- `assets/remotion-onboarding-template`
