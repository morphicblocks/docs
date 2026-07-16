---
title: Styling Modes with CSS
description: One stylesheet per mode using .morphic-mode-* classes.
---

Modes have no built-in look — **you** define how each mode renders, one CSS
file per mode. This is the framework's styling contract.

## The class contract

Every rendered tile carries the active mode, the block identifier, and one
class per element:

```html
<div class="morphic-block morphic-mode-iconic morphic-block-text_print"
     style="--morphic-block-color: #5C81A6">
  <div class="morphic-element-icon">…</div>
  <div class="morphic-element-title">Print</div>
  <div class="morphic-element-python">print(<span class="morphic-slot"></span>)</div>
</div>
```

A mode stylesheet mostly decides **which elements are visible and how they're
arranged**:

```css
/* iconic.css — show icon + title, hide everything else */
.morphic-mode-iconic .morphic-element-icon { display: block; }
.morphic-mode-iconic .morphic-element-title { display: block; font-weight: 600; }
```

The Blockly workspace root gets the mode class too:

```css
/* python.css — monospace text on workspace blocks in python mode */
.morphic-workspace-root.morphic-mode-python .blocklyText {
  font-family: "Fira Code", monospace;
}
```

Block colors can be driven from CSS via the custom property:

```css
.morphic-block-text_print {
  --morphic-block-color: #b469d6;
}
```

## Loading mode stylesheets

Three ways, in the mount config:

```ts
engine.mount({
  // 1. Auto-discovery by filename (Vite): modes/iconic.css → mode "iconic"
  modesFolder: import.meta.glob("./modes/*.css", { eager: true, query: "?url" }),

  // 2. Explicit per-mode entries (any bundler / no bundler)
  modeStyles: [
    { mode: "iconic", href: "/styles/iconic.css" },
    { mode: "python", cssText: ".morphic-mode-python { … }" },
  ],

  // 3. A base stylesheet applied regardless of mode
  baseStyle: { href: "/styles/morphic-base.css" },
});
```

`modesFolder` takes precedence over `modeStyles` for the same mode names.

## Mode coverage validation

At mount, the framework checks that every declared mode has a stylesheet and
warns about gaps — a mode without CSS renders all elements unstyled, which is
almost never what you want. Missing coverage shows up early instead of as a
visual surprise later.

## Related

- [Blocks & Elements](/concepts/blocks-and-elements/#the-rendered-tile) — the full markup being styled
- [Custom Toolbox](/guides/custom-toolbox/) — where tiles appear
