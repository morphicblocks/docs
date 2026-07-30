---
title: The Definitions Format
description: The definitions JSON, field by field.
---

Everything a block *is* lives in one JSON document. A complete, small example:

```json
{
  "elementTypes": {
    "icon":       "image",
    "title":      "text",
    "description":"text",
    "concept":    "code",
    "python": {
      "type": "code",
      "stringQuote": "\"",
      "empty": {
        "Number": { "shadow": "math_number", "fieldValues": { "NUM": "42" } },
        "String": { "shadow": "text", "fieldValues": { "TEXT": "world" } }
      }
    },
    "javascript": {
      "type": "code",
      "stringQuote": "\"",
      "empty": {
        "Number": { "shadow": "math_number", "fieldValues": { "NUM": "42" } },
        "String": { "shadow": "text", "fieldValues": { "TEXT": "world" } }
      }
    }
  },
  "modes": [
    { "name": "iconic",     "elements": ["icon", "title", "description"] },
    { "name": "conceptual", "elements": ["title", "concept"] },
    { "name": "python",     "elements": ["title", "python"] },
    { "name": "javascript", "elements": ["title", "javascript"] }
  ],
  "presets": [
    { "name": "iconic", "label": "Iconic", "toolbox": "iconic", "workspace": "conceptual" },
    { "name": "hybrid", "label": "Hybrid", "toolbox": "conceptual",
      "workspace": "conceptual", "codespace": "python", "preview": "javascript" }
  ],
  "categories": [
    { "name": "Output", "color": "#5C81A6" }
  ],
  "highlighting": {
    "python":     { "keywords": ["print", "if", "for", "in"], "strings": ["\"", "'"], "comment": "#" },
    "javascript": { "keywords": ["console", "if", "for", "let"], "strings": ["\"", "'"], "comment": "//" }
  },
  "blocks": [
    {
      "identifier": "text_print",
      "category": "Output",
      "elements": {
        "title":      "Print",
        "description":"Prints a value to the console",
        "concept":    "Output %1",
        "python":     "print(%1)",
        "javascript": "console.log(%1);"
      },
      "inputSlots": {
        "1": { "kind": "value", "name": "TEXT" }
      }
    }
  ]
}
```

## `$schema` and `version`

Point your file at the JSON Schema shipped with the package and editors
(VS Code, …) give **autocomplete and inline validation** as you type — the
author-time counterpart to the mount-time [validation](#validation):

```json
{
  "$schema": "./node_modules/morphic-blocks/definitions.schema.json",
  "version": 1,
  "blocks": [ /* … */ ]
}
```

`$schema` may be a relative path (to `morphic-blocks/definitions.schema.json`)
or a URL. `version` marks the format revision (currently `1`). Both are optional
and ignored by the framework at runtime.

## `elementTypes`

Global registry mapping element names to their type. A value is either a bare
type string — `"text" | "code" | "image"` — or a config object:

| Field | Applies to | Purpose |
| --- | --- | --- |
| `type` | all | `"text"`, `"code"`, or `"image"` |
| `empty` | `code` | Defaults for empty value slots (see [below](#shadows-placeholders-and-empty-slots)) |
| `stringQuote` | `code` | Delimiter wrapped around framework-supplied literals in `String`-checked slots, so the codespace renders `print("hello")` rather than `print(hello)`. Omit to disable quoting. |
| `size` | `image` | Display size when the value is a file path auto-wrapped as `<img>`: a number (`32` → 32×32), `"32"`, or `"32x32"`. Defaults to 16×16. |

See [Blocks & Elements](/concepts/blocks-and-elements/#element-types) for what
each type means.

## Shadows, placeholders, and empty slots

What should a value slot show when nothing is attached? An **empty-default
config** answers that, and appears in two places with the same shape:

- `elementTypes.<name>.empty` — per element (per "language"), keyed by the
  slot's `check` (`"Number"`, `"String"`, `"Boolean"`, …). A `default` key acts
  as a catch-all, used when the slot's check isn't listed or the slot has no
  `check` at all.
- `inputSlots.<n>.default` — per block slot; **highest priority**, beats the
  elementType-level lookup

The resolution order is `inputSlots.<n>.default` → `empty[<check>]` →
`empty.default`.

```json
"inputSlots": {
  "1": {
    "kind": "value", "name": "TEXT", "check": "String",
    "default": { "shadow": "text", "fieldValues": { "TEXT": "Hello, world!" } }
  }
}
```

| Field | Purpose |
| --- | --- |
| `shadow` | Blockly block type used as a **shadow** — ghosted, immutable, auto-replaced when a real block connects, restored when it disconnects. E.g. `"math_number"`, `"text"`, `"logic_boolean"`. |
| `placeholder` | Blockly block type attached as a **real block** on render — movable, editable, deletable. When both are set, the placeholder takes priority on the visible slot; Blockly's native shadow restoration brings the shadow back if the user removes the placeholder. |
| `fieldValues` | Initial values for the chosen block's fields, e.g. `{ "NUM": "42" }` for `math_number` or `{ "TEXT": "hello" }` for `text`. |

The `shadow` / `placeholder` values resolve against *your* block identifiers
first, then Blockly stock types — see
[Block identifiers](/concepts/blocks-and-elements/#block-identifiers). A
shadow's output type must be compatible with the slot's `check`, otherwise
Blockly silently rejects it.

A **shadow** default fills the slot in both views: the workspace shows the
ghosted block and the codespace shows its value, editable in place (so a `print`
with a `String` shadow renders `print("hello")` — text stays syntactically
valid). A **placeholder** seats a *real* block that, once deleted, leaves the
slot truly empty.

For a truly empty slot — a deleted placeholder, or no default at all — the
workspace shows an empty socket, and the codespace (which can't render
"nothing") shows a bracketed **type marker** derived from the slot's `check`:
`[NUMBER]`, `[TEXT]`, `[BOOL]`, or `[VALUE]` when the slot has no `check`. Fill
it by dragging a value block into the slot.

## `modes`

The list of mode definitions (`{ name, elements }`) — covered in detail in
[Modes](/concepts/modes/).

## `presets`

Named per-view mode assignments — covered in
[Presets & Views](/concepts/presets-and-views/).

## `categories`

Optional toolbox groupings. Blocks reference them by name:

```json
"categories": [{ "name": "Output", "color": "#5C81A6" }]
```

## `highlighting`

Optional syntax highlighting for the codespace and preview, **keyed by element
name** (a mode's source element already names the "language"):

| Field      | Meaning                                                              |
| ---------- | -------------------------------------------------------------------- |
| `keywords` | Words highlighted as keywords (exact token match)                    |
| `strings`  | String delimiters, e.g. `["\"", "'"]`                                |
| `comment`  | Line-comment marker, e.g. `"#"` or `"//"`                            |
| `numbers`  | Highlight numeric literals (default `true`)                          |
| `colors`   | Optional per-token-class color overrides (`keyword`, `string`, `number`, `comment`) |

No grammar files, no language plugins — see the
[Syntax Highlighting guide](/guides/syntax-highlighting/).

## `blocks`

A flat array of block definitions:

| Field                | Purpose                                             |
| -------------------- | --------------------------------------------------- |
| `identifier`         | Free-form block id (see [namespacing](/concepts/blocks-and-elements/#block-identifiers)) |
| `category`           | Optional category name                              |
| `elements`           | The `name: content` map of visual parts             |
| `inputSlots`         | Configuration of `%N` slots (below)                 |
| `fields`             | Inline field widgets — dropdown/text/number/checkbox (below) |
| `output`             | Value-block output type (e.g. `"Number"`)           |
| `previousStatement` / `nextStatement` | Statement connections            |
| `color`              | Block color (can also come from CSS)                |
| `tooltip`, `helpUrl`, `inputsInline` | Passed through to Blockly       |

### Input slots

`inputSlots` configures each `%N` placeholder, keyed by its number:

```json
"inputSlots": {
  "1": { "kind": "value", "name": "TEXT", "check": "String" }
}
```

| Field     | Purpose                                                            |
| --------- | ------------------------------------------------------------------ |
| `kind`    | `"value"` (expression input) or `"statement"` (nested body)        |
| `name`    | Blockly input name — behaviors read attached code via this name    |
| `check`   | Type check (`"Number"`, `"String"`, …), also keys empty defaults   |
| `label`   | Optional label text                                                |
| `align`   | Input alignment                                                    |
| `default` | Per-slot shadow/placeholder config — highest priority, beats the `elementTypes` `empty` lookup (see [Shadows, placeholders, and empty slots](#shadows-placeholders-and-empty-slots)) |

### Fields

Where `inputSlots` configures the `%N` **sockets** other blocks plug into,
`fields` declares the inline **widgets** that live on the block itself —
dropdowns, text boxes, number spinners, checkboxes — keyed by their
`%FIELDNAME` token:

```json
"elements": { "python": "%1 %OP %2" },
"fields": {
  "OP": {
    "type": "dropdown",
    "options": ["+", ["-", "−"], ["*", "×"], ["/", "÷"]],
    "default": "+"
  }
}
```

| Type       | Extra config                                   |
| ---------- | ---------------------------------------------- |
| `dropdown` | `options` (below), `default` (selected value)  |
| `text`     | `default`                                      |
| `number`   | `default`, `min`, `max`, `precision`           |
| `checkbox` | `default` (boolean)                            |

A dropdown **option** is one of:

| Form                             | Meaning                                    |
| -------------------------------- | ------------------------------------------ |
| `"=="`                           | value = label = `"=="`                     |
| `["-", "−"]`                     | `[value, label]` — value `-`, shown as `−` |
| `{ "value": "-", "label": "−" }` | object form                                |

The **value** is the source of truth: it is what the block *generates*,
serializes, and executes. The optional **label** is a display-only override
shown on the workspace block, so one option can show `÷` while the text views
and generated code use `/`. There is no separate serialization key — Blockly
stores the value.

#### Per-mode option text

`display` makes an option's *shown* text follow the active mode while the value
stays single — the same mode-awareness the element system gives content, now for
fields. It maps an **element name** (keyed like [`highlighting`](#highlighting))
to the text shown when that element renders, so Python source reads `True` while
JavaScript reads `true`, both storing and executing `true`:

```json
"fields": {
  "BOOL": {
    "type": "dropdown",
    "options": [
      { "value": "true",  "display": { "python": "True" } },
      { "value": "false", "display": { "python": "False" } }
    ],
    "default": "true"
  }
}
```

Resolution when element `E` renders: the workspace block shows
`display[E] ?? label ?? value`; the codespace and preview show
`display[E] ?? value` (`label` stays block-only). Execution, codegen, and
serialization always use the **value**. This is the *representation* axis only
(Python vs JavaScript spelling) — natural-language translation is a separate
concern. Only `dropdown` fields take `display`; `text`/`number` hold user data
or language-neutral values.

Fields outside these four types (variables, colour, plugin/custom) are attached
by a behavior's
[`onViewApplied`](/concepts/behaviors-and-codegen/#the-full-behavior-object)
instead — an undeclared `%FIELDNAME` token is left for the behavior to fill.

## Template syntax

`code` element content is a template:

| Syntax       | Result                                                                 |
| ------------ | ---------------------------------------------------------------------- |
| `%1`, `%2`   | Input slot — a Blockly input *and* a substitution point in text views  |
| `%FIELDNAME` | Inline field declared in [`fields`](#fields) (uppercase token, e.g. `%NUM`) — rendered on the block, substituted in text views |
| `<img …>`    | Image (Blockly `FieldImage` on workspace blocks)                       |
| Plain text   | Becomes a Blockly label field                                          |

**Whitespace is preserved as authored** in text renderings, and indentation
compounds across nesting:

```json
"python": "if %1:\n  %2"
```

renders multi-line with its body indented — nested blocks indent further
automatically.

## Validation

The framework checks your definitions when you `mount()`, so problems that would
otherwise fail silently at render time surface as clear messages naming the
block. It **throws** on structural breakage that guarantees wrong output, and
**warns** on config that is merely degraded or dead.

Throws (every problem is collected and reported at once):

- a block whose `code` elements disagree on their `%N` set — an input, and any
  block plugged into it, would vanish when switching modes
- a `%FIELDNAME` token with no [`fields`](#fields) entry and no `onViewApplied`
  to supply the field
- a `shadow` / `placeholder` that names neither one of your blocks nor a real
  Blockly type

Warns:

- a `%N` with no `inputSlots` entry, or an `inputSlots` entry with no matching `%N`
- an element name not declared in `elementTypes`, or a mode listing an element
  no block defines
- a `highlighting` key that isn't a `code` element
- an `elementTypes` config field on the wrong type — `stringQuote` or `empty` on
  a non-`code` element, or `size` on a non-`image` element — which is ignored
- a block `category` not listed in `categories`
- a name reused across element / mode / preset (see [Modes](/concepts/modes/))

To check a file *before* mounting — in a test or build step — call the exported
`validateDefinitions(...)`, which returns `{ errors, warnings }` instead of
throwing.
