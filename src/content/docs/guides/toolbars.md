---
title: Toolbars
description: Toolbars per view with copy, paste, zoom, undo, and redo.
---

Each view can have its own toolbar. Like everything else in the framework,
toolbars are **headless**: structural classes only, styling is yours.

Give `mount()` a container per view, by view name, and each gets the default
toolbar:

```ts
engine.mount({
  // …containers
  toolbars: {
    workspace: document.getElementById("workspace-toolbar")!,
    codespace: document.getElementById("codespace-toolbar")!,
  },
});
```

For [custom items](#custom-items), or to add a toolbar later, use
`engine.mountToolbar()`:

```ts
engine.mountToolbar(document.getElementById("workspace-toolbar")!, { view: "workspace" });
```

A toolbar acts on a view by name, declared or [added](/guides/added-views/)
(an added view can also bring its own through `addView({ toolbar })`).

## Default items

Omitting `items` gives the defaults of the view's kind:

| View                    | Items                                                             |
| --- | --- |
| `workspace` | view label · spacer · undo · redo · copy · paste · zoom in/out/fit · clear |
| `codespace` | view label · spacer · undo · redo · copy · paste · delete · zoom in/out/fit · clear |
| read only (`editable: false`) | view label · spacer · copy · zoom in/out/fit · read-only badge     |

The view label shows the element the view shows (`python`).

Pass `items: []` to render none, or compose your own from the exported
factories:

```ts
import { toolbarItems } from "morphic-blocks";

engine.mountToolbar(el, {
  view: "codespace",
  display: "both",   // "icon" (default) | "label" | "both"
  items: [
    toolbarItems.viewLabel(),
    toolbarItems.spacer(),
    toolbarItems.undo(),
    toolbarItems.redo(),
    toolbarItems.copy(),
  ],
});
```

## Block-aware clipboard and zoom

Toolbar actions go through engine APIs you can also call directly. Each takes a
view name:

- `engine.copyActiveBlock(view)` — copies the block that owns the active
  line/selection; also mirrors the block's *code text* to the system clipboard.
- `engine.pasteActiveBlock(view)` — pastes the internal clipboard as a real
  block (offset from the original).
- `engine.hasClipboardContents()`: whether there is a block to paste, e.g. to
  disable a paste button of your own.
- `engine.deleteSelectedLines(view)`: deletes the blocks of the lines selected
  in a codespace; `engine.hasSelectedLines(view)` tells whether any are, e.g.
  to enable a button of your own.
- `engine.zoomPane(view, "in" | "out" | "fit")` — Blockly zoom on a
  workspace; font-size scaling on a text view.

## Custom items

An item is a plain object:

```ts
{
  id: "run",                       // reflected as data-toolbar-id for CSS
  align: "right",                  // "left" (default) | "right" of the spacer
  label: "Run",
  icon: "<svg …>…</svg>",          // inline SVG string
  title: "Run the program",        // native tooltip
  onClick: (ctx) => { /* ctx.engine, ctx.view, ctx.refresh() */ },
  visible: (ctx) => true,          // omit item when false
  disabled: (ctx) => false,        // rendered disabled when true
  // render: (ctx) => …            // escape hatch: fully custom DOM
}
```

Every callback receives the toolbar context (`ctx.engine`, `ctx.kind` for the
view's kind, `ctx.readOnly`, `ctx.view` for its name, `ctx.refresh()`); pass
`ctx.view` to the engine APIs above. Items can read the view's state and
request a re-render; that's how the built-in undo/redo items track their
enabled state.

## Styling

```css
.morphic-toolbar { /* container; also has data-morphic-kind="workspace" and data-morphic-view="…" */ }
.morphic-toolbar-left, .morphic-toolbar-right { /* item groups */ }
[data-toolbar-id="copy"] { /* single item */ }
```
