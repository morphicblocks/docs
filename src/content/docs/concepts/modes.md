---
title: Modes
description: Modes select which elements a toolbox tile shows.
---

A **mode** is a named subset of [elements](/concepts/blocks-and-elements/)
that a **toolbox tile** shows. Modes are purely presentational: switching one
never changes the underlying block model. Since 0.4.0 they are for the tiles
only; [views](/concepts/presets-and-views/) show a code element instead.

```json
{
  "modes": [
    { "name": "iconic",      "elements": ["icon", "title", "description"] },
    { "name": "conceptual",  "elements": ["title", "concept"] },
    { "name": "python-text", "elements": ["title", "python"],
      "render": { "python": "text-based" } },
    { "name": "side-by-side", "elements": ["title", "concept", "python"],
      "render": { "concept": "block-based", "python": "text-based" } }
  ]
}
```

| Field      | Required | Purpose                                                    |
| ---------- | -------- | ---------------------------------------------------------- |
| `name`     | yes      | Mode identifier; keep it distinct from element and preset names |
| `elements` | yes      | Element names shown on the tile, **in list order** |
| `render`   | no       | How each code element is drawn on the tile: `"block-based"` (the default) or `"text-based"` |

The **order** of `elements` is the order the parts appear on the tile; reorder
the list to rearrange it.

Mode names are up to you. A "mode" can be a scaffolding level (`iconic`,
`conceptual`, `python-text`), a natural language (`english`, `deutsch`), an
accessibility variant, whatever your application needs.

Keep each mode name **distinct from your element and preset names**. Naming a
mode after an element (a `python` mode showing the `python` element) makes one
word mean two things; the framework warns when an element, mode, or preset
name collides.

## Blocks or text on a tile

`render` says, per code element, whether a tile draws it as a mini block you
can drag or as its source text. Leaving it out means `block-based`, but
writing `block-based` out where a mode mixes both makes the file easier to
read, as in `side-by-side` above.

The text reads exactly as the codespace would write the block: field values and
slot defaults filled in (`for i in range(3):`), an empty slot as its type
marker (`[NUMBER]`).

Until 0.3, `render` sat on the preset's `toolbox` entry (`{ mode, render }`,
values `"block"` and `"text"`); `mount()` reports that place with the new one.

## The source element

A mode's **source element** is the first `type: "code"` element in its
`elements`. Views show it where nothing else names an element: without a
preset, every view shows the first mode's source element.

## Switching modes

The toolbox mode switches with a [preset](/concepts/presets-and-views/) or
`show({ toolbox: "conceptual" })`. Tiles redraw in place; the program is
untouched.

Each mode is backed by a CSS file that controls how its elements look; see
[Styling Modes](/guides/styling-modes/).

## Changing a mode's elements

A mode's element list can also change while the app runs, for example to let
the user pick what the tiles show:

```ts
engine.setModeElements("iconic", ["icon", "title"]);
```

The tiles redraw; the views are not affected. Your definitions file stays as
it is, and a new `mount()` starts from it again. Unknown element names are
refused.
