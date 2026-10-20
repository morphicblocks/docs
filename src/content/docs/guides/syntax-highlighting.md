---
title: Syntax Highlighting
description: Definition-driven highlighting for the codespaces.
---

The codespaces color their text from each code element's
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
- Each codespace picks the entry of the element it shows.
- Switching what a view shows at runtime (`show()`, presets) swaps the rules live.
- Code shown as text on toolbox tiles (`render: "text-based"`) takes the same
  rules and colours; the toolbox option `highlight: false` turns that off.

## Overriding per editor

The code editor takes `highlightRules` in its options, ahead of the
definitions:

```ts
await engine.mountCodeEditor(container, {
  highlightRules: { keywords: ["SELECT", "FROM"], strings: ["'"] },
});
```
