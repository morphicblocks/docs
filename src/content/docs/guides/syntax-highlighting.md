---
title: Syntax Highlighting
description: Definition-driven highlighting for codespace and preview.
---

The codespace and preview color their text from each code element's
`highlighting` in the [`code` section](/concepts/definitions-format/#code) of
your definitions — **no grammar files, no language plugins**. Since a mode's
[source element](/concepts/modes/#the-source-element) already names the
"language" (`python`, `javascript`, …), the rules sit with that element:

```json
{
  "code": {
    "python": {
      "highlighting": {
        "keywords": ["print", "if", "else", "for", "in", "def", "return"],
        "strings": ["\"", "'"],
        "comment": "#"
      }
    },
    "javascript": {
      "highlighting": {
        "keywords": ["console", "if", "else", "for", "let", "const", "function"],
        "strings": ["\"", "'"],
        "comment": "//",
        "colors": { "keyword": "#c678dd" }
      }
    }
  }
}
```

## Rule fields

| Field      | Purpose                                                              |
| --- | --- |
| `keywords` | Words highlighted as keywords, matched as whole words in any script (`if`, `اطبع`) |
| `strings`  | String delimiters: a mark that opens and closes (`"\""`), or an `[open, close]` pair for quotes that differ (`["„", "“"]`); a span runs until its close on the same line |
| `comment`  | Line-comment marker; highlights from the marker to end of line       |
| `numbers`  | Highlight integer/decimal literals — defaults to `true`              |
| `colors`   | Optional overrides per token class: `keyword`, `string`, `number`, `comment` (framework provides defaults) |

This is deliberately token-level, not a parser: enough to make rendered
templates readable, simple enough that adding a new "language" to your
definitions costs five lines of JSON.

## How it applies

- The rules come from the definitions handed to the engine; a `code` section
  in the mount config replaces them.
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
