---
title: Added Views
description: More previews, codespaces and workspaces beside the ones mount() sets up.
---

`mount()` sets up one workspace, codespace and preview. `engine.addView()` adds
as many more as you need, each in its own mode: Python and JavaScript previews
side by side, two codespaces in different languages, or read only workspaces
that mirror the program as blocks in other modes.

```ts
const right = engine.addView({
  kind: "preview",                  // "preview" | "codespace" | "workspace"
  container: document.getElementById("right")!,
  mode: "syntax-js",
  name: "right",                    // optional; otherwise view-1, view-2, …
  toolbar: { container: document.getElementById("right-toolbar")! },
});
await right.ready;                  // text views load their editor in the background
```

## Kinds

| Kind | What it does |
| --- | --- |
| `preview` | Shows the program as text in its mode, read only. |
| `codespace` | Edits the program as text in its mode: drops, inline value edits, deleting, the grip, like the built-in codespace. |
| `workspace` | Shows the program as blocks in its mode and follows every change of the main workspace. Read only: `editable: false` is the only value for now, and the default. A click on a block selects it everywhere. |

Every added view takes part in [selection sync](/guides/selection-sync/) and
highlights the selected block like the built-in views.

## The handle

`addView()` returns a handle:

| Member | Purpose |
| --- | --- |
| `name`, `kind` | The view's name and kind. |
| `ready` | Settles once a text view's editor has loaded. |
| `getMode()`, `setMode(mode)` | The view's mode. |
| `setTheme(theme)` | Colours of a text view, e.g. on a light/dark switch. |
| `dispose()` | Removes the view and its toolbar. |

A new `mount()` removes every added view. `engine.getViewMode(name)` returns the
mode of any view by name, built in (`workspace`, `codespace`, `preview`) or
added.

## Toolbars

Pass `toolbar: { container, items?, display? }` and the view gets its own
toolbar, acting on that view and removed with it. Items default to the view's
kind. Any toolbar can also be attached later by view name; see
[Toolbars](/guides/toolbars/).

## Presets

A preset can set the modes of added views by name with `views`:

```json
{ "name": "compare", "toolbox": "pseudo", "workspace": "pseudo",
  "views": { "right": "syntax-js" } }
```

Applying it switches each listed view that exists. Showing and hiding the
views' containers stays with your app, as for the built-in ones: read
`preset.views` in `onPresetApplied`.
