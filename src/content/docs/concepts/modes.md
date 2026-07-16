---
title: Modes
description: Modes select which elements a block shows.
---

A **mode** is a named subset of [elements](/concepts/blocks-and-elements/).
Assigning a mode to a view decides which visual parts of each block that view
renders — nothing more. Modes are purely presentational: switching one never
changes the underlying block model.

```json
{
  "modes": [
    { "name": "iconic",     "elements": ["icon", "title", "description"] },
    { "name": "conceptual", "elements": ["title", "concept"] },
    { "name": "python",     "elements": ["title", "python"] }
  ]
}
```

| Field      | Required | Purpose                                                    |
| ---------- | -------- | ---------------------------------------------------------- |
| `name`     | yes      | Mode identifier (arbitrary, no coupling to element names)  |
| `elements` | yes      | Element names rendered on the toolbox tile                 |

Mode names are up to you. A "mode" can be a scaffolding level (`iconic` →
`conceptual` → `python`), a natural language (`english`, `deutsch`), a target
syntax (`python`, `javascript`), an accessibility variant — whatever your
application needs.

## The source element

When a mode is assigned to a **codespace** or **preview** (text views), the
framework needs to know *which* element to render as source text. That is the
mode's **source element**: the first `type: "code"` element listed in its
`elements` array.

For the `python` mode above, the source element is `python` — a codespace in
that mode renders each block's `python` template as text.

How a mode's code elements render on a **toolbox tile** (as a mini block or as
source text) is *not* decided by the mode — it's decided by the preset's
`toolbox` entry. This keeps modes reusable: one mode can appear block-like in a
beginner preset and text-like in an advanced one. See
[Presets & Views](/concepts/presets-and-views/).

## Workspace template resolution

When a mode is assigned to the **workspace**, each block needs a Blockly
template. It is resolved in order:

1. The first `type: "code"` element listed in the mode's `elements` array
2. Fallback: the first `type: "code"` element in the block's definition
3. Fallback: an element literally named `"block"` (backward compatibility)
4. Fallback: the first element in the definition

In practice you rarely think about this — list a code element in the mode and
that's the template.

## Switching modes

Modes are switched per view at runtime, individually via
[`setModes()`](/concepts/presets-and-views/#the-lower-level-api-setmodes) or as
a named bundle via [presets](/concepts/presets-and-views/). Blocks re-render in
place; the program is untouched.

Each mode is backed by a CSS file that controls how its elements look — see
[Styling Modes](/guides/styling-modes/).
