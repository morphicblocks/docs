---
title: Custom Toolbox
description: Replace Blockly's flyout with HTML Morphic Block tiles.
---

`engine.mountToolbox()` replaces Blockly's built-in flyout with an HTML
toolbox of **Morphic Block tiles** — no off-screen Blockly workspaces, just
DOM you can style:

```ts
engine.mountToolbox(document.getElementById("toolbox")!, {
  categories: definitions.categories,
});
```

Dragging a tile into the workspace — or onto the
[codespace](/guides/codespace/) — creates the actual Blockly block in the
model.

## Options

| Option       | Default | Purpose                                                    |
| --- | --- | --- |
| `modeLabel`  | `true`  | Render a `Mode: <name>` header at the top of the toolbox   |
| `blocks`     | all     | Show only a subset of blocks (list of identifiers)         |
| `categories` | —       | Category grouping; falls back to the mount config's `toolbox.categories`; with neither, blocks render as a flat list |

Category entries are `{ name, color?, blocks? }` — when a category omits its
`blocks` list, the framework derives it from block definitions whose
`category` field matches the name.

## Tiles and modes

Each tile renders **all** of a block's elements; the active toolbox mode's CSS
decides which are visible (see
[Blocks & Elements](/concepts/blocks-and-elements/#the-rendered-tile) for the
markup). The toolbox re-renders when the toolbox mode changes — via
`setModes({ toolboxMode })` or a preset switch — and honours the preset's
[render override](/concepts/presets-and-views/#the-toolbox-render-override)
for showing code elements as blocks or as source text.

## Styling

The toolbox is intentionally unstyled beyond structural classes. Target:

```css
.morphic-block { /* every tile */ }
.morphic-mode-iconic .morphic-element-title { /* per mode, per element */ }
[data-category="Output"] { /* category wrapper */ }
```

See [Styling Modes](/guides/styling-modes/) for the full CSS contract.
