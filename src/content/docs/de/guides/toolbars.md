---
title: Toolbars
description: Toolbars pro View mit Kopieren, Einfügen, Zoom, Undo und Redo.
---

Jeder View kann seine eigene Toolbar haben. Wie alles im Framework sind
Toolbars **unstilisiert**: nur strukturelle Klassen, das Styling gehört dir.

Gib `mount()` einen Container pro View, nach View-Name, und jeder bekommt die
Standard-Toolbar:

```ts
engine.mount({
  // …Container
  toolbars: {
    workspace: document.getElementById("workspace-toolbar")!,
    codespace: document.getElementById("codespace-toolbar")!,
  },
});
```

Für [eigene Elemente](#eigene-elemente), oder um eine Toolbar später
hinzuzufügen, nutze `engine.mountToolbar()`:

```ts
engine.mountToolbar(document.getElementById("workspace-toolbar")!, { view: "workspace" });
```

Eine Toolbar wirkt auf einen View nach Name, deklariert oder
[hinzugefügt](/de/guides/added-views/) (ein hinzugefügter kann seine auch über
`addView({ toolbar })` mitbringen).

## Standard-Elemente

Lässt du `items` weg, erhältst du die Standardwerte der Art des Views:

| View                    | Elemente                                                         |
| --- | --- |
| `workspace` | View-Label · Spacer · Undo · Redo · Kopieren · Einfügen · Zoom rein/raus/passend · Leeren |
| `codespace` | View-Label · Spacer · Undo · Redo · Kopieren · Einfügen · Löschen · Zoom rein/raus/passend · Leeren |
| schreibgeschützt (`editable: false`) | View-Label · Spacer · Kopieren · Zoom rein/raus/passend · Read-only-Badge |

Das View-Label nennt das Element, das der View zeigt (`python`).

Übergib `items: []`, um keine zu rendern, oder stelle eigene aus den
exportierten Factories zusammen:

```ts
import { toolbarItems } from "morphic-blocks";

engine.mountToolbar(el, {
  view: "codespace",
  display: "both",   // "icon" (Standard) | "label" | "both"
  items: [
    toolbarItems.viewLabel(),
    toolbarItems.spacer(),
    toolbarItems.undo(),
    toolbarItems.redo(),
    toolbarItems.copy(),
  ],
});
```

## Block-bewusste Zwischenablage und Zoom

Toolbar-Aktionen laufen über Engine-APIs, die du auch direkt aufrufen kannst.
Jede nimmt einen View-Namen:

- `engine.copyActiveBlock(view)` — kopiert den Block, dem die aktive
  Zeile/Auswahl gehört; spiegelt zudem den *Code-Text* des Blocks in die
  System-Zwischenablage.
- `engine.pasteActiveBlock(view)` — fügt die interne Zwischenablage als echten
  Block ein (versetzt zum Original).
- `engine.hasClipboardContents()`: ob ein Block zum Einfügen bereitliegt, etwa
  um einen eigenen Einfügen-Button zu deaktivieren.
- `engine.deleteSelectedLines(view)`: löscht die Blöcke der in einem Codespace
  ausgewählten Zeilen; `engine.hasSelectedLines(view)` sagt, ob welche
  ausgewählt sind, etwa um einen eigenen Button freizugeben.
- `engine.zoomPane(view, "in" | "out" | "fit")` — Blockly-Zoom in einem
  Workspace; Schriftgrößen-Skalierung in einer Text-View.

## Eigene Elemente

Ein Element ist ein einfaches Objekt:

```ts
{
  id: "run",                       // als data-toolbar-id für CSS gespiegelt
  align: "right",                  // "left" (Standard) | "right" des Spacers
  label: "Run",
  icon: "<svg …>…</svg>",          // Inline-SVG-String
  title: "Run the program",        // nativer Tooltip
  onClick: (ctx) => { /* ctx.engine, ctx.view, ctx.refresh() */ },
  visible: (ctx) => true,          // Element weglassen, wenn false
  disabled: (ctx) => false,        // deaktiviert gerendert, wenn true
  // render: (ctx) => …            // Hintertür: vollständig eigenes DOM
}
```

Jeder Callback erhält den Toolbar-Kontext (`ctx.engine`, `ctx.kind` für die Art
des Views, `ctx.readOnly`, `ctx.view` für seinen Namen, `ctx.refresh()`); gib `ctx.view` an die
Engine-APIs oben weiter. So können Elemente den Zustand der View lesen und ein
Neurendern anfordern; genau so verfolgen die eingebauten Undo/Redo-Elemente
ihren Aktiviert-Zustand.

## Styling

```css
.morphic-toolbar { /* Container; hat auch data-morphic-kind="workspace" und data-morphic-view="…" */ }
.morphic-toolbar-left, .morphic-toolbar-right { /* Element-Gruppen */ }
[data-toolbar-id="copy"] { /* einzelnes Element */ }
```
