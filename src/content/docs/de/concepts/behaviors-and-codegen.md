---
title: Behaviors & Code-Erzeugung
description: Behavior-Funktionen machen aus Blöcken lauffähigen Code.
---

Definitionen beschreiben, wie Blöcke *aussehen*; **Behaviors** definieren, was
sie *tun*. Die Behaviors-Map paart jeden Block-Identifier mit der Funktion, die
seinen ausführbaren Code erzeugt:

```ts
import type { MorphicBehaviorMap } from "morphic-blocks";

export const behaviors: MorphicBehaviorMap = {
  text_print(proxy) {
    return `console.log(${proxy.inputs.TEXT ?? "undefined"});\n`;
  },
};
```

Die Code-Erzeugung ist **einseitig und entwicklergesteuert**: Was auch immer
dein Behavior als String zurückgibt, *ist* der Code. Es gibt keine feste
Zielsprache — Behaviors geben typischerweise JavaScript aus, weil der Browser
das ausführen kann, aber die Strings gehören dir.

## Der Behavior-Proxy

Deine Generate-Funktion erhält einen Proxy des lebenden Blocks:

| Eigenschaft | Was sie enthält                                            |
| ----------- | ---------------------------------------------------------- |
| `blockId`   | Die Blockly-Block-ID                                       |
| `blockType` | Der saubere Block-Identifier (z. B. `text_print`)          |
| `mode`      | Der aktive Workspace-Mode                                  |
| `inputs`    | Erzeugter Code angehängter Blöcke, geschlüsselt nach Input-Namen |
| `fields`    | Feldwerte, geschlüsselt nach Feldnamen                     |
| `context`   | Render-Kontext                                             |

`proxy.inputs.TEXT` ist der *bereits erzeugte* Code des Blocks, der im
`TEXT`-Slot steckt — die Erzeugung rekursiert für dich durch das Programm.

## Das vollständige Behavior-Objekt

Ein Behavior kann mehr als eine Generate-Funktion sein. Die Langform:

```ts
export const behaviors: MorphicBehaviorMap = {
  text_print: {
    init(block, context) {
      // einmaliges Setup bei Erstellung des Blocks
    },
    onViewApplied(block, context) {
      // aufgerufen, nachdem ein Mode/View angewendet wurde — hier *eigene*
      // Blockly-Felder anhängen (Dropdown/Text/Number/Checkbox via `fields`)
    },
    generate(proxy) {
      return `console.log(${proxy.inputs.TEXT ?? "undefined"});\n`;
    },
  },
};
```

| Hook            | Wann er läuft                                                  |
| --------------- | ------------------------------------------------------------- |
| `init`          | Einmal, bei Instanziierung des Blocks                         |
| `onViewApplied` | Nach jeder Mode-Anwendung — *eigene* Felder anhängen (Standard-Dropdown/Text/Number/Checkbox gehören in [`fields`](/de/concepts/definitions-format/#felder)) |
| `generate`      | Während der Code-Erzeugung                                    |

Eine reine Funktion ist die Kurzform für `{ generate }`.

## Erzeugen und Ausführen

```ts
const js = engine.generateJavaScript();

// mit Block-zu-Codeposition-Metadaten (von der Selection-Sync genutzt):
const { code, metadata } = engine.generateJavaScriptWithMetadata();

// in der Seite ausführen:
engine.runJavaScript();
```

## Behaviors vs. Template-Rendering

Zwei verschiedene Dinge machen aus Blöcken Text — verwechsle sie nicht:

- **Behaviors** erzeugen den *ausführbaren* Code (`generateJavaScript()`).
- **Templates** (`code`-Elements mit `%N`-Einsetzung) erzeugen, was Codespace
  und Preview *anzeigen*.

Sie sind absichtlich unabhängig: Was Lernende sehen, kann Python sein, während
das, was läuft, JavaScript ist. Siehe [Presets & Views](/de/concepts/presets-and-views/)
zum Verdrahten der Views und die [Codespace-Anleitung](/de/guides/codespace/)
für die editierbare Text-Ansicht.
