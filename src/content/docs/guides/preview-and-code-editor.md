---
title: Read Only Views & Code Editor
description: A codespace that only shows the program, and the optional CodeMirror editor.
---

Two more text views complement the [codespace](/guides/codespace/):

| View            | Shows                                              | Editable |
| --- | --- | --- |
| **Read only codespace** | The program as text, in the element it shows | No |
| **Code editor** | The *generated* JavaScript (via behaviors)          | No (display) |

Both are CodeMirror-based and lazy-loaded; they need the optional
[CodeMirror packages](/getting-started/installation/#optional-code-editor-packages).

## Read only codespace

A codespace with `editable: false` shows the program as text without letting
it change, e.g. JavaScript beside a Python codespace, so learners see two
syntaxes of the same program at once. Until 0.4.0 this was the preview.

```json
{
  "views": {
    "blocks": "workspace",
    "code": "codespace",
    "read": { "kind": "codespace", "editable": false }
  },
  "presets": [
    { "name": "both", "toolbox": "conceptual", "views": { "blocks": "concept", "code": "python", "read": "javascript" } }
  ]
}
```

```ts
await engine.mount({
  containers: { blocks: blocksElement, code: codeElement, read: readElement },
  themes: { read: readTheme },   // optional, defaults to editorTheme
});
```

What it shows comes from the preset or `show({ views: { read: "javascript" } })`.
Highlighting resolves from the shown element's
[`highlighting`](/guides/syntax-highlighting/); the value markers of the
codespace are left out, since nothing can be edited there. Its container gets
`morphic-read-only` beside `morphic-codespace-root`.

Theme at runtime: `engine.setViewTheme("read", theme)`.

## Code editor

The code editor displays the output of `generateJavaScript()`, the executable
code your [behaviors](/concepts/behaviors-and-codegen/) produce, and updates
as the model changes:

```ts
await engine.mount({
  workspaceContainer,
  codeEditorContainer: document.getElementById("editor")!,
  editorTheme,                   // optional
});

engine.showCodeEditor();         // it starts hidden
engine.hideCodeEditor();
engine.isCodeEditorVisible();
engine.setCodeEditorTheme(theme);
```

It always shows **JavaScript**, the execution target, whatever the views show,
and it carries **no** definition highlighting by default. So it's primarily a
**developer aid**: a live look at what your behaviors actually generate while
building and debugging. For a reader-facing view of the program, prefer a
read only codespace, which shows any code element *with* the definitions'
[syntax highlighting](/guides/syntax-highlighting/).

## Shared options

`mountCodeEditor(container, options)` accepts `MorphicCodeEditorOptions`:

| Option           | Purpose                                                       |
| --- | --- |
| `theme`          | Visual theme (sensible defaults provided)                     |
| `extensions`     | Raw CodeMirror extensions, appended after the built-in ones   |
| `highlightRules` | Token-level highlighting override                             |

The `extensions` escape hatch means anything CodeMirror can do (line wrapping,
custom keymaps, additional gutters) composes with the framework's own
behavior.

## Themes

The text views are **dark by default**. A theme is a plain object; every field
is optional and falls back to the default:

| Field                 | Default     | Purpose                              |
| --- | --- | --- |
| `background`          | `#1e1e1e`   | Editor background                    |
| `foreground`          | `#d4d4d4`   | Default text color                   |
| `gutterBackground`    | `#1e1e1e`   | Background of the line number column |
| `gutterForeground`    | `#858585`   | Line number color                    |
| `selectionBackground` | `#264f78`   | Background of selected text          |
| `fontFamily`          | `monospace` | Font of the code                     |
| `fontSize`            | `14px`      | Size of the code                     |
| `lineHeight`          | `1.5`       | Line spacing, as a multiplier        |

`editorTheme` colours every text view and the code editor; `themes` gives
single views their own, by view name. A light page needs its own colors, or a
ready-made theme from [`@morphicblocks/themes`](/guides/themes/):

```ts
await engine.mount({
  // …containers
  editorTheme: {
    background: "#ffffff",
    foreground: "#1f2933",
    gutterBackground: "#f7f8f9",
    gutterForeground: "#9aa3ab",
    selectionBackground: "#d3ebe7",
  },
});
```

Change a theme at runtime with `setViewTheme(view, theme)` and
`setCodeEditorTheme(theme)`, e.g. when the page switches between light and
dark. Token colors (keywords, strings, numbers) come from each code element's
[`highlighting`](/guides/syntax-highlighting/), not from the theme. On a
light theme, also set a visible
[selection highlight](/guides/selection-sync/#options).
