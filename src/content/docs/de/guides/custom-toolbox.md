---
title: Eigene Toolbox
description: Ersetze Blocklys Flyout durch HTML-Kacheln der Morphic Blocks.
---

Die eigene Toolbox ersetzt Blocklys eingebautes Flyout durch eine HTML-Toolbox
aus **Kacheln der Morphic Blocks**: keine Off-Screen-Blockly-Workspaces, nur DOM,
das du gestalten kannst. Gib `mount()` einen Container dafür:

```ts
engine.mount({
  workspaceContainer: document.getElementById("workspace")!,
  toolboxContainer: document.getElementById("toolbox")!,
});
```

Die Kategorien kommen aus den Definitionen. Um die Toolbox später oder mit
[Optionen](#optionen) einzurichten, nutze stattdessen `engine.mountToolbox()`:

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
| `modeLabel`  | `true`  | Kopfzeile oben in der Toolbox: `true` zeigt `Mode: <name>`, `false` keine, ein String diesen Text, eine Funktion `(mode) => text` ihr Ergebnis |
| `blocks`     | alle    | Nur eine Teilmenge der Blöcke zeigen (Liste von Identifiern) |
| `categories` | —       | Kategorie-Gruppierung; ohne diese und ohne `toolbox.categories` der Mount-Konfiguration rendern Blöcke als flache Liste |
| `highlight`  | `true`  | Code, der auf Kacheln als Text steht (`render: "text"`), mit dem [Highlighting](/de/guides/syntax-highlighting/) seines Elements färben, wie der Codespace; `false` lässt ihn schlicht |
| `touch`      | `true`  | Kacheln lassen sich mit Finger oder Stift ziehen; siehe [Touch und Tastatur](#touch-und-tastatur) |
| `keyboard`   | `true`  | Kacheln sind mit Tab erreichbar und werden mit Enter oder Leertaste hinzugefügt; siehe [Touch und Tastatur](#touch-und-tastatur) |

Alle lassen sich auch in `mount()` unter `toolbox` setzen, sodass auch eine
über `toolboxContainer` eingerichtete Toolbox sie bekommt:

```ts
engine.mount({
  workspaceContainer,
  toolboxContainer,
  toolbox: { modeLabel: false, blocks: ["text_print", "loop_for"] },
});
```

Optionen, die an `mountToolbox()` übergeben werden, haben Vorrang vor denen in
`mount()`.

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

## Touch und Tastatur

Die Toolbox funktioniert ohne Maus. Beides ist standardmäßig an und lässt sich
in den Toolbox-Optionen abschalten (`touch: false`, `keyboard: false`).

**Touch und Stift.** Eine Kachel bewegt sich, wenn sie seitwärts gezogen oder
lange gedrückt wird; eine Wischbewegung nach oben oder unten scrollt weiter
die Toolbox. Sie lässt sich auf dem Workspace und auf jedem Codespace ablegen.
Eine seitwärts angeordnete Toolbox gibt ihren Kacheln `touch-action: pan-x`,
sodass Wischen entlang der Toolbox scrollt und Wischen nach oben oder unten
zieht.

**Tastatur.** Jede Kachel ist ein Button in der Tab-Reihenfolge, für
Screenreader benannt nach dem, was sie zeigt: Code so, wie der Codespace ihn
schreiben würde, Text wie er ist und Bilder nach ihrem Alt-Text. Enter oder
Leertaste fügt den Block hinter dem ausgewählten ein, wenn er dort passt,
sonst als neuen Stapel, und wählt ihn aus, sodass erneutes Drücken eine Kette
baut. Der Fokus bleibt auf der Kachel. Gib dem Fokus einen sichtbaren Stil:

```css
.morphic-block:focus-visible { outline: 2px solid; }
```

Der Workspace selbst gehört Blockly. Um Blöcke dort mit der Tastatur zu
bewegen und zu bearbeiten, füge deiner App Blocklys Plugin für die
Tastaturnavigation hinzu; das Framework überlässt dir diese Wahl.

## Styling

Die Toolbox ist über strukturelle Klassen hinaus bewusst unstilisiert. Zielklassen:

```css
.morphic-block { /* jede Kachel */ }
.morphic-mode-iconic .morphic-element-title { /* pro Mode, pro Element */ }
[data-category="Output"] { /* Kategorie-Wrapper */ }
```

Siehe [Modes mit CSS gestalten](/de/guides/styling-modes/) für den vollständigen
CSS-Vertrag.

### Breite

Die Toolbox nimmt die Breite, die dein Layout ihr gibt; ein breiterer Block
wird abgeschnitten. Das Framework veröffentlicht den breitesten Block einer
Kachel als `--morphic-toolbox-block-width` am Toolbox-Container, aktualisiert
bei jedem neuen Zeichnen der Kacheln (Mode- oder Schriftwechsel). Die
Variable steht am Container, nutze sie also dort, plus deinem eigenen
Kachel-Innenabstand, und lass die Spalte darum auf seine Mindestbreite
wachsen:

```css
#toolbox {
  min-width: calc(var(--morphic-toolbox-block-width) + 40px);
}
.layout {
  grid-template-columns: minmax(250px, min-content) 1fr;
}
```

Nur Blöcke zählen, lange Beschreibungen, die umbrechen, verbreitern ihn also
nicht. Ohne eine solche Regel ändert sich nichts.

### Kacheln, die nur der Block sind

Eine Kachel hat keinen eigenen Hintergrund; jeder Rahmen um den Block kommt aus
deinem CSS. Um nur den Blockly-Block zu zeigen, gib der Toolbox einen Mode, der
nur das Code-Element auflistet, und lass sein CSS die Kachel genau so groß wie
den Block machen:

```json
"modes": [{ "name": "blocks", "elements": ["block"] }]
```

```css
.morphic-block.morphic-mode-blocks {
  background: none;
  border: 0;
  padding: 0;
  width: fit-content;
}
```
