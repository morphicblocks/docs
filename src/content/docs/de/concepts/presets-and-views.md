---
title: Presets & Views
description: "Weise jedem View einen Mode zu: Toolbox, Workspace, Codespace, Preview."
---

Morphic Blocks rendert in bis zu vier **Views**:

| View        | Was es ist                                                        |
| ----------- | ----------------------------------------------------------------- |
| `toolbox`   | HTML-Kacheln, aus denen der Nutzer Blöcke zieht                    |
| `workspace` | Die Blockly-Fläche mit ziehbaren Blöcken                           |
| `codespace` | Eine über die Struktur editierbare *Text*-Ansicht desselben Modells |
| `preview`   | Eine schreibgeschützte Text-Ansicht (z. B. JavaScript neben Python) |

Jeder View rendert **dasselbe Block-Modell**, jeder in seinem eigenen
[Mode](/de/concepts/modes/). Ein **Preset** ist eine benannte Zuordnung von
Modes zu Views:

```json
{
  "presets": [
    { "name": "iconic", "label": "Iconic", "toolbox": "iconic", "workspace": "conceptual" },
    { "name": "hybrid", "label": "Hybrid",
      "toolbox": "conceptual", "workspace": "conceptual",
      "codespace": "python", "preview": "javascript" },
    { "name": "text", "label": "Text",
      "toolbox": { "mode": "python", "render": { "python": "text" } },
      "codespace": "python" }
  ]
}
```

| Feld        | Erforderlich | Zweck                                                    |
| ----------- | ------------ | -------------------------------------------------------- |
| `name`      | ja           | Preset-Identifier                                        |
| `label`     | nein         | Anzeige-Label (fällt auf `name` zurück)                  |
| `toolbox`   | ja           | Toolbox-Mode, oder `{ mode, render }` (siehe unten)      |
| `workspace` | nein*        | Mode für den Block-Workspace                             |
| `codespace` | nein*        | Mode, dessen Quell-Element der Codespace rendert          |
| `preview`   | nein         | Mode, dessen Quell-Element die schreibgeschützte Preview rendert |

\* Mindestens ein Editier-Bereich (`workspace` oder `codespace`) muss gesetzt
sein. **Das Vorhandensein eines View-Schlüssels bedeutet, dass dieser View
gezeigt wird** — Workspace und Codespace können gleichzeitig sichtbar sein, in
verschiedenen Modes.

## Die Toolbox-Render-Überschreibung

Der `toolbox`-Eintrag eines Preset ist entweder:

- ein **Mode-Name** — alle `code`-Elements des Mode rendern als ziehbare
  Mini-Blöcke, oder
- ein **Objekt** `{ mode, render }` — wobei `render` Element-Namen auf
  `"block"` oder `"text"` abbildet und so überschreibt, wie jedes
  `code`-Element auf der Kachel rendert.

`{ "mode": "python", "render": { "python": "text" } }` zeigt das
Python-Template als Quelltext auf der Kachel statt als Block. Weil diese
Entscheidung im Preset liegt, kann derselbe Mode in verschiedenen Presets
unterschiedlich rendern.

Jedes `code`-Element, das **nicht** in `render` genannt ist, rendert als
**Block** — `render` überschreibt nur die aufgeführten. Und `render` gilt
**nur für die Toolbox-Kachel**: Codespace, Preview und Workspace rendern immer
das [Quell-Element](/de/concepts/modes/#das-quell-element) des zugewiesenen
Mode, unabhängig von `render`.

## Presets verwenden

Übergib Presets in der Mount-Konfiguration und wechsle zur Laufzeit:

```ts
engine.mount({
  workspaceContainer,
  codespaceContainer,          // erforderlich, wenn ein Preset einen Codespace nutzt
  modes: definitions.modes,
  presets: definitions.presets,
  preset: "iconic",            // Anfangs-Preset
  onPresetApplied(preset) {
    // Panes je nach vorhandenen View-Schlüsseln ein-/ausblenden
  },
});

engine.applyPreset("hybrid");  // per Name oder Index

engine.getPresets();           // alle Presets, z. B. für deine Buttons
engine.getActivePreset();      // das zuletzt angewendete, z. B. um seinen Button zu markieren
```

Presets werden beim Mount validiert: unbekannte Modes, fehlende Code-Elements,
ein Codespace-Preset ohne `codespaceContainer`, doppelte Namen und ungültige
`render`-Werte werden sofort gemeldet.

`onPresetApplied(preset)` ist dein Layout-Hook — das Framework steuert nie dein
Seitenlayout; es teilt dir mit, welche Views das Preset nutzt, und du ordnest
die Panes an.

Nach dem Ein- oder Ausblenden von Panes musst du den Workspace nicht neu
skalieren. Das Framework beobachtet den Workspace-Container und zeichnet Blockly
neu, sobald sich seine Größe ändert, sei es durch einen Preset-Wechsel, eine
Fenstergröße oder einen gezogenen Trenner.

## Die tieferliegende API: setModes()

Presets bündeln Mode-Wechsel; `setModes()` ist das Primitiv darunter:

```ts
engine.setModes({
  workspaceMode: "conceptual",
  toolboxMode: "python",
  toolboxRender: { python: "text" },
  codespaceMode: "python",
  previewMode: "javascript",
});
```

Alle Schlüssel sind optional — setze, was du ändern willst. Ein `null` löscht
den Codespace-/Preview-Mode und die Toolbox-Render-Überschreibung.
