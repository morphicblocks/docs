---
title: Upgrade to 0.4
description: What moved in 0.4.0, and how to bring an app over.
---

0.4.0 changes how views are set up and what they show. Every old place fails
at `mount()` with a message that names the new one, so an app can be brought
over step by step.

## In the definitions

| Until 0.3 | Since 0.4 |
| --- | --- |
| A preset's `toolbox: { mode, render }` | `toolbox: "<mode>"`, and `render` on that mode |
| `render` values `"block"`, `"text"` | `"block-based"`, `"text-based"` |
| A preset's `workspace`, `codespace`, `preview` keys, naming modes | `views: { <view>: <code element> }` |
| A preview | A view `{ "kind": "codespace", "editable": false }` |
| Views fixed by the framework | `views` declares them by name |

Before:

```json
{
  "presets": [
    { "name": "text", "toolbox": { "mode": "py", "render": { "python": "text" } },
      "codespace": "py", "preview": "js" }
  ]
}
```

After:

```json
{
  "modes": [{ "name": "py", "elements": ["title", "python"], "render": { "python": "text-based" } }],
  "views": {
    "workspace": "workspace",
    "codespace": "codespace",
    "preview": { "kind": "codespace", "editable": false }
  },
  "presets": [
    { "name": "text", "toolbox": "py", "views": { "codespace": "python", "preview": "javascript" } }
  ]
}
```

Views show a **code element** now (`python`), not a mode (`py`); modes are
for the toolbox tiles. A file without `views` gets `workspace` and
`codespace`, so a small app often only needs its presets changed.

## In the app

| Until 0.3 | Since 0.4 |
| --- | --- |
| `previewContainer` | `containers: { preview: element }` and a declared view |
| `workspaceContainer`, `codespaceContainer` | still work, short for `containers.workspace` / `.codespace` |
| `toolbarContainers` | `toolbars: { <view>: element }` |
| `previewTheme` | `themes: { <view>: theme }` |
| The mount option `codespace: { delete }` | `delete` on the codespace's view |
| `setModes({ … })` | `show({ toolbox, views: { <view>: <element> } })` |
| `getWorkspaceMode()`, `getCodespaceMode()`, `getPreviewMode()`, `getViewMode()` | `getViewElement(view)`, `getToolboxMode()` |
| `setCodespaceTheme()`, `setPreviewTheme()` | `setViewTheme(view, theme)` |
| `mountCodespace()`, `mountPreview()` | declared views, or `addView()` |
| `addView({ kind: "preview", mode })` | `addView({ kind: "codespace", editable: false, element })` |
| A handle's `getMode()`, `setMode()` | `getElement()`, `show(element)` |
| An added workspace, read only by default | editable by default; `editable: false` |
| `toolbarItems.modeLabel()` ("Mode: py") | `toolbarItems.viewLabel()` ("python") |
| Toolbar `pane`, `ctx.pane`, `data-morphic-pane` | `view`, `ctx.kind`, `data-morphic-kind` |
| A behavior's `context.mode`, `proxy.mode` | `context.element`, `proxy.element` (a tile's context keeps `mode`) |

In `onPresetApplied`, read `preset.views` to know which panes to show:

```ts
onPresetApplied(preset) {
  for (const [name, pane] of Object.entries(panes)) pane.hidden = !(name in preset.views);
}
```

## In the CSS

Views and their blocks carry the element they show, not a mode:

| Until 0.3 | Since 0.4 |
| --- | --- |
| `.morphic-workspace-root.morphic-mode-py` | `.morphic-workspace-root.morphic-shows-python` |
| `.morphic-codespace-root.morphic-mode-py` | `.morphic-codespace-root.morphic-shows-python` |
| `.morphic-preview-root` | `.morphic-codespace-root.morphic-read-only` |

Tiles keep `morphic-mode-<mode>`, so tile CSS stays as it is. New classes:
`morphic-view-<name>` and `morphic-preset-<name>`, see
[Presets & Views](/concepts/presets-and-views/#classes-for-your-css).
