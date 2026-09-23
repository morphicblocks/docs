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
| `fields`    | Unveränderte Feldwerte, geschlüsselt nach Feldnamen        |
| `quoted`    | Dieselben Werte als String-Literale in Anführungszeichen   |
| `context`   | Render-Kontext                                             |

`proxy.inputs.TEXT` ist der *bereits erzeugte* Code des Blocks, der im
`TEXT`-Slot steckt — die Erzeugung rekursiert für dich durch das Programm.

`fields` enthält jeden Wert genau so, wie das Feld ihn hat. `quoted` enthält
denselben Wert als String-Literal in Anführungszeichen, korrekt maskiert und
immer in Anführungszeichen, auch wenn er wie eine Zahl aussieht. Nimm die Form,
die deine Ausgabe braucht:

```ts
var_declare(proxy) {
  // ein Variablenname bleibt ohne Anführungszeichen: let x = …
  return `let ${proxy.fields.VAR} = ${proxy.inputs.VAL};\n`;
},
text_value(proxy) {
  // ein Textwert muss ein String sein: "hello", und "42" bleibt ein String
  return proxy.quoted.TEXT;
},
```

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
const { output, error } = engine.runJavaScript();
```

`runJavaScript()` sammelt jede Zeile, die das Programm ausgibt, samt ihrer
Stufe. So kannst du die Ausgabe auf deiner Seite zeigen, ohne eine eigene
Konsole zu schreiben:

```ts
const { output, error } = engine.runJavaScript();
// output = [
//   { level: "log",  text: "Hello" },
//   { level: "warn", text: "Value is empty" },
// ]

for (const line of output) {
  const div = document.createElement("div");
  div.textContent = line.text;
  div.className = line.level;          // .warn / .error in deinem CSS stylen
  outputEl.appendChild(div);
}
if (error) outputEl.append(`Error: ${error.message}`);
```

Ausgegebene Zeilen landen weiterhin auch in der Browser-Konsole. Um sie
stattdessen woandershin zu schicken, übergib eine eigene `console`:
`engine.runJavaScript({ console: myConsole })`. Die `output`-Liste wird in
beiden Fällen gefüllt.

## Klammern in zusammengesetzten Ausdrücken

Blöcke kodieren Gruppierung durch Verschachtelung: Ein Multiplikations-Block, der
einen Additions-Block enthält, *ist* `2 * (3 + 4)`. Reiner Text verliert das,
sofern die Klammern nicht ausgeschrieben werden — deshalb setzt das Framework sie:
im ausführbaren Code ebenso wie im gerenderten Text.

Ein Operand wird geklammert, wenn zwei Bedingungen zutreffen: Der Operand-Block
setzt selbst Werte zusammen (er hat Value-Inputs), und das Template des
Eltern-Blocks setzt mehrere Werte zusammen. Die zweite Bedingung hält Templates
mit nur einem Slot sauber:

| Template | Value-Slots | Ergebnis |
| --- | --- | --- |
| `%1 %OP %2` | 2 | `2 * (3 + 4)` — Gruppierung bleibt erhalten |
| `print(%1)` | 1 | `print(2 * 3)` |
| `if %1:` | 1 | `if 10 == 20:` — idiomatisches Python |

Ein **unärer** Operator ist die Ausnahme: `-%1` hat nur einen Slot, `-(3 + 4)`
braucht aber Klammern. Schreibe sie dort selbst ins Template — `-(%1)` —, wo das
Framework die Absicht nicht ableiten kann.

## Behaviors vs. Template-Rendering

Zwei verschiedene Dinge machen aus Blöcken Text — verwechsle sie nicht:

- **Behaviors** erzeugen den *ausführbaren* Code (`generateJavaScript()`).
- **Templates** (`code`-Elements mit `%N`-Einsetzung) erzeugen, was Codespace
  und Preview *anzeigen*.

Sie sind absichtlich unabhängig: Was Lernende sehen, kann Python sein, während
das, was läuft, JavaScript ist. Siehe [Presets & Views](/de/concepts/presets-and-views/)
zum Verdrahten der Views und die [Codespace-Anleitung](/de/guides/codespace/)
für die editierbare Text-Ansicht.
