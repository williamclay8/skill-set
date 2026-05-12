#!/usr/bin/env node
import {existsSync, readFileSync} from "node:fs";
import {join} from "node:path";

const root = process.cwd();
const skill = join(root, "skills", "create-onboarding-video");

const requiredFiles = [
  "SKILL.md",
  "agents/openai.yaml",
  "resources/app-store-preview.md",
  "resources/codex-usage.md",
  "resources/cursor-component.md",
  "resources/intake-checklist.md",
  "resources/remotion-best-practices.md",
  "resources/render-verification.md",
  "resources/storyboard-template.md",
  "scripts/validate-app-preview.mjs",
  "assets/remotion-onboarding-template/package.json",
  "assets/remotion-onboarding-template/src/Root.tsx",
  "assets/remotion-onboarding-template/src/components/Caption.tsx",
  "assets/remotion-onboarding-template/src/components/Cursor.tsx",
  "assets/remotion-onboarding-template/src/components/Slice.tsx",
  "assets/remotion-onboarding-template/src/scenes/DemoFlow.tsx",
  "assets/remotion-onboarding-template/src/transitions/crossfade.ts",
  "assets/remotion-onboarding-template/src/theme.ts",
  "assets/remotion-onboarding-template/public/demo/resting.svg",
  "assets/remotion-onboarding-template/public/demo/result.svg",
];

const checks = [];
const fail = (message) => checks.push({ok: false, message});
const pass = (message) => checks.push({ok: true, message});

for (const relative of requiredFiles) {
  const path = join(skill, relative);
  if (existsSync(path)) {
    pass(`${relative} exists`);
  } else {
    fail(`${relative} is missing`);
  }
}

const skillMdPath = join(skill, "SKILL.md");
if (existsSync(skillMdPath)) {
  const body = readFileSync(skillMdPath, "utf8");
  const requiredMentions = [
    "resources/intake-checklist.md",
    "resources/storyboard-template.md",
    "resources/remotion-best-practices.md",
    "resources/app-store-preview.md",
    "resources/codex-usage.md",
    "resources/render-verification.md",
    "scripts/validate-app-preview.mjs",
    "assets/remotion-onboarding-template",
  ];

  for (const mention of requiredMentions) {
    if (body.includes(mention)) {
      pass(`SKILL.md references ${mention}`);
    } else {
      fail(`SKILL.md does not reference ${mention}`);
    }
  }

  if (body.includes("AskUserQuestion")) {
    fail("SKILL.md still references AskUserQuestion instead of normal Codex/user intake");
  } else {
    pass("SKILL.md does not reference AskUserQuestion");
  }
}

const cursorPath = join(skill, "resources", "cursor-component.md");
if (existsSync(cursorPath)) {
  const cursor = readFileSync(cursorPath, "utf8");
  if (cursor.includes("path bends naturally")) {
    fail("cursor-component.md still contains the contradictory bending-path guidance");
  } else {
    pass("cursor-component.md avoids contradictory bending-path guidance");
  }
}

const openaiPath = join(skill, "agents", "openai.yaml");
if (existsSync(openaiPath)) {
  const openai = readFileSync(openaiPath, "utf8");
  if (openai.includes("$create-onboarding-video")) {
    pass("agents/openai.yaml default prompt names $create-onboarding-video");
  } else {
    fail("agents/openai.yaml default prompt must name $create-onboarding-video");
  }
}

const failures = checks.filter((check) => !check.ok);
for (const check of checks) {
  console.log(`${check.ok ? "PASS" : "FAIL"} ${check.message}`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} validation check(s) failed.`);
  process.exit(1);
}

console.log("\nSkill package validation passed.");
