---
title: Syntax Highlighting
description: Definition-driven highlighting for codespace and preview.
---

The codespace and preview color their text from the top-level `highlighting`
map in your definitions — **no grammar files, no language plugins**. Since a
mode's [source element](/concepts/modes/#the-source-element) already names the
"language" (`python`, `javascript`, …), the map is keyed by element name:

```json
{
  "highlighting": {
    "python": {
      "keywords": ["print", "if", "else", "for", "in", "def", "return"],
      "strings": ["\"", "'"],
      "comment": "#"
    },
    "javascript": {
      "keywords": ["console", "if", "else", "for", "let", "const", "function"],
      "strings": ["\"", "'"],
      "comment": "//",
      "colors": { "keyword": "#c678dd" }
    }
  }
}
```

## Rule fields

| Field      | Purpose                                                              |
| --- | --- |
| `keywords` | Words highlighted as keywords — exact match against identifier tokens |
| `strings`  | String delimiters; a span runs until the matching close on the same line |
| `comment`  | Line-comment marker; highlights from the marker to end of line       |
| `numbers`  | Highlight integer/decimal literals — defaults to `true`              |
| `colors`   | Optional overrides per token class: `keyword`, `string`, `number`, `comment` (framework provides defaults) |

This is deliberately token-level, not a parser: enough to make rendered
templates readable, simple enough that adding a new "language" to your
definitions costs five lines of JSON.

## How it applies

- Pass `highlighting` in the mount config (usually straight from your
  definitions JSON).
- Each codespace/preview picks the entry matching its mode's source element.
- Switching modes at runtime (`setModes()`, presets) swaps the rules live.

## Overriding per editor

For full control on a single editor, pass `highlightRules` in its mount
options — it takes precedence over the definitions lookup:

```ts
await engine.mountPreview(container, {
  highlightRules: { keywords: ["SELECT", "FROM"], strings: ["'"] },
});
```
