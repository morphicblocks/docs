---
title: Presets & Views
description: "Assign a mode to each view: toolbox, workspace, codespace, preview."
---

Morphic Blocks renders into up to four **views**:

| View        | What it is                                                        |
| ----------- | ----------------------------------------------------------------- |
| `toolbox`   | HTML tiles the user drags blocks from                             |
| `workspace` | The Blockly canvas of draggable blocks                            |
| `codespace` | An editable-by-structure *text* view of the same block model      |
| `preview`   | A read-only text view (e.g. show JavaScript next to Python)       |

Every view renders **the same block model**, each in its own
[mode](/concepts/modes/). A **preset** is a named assignment of modes to views:

```json
{
  "presets": [
    { "name": "iconic", "label": "Iconic", "toolbox": "iconic", "workspace": "conceptual" },
    { "name": "hybrid", "label": "Hybrid",
      "toolbox": "conceptual", "workspace": "conceptual",
      "codespace": "python", "preview": "javascript" },
    { "name": "text", "label": "Text",
      "toolbox": { "mode": "python", "render": { "python": "text" } },
      "codespace": "python" }
  ]
}
```

| Field       | Required | Purpose                                                  |
| ----------- | -------- | -------------------------------------------------------- |
| `name`      | yes      | Preset identifier                                        |
| `label`     | no       | Display label (falls back to `name`)                     |
| `toolbox`   | yes      | Toolbox mode, or `{ mode, render }` (see below)          |
| `workspace` | no*      | Mode for the block workspace                             |
| `codespace` | no*      | Mode whose source element the codespace renders          |
| `preview`   | no       | Mode whose source element the read-only preview renders  |

\* At least one editing space (`workspace` or `codespace`) must be set.
**Presence of a view key means that view is shown** — workspace and codespace
can be visible simultaneously, in different modes.

## The toolbox render override

A preset's `toolbox` is either:

- a **mode name** — all of the mode's `code` elements render as draggable mini
  blocks, or
- an **object** `{ mode, render }` — where `render` maps element names to
  `"block"` or `"text"`, overriding how each `code` element renders on the
  tile.

`{ "mode": "python", "render": { "python": "text" } }` shows the Python
template as source text on the tile instead of a block. Because this choice
lives in the preset, the same mode can render differently across presets.

Any `code` element **not** named in `render` renders as a **block** — `render`
only overrides the ones you list. And `render` applies to the **toolbox tile
only**: the codespace, preview, and workspace always render the assigned mode's
[source element](/concepts/modes/#the-source-element), regardless of `render`.

## Using presets

Pass presets in the mount config and switch at runtime:

```ts
engine.mount({
  workspaceContainer,
  codespaceContainer,          // required when any preset uses a codespace
  modes: definitions.modes,
  presets: definitions.presets,
  preset: "iconic",            // initial preset
  onPresetApplied(preset) {
    // show/hide panes based on which view keys are present
  },
});

engine.applyPreset("hybrid");  // by name or index
```

Presets are validated at mount: unknown modes, missing code elements, a
codespace preset without a `codespaceContainer`, duplicate names, and invalid
`render` values are all reported immediately.

`onPresetApplied(preset)` is your layout hook — the framework never controls
your page layout; it tells you which views the preset uses and you arrange the
panes.

## The lower-level API: setModes()

Presets bundle mode switches; `setModes()` is the primitive underneath:

```ts
engine.setModes({
  workspaceMode: "conceptual",
  toolboxMode: "python",
  toolboxRender: { python: "text" },
  codespaceMode: "python",
  previewMode: "javascript",
});
```

All keys are optional — set what you want to change. Passing `null` clears the
codespace/preview mode and the toolbox render override.
