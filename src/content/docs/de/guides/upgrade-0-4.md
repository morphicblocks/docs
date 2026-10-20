---
title: Auf 0.4 umsteigen
description: Was sich in 0.4.0 bewegt hat, und wie eine App umzieht.
---

0.4.0 ändert, wie Views eingerichtet werden und was sie zeigen. Jeder alte
Platz scheitert beim `mount()` mit einer Meldung, die den neuen nennt, so dass
eine App Schritt für Schritt umziehen kann.

## In den Definitionen

| Bis 0.3 | Seit 0.4 |
| --- | --- |
| `toolbox: { mode, render }` eines Presets | `toolbox: "<mode>"`, und `render` an diesem Mode |
| `render`-Werte `"block"`, `"text"` | `"block-based"`, `"text-based"` |
| Die Schlüssel `workspace`, `codespace`, `preview` eines Presets, mit Modes | `views: { <view>: <Code-Element> }` |
| Eine Preview | Ein View `{ "kind": "codespace", "editable": false }` |
| Vom Framework festgelegte Views | `views` deklariert sie mit Namen |

Vorher:

```json
{
  "presets": [
    { "name": "text", "toolbox": { "mode": "py", "render": { "python": "text" } },
      "codespace": "py", "preview": "js" }
  ]
}
```

Nachher:

```json
{
  "modes": [{ "name": "py", "elements": ["title", "python"], "render": { "python": "text-based" } }],
  "views": {
    "workspace": "workspace",
    "codespace": "codespace",
    "preview": { "kind": "codespace", "editable": false }
  },
  "presets": [
    { "name": "text", "toolbox": "py", "views": { "codespace": "python", "preview": "javascript" } }
  ]
}
```

Views zeigen jetzt ein **Code-Element** (`python`), keinen Mode (`py`); Modes
sind für die Toolbox-Kacheln. Eine Datei ohne `views` bekommt `workspace` und
`codespace`, so dass eine kleine App oft nur ihre Presets ändern muss.

## In der App

| Bis 0.3 | Seit 0.4 |
| --- | --- |
| `previewContainer` | `containers: { preview: element }` und ein deklarierter View |
| `workspaceContainer`, `codespaceContainer` | gehen weiter, kurz für `containers.workspace` / `.codespace` |
| `toolbarContainers` | `toolbars: { <view>: element }` |
| `previewTheme` | `themes: { <view>: theme }` |
| Die Mount-Option `codespace: { delete }` | `delete` am View des Codespace |
| `setModes({ … })` | `show({ toolbox, views: { <view>: <element> } })` |
| `getWorkspaceMode()`, `getCodespaceMode()`, `getPreviewMode()`, `getViewMode()` | `getViewElement(view)`, `getToolboxMode()` |
| `setCodespaceTheme()`, `setPreviewTheme()` | `setViewTheme(view, theme)` |
| `mountCodespace()`, `mountPreview()` | deklarierte Views, oder `addView()` |
| `addView({ kind: "preview", mode })` | `addView({ kind: "codespace", editable: false, element })` |
| `getMode()`, `setMode()` eines Handles | `getElement()`, `show(element)` |
| Ein zusätzlicher Workspace, standardmäßig schreibgeschützt | standardmäßig editierbar; `editable: false` |
| `toolbarItems.modeLabel()` („Mode: py") | `toolbarItems.viewLabel()` („python") |
| Toolbar-`pane`, `ctx.pane`, `data-morphic-pane` | `view`, `ctx.kind`, `data-morphic-kind` |
| `context.mode`, `proxy.mode` eines Behaviors | `context.element`, `proxy.element` (der Kontext einer Kachel behält `mode`) |

Lies in `onPresetApplied` `preset.views`, um zu wissen, welche Bereiche zu
zeigen sind:

```ts
onPresetApplied(preset) {
  for (const [name, pane] of Object.entries(panes)) pane.hidden = !(name in preset.views);
}
```

## Im CSS

Views und ihre Blöcke tragen das Element, das sie zeigen, keinen Mode:

| Bis 0.3 | Seit 0.4 |
| --- | --- |
| `.morphic-workspace-root.morphic-mode-py` | `.morphic-workspace-root.morphic-shows-python` |
| `.morphic-codespace-root.morphic-mode-py` | `.morphic-codespace-root.morphic-shows-python` |
| `.morphic-preview-root` | `.morphic-codespace-root.morphic-read-only` |

Kacheln behalten `morphic-mode-<mode>`, also bleibt Kachel-CSS, wie es ist.
Neue Klassen: `morphic-view-<name>` und `morphic-preset-<name>`, siehe
[Presets & Views](/de/concepts/presets-and-views/#klassen-für-dein-css).
