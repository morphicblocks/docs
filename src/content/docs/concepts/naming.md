---
title: Naming
description: How to name elements, modes, presets, views and categories so the code reads clearly.
---

Every name in the definitions is yours: elements, modes, presets, views and
categories. The framework only warns about two things; everything else on this
page is a recommendation that keeps an app's code easy to read.

## What the framework warns about

**A name used for two kinds.** One word for an element and a view, or a mode
and a preset, makes the reader guess which one is meant:

```jsonc
"views":   { "python": "codespace" },                    // a view called python…
"presets": [{ "views": { "python": "python" } }]         // …showing the python element
```

**A framework word as a name.** These words already mean something in Morphic
Blocks, so as your own names they read like the framework's:

| Category | Words |
| --- | --- |
| View kinds | `workspace`, `codespace`, `preview` |
| Element types | `text`, `code`, `image`, `custom` |
| Parts of the definitions | `element`, `mode`, `preset`, `view`, `category`, `block`, `blocks`, `tile`, `tiles`, `toolbox` |

Both are warnings, not errors. The framework's own default views, `workspace`
and `codespace` (used when the definitions declare no `views`), do not warn.
One name is reserved: an element cannot be called `default`, since that names
a block's fallback template.

## A pattern per kind

A suffix tells a reader at a glance which kind a name is. These are the
recommended ones; any clear, consistent pattern works as well.

| Kind | Recommended | Alternatives | Examples |
| --- | --- | --- | --- |
| element | a plain word for the content | | `concept`, `python`, `icon`, `description` |
| mode | `…-tiles` | `…-mode` | `icon-tiles`, `python-text-tiles`, `expert-tiles` |
| preset | `…-preset` | `…-step`, `…-level`, `…-layout` | `icon-preset`, `concept-step`, `java-level`, `compare-layout` |
| view | `…-pane` | `…-view` | `editor-pane`, `text-pane`, `read-pane` |
| category | a word learners read | | `Output`, `Loops`, `Variables` |

**Why `tiles` and `pane`.** They say what people see: a mode decides how the
toolbox tiles look, and a view sits in a pane of the page. `expert` works as a
mode name, but `expert-tiles` says what it is. They also keep the CSS classes
readable, since the framework writes the kind into them already:
`morphic-mode-icon-tiles` and `morphic-view-editor-pane`, where `icon-mode` or
`editor-view` would repeat it.

**Why `preset` has alternatives.** A preset is often one step of a learning
path (`concept-step`), a level (`java-level`) or a page layout
(`compare-layout`). The more specific word says more; `…-preset` fits every
case.

## Writing names

Names are recommended in **kebab-case** (`editor-pane`), the usual style for
anything that ends up in CSS. In JavaScript a view name is then a quoted key,
which also sets the app's own names apart from the framework's options:

```ts
engine.mount({
  containers: { "editor-pane": blocksElement, "read-pane": readElement },
  themes: { "read-pane": readTheme },
});
```

Other styles work the same way. The framework keeps every name as written in
its classes, so `iconTiles` gives `morphic-mode-iconTiles` and `title_en`
gives `morphic-element-title_en`; only characters a class cannot hold (a
space, `&`) become `-`. camelCase saves the quotes in JavaScript
(`containers: { editorPane: el }`, though `{ "editorPane": el }` works too),
and underscores suit element names that carry a language (`title_en`,
`pseudo_de`). A single word needs no suffix or style at all: `title`,
`python`. Pick one style per app and keep it.

A name with characters a class cannot hold warns and names the class it gets
instead: `my pane` becomes `morphic-view-my-pane`. Category names are labels
learners read, so spaces there are fine and do not warn; their class follows
the same rule: `Output & Text` becomes `morphic-category-Output-Text` and
`data-category="Output-Text"`.

## The names in these docs

The examples across these pages use one set of names:

| Name | Kind | What it is |
| --- | --- | --- |
| `title`, `icon`, `description` | elements | a tile's label, picture and help text |
| `concept` | element | the block in plain words (`Output %1`) |
| `python`, `javascript` | elements | the block in each language |
| `icon-tiles` | mode | tiles with icon, title and description |
| `concept-tiles`, `python-tiles` | modes | tiles showing that element as a block |
| `python-text-tiles` | mode | tiles showing Python as text |
| `icon-preset`, `hybrid-preset`, `text-preset` | presets | the steps from icons to Python text |
| `editor-pane`, `text-pane`, `read-pane` | views | the blocks, the editable text, the read only text |

The default views `workspace` and `codespace` appear where an example needs no
`views` of its own.
