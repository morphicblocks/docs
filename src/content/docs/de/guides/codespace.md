---
title: Codespace
description: Eine über die Struktur editierbare Text-Ansicht des Workspace.
---

Der **Codespace** zeigt das Block-Modell als Text, geschrieben im
Code-Element, das er zeigt (`python`, `concept`), und
lässt Nutzer *das Programm über seine Struktur bearbeiten*: Ziehen, Ablegen,
Umsortieren und Editieren von Werten, alles gegen dasselbe zugrunde liegende
Blockly-Modell wie der Workspace. Es ist kein Freitext-Editieren; jede Änderung
ist eine Modell-Operation, sodass das Programm nie syntaktisch kaputtgehen kann.

## Einbinden

Ein Codespace ist ein [View](/de/concepts/presets-and-views/) der Art
`codespace`. Ohne deklarierte Views gibt es einen namens `codespace`; gib
`mount()` seinen Container, und es richtet den Codespace dort ein:

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
Welches Element der Codespace zeigt, legt das aktive
[Preset](/de/concepts/presets-and-views/) fest, oder zur Laufzeit
`show({ views: { codespace: "python" } })`.

**Headless-Modus:** Ohne Container für einen Workspace läuft Blockly headless
(offscreen): Das Block-Modell bleibt maßgeblich, während Nutzer nur Text sehen.

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
  schließende Zeile beendet, oder einen Wert, der als eigene Gruppe steht. Sind
  mehrere Zeilen ausgewählt (mit der Maus ziehen oder Umschalt und Pfeiltasten),
  entfernen Entf/Rücktaste oder das `✕` der Toolbar die Blöcke aller dieser
  Zeilen in einem Rückgängig-Schritt.

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
Text-Views (jedem Codespace) markiert das Framework die Zeilen jeder Gruppe
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

Die Optionen eines Codespace sitzen an seinem View in den `views` der
Definitionen (oder an `addView()` für einen
[zusätzlichen Codespace](/de/guides/added-views/)). Jede Art zu löschen ist
standardmäßig an und lässt sich mit `delete` abschalten:

```json
{
  "views": {
    "workspace": "workspace",
    "codespace": { "kind": "codespace", "delete": { "lineButtons": false } }
  }
}
```

| Option | Schaltet ab |
| --- | --- |
| `lineButtons` | das `✕` neben jeder Zeile, in der ein Block beginnt |
| `keys` | Entf und Rücktaste |
| `toolbarButton` | das `✕` der Toolbar für die ausgewählten Zeilen |

`editable: false` macht einen Codespace schreibgeschützt (siehe
[Schreibgeschützte Views](/de/guides/preview-and-code-editor/)), und `rtl`
setzt seine Richtung (siehe [Textrichtung](/de/guides/text-direction/)).

Theme zur Laufzeit: `engine.setViewTheme("codespace", theme)`.

## Verwandt

- [Schreibgeschützte Views & Code-Editor](/de/guides/preview-and-code-editor/), die schreibgeschützten Geschwister
- [Syntax-Highlighting](/de/guides/syntax-highlighting/) — den gerenderten Text einfärben
- [Selection-Sync](/de/guides/selection-sync/) — verknüpftes Hervorheben über Views hinweg
