---
title: Toolbars
description: Per-pane toolbars with copy, paste, zoom, undo, and redo.
---

Each pane (workspace, codespace, preview) can mount its own toolbar. Like
everything else in the framework, toolbars are **headless** — structural
classes only, styling is yours.

Give `mount()` a container per pane, and each gets the default toolbar:

```ts
engine.mount({
  // …containers
  toolbarContainers: {
    workspace: document.getElementById("workspace-toolbar")!,
    codespace: document.getElementById("codespace-toolbar")!,
  },
});
```

For [custom items](#custom-items), or to add a toolbar later, use
`engine.mountToolbar()`:

```ts
engine.mountToolbar(document.getElementById("workspace-toolbar")!, {
  pane: "workspace",
});
```

## Default items

Omitting `items` gives the pane's defaults:

| Pane                    | Items                                                             |
| --- | --- |
| `workspace`, `codespace` | mode label · spacer · undo · redo · copy · paste · zoom in/out/fit · clear |
| `preview`               | mode label · spacer · copy · zoom in/out/fit · read-only badge     |

Pass `items: []` to render none, or compose your own from the exported
factories:

```ts
import { toolbarItems } from "morphic-blocks";

engine.mountToolbar(el, {
  pane: "codespace",
  display: "both",   // "icon" (default) | "label" | "both"
  items: [
    toolbarItems.modeLabel(),
    toolbarItems.spacer(),
    toolbarItems.undo(),
    toolbarItems.redo(),
    toolbarItems.copy(),
  ],
});
```

## Block-aware clipboard and zoom

Toolbar actions go through pane-aware engine APIs you can also call directly:

- `engine.copyActiveBlock(pane)` — copies the block that owns the active
  line/selection; also mirrors the block's *code text* to the system clipboard.
- `engine.pasteActiveBlock(pane)` — pastes the internal clipboard as a real
  block (offset from the original).
- `engine.zoomPane(pane, "in" | "out" | "fit")` — Blockly zoom on the
  workspace; font-size scaling on codespace/preview.

## Custom items

An item is a plain object:

```ts
{
  id: "run",                       // reflected as data-toolbar-id for CSS
  align: "right",                  // "left" (default) | "right" of the spacer
  label: "Run",
  icon: "<svg …>…</svg>",          // inline SVG string
  title: "Run the program",        // native tooltip
  onClick: (ctx) => { /* ctx.engine, ctx.pane, ctx.refresh() */ },
  visible: (ctx) => true,          // omit item when false
  disabled: (ctx) => false,        // rendered disabled when true
  // render: (ctx) => …            // escape hatch: fully custom DOM
}
```

Every callback receives the toolbar context (`ctx.engine`, `ctx.pane`,
`ctx.refresh()`), so items can read pane state and request a re-render —
that's how the built-in undo/redo items track their enabled state.

## Styling

```css
.morphic-toolbar { /* container; also has data-morphic-pane="workspace" */ }
.morphic-toolbar-left, .morphic-toolbar-right { /* item groups */ }
[data-toolbar-id="copy"] { /* single item */ }
```
