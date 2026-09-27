---
title: Preview & Code Editor
description: Read-only source preview and the optional CodeMirror editor.
---

Two more text views complement the [codespace](/guides/codespace/):

| View            | Shows                                              | Editable |
| --- | --- | --- |
| **Preview**     | The preview mode's source element, rendered as text | No |
| **Code editor** | The *generated* JavaScript (via behaviors)          | No (display) |

Both are CodeMirror-based and lazy-loaded — they need the optional
[CodeMirror packages](/getting-started/installation/#optional-code-editor-packages).

## Preview

The preview renders whatever the preview mode's
[source element](/concepts/modes/#the-source-element) says — e.g. show
JavaScript alongside a Python codespace, so learners see two syntaxes of the
same program simultaneously:

```ts
await engine.mount({
  workspaceContainer,
  previewContainer: document.getElementById("preview")!,
  previewTheme,                  // optional, defaults to editorTheme
});
```

To set the preview up later, or with other options, use
`engine.mountPreview(container, options)`.

The preview mode comes from the active preset's `preview` key or
`setModes({ previewMode })`. Highlighting rules resolve automatically from the
definitions' [`highlighting` map](/guides/syntax-highlighting/); placeholder
markers are suppressed (they're an editing affordance, and the preview is
read-only by design).

Theme at runtime: `engine.setPreviewTheme(theme)`.

## Code editor

The code editor displays the output of `generateJavaScript()` — the
executable code your [behaviors](/concepts/behaviors-and-codegen/) produce —
and updates as the model changes:

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

It always shows **JavaScript** — the execution target — regardless of the
active modes, and unlike the preview it carries **no** definition highlighting
by default. So it's primarily a **developer aid**: a live look at what your
behaviors actually generate while building and debugging. For a reader-facing
view of the program, prefer the **preview**, which renders any mode's source
element *with* the definitions'
[syntax highlighting](/guides/syntax-highlighting/). The code editor stays
available whenever exposing the raw generated JavaScript is what you want.

## Shared options

`mountPreview` / `mountCodeEditor` (and `mountCodespace`) accept
`MorphicCodeEditorOptions`:

| Option           | Purpose                                                       |
| --- | --- |
| `theme`          | Visual theme (sensible defaults provided)                     |
| `extensions`     | Raw CodeMirror extensions, appended after the built-in ones   |
| `highlightRules` | Token-level highlighting override (defaults from definitions) |
| `onDelete`       | Install a delete keymap + gutter `✕` (codespace default)      |
| `canDragBlock`   | Show a grip gutter for draggable blocks                       |

The `extensions` escape hatch means anything CodeMirror can do — line
wrapping, custom keymaps, additional gutters — composes with the framework's
own behavior.

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

`mount()` takes two themes: `editorTheme` for the codespace and the code
editor, and `previewTheme` for the preview (it falls back to `editorTheme`).
A light page needs its own colors:

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

Change a theme at runtime with `setCodespaceTheme()`, `setPreviewTheme()` and
`setCodeEditorTheme()`, e.g. when the page switches between light and dark.
Token colors (keywords, strings, numbers) come from the definitions'
[`highlighting` map](/guides/syntax-highlighting/), not from the theme. On a
light theme, also set a visible
[selection highlight](/guides/selection-sync/#options).
