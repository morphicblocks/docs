---
title: Preview & Code-Editor
description: Schreibgeschützte Quelltext-Preview und der optionale CodeMirror-Editor.
---

Zwei weitere Text-Views ergänzen den [Codespace](/de/guides/codespace/):

| View            | Zeigt                                              | Editierbar |
| --- | --- | --- |
| **Preview**     | Das Quell-Element des Preview-Mode, als Text gerendert | Nein |
| **Code-Editor** | Das *erzeugte* JavaScript (über Behaviors)          | Nein (Anzeige) |

Beide basieren auf CodeMirror und werden verzögert geladen — sie benötigen die
optionalen [CodeMirror-Pakete](/de/getting-started/installation/#optional-pakete-für-den-code-editor).

## Preview

Die Preview rendert, was das
[Quell-Element](/de/concepts/modes/#das-quell-element) des Preview-Mode angibt
— z. B. JavaScript neben einem Python-Codespace zeigen, sodass Lernende zwei
Syntaxen desselben Programms gleichzeitig sehen:

```ts
await engine.mountPreview(document.getElementById("preview")!);
```

Der Preview-Mode kommt aus dem `preview`-Schlüssel des aktiven Preset oder aus
`setModes({ previewMode })`. Die Highlighting-Regeln werden automatisch aus der
[`highlighting`-Map](/de/guides/syntax-highlighting/) der Definitionen
aufgelöst; Platzhalter-Markierungen werden unterdrückt (sie sind eine
Editier-Hilfe, und die Preview ist von Natur aus schreibgeschützt).

Theme zur Laufzeit: `engine.setPreviewTheme(theme)`.

## Code-Editor

Der Code-Editor zeigt die Ausgabe von `generateJavaScript()` — den
ausführbaren Code, den deine [Behaviors](/de/concepts/behaviors-and-codegen/)
erzeugen — und aktualisiert sich, während sich das Modell ändert:

```ts
await engine.mountCodeEditor(document.getElementById("editor")!, { theme });

engine.showCodeEditor();
engine.hideCodeEditor();
engine.isCodeEditorVisible();
engine.setCodeEditorTheme(theme);
```

## Gemeinsame Optionen

`mountPreview` / `mountCodeEditor` (und `mountCodespace`) akzeptieren
`MorphicCodeEditorOptions`:

| Option           | Zweck                                                        |
| --- | --- |
| `theme`          | Visuelles Theme (sinnvolle Standardwerte vorhanden)          |
| `extensions`     | Rohe CodeMirror-Erweiterungen, nach den eingebauten angehängt |
| `highlightRules` | Token-Highlighting-Überschreibung (Standard aus den Definitionen) |
| `onDelete`       | Ein Lösch-Keymap + Leisten-`✕` installieren (Codespace-Standard) |
| `canDragBlock`   | Eine Griffleiste für ziehbare Blöcke zeigen                  |

Die `extensions`-Hintertür bedeutet: Alles, was CodeMirror kann — Zeilenumbruch,
eigene Keymaps, zusätzliche Leisten — lässt sich mit dem eigenen Verhalten des
Frameworks kombinieren.
