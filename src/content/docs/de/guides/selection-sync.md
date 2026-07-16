---
title: Selection-Sync
description: Verknüpfte Block-↔-Text-Auswahl über alle Views.
---

Mit aktivierter Selection-Sync hebt das Auswählen eines Blocks seine
entsprechenden Zeilen in jeder Text-View hervor — und ein Klick auf eine Zeile
in einer Text-View wählt den Block aus. Das funktioniert über alle
eingebundenen Views: Workspace, Code-Editor, Codespace und Preview.

```ts
// nach mount() und mindestens einem von:
// mountCodeEditor / mountCodespace / mountPreview
engine.enableSelectionSync();
```

## So funktioniert es

Die Code-Erzeugung produziert **Metadaten** neben dem Text — für jeden Block den
Zeilenbereich, den er einnimmt, inklusive der Rumpfbereiche von Statement-Inputs
(`generateJavaScriptWithMetadata()` stellt dieselben Daten bereit). Die
Selection-Sync nutzt diese Zuordnung in beide Richtungen:

- **Block → Code:** Das Auswählen eines Blocks im Workspace hebt seinen Bereich
  in jeder Text-View hervor.
- **Code → Block:** Ein Klick auf eine Zeile in einer Text-View wählt den Block
  aus, dem sie gehört — und hebt seine Bereiche auch in den *anderen* Text-Views
  hervor.

Ein Klick auf eine leere Fläche in einer Text-View löscht die Hervorhebung
überall.

## Optionen

```ts
engine.enableSelectionSync({
  highlightColor: "rgba(85, 189, 203, 0.25)",
  blockToCode: true,
  codeToBlock: true,
});
```

| Option           | Standard | Zweck                                    |
| --- | --- | --- |
| `highlightColor` | halbtransparentes Blau | CSS-Hintergrund für hervorgehobene Zeilen |
| `blockToCode`    | `true`  | Richtung Block → Code aktivieren          |
| `codeToBlock`    | `true`  | Richtung Code → Block aktivieren          |

Ausschalten mit `engine.disableSelectionSync()`.

## Warum es für den Übergang zählt

Verknüpftes Hervorheben ist es, was nebeneinanderliegende Modes *lehrreich*
macht: Eine Lernende klickt `print("hi")` im Python-Codespace an und sieht
dieselbe Anweisung im Block-Workspace und in der JavaScript-Preview aufleuchten
— drei Repräsentationen, sichtbar ein Programm.
