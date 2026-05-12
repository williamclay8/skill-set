# App Store preview guidance

Use this resource when the user asks for an App Store preview, App Preview, or an onboarding video that may be uploaded to App Store Connect. Apple changes device buckets over time, so verify the current App Store Connect Help page before final delivery when exact upload acceptance matters.

Sources:
- Apple App Store Connect Help: https://developer.apple.com/help/app-store-connect/reference/app-preview-specifications/
- Apple upload guidance: https://developer.apple.com/help/app-store-connect/manage-app-information/upload-app-previews-and-screenshots/
- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/

## Hard upload constraints

- Duration: 15-30 seconds.
- Maximum file size: 500 MB.
- Count: up to 3 app previews per supported device size and language.
- Orientation: portrait or landscape for iOS and iPadOS. macOS, tvOS, and visionOS are landscape-only.
- Upload/playback environment: App Store Connect upload and playback require Safari 8 and macOS 10.10 or later.
- Default poster frame: 5 seconds. Set the poster frame deliberately in App Store Connect because it appears on product pages and install surfaces.
- App previews always appear before screenshots on iPhone, iPad, Mac, and Apple TV product pages.
- Processing after upload may take up to 24 hours.

## Video and audio encoding

Apple accepts H.264 and ProRes 422 HQ app previews.

H.264:
- Extensions: `.mov`, `.m4v`, `.mp4`.
- Target bit rate: 10-12 Mbps.
- Video: progressive, up to High Profile Level 4.0.
- Max frame rate: 30 fps.
- Audio: AAC, 256 kbps, stereo, 44.1 kHz or 48 kHz. All tracks should be enabled.

ProRes 422 HQ:
- Extension: `.mov`.
- Target bit rate: variable, around 220 Mbps.
- Video: progressive, no external references.
- Max frame rate: 30 fps.
- Audio: PCM or AAC 256 kbps, stereo, 44.1 kHz or 48 kHz. PCM may be 16-, 24-, or 32-bit. All tracks should be enabled.

Silent previews are common, but if audio is present, make it compliant. When in doubt, export a quiet stereo AAC track rather than a mono or oddly sampled track.

## Accepted iPhone resolutions

Render the exact accepted resolution for the display target. Do not assume a full device screenshot size is accepted as video.

| Display target | Portrait | Landscape |
|---|---:|---:|
| 6.9", 6.5", 6.3", 6.1" iPhone displays | 886 x 1920 | 1920 x 886 |
| 5.5" iPhone displays | 1080 x 1920 | 1920 x 1080 |
| 4.7" iPhone displays | 750 x 1334 | 1334 x 750 |
| 4" iPhone displays | 1080 x 1920 | 1920 x 1080 |
| 3.5" iPhone displays | Not supported | Not supported |

## Accepted iPad resolutions

| Display target | Portrait | Landscape |
|---|---:|---:|
| 13", 12.9", 11", 10.5" iPad displays | 1200 x 1600 | 1600 x 1200 |
| 12.9" iPad secondary accepted size | 900 x 1200 | 1200 x 900 |
| 9.7" iPad displays | 900 x 1200 | 1200 x 900 |

## App Review and metadata risks

App previews are app metadata. Treat the video as part of the submitted product page, not a standalone ad.

- The preview must accurately reflect the app's core experience and current version.
- Do not show hidden, dormant, beta-only, undocumented, or unavailable features.
- Avoid unverifiable claims, pricing promises, competitor references, keyword stuffing, or terms that belong in another metadata field.
- Keep screenshots, previews, app name, subtitle, icon, and description consistent so customers are not confused.
- Preview content should be appropriate for a 4+ audience even when the app's age rating is higher.
- Do not include protected third-party material, trademarks, copyrighted works, music, screenshots, or brands unless the app owner has rights to use them in every storefront where the app ships.
- Avoid objectionable, discriminatory, defamatory, scary, gross, sexual, violent, or otherwise upsetting content.
- Do not fake device data or imply functionality the app cannot provide.

## Production guidance for this skill

- Prefer `886x1920` at 30 fps for modern iPhone App Store previews unless the user asks for a different target.
- Keep the Remotion composition duration at exactly 15-30 seconds before rendering.
- Build the edit around real captured app UI footage/stills. Remotion overlays, captions, crops, touch indicators, and transitions can clarify the screen capture, but they must not synthesize features, screens, content, or outcomes the submitted app cannot provide.
- Leave UI text readable at thumbnail scale and make the 5-second poster frame representative.
- Validate the final file with `skills/create-onboarding-video/scripts/validate-app-preview.mjs <file>` before handoff.
