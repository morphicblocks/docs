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
    "python":     { "type": "code", "empty": { "Number": "0", "String": "\"text\"", "Boolean": "True", "default": "None" } },
    "javascript": { "type": "code", "empty": { "Number": "0", "String": "\"text\"", "Boolean": "true", "default": "null" } }
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

## `elementTypes`

Global registry mapping element names to their type. A value is either a bare
type string — `"text" | "code" | "image"` — or a config object:

```json
"python": {
  "type": "code",
  "empty": { "Number": "0", "String": "\"text\"", "Boolean": "True", "default": "None" }
}
```

The `empty` map provides defaults for **empty value slots** in text renderings,
keyed by the slot's `check` (`"Number"`, `"String"`, `"Boolean"`, plus
`"default"` for unchecked slots). With defaults set, a `print` block with
nothing attached renders as `print("text")` instead of `print()` — generated
text stays syntactically valid. See [Blocks & Elements](/concepts/blocks-and-elements/#element-types)
for what each type means.

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
| `default` | Block-level empty-default override (beats the `elementTypes` one)  |

## Template syntax

`code` element content is a template:

| Syntax       | Result                                                                 |
| ------------ | ---------------------------------------------------------------------- |
| `%1`, `%2`   | Input slot — a Blockly input *and* a substitution point in text views  |
| `%FIELDNAME` | Field value (uppercase token, e.g. `%NUM`) — substituted in text views |
| `<img …>`    | Image (Blockly `FieldImage` on workspace blocks)                       |
| Plain text   | Becomes a Blockly label field                                          |

**Whitespace is preserved as authored** in text renderings, and indentation
compounds across nesting:

```json
"python": "if %1:\n  %2"
```

renders multi-line with its body indented — nested blocks indent further
automatically.
