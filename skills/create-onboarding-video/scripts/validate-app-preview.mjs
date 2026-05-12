#!/usr/bin/env node
import {existsSync, statSync} from "node:fs";
import {basename, extname, resolve} from "node:path";
import {spawnSync} from "node:child_process";

const MAX_BYTES = 500 * 1024 * 1024;
const MIN_DURATION = 15;
const MAX_DURATION = 30;
const MAX_FPS = 30;

const acceptedResolutions = new Map([
  ["886x1920", "iPhone 6.9/6.5/6.3/6.1 portrait"],
  ["1920x886", "iPhone 6.9/6.5/6.3/6.1 landscape"],
  ["1080x1920", "iPhone 5.5/4 portrait"],
  ["1920x1080", "iPhone 5.5/4 landscape"],
  ["750x1334", "iPhone 4.7 portrait"],
  ["1334x750", "iPhone 4.7 landscape"],
  ["1200x1600", "iPad portrait"],
  ["1600x1200", "iPad landscape"],
  ["900x1200", "iPad 12.9 secondary / 9.7 portrait"],
  ["1200x900", "iPad 12.9 secondary / 9.7 landscape"],
]);

const h264Extensions = new Set([".mov", ".m4v", ".mp4"]);
const proresExtensions = new Set([".mov"]);

const usage = `Usage:
  node skills/create-onboarding-video/scripts/validate-app-preview.mjs <media-file>

Checks an App Store preview candidate against Apple's common upload constraints:
  - 15-30 second duration
  - <= 500 MB file size
  - accepted iPhone/iPad preview resolution
  - H.264 or ProRes video, <= 30 fps
  - extension compatible with codec
  - audio track shape when audio is present

The script has no npm dependencies. It uses ffprobe when available; without ffprobe,
it can only check file existence, extension, and size.

Options:
  -h, --help     Show this help text
`;

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(usage);
  process.exit(0);
}

if (args.length !== 1) {
  console.error(usage);
  process.exit(2);
}

const target = resolve(args[0]);
const checks = [];

function record(level, message) {
  checks.push({level, message});
}

function pass(message) {
  record("PASS", message);
}

function warn(message) {
  record("WARN", message);
}

function fail(message) {
  record("FAIL", message);
}

function parseRate(rate) {
  if (!rate || rate === "0/0") return null;
  const [numerator, denominator] = rate.split("/").map(Number);
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return null;
  }
  return numerator / denominator;
}

function ffprobeJson(file) {
  const probe = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-print_format",
      "json",
      "-show_format",
      "-show_streams",
      file,
    ],
    {encoding: "utf8"},
  );

  if (probe.error?.code === "ENOENT") {
    return {available: false};
  }

  if (probe.status !== 0) {
    fail(`ffprobe could not read ${basename(file)}: ${probe.stderr.trim() || "unknown error"}`);
    return {available: true, data: null};
  }

  try {
    return {available: true, data: JSON.parse(probe.stdout)};
  } catch (error) {
    fail(`ffprobe returned invalid JSON: ${error.message}`);
    return {available: true, data: null};
  }
}

if (!existsSync(target)) {
  fail(`File does not exist: ${target}`);
} else {
  const stats = statSync(target);
  if (!stats.isFile()) {
    fail(`Path is not a file: ${target}`);
  } else if (stats.size <= MAX_BYTES) {
    pass(`File size ${(stats.size / 1024 / 1024).toFixed(1)} MB is <= 500 MB`);
  } else {
    fail(`File size ${(stats.size / 1024 / 1024).toFixed(1)} MB exceeds 500 MB`);
  }
}

const extension = extname(target).toLowerCase();
if (h264Extensions.has(extension)) {
  pass(`Extension ${extension} is accepted for H.264 candidates`);
} else {
  fail(`Extension ${extension || "(none)"} is not one of .mov, .m4v, .mp4`);
}

if (existsSync(target)) {
  const probe = ffprobeJson(target);
  if (!probe.available) {
    warn("ffprobe was not found; install ffmpeg or add ffprobe to PATH for duration, codec, fps, resolution, and audio checks");
  } else if (probe.data) {
    const streams = Array.isArray(probe.data.streams) ? probe.data.streams : [];
    const video = streams.find((stream) => stream.codec_type === "video");
    const audioStreams = streams.filter((stream) => stream.codec_type === "audio");
    const duration = Number(probe.data.format?.duration ?? video?.duration);

    if (!video) {
      fail("No video stream found");
    } else {
      const resolution = `${video.width}x${video.height}`;
      const resolutionLabel = acceptedResolutions.get(resolution);
      if (resolutionLabel) {
        pass(`Resolution ${resolution} matches ${resolutionLabel}`);
      } else {
        fail(`Resolution ${resolution} is not an accepted iPhone/iPad App Store preview size`);
      }

      const fps = parseRate(video.avg_frame_rate) ?? parseRate(video.r_frame_rate);
      if (fps === null) {
        warn("Could not determine frame rate from ffprobe output");
      } else if (fps <= MAX_FPS + 0.01) {
        pass(`Frame rate ${fps.toFixed(3)} fps is <= 30 fps`);
      } else {
        fail(`Frame rate ${fps.toFixed(3)} fps exceeds 30 fps`);
      }

      if (video.codec_name === "h264") {
        if (h264Extensions.has(extension)) {
          pass(`Video codec h264 is compatible with ${extension}`);
        } else {
          fail(`H.264 preview must use .mov, .m4v, or .mp4, not ${extension}`);
        }
      } else if (video.codec_name === "prores") {
        if (proresExtensions.has(extension)) {
          pass("Video codec prores is compatible with .mov");
        } else {
          fail(`ProRes preview must use .mov, not ${extension}`);
        }
        if (video.profile && !/422.*HQ|HQ/i.test(video.profile)) {
          warn(`ProRes profile is "${video.profile}"; Apple specifies ProRes 422 HQ only`);
        }
      } else {
        fail(`Video codec ${video.codec_name || "(unknown)"} is not H.264 or ProRes`);
      }
    }

    if (Number.isFinite(duration)) {
      if (duration >= MIN_DURATION && duration <= MAX_DURATION) {
        pass(`Duration ${duration.toFixed(2)}s is within 15-30s`);
      } else {
        fail(`Duration ${duration.toFixed(2)}s is outside 15-30s`);
      }
    } else {
      warn("Could not determine duration from ffprobe output");
    }

    if (audioStreams.length === 0) {
      warn("No audio stream found; if the preview is intentionally silent, confirm App Store Connect accepts the upload");
    }

    for (const [index, audio] of audioStreams.entries()) {
      const sampleRate = Number(audio.sample_rate);
      const channels = Number(audio.channels);
      const codec = audio.codec_name || "(unknown)";
      const isAllowedCodec = codec === "aac" || codec.startsWith("pcm_");
      const isAllowedRate = sampleRate === 44100 || sampleRate === 48000;

      if (isAllowedCodec) {
        pass(`Audio stream ${index + 1} codec ${codec} is AAC or PCM`);
      } else {
        fail(`Audio stream ${index + 1} codec ${codec} is not AAC or PCM`);
      }

      if (isAllowedRate) {
        pass(`Audio stream ${index + 1} sample rate ${sampleRate} Hz is accepted`);
      } else {
        fail(`Audio stream ${index + 1} sample rate ${sampleRate || "(unknown)"} Hz is not 44100 or 48000`);
      }

      if (channels === 2 || (channels === 1 && audioStreams.length === 2)) {
        pass(`Audio stream ${index + 1} channel layout can satisfy stereo requirements`);
      } else {
        fail(`Audio stream ${index + 1} has ${channels || "(unknown)"} channel(s); use stereo or two mono L/R tracks`);
      }
    }
  }
}

for (const check of checks) {
  console.log(`${check.level} ${check.message}`);
}

const failureCount = checks.filter((check) => check.level === "FAIL").length;
const warningCount = checks.filter((check) => check.level === "WARN").length;

if (failureCount > 0) {
  console.error(`\n${failureCount} failure(s), ${warningCount} warning(s).`);
  process.exit(1);
}

console.log(`\nApp preview validation completed with ${warningCount} warning(s).`);
