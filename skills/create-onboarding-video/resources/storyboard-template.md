# Storyboard Template

Create this plan before coding. Keep it short enough to review with the user or use as implementation notes.

## Project

- **Feature:**
- **Audience/use:**
- **Output:** 1080x1920 portrait, 30fps, MP4 unless specified otherwise.
- **Total duration target:**
- **Source stills:** `public/<screen-name>/<state>.png`

## Beat Template

Repeat once per beat:

```md
### Beat <n>: <short name>

- Duration:
- Source stills:
- Focal UI piece:
- Crop/mask plan:
- Interaction:
- Cursor:
- Caption:
- Motion:
- Transition in:
- Transition out:
- Verification notes:
```

## Beat Guidance

- **Focal UI piece:** name the exact component that proves the feature works. Examples: "Create button and bottom sheet header", "habit row being reordered", "progress ring filling".
- **Crop/mask plan:** specify how the screenshot is isolated, such as a fixed crop, rounded mask, overflow-hidden slice, or layered foreground/background crop.
- **Interaction:** describe the action, not just the view. Examples: tap, drag, focus, select, swipe, load, confirm.
- **Cursor:** use "required" for taps/clicks/selections, "not needed" for illustrative highlights/results, or "continues" when multiple taps stay on the same UI.
- **Caption:** one short headline, fixed in the top caption band for the full beat.
- **Motion:** prefer springs, masked reveals, shared-element movement, slide/fade, scale, and subtle parallax.
- **Verification notes:** call out what must be visible in the rendered draft, such as no full-screen UI, crop remains sharp, caption readable, pointer arrives before tap, and no layout overlap.

## Connected Beats

If two consecutive beats share the exact same caption text, render the second caption statically so it appears to persist through the transition. If the text changes at all, animate the new caption normally.
