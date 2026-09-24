---
title: Codespace
description: An editable-by-structure text view of the workspace.
---

The **codespace** shows the block model as text — rendered from the codespace
mode's [source element](/concepts/modes/#the-source-element) — and lets users
*edit the program through its structure*: dragging, dropping, reordering, and
editing values, all against the same underlying Blockly model as the
workspace. It is not free-text editing; every change is a model operation, so
the program can never become syntactically broken.

## Mounting

Give `mount()` a container, and it sets the codespace up there:

```ts
await engine.mount({
  workspaceContainer,            // optional, see headless mode below
  codespaceContainer: document.getElementById("codespace")!,
  editorTheme,                   // optional
  // …
});
```

Awaiting `mount()` waits for the codespace, because CodeMirror is lazy-loaded
(see [Installation](/getting-started/installation/#optional-code-editor-packages)).
To set it up again later with other [options](#options), call
`engine.mountCodespace(options)`.
Which mode the codespace shows is set by the active
[preset](/concepts/presets-and-views/), or at runtime with
`setModes({ codespaceMode })`.

**Headless mode:** `mount()` accepts `workspaceContainer`,
`codespaceContainer`, or both. With only a `codespaceContainer`, Blockly runs
headless (offscreen) — the block model stays authoritative while users only
ever see text.

## What users can do

- **Drop from the toolbox** — tiles dragged onto the codespace insert blocks,
  with a drop-position indicator. Drops resolve to real slots: into empty
  `for`/`if` bodies, between statements, and into **value slots** (numbers,
  strings, variables).
- **Reorder via the grip** — a grip gutter (`⋮⋮`) appears on draggable block
  lines; dragging it moves the block, including same-chain reordering.
- **Right-click drag** (or Ctrl-click on macOS) — drag directly from a block's
  text, with hover affordances: blue outline on the innermost editable value,
  grey background on the enclosing block.
- **Edit values inline** — clicking an editable placeholder (text, number,
  dropdown) overlays an input on the exact range;
  [shadows](/concepts/definitions-format/#shadows-placeholders-and-empty-slots)
  materialise to real blocks on first edit.
- **Delete** — Delete/Backspace on a block's line, or the gutter `✕`.

Empty value slots render their configured
[empty defaults](/concepts/definitions-format/#shadows-placeholders-and-empty-slots),
or an editable `___` marker when none is set.

## Options

`mountCodespace(options?)` takes the same options as the code editor
(`theme`, `extensions`, `highlightRules`, …). Two have codespace-specific
defaults you can override:

| Option         | Default behavior                                            |
| --- | --- |
| `onDelete`     | Deletes the block at the given line from the model          |
| `canDragBlock` | Grips appear for all movable blocks (statement and value)   |

Theme at runtime: `engine.setCodespaceTheme(theme)`.

## Related

- [Preview & Code Editor](/guides/preview-and-code-editor/) — the read-only siblings
- [Syntax Highlighting](/guides/syntax-highlighting/) — coloring the rendered text
- [Selection Sync](/guides/selection-sync/) — linked highlighting across views
