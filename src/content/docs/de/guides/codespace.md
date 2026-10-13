---
title: Codespace
description: Eine über die Struktur editierbare Text-Ansicht des Workspace.
---

Der **Codespace** zeigt das Block-Modell als Text — gerendert aus dem
[Quell-Element](/de/concepts/modes/#das-quell-element) des Codespace-Mode — und
lässt Nutzer *das Programm über seine Struktur bearbeiten*: Ziehen, Ablegen,
Umsortieren und Editieren von Werten, alles gegen dasselbe zugrunde liegende
Blockly-Modell wie der Workspace. Es ist kein Freitext-Editieren; jede Änderung
ist eine Modell-Operation, sodass das Programm nie syntaktisch kaputtgehen kann.

## Einbinden

Gib `mount()` einen Container, und es richtet den Codespace dort ein:

```ts
await engine.mount({
  workspaceContainer,            // optional, siehe Headless-Modus unten
  codespaceContainer: document.getElementById("codespace")!,
  editorTheme,                   // optional
  // …
});
```

Das Warten auf `mount()` wartet auf den Codespace, weil CodeMirror verzögert
geladen wird (siehe
[Installation](/de/getting-started/installation/#optional-pakete-für-den-code-editor)).
Um ihn später mit anderen [Optionen](#optionen) neu einzurichten, rufe
`engine.mountCodespace(options)` auf.
Welchen Mode der Codespace zeigt, legt das aktive
[Preset](/de/concepts/presets-and-views/) fest, oder zur Laufzeit
`setModes({ codespaceMode })`.

**Headless-Modus:** `mount()` akzeptiert `workspaceContainer`,
`codespaceContainer` oder beides. Nur mit einem `codespaceContainer` läuft
Blockly headless (offscreen) — das Block-Modell bleibt maßgeblich, während
Nutzer nur Text sehen.

## Was Nutzer tun können

- **Aus der Toolbox ablegen** — auf den Codespace gezogene Kacheln fügen Blöcke
  ein, mit Positionsanzeige. Drops landen in echten Slots: in leeren `for`/`if`-
  Rümpfen, zwischen Anweisungen und in **Value-Slots** (Zahlen, Strings,
  Variablen).
- **Per Griff umsortieren** — eine Griffleiste (`⋮⋮`) erscheint auf ziehbaren
  Blockzeilen; das Ziehen daran verschiebt den Block, inklusive Umsortieren in
  derselben Kette.
- **Rechtsklick-Ziehen** (oder Ctrl-Klick auf macOS) — direkt aus dem Text eines
  Blocks ziehen, mit Hover-Hinweisen: blaue Kontur am innersten editierbaren
  Wert, grauer Hintergrund am umschließenden Block.
- **Werte inline editieren** — ein Klick auf einen editierbaren Platzhalter
  (Text, Zahl, Dropdown) legt eine Eingabe über den exakten Bereich;
  [Shadows](/de/concepts/definitions-format/#shadows-placeholder-und-leere-slots)
  materialisieren beim ersten Editieren zu echten Blöcken.
- **Löschen** — Entf/Rücktaste auf der Zeile eines Blocks oder das `✕` in der
  Leiste entfernt den Block, zu dem die Zeile gehört, mit allem darin, wie im
  Workspace: die Anweisung, die in der Zeile beginnt, den Block, den eine
  schließende Zeile beendet, oder einen Wert, der als eigene Gruppe steht.

Drops folgen denselben Verbindungsprüfungen wie der Workspace: Ein Block landet
nur dort, wo seine Verbindungen passen (ein Wert nur in einem Slot, dessen
`check` seinen Typ annimmt), und ein abgelehnter Drop ändert nichts. Ein Wert,
der auf einen belegten Slot fällt, behält den alten Wert, wie im Workspace:
Der alte landet im einzigen Slot des neuen Blocks, der ihn annimmt, sonst in
einer eigenen Zeile unter den anderen.

Leere Value-Slots rendern ihre konfigurierten
[Empty-Defaults](/de/concepts/definitions-format/#shadows-placeholder-und-leere-slots)
oder eine editierbare `___`-Markierung, wenn keine gesetzt ist.

## Gruppen von Blöcken

Verbundene Blöcke bilden eine Gruppe, wie ein Stapel im Workspace. In den
Text-Views (Codespace, Previews) markiert das Framework die Zeilen jeder Gruppe
mit Klassen. Der Text selbst und seine Zeilennummern bleiben unverändert:

| Klasse | An |
| --- | --- |
| `morphic-group-start` | der ersten Zeile einer Gruppe |
| `morphic-group-end` | der letzten Zeile einer Gruppe |
| `morphic-group-line` | jeder Zeile einer Gruppe mit mehr als einer Zeile |
| `morphic-group-odd` / `morphic-group-even` | jeder Zeile jeder zweiten Gruppe |
| `morphic-group-hover` | jeder Zeile der Gruppe unter der Maus |

Die Zeilennummern tragen dieselben Klassen. Ohne eigenes CSS ändert sich nichts.
Einige Ideen:

**1. Abstand zwischen Gruppen**, der wie eine Leerzeile aussieht, ohne eine
hinzuzufügen. Der Abstand kommt unter jede Gruppe, so bleibt jede Zeilennummer
an ihrer Zeile:

```css
.cm-content .cm-line.morphic-group-end:not(:last-child) { padding-bottom: 1lh; }
```

**2. Ein Balken entlang jeder Gruppe:**

```css
.cm-content .morphic-group-line { box-shadow: inset 3px 0 0 #c9d6e3; }
```

**3. Jede zweite Gruppe getönt:**

```css
.cm-content .morphic-group-even { background: rgb(0 0 0 / 0.03); }
```

**4. Eine Trennlinie zwischen Gruppen:**

```css
.cm-content .morphic-group-start:not(:first-child) { border-top: 1px dashed #d0d7de; }
```

**5. Die Gruppe unter der Maus:**

```css
.cm-content .morphic-group-hover { box-shadow: inset 3px 0 0 #00509b; }
```

Der Block unter der Maus (Codespace) und der ausgewählte Block sind schon
hervorgehoben, ein Balken bleibt daher leichter von ihnen zu unterscheiden als
ein Hintergrund. Ein Hintergrund geht auch (`background: rgb(0 80 155 / 0.06)`).
Um nur die Gruppen zu zeigen, schalte die anderen Hervorhebungen aus:

```css
.cm-content .morphic-hover-target { background: none; }    /* Block unter der Maus */
.cm-content .morphic-editable-hover { outline: none; }     /* Kontur eines editierbaren Werts */
.cm-content { --morphic-highlight-color: transparent; }    /* ausgewählter Block */
```

## Optionen

`mountCodespace(options?)` nimmt dieselben Optionen wie der Code-Editor
(`theme`, `extensions`, `highlightRules`, …). Zwei haben codespace-spezifische
Standardwerte, die du überschreiben kannst:

| Option         | Standardverhalten                                          |
| --- | --- |
| `onDelete`     | Löscht den Block in der angegebenen Zeile aus dem Modell    |
| `canDragBlock` | Griffe erscheinen für alle beweglichen Blöcke (Statement und Value) |

Theme zur Laufzeit: `engine.setCodespaceTheme(theme)`.

## Verwandt

- [Preview & Code-Editor](/de/guides/preview-and-code-editor/) — die schreibgeschützten Geschwister
- [Syntax-Highlighting](/de/guides/syntax-highlighting/) — den gerenderten Text einfärben
- [Selection-Sync](/de/guides/selection-sync/) — verknüpftes Hervorheben über Views hinweg
