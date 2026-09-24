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

Deklariere den Container beim `mount()`, dann binde den Codespace ein:

```ts
engine.mount({
  workspaceContainer,            // optional — siehe Headless-Modus unten
  codespaceContainer: document.getElementById("codespace")!,
  modes: definitions.modes,
  // …
});

await engine.mountCodespace();
```

`mountCodespace()` ist asynchron, weil CodeMirror verzögert geladen wird (siehe
[Installation](/de/getting-started/installation/#optional-pakete-für-den-code-editor)).
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
  Leiste.

Leere Value-Slots rendern ihre konfigurierten
[Empty-Defaults](/de/concepts/definitions-format/#shadows-placeholder-und-leere-slots)
oder eine editierbare `___`-Markierung, wenn keine gesetzt ist.

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
