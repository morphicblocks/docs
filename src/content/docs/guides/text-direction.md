---
title: Text Direction
description: Right to left apps (Arabic, Hebrew, Persian), and views that run the other way.
---

Most apps run in one direction for good. Set it once, on the page and on the
blocks:

```html
<html dir="rtl">
```

```ts
engine.mount({
  // …containers
  blockly: { rtl: true },
});
```

- **Blocks:** `blockly.rtl` draws the workspaces right to left; the toolbox
  tiles follow it.
- **Text views:** codespaces follow the page's `dir`, like any other element.

## One view the other way

A view's `rtl` sets its direction on its own, e.g. Python left to right on a
right to left page, or Arabic blocks beside English ones:

```json
{
  "views": {
    "blocks": "workspace",
    "code": { "kind": "codespace", "rtl": false }
  }
}
```

Left out, a view follows the page (codespaces) or `blockly.rtl`
(workspaces), which is what most apps want. For a codespace, `dir` on its
container does the same.

## Switching the direction

Blockly sets a workspace's direction when it is created, so a switch builds
the views again. Save the program, mount with the new direction, and load it:

```ts
// `config`: what the app gave `mount()` at the start.
async function setDirection(rtl: boolean) {
  const program = engine.serializeWorkspace();
  document.documentElement.dir = rtl ? "rtl" : "ltr";
  await engine.mount({ ...config, blockly: { ...config.blockly, rtl } });
  engine.loadWorkspace(program);
}
```

`mount()` starts over: add the views from `addView()` again, and undo starts
empty.
