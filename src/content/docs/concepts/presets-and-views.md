---
title: Presets & Views
description: "Declare the views, give them containers, and say what each one shows."
---

The program shows in **views**. Each view has a name and a kind:

| Kind        | What it is                                                         |
| ----------- | ------------------------------------------------------------------ |
| `workspace` | A Blockly canvas of draggable blocks                               |
| `codespace` | A text view of the same block model, editable by structure         |

A codespace with `editable: false` shows the program as text, read only (what
0.3 called the preview). Beside the views, the **toolbox** shows the tiles, in
a [mode](/concepts/modes/).

## Declaring views

Views are declared by name in the definitions:

```json
{
  "views": {
    "blocks": "workspace",
    "code": "codespace",
    "read": { "kind": "codespace", "editable": false }
  }
}
```

A bare kind is the short form. The long form takes:

| Field      | Purpose                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| `kind`     | `"workspace"` or `"codespace"`                                          |
| `editable` | Whether the program can be changed there. Default `true`                |
| `rtl`      | Right to left (`true`) or left to right (`false`); see [Text Direction](/guides/text-direction/) |
| `delete`   | How blocks are deleted in a codespace; see [Codespace](/guides/codespace/#options) |

Without `views`, there are two: `workspace` and `codespace`.

The app gives containers by name, and only the views it gives one to are set
up. So the same definitions serve a full page and a small embed:

```ts
engine.mount({
  containers: { blocks: blocksElement, code: codeElement, read: readElement },
  toolboxContainer,
});
```

`workspaceContainer` and `codespaceContainer` are short for
`containers.workspace` and `containers.codespace`.

**The program** lives in the first workspace that has a container. Every other
workspace shows a copy and sends its edits there. Without any workspace,
Blockly runs hidden, so a codespace alone still edits a real block model.

## What a view shows

A view shows a **code element**, not a mode: `"python"`, `"concept"`. Modes
are for the toolbox tiles. Without a preset, every view shows the first code
element of the first mode.

## Presets

A **preset** says what the toolbox and each view show:

```json
{
  "presets": [
    { "name": "start", "label": "Start", "toolbox": "iconic", "views": { "blocks": "concept" } },
    { "name": "both", "label": "Both", "toolbox": "concept",
      "views": { "blocks": "concept", "code": "python", "read": "javascript" } },
    { "name": "text", "label": "Text", "toolbox": "python-text", "views": { "code": "python" } }
  ]
}
```

| Field     | Required | Purpose                                              |
| --------- | -------- | ---------------------------------------------------- |
| `name`    | yes      | Preset identifier                                    |
| `label`   | no       | Display label (falls back to `name`)                 |
| `toolbox` | yes      | The tiles' [mode](/concepts/modes/)                  |
| `views`   | yes      | The code element each view shows, by view name       |

The views a preset lists are the ones it shows; views it leaves out keep what
they show. A name that is no declared view only warns, since a view
[added later](/guides/added-views/) may carry it.

Pass presets in the definitions (or the mount config) and switch at runtime:

```ts
engine.mount({
  containers,
  preset: "start",             // initial preset, default the first
  onPresetApplied(preset) {
    // show the panes of the views in preset.views, hide the others
  },
});

engine.applyPreset("both");    // by name or index
engine.getPresets();           // all presets, e.g. to build your buttons
engine.getActivePreset();      // the one applied last, e.g. to mark its button
```

Presets are checked at mount: unknown toolbox modes, views showing something
that is no code element, and duplicate names are reported right away.

`onPresetApplied(preset)` is your layout hook. The framework never controls
your page layout: it tells you which views the preset shows and you arrange
the panes. You don't need to resize a workspace after showing or hiding its
pane; the framework redraws Blockly whenever its container's size changes.

## show()

Presets bundle these switches; `show()` is the call underneath, in the same
shape:

```ts
engine.show({ toolbox: "python-text", views: { blocks: "concept", code: "python" } });
```

Everything left out stays as it is.

## Classes for your CSS

Every view's container carries classes you can combine:

| Class | On |
| --- | --- |
| `morphic-view`, `morphic-view-<name>` | every view, and this view by name |
| `morphic-shows-<element>` | the element the view shows |
| `morphic-preset-<name>` | the preset applied last |
| `morphic-workspace-root`, `morphic-codespace-root` | the view's kind |
| `morphic-read-only` | a view with `editable: false` |

Workspace blocks carry `morphic-shows-<element>` too; tiles carry their mode,
`morphic-mode-<mode>`. For example, a monospace font for Python blocks, and a
border on every view in one preset:

```css
.morphic-workspace-root.morphic-shows-python .blocklyText { font-family: monospace; }
.morphic-view.morphic-preset-both { border-top: 3px solid #3776ab; }
```

## Reading the current state

| Method | Returns |
| --- | --- |
| `getAvailableModes()` | every mode name from the definitions |
| `getToolboxMode()` | the tiles' mode |
| `getViewElement(name)` | the element a view shows, added views included |
| `getViewNames()` | the views that are set up |

All return `undefined` (or an empty list) before `mount()`.
