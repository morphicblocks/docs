---
title: Custom Toolbox
description: Replace Blockly's flyout with HTML Morphic Block tiles.
---

The custom toolbox replaces Blockly's built-in flyout with an HTML toolbox of
**Morphic Block tiles**: no off-screen Blockly workspaces, just DOM you can
style. Give `mount()` a container for it:

```ts
engine.mount({
  workspaceContainer: document.getElementById("workspace")!,
  toolboxContainer: document.getElementById("toolbox")!,
});
```

Categories come from the definitions. To set the toolbox up later, or with
[options](#options), use `engine.mountToolbox()` instead:

```ts
engine.mountToolbox(document.getElementById("toolbox")!, {
  categories: definitions.categories,
});
```

Dragging a tile into the workspace — or onto the
[codespace](/guides/codespace/) — creates the actual Blockly block in the
model.

## Options

| Option       | Default | Purpose                                                    |
| --- | --- | --- |
| `modeLabel`  | `true`  | Header at the top of the toolbox: `true` shows `Mode: <name>`, `false` none, a string that text, a function `(mode) => text` its result |
| `blocks`     | all     | Show only a subset of blocks (list of identifiers)         |
| `categories` | —       | Category grouping; with neither this nor the mount config's `toolbox.categories`, blocks render as a flat list |
| `highlight`  | `true`  | Colour code shown as text on tiles (`render: "text-based"`) with its element's [highlighting](/guides/syntax-highlighting/), like the codespace; `false` leaves it plain |
| `touch`      | `true`  | Tiles can be dragged with a finger or pen; see [Touch and keyboard](#touch-and-keyboard) |
| `keyboard`   | `true`  | Tiles can be reached with Tab and added with Enter or Space; see [Touch and keyboard](#touch-and-keyboard) |
| `layout`     | `"stacked"` | `"stacked"`: every category under its heading; `"tabs"`: a list of the category names and the tiles of the chosen one; see [Categories](#categories) |
| `categoryHeadings` | `true` | A heading with the category's name above its tiles |
| `collapsible` | `true` | A click on a heading collapses or expands its category |
| `collapsed`  | all open | `true` collapses all at the start, a list of names only those |
| `onCategoryToggle` | — | `(name, collapsed) => …`, e.g. to remember the state |
| `scrollbar`  | `false` | `false` hides the scrollbar and fades the edges where more tiles wait; `true` shows it; see [Scrolling](#scrolling) |
| `custom`     | — | How each `custom` element is drawn, by element name; see [Custom elements](/concepts/blocks-and-elements/#custom-elements) |

All of them can also be set in `mount()` under `toolbox`, so a toolbox set up by
`toolboxContainer` gets them too:

```ts
engine.mount({
  workspaceContainer,
  toolboxContainer,
  toolbox: { modeLabel: false, blocks: ["text_print", "loop_for"] },
});
```

Options passed to `mountToolbox()` win over the ones in `mount()`.

Category entries are `{ name, color?, blocks? }` — when a category omits its
`blocks` list, the framework derives it from block definitions whose
`category` field matches the name.

## Tiles and modes

Each tile renders **all** of a block's elements; the active toolbox mode's CSS
decides which are visible (see
[Blocks & Elements](/concepts/blocks-and-elements/#the-rendered-tile) for the
markup). The toolbox re-renders when the toolbox mode changes, via
`show({ toolbox })` or a preset switch, and honours the mode's
[`render`](/concepts/modes/#blocks-or-text-on-a-tile) for showing code
elements as blocks or as source text.

## Categories

With categories, each one gets a heading with its name. A click on it, or
Enter or Space, collapses or expands the category, and the state stays when the
tiles are drawn again (a mode or preset change). The markup:

```html
<div class="morphic-toolbox morphic-toolbox-stacked">
  <div data-category="output" data-collapsed style="--morphic-category-color: #5C81A6">
    <button class="morphic-category-heading" aria-expanded="false">Output</button>
    <div class="morphic-category-tiles" hidden>…tiles…</div>
  </div>
</div>
```

`layout: "tabs"` shows one category at a time, like Blockly's own toolbox: a
list of the names (`.morphic-category-tabs`, buttons `.morphic-category-tab`
with `aria-selected`) and the chosen category's tiles. The first is shown at
the start; tiles without a category stay in view. Where the list sits is your
CSS, for example beside the tiles:

```css
.morphic-toolbox-tabs { display: grid; grid-template-columns: auto 1fr; gap: 0.5rem; }
.morphic-category-tabs { display: flex; flex-direction: column; gap: 4px; }
.morphic-category-tab[aria-selected="true"] { background: var(--morphic-category-color); color: white; }
```

The toolbox's width counts every category, collapsed or not, so opening one
never widens it. Without categories the tiles are a flat list, and `"tabs"`
warns through `onWarning`.

## Scrolling

By default the toolbox hides its scrollbar and fades the edge where more tiles
wait above or below. The container gets classes to style that yourself:

| Class | While |
| --- | --- |
| `morphic-toolbox` | always |
| `morphic-toolbox-more-above` | tiles are hidden above |
| `morphic-toolbox-more-below` | tiles are hidden below |

The default styles have no weight (`:where()`), so any rule of yours wins, for
example a shadow instead of the fade:

```css
.morphic-toolbox-more-below { mask-image: none; box-shadow: inset 0 -12px 12px -12px rgb(0 0 0 / 0.3); }
```

`scrollbar: true` keeps the normal scrollbar (style it with `scrollbar-width`
and `scrollbar-color`); the classes stay. This works when the toolbox
container is the element that scrolls (`overflow-y: auto`).

## Touch and keyboard

The toolbox works without a mouse. Both ways are on by default, and each can
be turned off in the toolbox options (`touch: false`, `keyboard: false`).

**Touch and pen.** A tile starts moving when it is dragged sideways or after a
long press; an up or down swipe still scrolls the toolbox. It can be dropped on
the workspace and on every codespace. A toolbox laid out sideways gives its
tiles `touch-action: pan-x`, so a swipe along it scrolls and a swipe up or
down drags.

**Keyboard.** Every tile is a button in the Tab order, named for screen
readers after what it shows: code as the codespace would write it, text as it
is, and images by their alt text. Enter or Space adds the block
after the selected one when it fits there, else as a new stack, and selects
it, so pressing again builds a chain. Focus stays on the tile. Give the focus
a visible style:

```css
.morphic-block:focus-visible { outline: 2px solid; }
```

The workspace itself belongs to Blockly. To move and edit blocks there with
the keyboard, add Blockly's keyboard navigation plugin to your app; the
framework leaves that choice to you.

## Styling

The toolbox is intentionally unstyled beyond structural classes. Target:

```css
.morphic-block { /* every tile */ }
.morphic-mode-iconic .morphic-element-title { /* per mode, per element */ }
[data-category="Output"] { /* category wrapper */ }
```

See [Styling Modes](/guides/styling-modes/) for the full CSS contract.

### Width

The toolbox takes the width your layout gives it; a block or a line of code
wider than that is cut off. The framework publishes the widest block or code
shown as text (`render: "text-based"`) on a tile as
`--morphic-toolbox-block-width` on the toolbox container, updated whenever the
tiles are drawn again (a mode or font change). The variable is set on the
container, so use it there, adding your own tile padding, and let the column
around it grow to its minimum width:

```css
#toolbox {
  min-width: calc(var(--morphic-toolbox-block-width) + 40px);
}
.layout {
  grid-template-columns: minmax(250px, min-content) 1fr;
}
```

Only blocks and code count, since neither wraps; long descriptions, which wrap,
do not widen it. Code shown as text is measured on the page, so a toolbox that
is hidden while its tiles are drawn counts only its blocks until the next
redraw. Without such a rule nothing changes.

### Tiles that are just the block

A tile has no background of its own; any box around the block comes from your
CSS. To show nothing but the Blockly block, give the toolbox a mode that lists
only the code element, and let its CSS make the tile exactly as big as the
block:

```json
"modes": [{ "name": "blocks", "elements": ["block"] }]
```

```css
.morphic-block.morphic-mode-blocks {
  background: none;
  border: 0;
  padding: 0;
  width: fit-content;
}
```
