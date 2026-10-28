---
title: Added Views
description: Views added at runtime, beside the ones the definitions declare.
---

Most apps declare their views in the definitions
([Presets & Views](/concepts/presets-and-views/)). `engine.addView()` adds one
at runtime instead, for a view the app only sometimes needs: a second
codespace in another language, or another workspace that shows the program as
blocks in another element.

```ts
const right = engine.addView({
  kind: "codespace",                // "codespace" | "workspace"
  editable: false,                  // read only, default true
  container: document.getElementById("right")!,
  element: "javascript",
  name: "right-pane",                // optional; otherwise view-1, view-2, …
  toolbar: { container: document.getElementById("right-toolbar")! },
});
await right.ready;                  // text views load their editor in the background
```

It takes what a declared view takes (`editable`, `rtl`, `delete`), plus its
`container`, the `element` it shows, an optional `theme` and `toolbar`.

## Kinds

| Kind | What it does |
| --- | --- |
| `codespace` | Edits the program as text in its element: drops, inline value edits, deleting, the grip. With `editable: false`, it only shows it. |
| `workspace` | Shows the program as blocks in its element and follows every change of the program's workspace. Blocks can be moved, connected, edited and deleted there and tiles dropped on it, and every change goes to the program's workspace; `editable: false` makes it read only. Undo follows the program's history. A click on a block selects it everywhere. |

Every added view takes part in [selection sync](/guides/selection-sync/) and
highlights the selected block like the declared views.

## The handle

`addView()` returns a handle:

| Member | Purpose |
| --- | --- |
| `name`, `kind` | The view's name and kind. |
| `ready` | Settles once a text view's editor has loaded. |
| `getElement()`, `show(element)` | The element the view shows. |
| `setTheme(theme)` | Colours of a text view, e.g. on a light/dark switch. |
| `dispose()` | Removes the view and its toolbar. |

A new `mount()` removes every added view. `engine.getViewElement(name)`
returns the element of any view by name, declared or added.

## Toolbars

Pass `toolbar: { container, items?, display? }` and the view gets its own
toolbar, acting on that view and removed with it. Items default to the view's
kind. Any toolbar can also be attached later by view name; see
[Toolbars](/guides/toolbars/).

## Presets

A preset can name added views in its `views`, like declared ones:

```json
{ "name": "compare-preset", "toolbox": "concept-tiles", "views": { "editor-pane": "concept", "right-pane": "javascript" } }
```

Since the name is no declared view, `mount()` warns once; applying the preset
switches the view when it exists. Showing and hiding the views' containers
stays with your app: read `preset.views` in `onPresetApplied`.
