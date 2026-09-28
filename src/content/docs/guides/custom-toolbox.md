---
title: Custom Toolbox
description: Replace Blockly's flyout with HTML Morphic Block tiles.
---

The custom toolbox replaces Blockly's built-in flyout with an HTML toolbox of
**Morphic Block tiles**: no off-screen Blockly workspaces, just DOM you can
style. Give `mount()` a container for it:

```ts
engine.mount({
  workspaceContainer: document.getElementById("workspace")!,
  toolboxContainer: document.getElementById("toolbox")!,
});
```

Categories come from the definitions. To set the toolbox up later, or with
[options](#options), use `engine.mountToolbox()` instead:

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
| `modeLabel`  | `true`  | Header at the top of the toolbox: `true` shows `Mode: <name>`, `false` none, a string that text, a function `(mode) => text` its result |
| `blocks`     | all     | Show only a subset of blocks (list of identifiers)         |
| `categories` | —       | Category grouping; with neither this nor the mount config's `toolbox.categories`, blocks render as a flat list |

All three can also be set in `mount()` under `toolbox`, so a toolbox set up by
`toolboxContainer` gets them too:

```ts
engine.mount({
  workspaceContainer,
  toolboxContainer,
  toolbox: { modeLabel: false, blocks: ["text_print", "loop_for"] },
});
```

Options passed to `mountToolbox()` win over the ones in `mount()`.

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

### Tiles that are just the block

A tile has no background of its own; any box around the block comes from your
CSS. To show nothing but the Blockly block, give the toolbox a mode that lists
only the code element, and let its CSS make the tile exactly as big as the
block:

```json
"modes": [{ "name": "blocks", "elements": ["block"] }]
```

```css
.morphic-block.morphic-mode-blocks {
  background: none;
  border: 0;
  padding: 0;
  width: fit-content;
}
```
