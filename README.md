# skill-set

A collection of agent skills for Claude Code and Codex.

## Skills

- [`create-onboarding-video`](skills/create-onboarding-video/SKILL.md) - Build iOS app onboarding and App Store-style preview videos with Remotion.

## Install

### Claude Code

Install a skill by copying its directory into either a project-local or global Claude skills directory:

```sh
mkdir -p .claude/skills
cp -R skills/create-onboarding-video .claude/skills/
```

For a global install:

```sh
mkdir -p ~/.claude/skills
cp -R skills/create-onboarding-video ~/.claude/skills/
```

Verify that Claude can see the skill by starting Claude Code in the target project and asking it to use `create-onboarding-video` for an onboarding video task.

### Codex

Install a skill by copying its directory into a Codex skills location such as `~/.codex/skills`:

```sh
mkdir -p ~/.codex/skills
cp -R skills/create-onboarding-video ~/.codex/skills/
```

Codex reads `SKILL.md` for invocation guidance and `agents/openai.yaml` for product-facing display metadata. The `resources/codex-usage.md` file provides Codex-specific workflow notes for loading resources, rendering locally, browser preview checks, privacy, and repository hygiene.

## Verify

From this repository, run the package validators before publishing or sharing changes:

```sh
python3 /Users/clay/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/create-onboarding-video
node scripts/validate-skill.mjs
```

`quick_validate.py` checks skill structure and metadata conventions. `scripts/validate-skill.mjs` checks this package's expected support files and cross-references.

## Use

### Claude Code

Ask Claude to use the skill with supplied app screenshots:

```text
Use create-onboarding-video to make a short portrait onboarding video for these iOS screenshots.
```

### Codex

Invoke the skill by name or with its product prompt:

```text
Use $create-onboarding-video to create a short Remotion onboarding video from these iOS app screenshots.
```

For Codex work, keep source screenshots and renders local unless the user explicitly asks to publish them, run the local render/preview checks described by the skill, and track whether changes are local, committed, pushed, or live.
