---
title: Resizable Panes
description: The page layout is the app's; makeResizable is an optional helper for dividers.
---

Every view lives in a container of your own, so you place the toolbox, the
workspaces and the codespaces wherever your page needs them. The framework
never controls the layout. Resizing panes is part of that layout: CSS, or your
UI library's split panes, work as they are.

For a simple divider between two panes, the framework exports an optional,
unstyled helper. You give it your divider element and the pane it resizes; the
pane must be a flex item:

```ts
import { makeResizable } from "morphic-blocks";

const divider = makeResizable(document.getElementById("gutter")!, {
  target: document.getElementById("codespace-pane")!,
  axis: "x",          // "x" resizes the width, "y" the height
  min: 200,           // pixels
  max: 800,
  invert: false,      // true when the divider sits before the pane it resizes
  onResize: (size) => localStorage.setItem("codespace-width", String(size)),
});

divider.dispose();    // detaches it again
```

It changes the pane's `flex-basis` while the divider is dragged with the mouse
or a finger. A workspace in the pane redraws itself when its size changes.

## Keyboard and screen readers

The divider can be reached with Tab and moved with the arrow keys along its
axis, by `step` pixels (default 10), with Shift five times as far. Home and
End go to `min` and `max`.

Screen readers announce it as a resize handle: it gets `role="separator"`,
`aria-orientation`, and the pane's size in `aria-valuenow`, `aria-valuemin`
and `aria-valuemax`. Give the pane an `id`, and the divider names it in
`aria-controls`; add an `aria-label` that says what it resizes:

```html
<div id="gutter" aria-label="Resize the code"></div>
```

How the divider looks, its cursor and its focus ring are your CSS.
