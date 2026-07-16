---
title: Eigene Toolbox
description: Ersetze Blocklys Flyout durch HTML-Kacheln der Morphic Blocks.
---

`engine.mountToolbox()` ersetzt Blocklys eingebautes Flyout durch eine
HTML-Toolbox aus **Kacheln der Morphic Blocks** — keine Off-Screen-Blockly-
Workspaces, nur DOM, das du gestalten kannst:

```ts
engine.mountToolbox(document.getElementById("toolbox")!, {
  categories: definitions.categories,
});
```

Eine Kachel in den Workspace zu ziehen — oder auf den
[Codespace](/de/guides/codespace/) — erzeugt den tatsächlichen Blockly-Block im
Modell.

## Optionen

| Option       | Standard | Zweck                                                      |
| --- | --- | --- |
| `modeLabel`  | `true`  | Eine `Mode: <name>`-Kopfzeile oben in der Toolbox rendern   |
| `blocks`     | alle    | Nur eine Teilmenge der Blöcke zeigen (Liste von Identifiern) |
| `categories` | —       | Kategorie-Gruppierung; fällt auf `toolbox.categories` der Mount-Konfiguration zurück; ohne beides rendern Blöcke als flache Liste |

Kategorie-Einträge sind `{ name, color?, blocks? }` — lässt eine Kategorie ihre
`blocks`-Liste weg, leitet das Framework sie aus den Block-Definitionen ab,
deren `category`-Feld zum Namen passt.

## Kacheln und Modes

Jede Kachel rendert **alle** Elements eines Blocks; das CSS des aktiven
Toolbox-Mode entscheidet, welche sichtbar sind (siehe
[Blocks & Elements](/de/concepts/blocks-and-elements/#die-gerenderte-kachel)
für das Markup). Die Toolbox rendert neu, wenn sich der Toolbox-Mode ändert —
über `setModes({ toolboxMode })` oder einen Preset-Wechsel — und respektiert die
[Render-Überschreibung](/de/concepts/presets-and-views/#die-toolbox-render-überschreibung)
des Preset, um Code-Elements als Blöcke oder als Quelltext zu zeigen.

## Styling

Die Toolbox ist über strukturelle Klassen hinaus bewusst unstilisiert. Zielklassen:

```css
.morphic-block { /* jede Kachel */ }
.morphic-mode-iconic .morphic-element-title { /* pro Mode, pro Element */ }
[data-category="Output"] { /* Kategorie-Wrapper */ }
```

Siehe [Modes mit CSS gestalten](/de/guides/styling-modes/) für den vollständigen
CSS-Vertrag.
