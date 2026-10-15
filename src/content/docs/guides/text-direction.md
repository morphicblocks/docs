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

- **Blocks:** `blockly.rtl` draws the workspace right to left; added
  workspaces and the toolbox tiles follow it.
- **Text views:** the codespace, the preview and added text views follow the
  page's `dir`, like any other element.

## One text view the other way

A text view takes the direction of the element around it. To show Python
left to right on a right to left page, set `dir` on its container:

```html
<div id="codespace" dir="ltr"></div>
```

On a left to right page, only the view that should run right to left needs
`dir="rtl"`.

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
