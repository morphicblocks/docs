---
title: Selection Sync
description: Linked block ↔ text selection across all views.
---

With selection sync enabled, selecting a block highlights its corresponding
lines in every text view — and clicking a line in a text view selects the
block. It works across all mounted views: workspace, code editor, codespace,
and preview.

```ts
// after mount() and at least one of:
// mountCodeEditor / mountCodespace / mountPreview
engine.enableSelectionSync();
```

## How it works

Code generation produces **metadata** alongside the text — for each block, the
line range it occupies, including statement-input body ranges
(`generateJavaScriptWithMetadata()` exposes the same data). Selection sync
uses that mapping in both directions:

- **Block → code:** selecting a block in the workspace highlights its range in
  each text view.
- **Code → block:** clicking a line in a text view selects the block that owns
  it — and highlights its ranges in the *other* text views too.

Clicking an empty area in a text view clears the highlight everywhere.

## Options

```ts
engine.enableSelectionSync({
  highlightColor: "rgba(85, 189, 203, 0.25)",
  blockToCode: true,
  codeToBlock: true,
});
```

| Option           | Default | Purpose                                  |
| --- | --- | --- |
| `highlightColor` | semi-transparent blue | CSS background for highlighted lines |
| `blockToCode`    | `true`  | Enable the block → code direction        |
| `codeToBlock`    | `true`  | Enable the code → block direction        |

Turn it off with `engine.disableSelectionSync()`.

## Why it matters for transition

Linked highlighting is what makes side-by-side modes *teach*: a learner
clicks `print("hi")` in the Python codespace and sees the same statement
light up in the block workspace and the JavaScript preview — three
representations, visibly one program.
