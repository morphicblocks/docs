---
title: Toolbars
description: Pro-Pane-Toolbars mit Kopieren, Einfügen, Zoom, Undo und Redo.
---

Jedes Pane (Workspace, Codespace, Preview) kann seine eigene Toolbar einbinden.
Wie alles im Framework sind Toolbars **unstilisiert** — nur strukturelle
Klassen, das Styling gehört dir.

Gib `mount()` einen Container pro Pane, und jedes bekommt die Standard-Toolbar:

```ts
engine.mount({
  // …Container
  toolbarContainers: {
    workspace: document.getElementById("workspace-toolbar")!,
    codespace: document.getElementById("codespace-toolbar")!,
  },
});
```

Für [eigene Elemente](#eigene-elemente), oder um eine Toolbar später
hinzuzufügen, nutze `engine.mountToolbar()`:

```ts
engine.mountToolbar(document.getElementById("workspace-toolbar")!, {
  pane: "workspace",
});
```

## Standard-Elemente

Lässt du `items` weg, erhältst du die Standardwerte des Pane:

| Pane                    | Elemente                                                         |
| --- | --- |
| `workspace`, `codespace` | Mode-Label · Spacer · Undo · Redo · Kopieren · Einfügen · Zoom rein/raus/passend · Leeren |
| `preview`               | Mode-Label · Spacer · Kopieren · Zoom rein/raus/passend · Read-only-Badge |

Übergib `items: []`, um keine zu rendern, oder stelle eigene aus den
exportierten Factories zusammen:

```ts
import { toolbarItems } from "morphic-blocks";

engine.mountToolbar(el, {
  pane: "codespace",
  display: "both",   // "icon" (Standard) | "label" | "both"
  items: [
    toolbarItems.modeLabel(),
    toolbarItems.spacer(),
    toolbarItems.undo(),
    toolbarItems.redo(),
    toolbarItems.copy(),
  ],
});
```

## Block-bewusste Zwischenablage und Zoom

Toolbar-Aktionen laufen über pane-bewusste Engine-APIs, die du auch direkt
aufrufen kannst:

- `engine.copyActiveBlock(pane)` — kopiert den Block, dem die aktive
  Zeile/Auswahl gehört; spiegelt zudem den *Code-Text* des Blocks in die
  System-Zwischenablage.
- `engine.pasteActiveBlock(pane)` — fügt die interne Zwischenablage als echten
  Block ein (versetzt zum Original).
- `engine.zoomPane(pane, "in" | "out" | "fit")` — Blockly-Zoom im Workspace;
  Schriftgrößen-Skalierung in Codespace/Preview.

## Eigene Elemente

Ein Element ist ein einfaches Objekt:

```ts
{
  id: "run",                       // als data-toolbar-id für CSS gespiegelt
  align: "right",                  // "left" (Standard) | "right" des Spacers
  label: "Run",
  icon: "<svg …>…</svg>",          // Inline-SVG-String
  title: "Run the program",        // nativer Tooltip
  onClick: (ctx) => { /* ctx.engine, ctx.pane, ctx.refresh() */ },
  visible: (ctx) => true,          // Element weglassen, wenn false
  disabled: (ctx) => false,        // deaktiviert gerendert, wenn true
  // render: (ctx) => …            // Hintertür: vollständig eigenes DOM
}
```

Jeder Callback erhält den Toolbar-Kontext (`ctx.engine`, `ctx.pane`,
`ctx.refresh()`), sodass Elemente den Pane-Zustand lesen und ein Neurendern
anfordern können — genau so verfolgen die eingebauten Undo/Redo-Elemente ihren
Aktiviert-Zustand.

## Styling

```css
.morphic-toolbar { /* Container; hat auch data-morphic-pane="workspace" */ }
.morphic-toolbar-left, .morphic-toolbar-right { /* Element-Gruppen */ }
[data-toolbar-id="copy"] { /* einzelnes Element */ }
```
