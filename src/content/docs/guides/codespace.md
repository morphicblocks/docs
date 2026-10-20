---
title: Codespace
description: An editable-by-structure text view of the workspace.
---

The **codespace** shows the block model as text, written in the code element
it shows (`python`, `concept`), and lets users
*edit the program through its structure*: dragging, dropping, reordering, and
editing values, all against the same underlying Blockly model as the
workspace. It is not free-text editing; every change is a model operation, so
the program can never become syntactically broken.

## Mounting

A codespace is a [view](/concepts/presets-and-views/) of kind `codespace`.
Without declared views there is one named `codespace`; give `mount()` its
container, and it sets the codespace up there:

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
Which element the codespace shows is set by the active
[preset](/concepts/presets-and-views/), or at runtime with
`show({ views: { codespace: "python" } })`.

**Headless mode:** without a container for any workspace, Blockly runs
headless (offscreen): the block model stays authoritative while users only
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
- **Delete** — Delete/Backspace on a block's line, or the gutter `✕`, removes
  the block the line belongs to with everything inside it, as in the workspace:
  the statement starting on the line, the block a closing line ends, or a value
  standing as its own group. With several lines selected (drag with the mouse,
  or Shift and the arrow keys), Delete/Backspace or the toolbar's `✕` removes
  the blocks of all of them in one undo step.

Drops follow the same connection checks as the workspace: a block goes only
where its connections fit (a value only into a slot whose `check` accepts its
type), and a refused drop changes nothing. A value dropped onto a filled slot
keeps the old value, as in the workspace: it goes into the new block's only
slot that takes it, else to its own line below the others.

Empty value slots render their configured
[empty defaults](/concepts/definitions-format/#shadows-placeholders-and-empty-slots),
or an editable `___` marker when none is set.

## Groups of blocks

Blocks that are connected form a group, like a stack in the workspace. In the
text views (every codespace), the framework marks each group's lines with
classes. The text itself and its line numbers stay unchanged:

| Class | On |
| --- | --- |
| `morphic-group-start` | the first line of a group |
| `morphic-group-end` | the last line of a group |
| `morphic-group-line` | every line of a group with more than one line |
| `morphic-group-odd` / `morphic-group-even` | every line of every other group |
| `morphic-group-hover` | every line of the group under the mouse |

The line numbers carry the same classes. Without your own CSS, nothing changes.
Some ideas:

**1. Space between groups**, looking like an empty line without adding one. The
gap goes below each group, so every line number stays on its line:

```css
.cm-content .cm-line.morphic-group-end:not(:last-child) { padding-bottom: 1lh; }
```

**2. A bar along each group:**

```css
.cm-content .morphic-group-line { box-shadow: inset 3px 0 0 #c9d6e3; }
```

**3. Every other group tinted:**

```css
.cm-content .morphic-group-even { background: rgb(0 0 0 / 0.03); }
```

**4. A separator line between groups:**

```css
.cm-content .morphic-group-start:not(:first-child) { border-top: 1px dashed #d0d7de; }
```

**5. The group under the mouse:**

```css
.cm-content .morphic-group-hover { box-shadow: inset 3px 0 0 #00509b; }
```

The block under the mouse (codespace) and the selected block are highlighted
already, so a bar stays easier to tell apart from them than a background. A
background works too (`background: rgb(0 80 155 / 0.06)`). To show only the
groups, turn the other highlights off:

```css
.cm-content .morphic-hover-target { background: none; }    /* block under the mouse */
.cm-content .morphic-editable-hover { outline: none; }     /* outline of an editable value */
.cm-content { --morphic-highlight-color: transparent; }    /* selected block */
```

## Options

A codespace's options sit on its view in the definitions' `views` (or on
`addView()` for an [added codespace](/guides/added-views/)). Each way of
deleting is on by default and can be turned off with `delete`:

```json
{
  "views": {
    "workspace": "workspace",
    "codespace": { "kind": "codespace", "delete": { "lineButtons": false } }
  }
}
```

| Option | Turns off |
| --- | --- |
| `lineButtons` | the `✕` beside each line where a block starts |
| `keys` | Delete and Backspace |
| `toolbarButton` | the toolbar's `✕` for the selected lines |

`editable: false` makes a codespace read only (see
[Read Only Views](/guides/preview-and-code-editor/)), and `rtl` sets its
direction (see [Text Direction](/guides/text-direction/)).

Theme at runtime: `engine.setViewTheme("codespace", theme)`.

## Related

- [Read Only Views & Code Editor](/guides/preview-and-code-editor/), the read only siblings
- [Syntax Highlighting](/guides/syntax-highlighting/) — coloring the rendered text
- [Selection Sync](/guides/selection-sync/) — linked highlighting across views
