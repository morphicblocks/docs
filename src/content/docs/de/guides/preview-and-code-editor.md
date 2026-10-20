---
title: Schreibgeschützte Views & Code-Editor
description: Ein Codespace, der das Programm nur zeigt, und der optionale CodeMirror-Editor.
---

Zwei weitere Text-Views ergänzen den [Codespace](/de/guides/codespace/):

| View            | Zeigt                                              | Editierbar |
| --- | --- | --- |
| **Schreibgeschützter Codespace** | Das Programm als Text, im Element, das er zeigt | Nein |
| **Code-Editor** | Das *erzeugte* JavaScript (über Behaviors)         | Nein (Anzeige) |

Beide basieren auf CodeMirror und werden nachgeladen; sie brauchen die
optionalen [CodeMirror-Pakete](/de/getting-started/installation/#optional-pakete-für-den-code-editor).

## Schreibgeschützter Codespace

Ein Codespace mit `editable: false` zeigt das Programm als Text, ohne dass es
sich dort ändern lässt, z. B. JavaScript neben einem Python-Codespace, damit
Lernende zwei Syntaxen desselben Programms zugleich sehen. Bis 0.4.0 war das
die Preview.

```json
{
  "views": {
    "blocks": "workspace",
    "code": "codespace",
    "read": { "kind": "codespace", "editable": false }
  },
  "presets": [
    { "name": "both", "toolbox": "conceptual", "views": { "blocks": "concept", "code": "python", "read": "javascript" } }
  ]
}
```

```ts
await engine.mount({
  containers: { blocks: blocksElement, code: codeElement, read: readElement },
  themes: { read: readTheme },   // optional, sonst editorTheme
});
```

Was er zeigt, kommt aus dem Preset oder aus
`show({ views: { read: "javascript" } })`. Die Hervorhebung ergibt sich aus
dem [`highlighting`](/de/guides/syntax-highlighting/) des gezeigten Elements;
die Wert-Markierungen des Codespace fehlen, da sich dort nichts bearbeiten
lässt. Sein Container bekommt `morphic-read-only` neben
`morphic-codespace-root`.

Theme zur Laufzeit: `engine.setViewTheme("read", theme)`.

## Code-Editor

Der Code-Editor zeigt die Ausgabe von `generateJavaScript()`, den
ausführbaren Code, den deine [Behaviors](/de/concepts/behaviors-and-codegen/)
erzeugen, und aktualisiert sich, wenn sich das Modell ändert:

```ts
await engine.mount({
  workspaceContainer,
  codeEditorContainer: document.getElementById("editor")!,
  editorTheme,                   // optional
});

engine.showCodeEditor();         // startet verborgen
engine.hideCodeEditor();
engine.isCodeEditorVisible();
engine.setCodeEditorTheme(theme);
```

Er zeigt immer **JavaScript**, das Ausführungsziel, egal was die Views zeigen,
und trägt standardmäßig **keine** Hervorhebung aus den Definitionen. Er ist
also vor allem ein **Entwickler-Werkzeug**: ein Live-Blick darauf, was deine
Behaviors beim Bauen und Debuggen tatsächlich erzeugen. Für eine Ansicht des
Programms für Lesende nimm lieber einen schreibgeschützten Codespace, der jedes
Code-Element *mit* der [Syntax-Hervorhebung](/de/guides/syntax-highlighting/)
der Definitionen zeigt.

## Gemeinsame Optionen

`mountCodeEditor(container, options)` nimmt `MorphicCodeEditorOptions`:

| Option           | Zweck                                                         |
| --- | --- |
| `theme`          | Visuelles Theme (sinnvolle Standardwerte vorhanden)           |
| `extensions`     | Rohe CodeMirror-Erweiterungen, nach den eingebauten angehängt |
| `highlightRules` | Überschreibt die Hervorhebung auf Token-Ebene                 |

Über `extensions` lässt sich alles, was CodeMirror kann (Zeilenumbruch,
eigene Tastenbelegungen, weitere Leisten), mit dem Verhalten des Frameworks
kombinieren.

## Themes

Die Text-Views sind **standardmäßig dunkel**. Ein Theme ist ein einfaches
Objekt; jedes Feld ist optional und fällt auf den Standard zurück:

| Feld                  | Standard    | Zweck                                |
| --- | --- | --- |
| `background`          | `#1e1e1e`   | Hintergrund des Editors              |
| `foreground`          | `#d4d4d4`   | Standard-Textfarbe                   |
| `gutterBackground`    | `#1e1e1e`   | Hintergrund der Zeilennummern-Spalte |
| `gutterForeground`    | `#858585`   | Farbe der Zeilennummern              |
| `selectionBackground` | `#264f78`   | Hintergrund des ausgewählten Texts   |
| `fontFamily`          | `monospace` | Schrift des Codes                    |
| `fontSize`            | `14px`      | Größe des Codes                      |
| `lineHeight`          | `1.5`       | Zeilenabstand, als Faktor            |

`editorTheme` färbt jede Text-View und den Code-Editor; `themes` gibt
einzelnen Views ihr eigenes, nach View-Name. Eine helle Seite braucht eigene
Farben:

```ts
await engine.mount({
  // …Container
  editorTheme: {
    background: "#ffffff",
    foreground: "#1f2933",
    gutterBackground: "#f7f8f9",
    gutterForeground: "#9aa3ab",
    selectionBackground: "#d3ebe7",
  },
});
```

Ändere ein Theme zur Laufzeit mit `setViewTheme(view, theme)` und
`setCodeEditorTheme(theme)`, etwa wenn die Seite zwischen hell und dunkel
wechselt. Token-Farben (Schlüsselwörter, Strings, Zahlen) kommen aus dem
[`highlighting`](/de/guides/syntax-highlighting/) jedes Code-Elements, nicht
aus dem Theme. Bei einem hellen Theme setze auch eine sichtbare
[Auswahl-Hervorhebung](/de/guides/selection-sync/#optionen).
