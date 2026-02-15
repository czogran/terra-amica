---
name: translations
description: Defines how to add and maintain translation keys across all locale files in src/assets/i18n.
---

## Translation Workflow

- Treat `src/assets/i18n/` as the source of truth for UI translations.
- When adding a new translation key, add it to **all** language files in this directory.
- Never add a key to only one locale file.
- Use the same key name and structure in every locale (for example, `reference.zoom.reset`).

## Required Coverage

- Apply each new key to every `*.json` file in `src/assets/i18n/`.
- If a locale file is missing the key, add it before finishing the change.
- Keep translation behavior consistent in templates and TS by using the same key path everywhere.

## Quality Rules

- Keep JSON valid and UTF-8 encoded.
- Preserve existing file style and naming patterns already used in the project.
- Do not remove existing translation keys unless explicitly requested.
- Prefer meaningful, user-facing translations (not placeholders like `TODO`).

## Usage in Code

- In templates, use `{{ 'key.path' | translate }}`.
- For attributes, use bindings like `[attr.aria-label]="'key.path' | translate"`.
- If a static label is moved to i18n, replace all direct usages with the translation key.
