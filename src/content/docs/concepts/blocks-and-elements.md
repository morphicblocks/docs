---
title: Blocks & Elements
description: The Morphic Block and its named elements.
---

The fundamental unit of the framework is the **Morphic Block**. It represents one
program construct (a print statement, a loop, a condition, …) and carries a set
of named **elements** — the visual parts it *can* show. Which parts it *does*
show is decided later, by [modes](/concepts/modes/).

## Elements

Elements are declared per block as a plain `name: content` map:

```json
{
  "identifier": "text_print",
  "elements": {
    "title":      "Print",
    "description":"Prints a value to the console",
    "concept":    "Output %1",
    "python":     "print(%1)",
    "javascript": "console.log(%1);"
  }
}
```

Element **names are free-form** — `title`, `icon`, `concept`, `python`,
`javascript` are conventions, not keywords. You invent the vocabulary that fits
your use case (natural languages, programming languages, verbosity levels, …).

## Element types

What an element name *means* is declared once, globally, in the `elementTypes`
registry — not repeated per block:

```json
{
  "elementTypes": {
    "icon":       "image",
    "title":      "text",
    "description":"text",
    "concept":    "code",
    "python":     "code"
  }
}
```

The type drives rendering behavior:

| Type    | Toolbox tile                            | Workspace block                                                        |
| ------- | --------------------------------------- | ---------------------------------------------------------------------- |
| `text`  | Rendered as HTML label                  | Never shown                                                            |
| `code`  | Rendered as Blockly SVG or source text  | Used as the Blockly template (`<img>` in content becomes a FieldImage) |
| `image` | Rendered as `<img>`                     | Never shown                                                            |

`code` elements use the [template syntax](/concepts/definitions-format/#template-syntax)
(`%1` input slots, `%FIELDNAME` fields, `<img>` tags) and double as the text
rendering for the codespace and preview views.

## The rendered tile

In the HTML toolbox, **all elements are always rendered**; the active mode's CSS
controls which are visible:

```html
<div class="morphic-block morphic-mode-iconic morphic-block-text_print"
     style="--morphic-block-color: #5C81A6">
  <div class="morphic-element-icon"><img src="assets/log.svg"></div>
  <div class="morphic-element-concept">Output <span class="morphic-slot"></span></div>
  <div class="morphic-element-python">print(...)</div>
  <div class="morphic-element-title">Print</div>
</div>
```

This is what your per-mode CSS targets — see
[Styling Modes](/guides/styling-modes/).

## Block identifiers

Block `identifier`s are free-form too — **including names that collide with
Blockly's built-ins** like `math_number` or `logic_boolean`. Internally the
framework registers every block as `morphic:<identifier>`, so your names can
never clobber the stock blocks (which the framework still uses for shadows,
placeholders, and connection checks).

You always work with the clean identifier: it keys the behaviors map, shadow
and placeholder references, and toolbox block lists. A reference resolves to
*your* block when it matches one of your definitions, and to the Blockly stock
type otherwise — `"shadow": "math_number"` keeps Blockly's number block, while
`"shadow": "my_number"` uses yours if you defined it.
