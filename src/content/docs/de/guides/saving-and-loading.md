---
title: Speichern & Laden
description: Workspaces sichern und wiederherstellen.
---

Zwei Aufrufe decken die Persistenz ab:

```ts
const state = engine.serializeWorkspace();   // schlichtes JSON-serialisierbares Objekt
engine.loadWorkspace(state);                 // wiederherstellen
```

Der Zustand ist Blocklys Standard-JSON-Serialisierung des Workspace — speichere
ihn, wo du willst:

```ts
// speichern
localStorage.setItem("program", JSON.stringify(engine.serializeWorkspace()));

// wiederherstellen
const saved = localStorage.getItem("program");
if (saved) engine.loadWorkspace(JSON.parse(saved));
```

Das Wiederherstellen rendert alle Views (Workspaces, Codespaces, den
Code-Editor) in dem neu, was sie gerade zeigen: Der gespeicherte Zustand
trägt das *Programm*, nicht die Darstellung. Ein im Mode `icon-tiles` gespeichertes
Programm lädt problemlos in eine Sitzung, die im Mode `python-tiles` läuft.

## Namespacing im gespeicherten Zustand

Im serialisierten JSON erscheinen deine Blöcke unter ihrem **namespaced**
Blockly-Typ — `morphic:text_print`, nicht `text_print` (siehe
[Block-Identifier](/de/concepts/blocks-and-elements/#block-identifier)).
Praktische Folgen:

- Verarbeite den gespeicherten Zustand **nicht** so nach, als stünden dort
  saubere Identifier; das `morphic:`-Präfix ist erwartet und zum Laden
  erforderlich.
- Der gespeicherte Zustand ist an deine Definitionen gekoppelt: Zustand zu
  laden, der auf einen seither entfernten oder umbenannten Block verweist,
  scheitert genauso wie im reinen Blockly. Behandle Definitions-Identifier als
  stabilen, versionierten Vertrag, sobald Nutzer Programme gespeichert haben.
- Blockly-Stock-Blöcke, die als Shadows/Placeholder dienen (`math_number`,
  `text`), erscheinen unter ihren nicht präfixierten Namen — das ist ebenfalls
  korrekt.
