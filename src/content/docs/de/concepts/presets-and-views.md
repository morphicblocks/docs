---
title: Presets & Views
description: "Deklariere die Views, gib ihnen Container und sag, was jeder zeigt."
---

Das Programm erscheint in **Views**. Jeder View hat einen Namen und eine Art:

| Art         | Was es ist                                                          |
| ----------- | ------------------------------------------------------------------- |
| `workspace` | Eine Blockly-Fläche mit ziehbaren Blöcken                           |
| `codespace` | Eine Text-Ansicht desselben Block-Modells, über die Struktur editierbar |

Ein Codespace mit `editable: false` zeigt das Programm als Text,
schreibgeschützt (was 0.3 die Preview nannte). Neben den Views zeigt die
**Toolbox** die Kacheln, in einem [Mode](/de/concepts/modes/).

## Views deklarieren

Views werden in den Definitionen mit Namen deklariert:

```json
{
  "views": {
    "blocks": "workspace",
    "code": "codespace",
    "read": { "kind": "codespace", "editable": false }
  }
}
```

Eine bloße Art ist die Kurzform. Die Langform nimmt:

| Feld       | Zweck                                                                   |
| ---------- | ----------------------------------------------------------------------- |
| `kind`     | `"workspace"` oder `"codespace"`                                        |
| `editable` | Ob sich das Programm dort ändern lässt. Standard `true`                 |
| `rtl`      | Von rechts nach links (`true`) oder von links nach rechts (`false`); siehe [Textrichtung](/de/guides/text-direction/) |
| `delete`   | Wie Blöcke in einem Codespace gelöscht werden; siehe [Codespace](/de/guides/codespace/#optionen) |

Ohne `views` gibt es zwei: `workspace` und `codespace`.

Die App gibt Container mit Namen, und nur die Views, die einen bekommen,
werden eingerichtet. So dienen dieselben Definitionen einer ganzen Seite und
einer kleinen Einbettung:

```ts
engine.mount({
  containers: { blocks: blocksElement, code: codeElement, read: readElement },
  toolboxContainer,
});
```

`workspaceContainer` und `codespaceContainer` sind kurz für
`containers.workspace` und `containers.codespace`.

**Das Programm** liegt im ersten Workspace, der einen Container hat. Jeder
andere Workspace zeigt eine Kopie und schickt seine Änderungen dorthin. Ganz
ohne Workspace läuft Blockly verborgen, so dass auch ein Codespace allein ein
echtes Block-Modell bearbeitet. Das verborgene Programm zeigt, was ein Preset
dem ersten deklarierten Workspace gibt (einem `workspace`-View ohne
Container), etwa ein Element, das jedes Feld behält; ohne einen solchen folgt
es dem ersten View mit Container.

## Was ein View zeigt

Ein View zeigt ein **Code-Element**, keinen Mode: `"python"`, `"concept"`.
Modes sind für die Toolbox-Kacheln. Ohne Preset zeigt jeder View das erste
Code-Element des ersten Modes.

## Presets

Ein **Preset** sagt, was die Toolbox und jeder View zeigen:

```json
{
  "presets": [
    { "name": "start", "label": "Start", "toolbox": "iconic", "views": { "blocks": "concept" } },
    { "name": "both", "label": "Beides", "toolbox": "concept",
      "views": { "blocks": "concept", "code": "python", "read": "javascript" } },
    { "name": "text", "label": "Text", "toolbox": "python-text", "views": { "code": "python" } }
  ]
}
```

| Feld      | Pflicht | Zweck                                                |
| --------- | ------- | ---------------------------------------------------- |
| `name`    | ja      | Bezeichner des Presets                               |
| `label`   | nein    | Anzeigename (sonst `name`)                           |
| `toolbox` | ja      | Der [Mode](/de/concepts/modes/) der Kacheln          |
| `views`   | ja      | Das Code-Element, das jeder View zeigt, nach View-Name |

Die Views, die ein Preset aufführt, sind die, die es zeigt; Views, die es
weglässt, behalten, was sie zeigen. Ein Name, der kein deklarierter View ist,
warnt nur, denn ein [später hinzugefügter View](/de/guides/added-views/) kann
ihn tragen.

Gib Presets in den Definitionen (oder der Mount-Konfiguration) an und wechsle
zur Laufzeit:

```ts
engine.mount({
  containers,
  preset: "start",             // Start-Preset, standardmäßig das erste
  onPresetApplied(preset) {
    // die Bereiche der Views in preset.views zeigen, die anderen verbergen
  },
});

engine.applyPreset("both");    // nach Name oder Index
engine.getPresets();           // alle Presets, z. B. für deine Buttons
engine.getActivePreset();      // das zuletzt angewandte, z. B. um seinen Button zu markieren
```

Presets werden beim Mount geprüft: unbekannte Toolbox-Modes, Views, die kein
Code-Element zeigen, und doppelte Namen werden sofort gemeldet.

`onPresetApplied(preset)` ist dein Layout-Hook. Das Framework steuert nie dein
Seitenlayout: Es sagt dir, welche Views das Preset zeigt, und du ordnest die
Bereiche an. Nach dem Zeigen oder Verbergen eines Bereichs musst du den
Workspace nicht neu skalieren; das Framework zeichnet Blockly neu, sobald sich
die Größe seines Containers ändert.

## show()

Presets bündeln diese Wechsel; `show()` ist der Aufruf darunter, in derselben
Form:

```ts
engine.show({ toolbox: "python-text", views: { blocks: "concept", code: "python" } });
```

Alles Weggelassene bleibt, wie es ist.

## Klassen für dein CSS

Der Container jedes Views trägt Klassen, die du kombinieren kannst:

| Klasse | An |
| --- | --- |
| `morphic-view`, `morphic-view-<name>` | jedem View, und diesem View nach Name |
| `morphic-shows-<element>` | dem Element, das der View zeigt |
| `morphic-preset-<name>` | dem zuletzt angewandten Preset |
| `morphic-workspace-root`, `morphic-codespace-root` | der Art des Views |
| `morphic-read-only` | einem View mit `editable: false` |

Workspace-Blöcke tragen ebenfalls `morphic-shows-<element>`; Kacheln tragen
ihren Mode, `morphic-mode-<mode>`. Zum Beispiel eine Monospace-Schrift für
Python-Blöcke und ein Rand an jedem View in einem Preset:

```css
.morphic-workspace-root.morphic-shows-python .blocklyText { font-family: monospace; }
.morphic-view.morphic-preset-both { border-top: 3px solid #3776ab; }
```

## Den aktuellen Stand lesen

| Methode | Liefert |
| --- | --- |
| `getAvailableModes()` | jeden Mode-Namen aus den Definitionen |
| `getToolboxMode()` | den Mode der Kacheln |
| `getViewElement(name)` | das Element, das ein View zeigt, zusätzliche Views eingeschlossen |
| `getViewNames()` | die eingerichteten Views |

Alle liefern vor `mount()` `undefined` (oder eine leere Liste).
