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
await engine.mountPreview(document.getElementById("preview")!);
```

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
await engine.mountCodeEditor(document.getElementById("editor")!, { theme });

engine.showCodeEditor();
engine.hideCodeEditor();
engine.isCodeEditorVisible();
engine.setCodeEditorTheme(theme);
```

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
